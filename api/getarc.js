import axios from 'axios';
//import Config from 'react-native-config';

// Function to put an item into a DynamoDB table - calls our backend 
export const getAllUserArc = async (data) => {
    console.log("Getting all ARC");
    const username = data.username;

    const currtime = "Time";

    const updatedData = {
        method : "GET",
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
        const response = await axios.get(process.env.EXPO_PUBLIC_ARC_API_ENDPOINT, updatedData);
       // console.log('Response :', response.data);
       const parsedData = JSON.parse(response.data.body);

        console.log('Parsed ARC data:', parsedData);  // Log the parsed data for debugging

        if (!parsedData.items) {
            console.error('No items array found:', parsedData);
            return { success: false, message: "No items found in the response" };
        }

        
      const dataWithUser = parsedData.items
      .filter(item => item.username && item.username.S === username)  

      //  console.log('Parsed ARC data:', parsedData.items); 
      //  console.log('Parsed ARC data:', parsedData.items[0].coverurl.S); 
        const bucketBaseUrl = process.env.EXPO_PUBLIC_S3_ENDPOINT;
        const dataWithFullImageUrls = dataWithUser.map(item => ({
            ...item,
            comicurl: item.comicid.L.map(comic => {
                // Accessing the structure correctly based on your JSON structure
                const imageUrl = comic.S;
                return imageUrl ? `${bucketBaseUrl}${encodeURIComponent(imageUrl)}` : undefined;
            }).filter(url => url),
            cover : `${bucketBaseUrl}${encodeURIComponent(item.coverurl.S)}`
        }));
    
      //console.log('Image URLs ARC', username, ':', dataWithFullImageUrls );
      return { success: true, message: "Stories fetched successfully!", data: dataWithFullImageUrls };
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