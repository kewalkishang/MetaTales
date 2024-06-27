import React, { useState } from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function TabTwoScreen() {
  const [permissionCameraInfo, requestPermissionCamera] = ImagePicker.useCameraPermissions();
  const [permissionLibraryInfo, requestPermissionLibrary] = ImagePicker.useMediaLibraryPermissions();
  const [imageLink, setImageLink] = useState("");

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
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
      });

      if (!result.canceled && result.assets) {
          setImageLink(result.assets[0].uri); // Correctly accessing uri from the first asset
      }
  };

  const pickFromLibraryHandler = async () => {
      const hasPermission = await verifyPermissionLibrary();
      if (!hasPermission) {
          console.log("Library access denied.");
          return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
      });

      if (!result.canceled && result.assets) {
          setImageLink(result.assets[0].uri); // Handle image URI correctly
      }
  };

  return (
      <View style={styles.container}>
          <View style={styles.buttonContainer}>
              <Pressable onPress={takePictureHandler} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
                  <View style={styles.button}>
                      <Text style={styles.text}>Take a picture</Text>
                  </View>
              </Pressable>
              <Pressable onPress={pickFromLibraryHandler} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
                  <View style={styles.button}>
                      <Text style={styles.text}>Choose from Library</Text>
                  </View>
              </Pressable>
          </View>
          {imageLink ? (
              <Image source={{ uri: imageLink }} style={styles.preview} />
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
