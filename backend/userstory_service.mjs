import { DynamoDBClient,  ScanCommand } from '@aws-sdk/client-dynamodb';
const dynamoClient = new DynamoDBClient({ region: 'us-west-1' });

export const handler = async (event) => {
        const metaData = {
        headers: {
            "Access-Control-Allow-Origin": "*",
         },
       };
       
       console.log(event);


        const params = {
        TableName: 'stories_db',
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
  
};
