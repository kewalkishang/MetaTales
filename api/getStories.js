import axios from 'axios';
//import Config from 'react-native-config';

// Function to put an item into a DynamoDB table - calls our backend 
export const getAllStories = async (data) => {
   // console.log("Getting all stories");
    const username = data.username;

    //This logic hasnt been implemenr
    const currtime = "Time";

    const updatedData = {
        username: username,
        method : "GET",
        time : currtime,
    };

    const config = {
        headers: {
            'Content-Type': 'application/json',
            "Access-Control-Allow-Origin": '*',
            // 'Authorization': `Bearer ${token}`,
        }
    };

    // Attempt to add the item to the DynamoDB table
    try {
        const response = await axios.get(process.env.EXPO_PUBLIC_GETSTORY_API_ENDPOINT, updatedData);
       // console.log('Response :', response.data);
        const parsedData = JSON.parse(response.data.body);

       // console.log('Parsed ALL STORIES data:', parsedData);  // Log the parsed data for debugging

        if (!parsedData.items) {
            console.error('No items array found:', parsedData);
            return { success: false, message: "No items found in the response" };
        }

        const todayStories = parsedData.items
        .filter(item => item.username && item.username.S === username && isFromToday(item.id.S))

        console.log(todayStories);
        // const imageURLs = todayStories.map(item => item.imageURL.S);  // Extract imageURLs
        // console.log( "image ", imageURLs);
        const bucketBaseUrl = process.env.EXPO_PUBLIC_S3_ENDPOINT;
        const imageDetails = todayStories.map(item => {
          const imageURL = item.imageURL.S;  // Extract imageURL
          const encodedFilename = encodeURIComponent(imageURL);  // Encode to handle special characters
          const fullImageUrl = `${bucketBaseUrl}${encodedFilename}`;  // Create full URL
      
          return {
              id: imageURL,
              fuller: fullImageUrl
          };
      });

        // Extracting messages from all items
 //const messages = parsedData.items[0].data.M.choices.L[0].M.message.M.content.S;
 const messages = extractAllMessages(todayStories);

 console.log( "Messages" , messages);
    

// const fullImageUrls = imageURLs.map(filename => {
//     // Encode each filename to handle special characters properly
//     const encodedFilename = encodeURIComponent(filename);
//     // Concatenate the base URL with the encoded filename
//     return `${bucketBaseUrl}${encodedFilename}`;
// });

      console.log('Stories URLs for', username, ':', imageDetails);
      console.log('Stories messages for', username, ':', messages );
        return { success: true, message: "Stories fetched successfully!", img: imageDetails, data :  messages };;
    } catch (error) {
        console.error('Error:', error.message);
        return { success: false, message: error.message };
    }
  
};

const isFromToday = (isoDate) => {
    const today = new Date(); // Gets the current date and time
    const dateToCheck = new Date(isoDate);
  
    return dateToCheck.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0);
  };

  const extractAllMessages = (parsedData) => {
    return parsedData.map(item => {
      // Check if the necessary nested structure exists to avoid errors
      if (item.data && item.data.M && item.data.M.choices && item.data.M.choices.L.length > 0) {
        // Extract the message content
        const messageContent = item.data.M.choices.L[0].M.message.M.content.S;
        return messageContent;
      } else {
        // Return a default or error message if the expected structure is missing
        return "No valid message found";
      }
    });
  };