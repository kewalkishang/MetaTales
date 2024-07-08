import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';
import { PutCommand, GetCommand, DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const dynamoClient = new DynamoDBClient({ region: 'us-west-1' });

import https from 'https';
const s3Client = new S3Client({ region: "us-west-1" });


const docClient = DynamoDBDocumentClient.from(dynamoClient);
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
       
       if ( event.method ===  "POST")
       {
           
               
          const partitionKey = event.username; // Assuming this is passed in the event
console.log(event);
    
      const paramsp = {
    TableName: 'persona_db',
    Key: {
      'username':  partitionKey // Replace 'YourPartitionKeyName' with your actual key name
    }
  };

    
    const commandp = new GetCommand(paramsp);
    const persona_data = await dynamoClient.send(commandp);
         const pData = persona_data.Item;
            const characterBuild = pData.name + " being a " + pData.physicalFeatures + " , wearing " + pData.clothing + " and a personality of  " + pData.personality;
           
           const stories = event.stories;
           console.log(stories);
              const data = JSON.stringify({
      model: "gpt-4",  // Update as per your model
      messages: [{
        role: "user",
        content: [{
          type: "text",
          text: "I am creating a comic for a character " + characterBuild  + " Using the scenario the above character has been, give me a short few words title for this . The scenarios" + stories
        }]
      }],
      max_tokens: 300
    });

    const options = {
      hostname: 'api.openai.com',
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${api_key}`,
        'Content-Length': Buffer.byteLength(data)
      }
    };

    // Making the HTTPS request in a separate async function to handle the response properly
    const openAIResponse = await new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let responseBody = '';
        res.on('data', (chunk) => { responseBody += chunk; });
        res.on('end', () => { resolve(JSON.parse(responseBody)); });
      });

      req.on('error', (error) => { reject(error); });
      req.write(data);
      req.end();
    });
     console.log("Summary ");
     console.log(JSON.stringify(openAIResponse));
        console.log(JSON.stringify(openAIResponse.choices[0].message.content));
        
        
         //  response_format : 'b64_json',
      const gendata = JSON.stringify({
      model: "dall-e-3",  // Update as per your model
      prompt: "Create me a cover image with the title : " + openAIResponse.choices[0].message.content,
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
    
    const key = user + "_arc_" + d.toISOString() + ".jpeg";

    const putCommand = new PutObjectCommand({
        Bucket: "metatales",
        Key: key,
        Body: imageBuffer,
        ContentType: 'image/jpeg'
    });

  //   // Upload to S3
   const s3data = await s3Client.send(putCommand);
   console.log(JSON.stringify(s3data));
           
           
       
       const id = event.username + "_arc_"+ d.toISOString();
   
        const item = {
            id: id,  // Generate a unique ID based on date-time
            coverurl : key,
            title : openAIResponse.choices[0].message.content,
            ...event 
        };

        const params = {
            TableName: 'arc_db',
            Item: item
        };

        const command = new PutCommand(params);
         //Add the survey item to DB
        const result = await dynamoClient.send(command);
        
        
         const itemsToUpdate = event.stories;  // Assuming 'keys' is an array of item keys
        const updates = itemsToUpdate.map(async (key) => {
        const params = {
            TableName: 'stories_db',
            Key: {
                'imageURL': key  // Assuming each key is the primary key of the item to update
            },
           UpdateExpression: 'set #arc = :arc',
            ExpressionAttributeNames: {
                '#arc': 'arc',
            },
            ExpressionAttributeValues: {
                ':arc': 'yes',
            },
        };

        try {
            await docClient.send(new UpdateCommand(params));
            //return { key, status: 'Success' };
        } catch (error) {
            console.error('Error updating item:', key, error);
            return { key, status: 'Failed', error: error.message };
        }
    });
        
        
        console.log("DynamoDB response:", result);
        const response =  { ...metaData, statusCode: 200, body: JSON.stringify({ message: 'Arc successfully inserted', data: result }) };
         return response;
       }
       else{
         
           const username = event.username;  // Assume username is passed as part of the event

            const params = {
        TableName: 'arc_db',
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
            body: JSON.stringify({ message: "Failed to retrieve arc data", error: error.message })
        };
    }
        
         
       }
    
};
