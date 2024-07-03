import axios from 'axios';

export const UploadStory = async (data) => {
   // console.log('Data', data);
 
    // Assuming 'imageFile' is the file object from an <input type="file" />
   // const imageFile = data
    const username = "DefaultUsername";
    // Attempt to add the item to the DynamoDB table
    try {

        const updatedData = {
            username: username,
            imageData: data
        };

        const config = {
            headers: {
                'Content-Type': 'image/jpeg',
                "Access-Control-Allow-Origin": '*',
            }
        };

        console.log(process.env.EXPO_PUBLIC_STORY_API_ENDPOINT);
        const response = await axios.post(process.env.EXPO_PUBLIC_STORY_API_ENDPOINT, updatedData);
        console.log('Response :', response);
        return { success: true, message: "Survey submitted successfully!", data: response.data };;
    } catch (error) {
        console.error('Error:', error.message);
        return { success: false, message: error.message };
    }
};
