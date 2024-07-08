import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import https from 'https';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { PutCommand,  DeleteCommand } from '@aws-sdk/lib-dynamodb';

const s3Client = new S3Client({ region: "us-west-1" });
const dynamoClient = new DynamoDBClient({ region: "us-west-1"});


export const handler = async (event) => {
  console.log(event);
  
  if(event.method === 'POST')
  {
  try {
    const base64String = event.imageData;
    const base64Data = base64String.replace(/^data:image\/jpeg;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    const d = new Date();
    const user = event.username;
    const key = user + "_" + d.toISOString() + ".jpeg";

    const putCommand = new PutObjectCommand({
        Bucket: "metatales",
        Key: key,
        Body: buffer,
        ContentType: 'image/jpeg'
    });

    // Upload to S3
    
   console.log("Upload file " , key );
   await s3Client.send(putCommand);

    const data = JSON.stringify({
      model: "gpt-4o",  // Update as per your model
      messages: [{
        role: "user",
        content: [{
          type: "text",
          text: "What’s in this image? Use the location  :  Use the caption " + event.caption + " : location for more info about the " + event.location
        }, {
          type: "image_url",
          image_url: { url: base64String }
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
    
    //const open = JSON.parse(openAIResponse);
    console.log(openAIResponse.message);
    const locationdata = event.location;
    const captiondata = event.caption;

    const item = {
        id: d.toISOString(),
        username: user,
        imageURL: key,
        location: locationdata,
        caption : captiondata,
        data: openAIResponse
    };

    const params = {
        TableName: 'stories_db',
        Item: item
    };

    // Adding the item to DynamoDB
    await dynamoClient.send(new PutCommand(params));

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Image processed, analyzed and data stored in DynamoDB",
        response: openAIResponse
      })
    };

  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: err.message
      })
    };
  }
  } 
    else{
        
          const keyToDelete = {
        imageURL : event.imageURL,  // Assuming 'id' is your table's partition key
    };

    const params = {
        TableName: 'stories_db',
        Key: keyToDelete,
    };

    try {
        const command = new DeleteCommand(params);
        const result = await dynamoClient.send(command);
        console.log("Delete operation:", result);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Item deleted successfully'
            })
        };
    } catch (error) {
        console.error("DynamoDB Error:", error);
        return {

            statusCode: 500,
            body: JSON.stringify({
                message: "Failed to delete item",
                error: error.message
            })
        };
    }
        
        
        
    }
};
