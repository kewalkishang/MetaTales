import axios from 'axios';
//import Config from 'react-native-config';

// Function to put an item into a DynamoDB table - calls our backend 
export const getAllUserComics = async (data) => {
    console.log("Getting all comics");
    const username = data.username;

    const currtime = "Time";

    const updatedData = {
        username: username,
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
        const response = await axios.get(process.env.EXPO_PUBLIC_COMIC_API_ENDPOINT, updatedData);
        console.log('Response :', response.data);
        const parsedData = JSON.parse(response.data.body);

        console.log('Parsed response data:', parsedData);  // Log the parsed data for debugging

        if (!parsedData.items) {
            console.error('No items array found:', parsedData);
            return { success: false, message: "No items found in the response" };
        }


        // const dataWithUser = parsedData.items
        // .filter(item => item.username && item.username.S === username)  // Check if the username matches
        // .map(item => item.imageURL.S);  // Extract imageURLs


        // const bucketBaseUrl = process.env.EXPO_PUBLIC_S3_ENDPOINT;

        // const dataWithFullImageUrls = parsedData.items.map(item => {
        //   if (item.username && item.username.S === username) {
        //     const encodedFilename = encodeURIComponent(item.imageURL.S);
        //     const fullImageURL = `${bucketBaseUrl}${encodedFilename}`;
        //     return {
        //       ...item,
        //       fullImageURL: fullImageURL
        //     };
        //   }
        //   return item;
        // });
        const bucketBaseUrl = process.env.EXPO_PUBLIC_S3_ENDPOINT;
        const dataWithFullImageUrls = parsedData.items.map(item => ({
            ...item,
            fullImageURL: `${bucketBaseUrl}${encodeURIComponent(item.imageURL.S)}`
        }));
    

      console.log('Image URLs ALL SDAS for', username, ':', dataWithFullImageUrls );
        return { success: true, message: "Stories fetched successfully!", data: dataWithFullImageUrls };;
    } catch (error) {
        console.error('Error:', error.message);
        return { success: false, message: error.message };
    }
  
};


export const getAllComics = async (data) => {
  console.log("Getting all comics");
  const username = data.username;

  const currtime = "Time";

  const updatedData = {
      username: username,
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
      const response = await axios.get(process.env.EXPO_PUBLIC_COMIC_API_ENDPOINT, updatedData);
      console.log('Response :', response.data);
      const parsedData = JSON.parse(response.data.body);

      console.log('Parsed response data:', parsedData);  // Log the parsed data for debugging

      if (!parsedData.items) {
          console.error('No items array found:', parsedData);
          return { success: false, message: "No items found in the response" };
      }


      const imageURLs = parsedData.items
      .filter(item => item.username && item.username.S === username)  // Check if the username matches
      .map(item => item.imageURL.S);  // Extract imageURLs


//         // Extracting messages from all items
//  //const messages = parsedData.items[0].data.M.choices.L[0].M.message.M.content.S;
//  const messages = extractAllMessages(parsedData);


      const bucketBaseUrl = process.env.EXPO_PUBLIC_S3_ENDPOINT;

const fullImageUrls = imageURLs.map(filename => {
  // Encode each filename to handle special characters properly
  const encodedFilename = encodeURIComponent(filename);
  // Concatenate the base URL with the encoded filename
  return `${bucketBaseUrl}${encodedFilename}`;
});

    console.log('Image URLs for', username, ':', fullImageUrls);
      return { success: true, message: "Stories fetched successfully!", img: fullImageUrls};;
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
    return parsedData.items.map(item => {
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