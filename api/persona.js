import axios from 'axios';
//import Config from 'react-native-config';

// Function to put an item into a DynamoDB table - calls our backend 
export const postPersona = async (data) => {
    console.log('Data', data);
    // const token = localStorage.getItem('accessToken');
    // //console.log("Token " + token);
    // if (token === undefined) {
    //     alert("Please login again!");
    //     return;
    // }
    const username = data.username;
    const fData = data.formD;

    const updatedData = {
        username: username,
        method : "POST",
        ...fData
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
        const response = await axios.post(process.env.EXPO_PUBLIC_SURVEY_API_ENDPOINT, updatedData);
        console.log('Response :', response.data);
        return { success: true, message: "Survey submitted successfully!", data: response.data };;
    } catch (error) {
        console.error('Error:', error.message);
        return { success: false, message: error.message };
    }
  
};

// Function to get an item from Dynamo - calls our backend 
export const getPersona = async (data) => {
    console.log('Data', data);
    // const token = localStorage.getItem('accessToken');
    // //console.log("Token " + token);
    // if (token === undefined) {
    //     alert("Please login again!");
    //     return;
    // }
    const username = data.username;
    const fData = data.formD;

    const updatedData = {
        username: username,
        method : "GET",
        ...fData
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
        const response = await axios.get(process.env.EXPO_PUBLIC_SURVEY_API_ENDPOINT, updatedData);
        console.log('Response :', response.data);
        const parsedData = JSON.parse(response.data.body);

        console.log('Parsed response data:', parsedData);  // Log the parsed data for debugging
  
        if (!parsedData.items) {
            console.error('No items array found:', parsedData);
            return { success: false, message: "No items found in the response" };
        }
  
  
        const personaData = parsedData.items
        .filter(item => item.username && item.username.S === username)  // Check if the username matches
    
        const bucketBaseUrl = process.env.EXPO_PUBLIC_S3_ENDPOINT;
        const encodedFilename = encodeURIComponent(personaData[0].imgURL.S);
        const url = `${bucketBaseUrl}${encodedFilename}`;

        return { success: true, message: "Survey submitted successfully!", data: personaData , img : url };;
    } catch (error) {
        console.error('Error:', error.message);
        return { success: false, message: error.message };
    }
  
};