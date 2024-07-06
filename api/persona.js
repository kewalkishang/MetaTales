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