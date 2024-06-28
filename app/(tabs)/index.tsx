import { Image, StyleSheet, TextInput , View, FlatList, Dimensions, SafeAreaView , StatusBar,  TouchableOpacity, Text} from 'react-native';
import React, { useState } from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';

const images = [
  { id: '1', uri: 'https://cdn.glitch.global/30af1d3b-4338-4f4a-a826-359ed81189cf/uki0lwy-360-panorama-view-park.jpeg?v=1678660202470', username : 'kewalkishang', hashtags : [ 'self', 'new']  },
  { id: '2', uri: 'https://cdn.glitch.global/30af1d3b-4338-4f4a-a826-359ed81189cf/uki0lwy-360-panorama-view-park.jpeg?v=1678660202470' , username : 'kewalkishang', hashtags : [ 'self', 'new'] },
  { id: '3', uri: 'https://cdn.glitch.global/30af1d3b-4338-4f4a-a826-359ed81189cf/uki0lwy-360-panorama-view-park.jpeg?v=1678660202470' , username : 'kewalkishang', hashtags : [ 'self', 'new'] },
  { id: '4', uri: 'https://cdn.glitch.global/30af1d3b-4338-4f4a-a826-359ed81189cf/uki0lwy-360-panorama-view-park.jpeg?v=1678660202470', username : 'kewalkishang', hashtags : [ 'self', 'new']  },
  { id: '5', uri: 'https://cdn.glitch.global/30af1d3b-4338-4f4a-a826-359ed81189cf/uki0lwy-360-panorama-view-park.jpeg?v=1678660202470' , username : 'kewalkishang', hashtags : [ 'self', 'new'] },
  // Add more images as needed
];

interface PostItem {
  id: string;
  uri: string;
  username : string;
  hashtags : string[];
}
// Get the full width of the device screen
const { width, height } = Dimensions.get('window');




export default function HomeScreen() {

  const handleLike = (id : string) => {
    console.log('Liked', id);
    // Update state or call backend
  };
  
  const handleComment = (id : string) => {
    console.log('Comment on', id);
    // Open comment view or modal
  };

  const renderItem = ({ item } : {item: PostItem }) =>  (
    // console.log("Rendering item", item.uri);
   
    <View style={styles.imageContainer}>
       <Image source={{ uri: item.uri }} style={styles.image} onError={(e) => console.error('Failed to load image', e.nativeEvent.error)}
 />
      <View style={styles.overlayContainer}> 
        <View style={{ width : "100%", flexDirection : 'row', justifyContent : 'space-around'}}>
        <View style={{ flex : 1, flexDirection : 'column', alignItems : 'flex-start', justifyContent :'flex-end' }}>
        <Text style={styles.text}>{item.username}</Text>
        <Text style={styles.text}>#{item.hashtags.join(' #')}</Text>
        </View>
        <View style={styles.iconsCol}>
          <TouchableOpacity onPress={() => handleLike(item.id)} style={{ alignItems : 'center', marginBottom : 10}}>
            <TabBarIcon name="heart-outline" color="white" />
            <Text style={styles.text}>12</Text>
          </TouchableOpacity>
 
          <TouchableOpacity onPress={() => handleComment(item.id)} style={{ alignItems : 'center' }}>
            <TabBarIcon name="chatbubble-outline" color="white" />
            <Text style={styles.text}>2</Text>
          </TouchableOpacity>
        </View>
        </View>
      </View>
    </View>
    );


  const styles = StyleSheet.create({
    safeArea: {
      flex: 1, // Takes full height of the screen
      marginTop:StatusBar.currentHeight,
      marginBottom : StatusBar.currentHeight,
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
    },
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 10,

      backgroundColor: '#000',
    },
    input: {
      flex: 4,
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginRight: 10,
      paddingHorizontal: 10,
      backgroundColor: 'white',
    },
    imageContainer: {
      width : '100%',
      height : 600,
      backgroundColor: 'blue',
    },
    image: {
      flex: 1,
       width : '100%',
       height : '100%', // This ensures the image covers the full area of the view
    },
    overlayContainer: {
      position: 'absolute',
      bottom: 50, // Adjust this value to ensure it's above the nav bar
      left: 0,
      right: 0,
      flexDirection: 'row',
      padding: 10,
    
    },
    text: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
    iconsCol: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
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
  renderItem={renderItem}
  showsVerticalScrollIndicator={true}
  pagingEnabled  // Enables native paging behavior
  showsHorizontalScrollIndicator={false}  // Hides the horizontal scroll bar
  snapToAlignment="start"
  snapToInterval={600}  // Snap interval to the width of the screen
  decelerationRate="fast"
/>
 
  </SafeAreaView>
  );
}
