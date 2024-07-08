import { DynamoDBClient,  ScanCommand } from '@aws-sdk/client-dynamodb';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { getDateTimeId } from './datetimeUtil.js';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const dynamoClient = new DynamoDBClient({ region: process.env.AWS_DYNAMO_REGION });
const s3Client = new S3Client({ region: "us-west-1" });
import https from 'https';


// Helper function to fetch image data using https
const fetchImageData = (url) => {
  return new Promise((resolve, reject) => {
    const req = https.get(url, (res) => {
      if (res.statusCode < 200 || res.statusCode >= 300) {
        return reject(new Error(`HTTP status code ${res.statusCode}`));
      }

      const data = [];
      res.on('data', (chunk) => {
        data.push(chunk);
      });
      res.on('end', () => {
        resolve(Buffer.concat(data));
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.end();
  });
};


export const handler = async (event) => {
        const metaData = {
        headers: {
            "Access-Control-Allow-Origin": "*",
         },
       };
       
       if (event.method === "POST")
       {
   
     
        
         const gendata = JSON.stringify({
      model: "dall-e-3",  // Update as per your model
      prompt: "Create me the image of a character using the following description . No  :  " + event.name +" with the physical features " + event.physicalFeatures + ", wearing " + event.clothing + " with a personality of " + event.personality + " in the artstyle "+ event.artStyle ,
  size:"1024x1024",
  quality:"standard",
  n:1,
    });

    const genoptions = {
      hostname: 'api.openai.com',
      path: '/v1/images/generations',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${api_key}`,
        'Content-Length': Buffer.byteLength(gendata)
      }
    };

    // Making the HTTPS request in a separate async function to handle the response properly
    const genopenAIResponse = await new Promise((resolve, reject) => {
      const req = https.request(genoptions, (res) => {
        let responseBody = '';
        res.on('data', (chunk) => { responseBody += chunk; });
        res.on('end', () => { resolve(JSON.parse(responseBody)); });
      });

      req.on('error', (error) => { reject(error); });
      req.write(gendata);
      req.end();
    });
    
    console.log("Generated image");
    console.log(JSON.stringify(genopenAIResponse));
    
    //This is the part that saves the images to our S3 bucket.
   // 
      console.log("url  " + genopenAIResponse.data[0].url);
const url = genopenAIResponse.data[0].url;
    const d = new Date();
    const user = event.username;
    const imageBuffer = await fetchImageData(url);
    
    const key = user + "_" + d.toISOString() + ".jpeg";

    const putCommand = new PutObjectCommand({
        Bucket: "metatales",
        Key: key,
        Body: imageBuffer,
        ContentType: 'image/jpeg'
    });

  //   // Upload to S3
   const s3data = await s3Client.send(putCommand);
   console.log(JSON.stringify(s3data));
        
        
        const item = {
            id: user + "_char_" + d.toISOString(),
            imgURL : key,
            ...event 
        };

        const params = {
            TableName: process.env.AWS_DYNAMO_TABLENAME,
            Item: item
        };

     

        const command = new PutCommand(params);
         //Add the survey item to DB
        const result = await dynamoClient.send(command);
        console.log("DynamoDB response:", result);
        const response =  { ...metaData, statusCode: 200, body: JSON.stringify({ message: 'Data successfully inserted', data: result }) };
         return response;
       }
       else{
           
            const username = event.username;  // Assume username is passed as part of the event

    const params = {
        TableName: process.env.AWS_DYNAMO_TABLENAME,
    };

    try {
        const command = new ScanCommand(params);
        const result = await dynamoClient.send(command);
        console.log("DynamoDB response:", result);

        return {
            ...metaData,
            statusCode: 200,
             body: JSON.stringify({
                message: 'All data retrieved successfully',
                items: result.Items,
                count: result.Count,
                scannedCount: result.ScannedCount
            })
        };
    } catch (error) {
        console.error("DynamoDB Error:", error);
        return {
            ...metaData,
            statusCode: 500,
            body: JSON.stringify({ message: "Failed to retrieve data", error: error.message })
        };
    }
           
           
           
           
       }
    
};
