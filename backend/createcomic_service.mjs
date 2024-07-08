
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { DynamoDBClient,  ScanCommand } from '@aws-sdk/client-dynamodb';
import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";

const dynamoClient = new DynamoDBClient({ region: 'us-west-1' });
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
  
 
//  Define the parameters of the persona

  try {
     
          const partitionKey = event.username; // Assuming this is passed in the event
console.log(event);
    
      const params = {
    TableName: 'persona_db',
    Key: {
      'username':  partitionKey // Replace 'YourPartitionKeyName' with your actual key name
    }
  };

    
    const command = new GetCommand(params);
    const persona_data = await dynamoClient.send(command);
    const stories = event.stories;
    console.log("Persona Data ");
    console.log(JSON.stringify(persona_data));
        console.log(JSON.stringify(stories));
    
       const data = JSON.stringify({
      model: "gpt-4",  // Update as per your model
      messages: [{
        role: "user",
        content: [{
          type: "text",
          text: "Can you summarize the stories into just 200 character ? I want to create a comic strip out of it. Add the described character in the image "+  
                persona_data + " in the following described situations "+
                stories
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
        const pData = persona_data.Item;
    const characterBuild = pData.name + " being a " + pData.physicalFeatures + " , wearing " + pData.clothing + " and a personality of  " + pData.personality;
      const promptData = " Create a comic book with different sections representing the following scenarios:" + openAIResponse.choices[0].message.content + "To each of these scenarios add a character with the following characteristics : " + characterBuild;  
  console.log(promptData);
    //  response_format : 'b64_json',
      const gendata = JSON.stringify({
      model: "dall-e-3",  // Update as per your model
      prompt: promptData,
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
  
   //Update dynamo with the new 
   const item = {
            id: d.toISOString(),  // Generate a unique ID based on date-time
            imageURL : key,
            username : user,
            story : openAIResponse.choices[0].message.content
        };

        const sendparams = {
            TableName: "comic_db",
            Item: item
        };

        const sendcommand = new PutCommand(sendparams);
         //Add the survey item to DB
        const comicdb_result = await dynamoClient.send(sendcommand);
    
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Item retrieved successfully",
        item: comicdb_result
      })
    };
  } catch (error) {
    console.error("Error fetching item: ", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to retrieve item",
        error: error.message
      })
    };
  }
  
 
};
