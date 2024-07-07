import axios from 'axios';
//import Config from 'react-native-config';

// Function to put an item into a DynamoDB table - calls our backend 
export const createArc = async (data) => {
    console.log("Create arc stories");
    const username = data.username;
    console.log(data);

    const comic = data.imgData.map(item => item.url.S)
    console.log(comic);
    const updatedData = {
        method : "POST",
        username: username,
        stories : data.stories,
        comicid : comic
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
        const response = await axios.post(process.env.EXPO_PUBLIC_ARC_API_ENDPOINT, updatedData);
        console.log('Response :', response.data);
        return { success: true, message: "ARC created successfully!", data: response.data };
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