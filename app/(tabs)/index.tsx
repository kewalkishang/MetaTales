import { Image, StyleSheet, TextInput , View, FlatList, Dimensions, SafeAreaView , StatusBar,  TouchableOpacity, Text} from 'react-native';
import React, { useState , useEffect, useContext } from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';

import { getAllComics, getAllUserComics } from '../../api/getComic'
import { AuthContext } from '../../context/AuthContext';
//import { createComic } from '../../api/createComic'

interface Item {
  id: { S: string };  // Assuming DynamoDB format where attributes are typed
  fullImageURL: string;
  username: { S: string };
}

 interface ImageItem {
  id: string;
  uri: string;
  username : string,
  hashtags : string[]
}


const images = [
  { id: '1', uri: 'https://images.unsplash.com/photo-1554357475-accb8a88a330?q=80&w=3164&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', username : 'kewalkishang', hashtags : [ 'self', 'new']  },
  { id: '2', uri: 'https://images.unsplash.com/photo-1614094082869-cd4e4b2905c7?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' , username : 'kewalkishang', hashtags : [ 'self', 'new'] },
  { id: '3', uri: 'https://images.unsplash.com/photo-1512100356356-de1b84283e18?q=80&w=2507&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' , username : 'kewalkishang', hashtags : [ 'self', 'new'] },
  { id: '4', uri: 'https://images.unsplash.com/photo-1476157808914-828d68f0f401?q=80&w=1863&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', username : 'kewalkishang', hashtags : [ 'self', 'new']  },
  { id: '5', uri: 'https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' , username : 'kewalkishang', hashtags : [ 'self', 'new'] },
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
  const { user } = useContext(AuthContext);
  const [imagesForTale , setImagesForTale ] = useState<ImageItem[]>([]);

  const fetchData = async () => {
    try {
      const response = await getAllUserComics({username : user});
      if (response.success) {
        // Assuming response.data directly contains the imageURLs array
        const imageItems: ImageItem[] = response.data.map( (item : Item)   => ({
          id: item.id.S,  // Assuming URL is unique and can be used as an ID
          uri: item.fullImageURL,  // Use the full image URL you composed
          username: item.username.S,  // Use the username from each item
          hashtags: ['self', 'new']  // Static hashtags for all items
        }));

       // setImgData(response.data);

        setImagesForTale(imageItems);
        if(imageItems.length > 0)
          {
           // setHasStories(true);
          }
      } else {
        console.error("Failed to fetch data:", response.message);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  // useEffect to call fetchData on component mount
  useEffect(() => {
    //Comment it out if you are not testing stories.
   fetchData();
  }, []);

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
      position: 'absolute',
      top: 5,
      right: 15,
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
      borderWidth: 0.2,
      marginRight: 10,
      paddingHorizontal: 10,
      backgroundColor: '#E6E6E6',
      borderRadius: 30
    },
    imageContainer: {
      width : '100%',
      height : 600,
      backgroundColor: 'black',
    },
    image: {
      // flex: 1,
       width : '100%',
       height : '100%', // This ensures the image covers the full area of the view
       resizeMode:'contain',
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
      flexDirection: 'row',
      alignItems: 'center',
      alignContent: 'center',
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
         <TabBarIcon name={ 'search-outline' } color={'black'} />
        </TouchableOpacity>
    </View>
    <FlatList
  data={imagesForTale}
  keyExtractor={item => item.id}
  renderItem={renderItem}
  showsVerticalScrollIndicator={true}
  pagingEnabled  // Enables native paging behavior
  showsHorizontalScrollIndicator={false}  // Hides the horizontal scroll bar
  snapToAlignment="start"
  snapToInterval={650}  // Snap interval to the width of the screen
  decelerationRate="fast"
/>
 
  </SafeAreaView>
  );
}
