import React, { useState , useEffect,  useContext, useCallback} from 'react';
import { View, Text, Image, Pressable, StyleSheet, TouchableOpacity, ActivityIndicator, PanResponder, Animated, TextInput, Modal} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Button } from 'react-native-elements/dist/buttons/Button';
import { UploadStory } from '@/api/uploadStory';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import * as Location from 'expo-location';
import { AuthContext } from '../../context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';

export default function TabTwoScreen() {
  const { user } = useContext(AuthContext);
  const [permissionCameraInfo, requestPermissionCamera] = ImagePicker.useCameraPermissions();
  const [permissionLibraryInfo, requestPermissionLibrary] = ImagePicker.useMediaLibraryPermissions();
  const [locationPermission, requestLocationPermission] = Location.useForegroundPermissions();
  const [imageLink, setImageLink] = useState("");
  const [base64m , setBase66m ] = useState<string | null | undefined>(null);
  const [loading, setLoading] = useState(false);
  const [caption, setCaption] = useState("");
  const [isEditingCaption, setIsEditingCaption] = useState(false);
  const [captionPosition, setCaptionPosition] = useState({ x: 0, y: 0 });
  const [location, setLocation] = useState<string | null>(null);
  // const [locationCoords, setLocationCoords] = useState({ latitude: 0, longitude: 0 });
  // const [isMapVisible, setIsMapVisible] = useState(false);
  
  useFocusEffect(
    useCallback(() => {
      // Reset state when the screen comes into focus
      // resetState();
      reopenCamera();

      return () => {
        // Cleanup if needed
      };
    }, [])
  );

  useEffect(() => {
    const openCamera = async () => {
      const hasPermission = await verifyPermissionCamera();
      if (hasPermission) {
        takePictureHandler();
      }
    };
    openCamera();
  }, []);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (event, gesture) => {
      if (isEditingCaption) {
        setCaptionPosition({ x: gesture.dx, y: gesture.dy });
      }
    },
    onPanResponderRelease: () => {},
  });

  
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
          setLoading(false);
          return;
      }
        const result = await ImagePicker.launchCameraAsync({
          allowsEditing: false,
          aspect: [4, 3],
          quality: 0.5,
          base64 : true,
      });

      // if (!result.canceled && result.assets && result.assets[0].uri) {
      //   const { uri, base64 } = result.assets[0];
      //   await resizeAndCompressImage(uri, base64);
      // }

      if (!result.canceled && result.assets  && result.assets[0].base64) {
         console.log(result.assets[0].base64.slice(0, 20));
          setBase66m(result.assets[0].base64);
          setImageLink(result.assets[0].uri); // Correctly accessing uri from the first asset
      }

      setLoading(false);
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

  const reopenCamera = () => {
    setLoading(true);
    setImageLink("");
    setLocation(null);
    setCaption("");
    setIsEditingCaption(false);
    takePictureHandler();
  }

  const handleCaptionChange = (text : string) => {
    setCaption(text);
  }

  const toggleCaptionEditing = () => {
    setIsEditingCaption(!isEditingCaption);
  }

  const verifyPermissionLocation = async () => {
    if (locationPermission && locationPermission.granted) {
      return true;
    }
    const response = await requestLocationPermission();
    return response.granted;
  };

  // const getLocation = async () => {
  //   const hasPermission = await verifyPermissionLocation();
  //   if (!hasPermission) {
  //     console.log("Location access denied.");
  //     return;
  //   }

  //   const currentLocation = await Location.getCurrentPositionAsync({});
  //   setLocationCoords({
  //     latitude: currentLocation.coords.latitude,
  //     longitude: currentLocation.coords.longitude,
  //   });
  //   setIsMapVisible(true);
  // };


  const getLocation = async () => {
    const hasPermission = await verifyPermissionLocation();
    if (!hasPermission) {
      console.log("Location access denied.");
      return;
    }

    const currentLocation = await Location.getCurrentPositionAsync({});
    const reverseGeocode = await Location.reverseGeocodeAsync(currentLocation.coords);
    const address = reverseGeocode[0];

    setLocation(address.city ? `${address.city}, ${address.region}` : `${address.region}`);
  };


  return (
      <View style={styles.container}>
          {/* <View style={styles.buttonContainer}> */}
              {/* <Pressable onPress={takePictureHandler} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
                  <View style={styles.button}>
                      <Text style={styles.text}>Take a picture</Text>
                  </View>
              </Pressable> */}
              {/* <Pressable onPress={pickFromLibraryHandler} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
                  <View style={styles.button}>
                      <Text style={styles.text}>Choose from Library</Text>
                  </View>
              </Pressable> */}
          {/* </View> */}
          {loading?  ( <ActivityIndicator size="large" color="#0000ff" />) :  imageLink ? (
             <View style={styles.preview}>
              {location && (
                <Text style={styles.locationText}>
                  {location}
                </Text>
              )}
              <Image source={{ uri: imageLink }}  style={{ width : '100%', height : '94%'}} resizeMode="contain"/>
              {isEditingCaption && (
                <Animated.View style={[styles.captionContainer, { transform: [{ translateX: captionPosition.x }, { translateY: captionPosition.y }] }]} {...panResponder.panHandlers}>
                  <TextInput
                    placeholder="Add caption..."
                    style={styles.captionInput}
                    value={caption}
                    onChangeText={(text) => handleCaptionChange(text)}
                  />
                </Animated.View>
              )}
              {/* {!isEditingCaption && (
                
              )} */}
              <TouchableOpacity onPress={()=>toggleCaptionEditing()} style={styles.captionButton}>
                  <TabBarIcon name="text-outline" color="black" size={32}/>
              </TouchableOpacity>
              <TouchableOpacity onPress={reopenCamera} style={styles.crossIcon}>
                <TabBarIcon name="close" color="black" size={32} style={styles.crossIconStyle}/>
              </TouchableOpacity>
              <TouchableOpacity onPress={sendPicture} style={styles.uploadButton}>
             {/* <Text style={{ color : 'white'}}>Upload</Text> */}
                <TabBarIcon name="send-outline" color="black" />
              </TouchableOpacity>
              <TouchableOpacity onPress={getLocation} style={styles.locationButton}>
                <TabBarIcon name="location-outline" color="black" size={32}/>
                {/* <Text >Add Location</Text> */}
              </TouchableOpacity>
            </View>
          ) 
          : (
              <Text style={styles.preview}>No image selected ...</Text>
          )
          }
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
    // width: 300, // Correct size for preview
    // height: 300,
    // alignSelf: 'center', // Centers the image in the view
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor : 'white',
    color: "black"
  },
  uploadButton: {
    position: 'absolute',
    bottom: 50,
    right: 10, // Position it to the bottom right
    padding: 10,
    backgroundColor: '#C4AED7',
    borderRadius: 50,
  },
  crossIcon : {
    position:'absolute',
    top: 70,
    left: 10,
    padding: 10
  },
  crossIconStyle: {
    fontWeight: 'bold',
  },
  captionButton: {
    position: 'absolute',
    bottom: 50,
    left: 10,
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 50,
  },
  captionButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  captionContainer: {
    position: 'absolute',
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
  },
  captionInput: {
    fontSize: 16,
  },
  locationButton: {
    position: 'absolute',
    bottom: 50,
    left: 70,
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 50,
  },
  locationText: {
    position: 'absolute',
    top: 80,
    textAlign: 'center',
    fontSize: 16,
    // backgroundColor: '#EEF1F0',
    // padding: 5,
    // borderRadius: 70,
    color : 'white'
  }
});


