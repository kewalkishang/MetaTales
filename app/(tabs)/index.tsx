import { Image, StyleSheet, TextInput , View, FlatList, Dimensions, SafeAreaView , StatusBar,  TouchableOpacity, Text} from 'react-native';
import React, { useState } from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';

const images = [
  { id: '1', uri: 'https://cdn.glitch.global/30af1d3b-4338-4f4a-a826-359ed81189cf/uki0lwy-360-panorama-view-park.jpeg?v=1678660202470' },
  { id: '2', uri: 'https://cdn.glitch.global/30af1d3b-4338-4f4a-a826-359ed81189cf/uki0lwy-360-panorama-view-park.jpeg?v=1678660202470' },
  { id: '3', uri: 'https://cdn.glitch.global/30af1d3b-4338-4f4a-a826-359ed81189cf/uki0lwy-360-panorama-view-park.jpeg?v=1678660202470' },
  { id: '4', uri: 'https://cdn.glitch.global/30af1d3b-4338-4f4a-a826-359ed81189cf/uki0lwy-360-panorama-view-park.jpeg?v=1678660202470' },
  { id: '5', uri: 'https://cdn.glitch.global/30af1d3b-4338-4f4a-a826-359ed81189cf/uki0lwy-360-panorama-view-park.jpeg?v=1678660202470' },
  // Add more images as needed
];

// Get the full width of the device screen
const { width, height } = Dimensions.get('window');


export default function HomeScreen() {
  const styles = StyleSheet.create({
    imageContainer: {
      width: width, // Set the width according to your preference
      height: height, // Set the height according to your preference
      marginRight: 10, // Adds space between images
    },
    image: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover' // This ensures the image covers the full area of the view
    },
    input: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      paddingLeft: 10,
      flex :  4
      // Add other styling as needed
    },
    container: {
      padding: 10,
      flexDirection: 'row',
      // backgroundColor: 'white',
      // Add other styling as needed
    },
    safeArea: {
      flex: 1, // Takes full height of the screen
      marginTop:StatusBar.currentHeight
    },
    button: {
      padding: 10,
      // backgroundColor: '#007AFF',  // Example button color, change as needed
      borderRadius: 5,
      justifyContent: 'center',
      flex :  1
    },
    buttonText: {
      color: 'white'
    }
  });

  const [search, setSearch] = useState('');

  // Correctly typed function
  const updateSearch = (searchText : string) => {
    setSearch(searchText);
  };
  const handleSearchPress = () => {
   //
  };

  return (
    <SafeAreaView style={styles.safeArea} > 
    <View>
           <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Type Here..."
        value={search}
        onChangeText={updateSearch}
      />
         <TouchableOpacity onPress={handleSearchPress} style={styles.button}>
         <TabBarIcon name={ 'search-outline' } color={'white'} />
        </TouchableOpacity>
    </View>
     <FlatList
      data={images}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.uri }} style={styles.image} />
        </View>
      )}
      // Setting horizontal to true makes the list scroll horizontally
    
      showsVerticalScrollIndicator={true}
    />
  </View>
  </SafeAreaView>
  );
}
