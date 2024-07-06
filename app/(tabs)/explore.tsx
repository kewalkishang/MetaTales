import React, { useState, useContext } from 'react';
import { View, Text, Image, Pressable, StyleSheet, TouchableOpacity} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Button } from 'react-native-elements/dist/buttons/Button';
import { UploadStory } from '@/api/uploadStory';
import { AuthContext } from '../../context/AuthContext';

export default function TabTwoScreen() {
  const { user } = useContext(AuthContext);
  const [permissionCameraInfo, requestPermissionCamera] = ImagePicker.useCameraPermissions();
  const [permissionLibraryInfo, requestPermissionLibrary] = ImagePicker.useMediaLibraryPermissions();
  const [imageLink, setImageLink] = useState("");
  const [base64m , setBase66m ] = useState<string | null | undefined>(null);

  const verifyPermissionCamera = async () => {
      if (permissionCameraInfo && permissionCameraInfo.granted) {
          return true;
      }
      const response = await requestPermissionCamera();
      return response.granted;
  };

  const verifyPermissionLibrary = async () => {
      if (permissionLibraryInfo && permissionLibraryInfo.granted) {
          return true;
      }
      const response = await requestPermissionLibrary();
      return response.granted;
  };

  const takePictureHandler = async () => {
      const hasPermission = await verifyPermissionCamera();
      if (!hasPermission) {
          console.log("Camera access denied.");
          return;
      }

      
        const result = await ImagePicker.launchCameraAsync({
          allowsEditing: false,
          aspect: [4, 3],
          quality: 0.5,
          base64 : true,
      });

      if (!result.canceled && result.assets  && result.assets[0].base64) {
         console.log(result.assets[0].base64.slice(0, 20));
          setBase66m(result.assets[0].base64);
          setImageLink(result.assets[0].uri); // Correctly accessing uri from the first asset
      }
  };

//   const pickFromLibraryHandler = async () => {
//       const hasPermission = await verifyPermissionLibrary();
//       if (!hasPermission) {
//           console.log("Library access denied.");
//           return;
//       }

//       const result = await ImagePicker.launchImageLibraryAsync({
//           mediaTypes: ImagePicker.MediaTypeOptions.All,
//           allowsEditing: true,
//           aspect: [4, 3],
//           quality: 1,
//       });

//       if (!result.canceled && result.assets) {
//           setImageLink(result.assets[0].uri); // Handle image URI correctly
//       }
//   };


  const sendPicture = async() => {
    UploadStory({username : user, imgData:`data:image/jpeg;base64,${base64m}`});
    
  }

  return (
      <View style={styles.container}>
          <View style={styles.buttonContainer}>
              <Pressable onPress={takePictureHandler} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
                  <View style={styles.button}>
                      <Text style={styles.text}>Take a picture</Text>
                  </View>
              </Pressable>
              {/* <Pressable onPress={pickFromLibraryHandler} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
                  <View style={styles.button}>
                      <Text style={styles.text}>Choose from Library</Text>
                  </View>
              </Pressable> */}
          </View>
          {imageLink ? (
             <View style={styles.preview}>
              <Image source={{ uri: imageLink }}  style={{ width : '100%', height : '100%'}} />
              <TouchableOpacity onPress={sendPicture} style={{ alignItems : 'center', marginBottom : 10}}>
             <Text style={{ color : 'white'}}>Hello</Text>
            </TouchableOpacity>
            </View>
          ) : (
              <Text>No image selected</Text>
          )}
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Changed to space-around for better layout
    padding: 20, // Reduced padding for better fit
  },
  button: {
    padding: 10, // Ensures padding inside the button for better touch
    backgroundColor: '#eee', // Adds a background color for visibility
  },
  text: {
    fontSize: 18, // Adjusted for better readability
    fontWeight: 'bold',
    color: 'black', // Changed for contrast with button background
  },
  preview: {
    width: 300, // Correct size for preview
    height: 300,
    alignSelf: 'center', // Centers the image in the view
  }
});
