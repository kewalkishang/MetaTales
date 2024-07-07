import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Platform, Text, View, TouchableOpacity, FlatList, Modal, ScrollView, Button, Dimensions } from 'react-native';
import { Link, router } from 'expo-router';
import { getAllStories } from '../../api/getStories'
import { createComic } from '../../api/createComic'
import { getAllComics, getAllUserComics } from '../../api/getComic'
import {createArc } from '../../api/createarc'
import {getAllUserArc } from '../../api/getarc'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { AuthContext } from '../../context/AuthContext';

const personIcon = require('../../assets/images/file.jpg');

interface ComicItem {
  id: { S: string };  // Assuming DynamoDB format where attributes are typed
  imageURL : string;
  fullImageURL : string;
  username: { S: string };
}

interface ArcItem {
  id: { S: string };  // Assuming DynamoDB format where attributes are typed
  cover : string;
  imageURL : string[];
  comicurl : string[];
  username: { S: string };
}

interface ImageItem {
  id: string;
  uri: string;
  url : string;
  comicURL : string[];
  coverURL : string;
}

// const FirstRoute = () => (
//   <View style={[styles.scene, { backgroundColor: '#ff4081' }]} />
// );

// const SecondRoute = () => (
//   <View style={[styles.scene, { backgroundColor: '#673ab7' }]} />
// );

const initialLayout = { width: Dimensions.get('window').width };

export default function ProfileScreen() {

  const { user } = useContext(AuthContext);

  // const [index, setIndex] = React.useState(0);
  // const [routes] = React.useState([
  //   { key: 'first', title: 'First' },
  //   { key: 'second', title: 'Second' },
  // ]);

  // const renderScene = SceneMap({
  //   first: FirstRoute,
  //   second: SecondRoute,
  // });

  const fetchData = async () => {
    try {
      const response = await getAllStories({ username: user });
      if (response.success) {
        // Assuming response.data directly contains the imageURLs array
        const imageItems: ImageItem[] = response.img.map((url: string) => ({
          id: url,  // Assuming URL is unique and can be used as an ID
          uri: url
        }));

        setImgData(response.data);

        setImagesForStories(imageItems);
        if (imageItems.length > 0) {
          setHasStories(true);
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

  useFocusEffect(
    useCallback(() => {
      // Reset state when the screen comes into focus
      // resetState();
      fetchData();
      fetchComicData();
      fetchArcData();
      return () => {
        // Cleanup if needed
      };
    }, [])
  );
  

  const fetchComicData = async () => {
    try {
      const response = await getAllComics({ username: user });
      if (response.success) {
        // Assuming response.data directly contains the imageURLs array
        const imageItems: ImageItem[] = response.data.map((item : ComicItem)   => ({
          id: item.id.S,  // Assuming URL is unique and can be used as an ID
          uri: item.fullImageURL,  
          url : item.imageURL,
          username: 'kewalkishang',
          hashtags: ['self', 'new']
        }));

         setImgData(response.data);
          console.log("Comics ",imageItems.length);
        setImagesForTale(imageItems);
        // if (imageItems.length > 0) {
        //    setHasStories(true);
        // }
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
    fetchComicData();
  }, []);

  const fetchArcData = async () => {
    try {
      const response = await getAllUserArc({ username: user });
      if (response.success) {
        // Assuming response.data directly contains the imageURLs array
        const imageItems: ImageItem[] = response.data.map((item : ArcItem)   => ({
          id: item.id.S,  // Assuming URL is unique and can be used as an ID
          uri: item.cover,  
          comicURL : item.comicurl,
          coverURL : item.cover,
          username: 'kewalkishang',
          hashtags: ['self', 'new']
        }));
        console.log("ARC  ", imageItems);
        console.log("ARC LENGHT ", imageItems.length);
       setArc(imageItems);
      } else {
        console.error("Failed to fetch arc data:", response.message);
      }
    } catch (error) {
      console.error("Failed to fetch arc data:", error);
    }
  };

  // useEffect to call fetchData on component mount
  useEffect(() => {
    //Comment it out if you are not testing stories.
   fetchArcData();
  }, []);



  const renderImageItem = ({ item }: { item: ImageItem }) => (
    <TouchableOpacity onPress={() => handlePressImage(item)} style={activeTab === 'tale' ? styles.taleImage : styles.arcImage}>
      <Image
        source={{ uri: item.uri }}
        style={{ flex: 1, height: undefined, width: undefined, resizeMode: 'cover' }}
      />
      <View style={styles.overlayContainer}>
        <View style={{ width: "100%", flexDirection: 'row', justifyContent: 'space-around' }}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <TabBarIcon size={14} name={ 'eye-outline' } color="white" />
            <Text style={styles.text}>2</Text>
          </View>
        </View>
      </View>
      <View style={styles.overlayContainerTop}>
        <View style={styles.iconsCol}>
          <TabBarIcon size={18} name={activeTab === 'tale' ? 'image-outline': 'book-outline' } color="white" />
        </View>
      </View>


    </TouchableOpacity>
  );


  const username = 'kewalkishang';
  const followers = 1200;
  const following = 75;
  const likes = 3400;

  // const imagesForTalePlaceholder : ImageItem[]  = [
  //   { id: '1', uri: 'https://cdn.glitch.global/30af1d3b-4338-4f4a-a826-359ed81189cf/uki0lwy-360-panorama-view-park.jpeg?v=1678660202470' },
  //   { id: '2', uri: 'https://cdn.glitch.global/30af1d3b-4338-4f4a-a826-359ed81189cf/uki0lwy-360-panorama-view-park.jpeg?v=1678660202470' },
  //   { id: '3', uri: 'https://cdn.glitch.global/30af1d3b-4338-4f4a-a826-359ed81189cf/uki0lwy-360-panorama-view-park.jpeg?v=1678660202470' },
  //   { id: '4', uri: 'https://cdn.glitch.global/30af1d3b-4338-4f4a-a826-359ed81189cf/uki0lwy-360-panorama-view-park.jpeg?v=1678660202470' },
  //   { id: '5', uri: 'https://cdn.glitch.global/30af1d3b-4338-4f4a-a826-359ed81189cf/uki0lwy-360-panorama-view-park.jpeg?v=1678660202470' },
  //   { id: '6', uri: 'https://cdn.glitch.global/30af1d3b-4338-4f4a-a826-359ed81189cf/uki0lwy-360-panorama-view-park.jpeg?v=1678660202470' },
  //   { id: '7', uri: 'https://cdn.glitch.global/30af1d3b-4338-4f4a-a826-359ed81189cf/uki0lwy-360-panorama-view-park.jpeg?v=1678660202470' },
  //   { id: '8', uri: 'https://cdn.glitch.global/30af1d3b-4338-4f4a-a826-359ed81189cf/uki0lwy-360-panorama-view-park.jpeg?v=1678660202470' },
  //   { id: '9', uri: 'https://cdn.glitch.global/30af1d3b-4338-4f4a-a826-359ed81189cf/uki0lwy-360-panorama-view-park.jpeg?v=1678660202470' },
  //   { id: '10', uri: 'https://cdn.glitch.global/30af1d3b-4338-4f4a-a826-359ed81189cf/uki0lwy-360-panorama-view-park.jpeg?v=1678660202470' },
  //   { id: '11', uri: 'https://cdn.glitch.global/30af1d3b-4338-4f4a-a826-359ed81189cf/uki0lwy-360-panorama-view-park.jpeg?v=1678660202470' },
  //   { id: '12', uri: 'https://cdn.glitch.global/30af1d3b-4338-4f4a-a826-359ed81189cf/uki0lwy-360-panorama-view-park.jpeg?v=1678660202470' },
  // ];

  const imagesForArc: ImageItem[] = [
    { id: '1', uri: 'https://cdn.glitch.global/30af1d3b-4338-4f4a-a826-359ed81189cf/uki0lwy-360-panorama-view-park.jpeg?v=1678660202470', url : '' , comicURL : [], coverURL : ''},
    { id: '2', uri: 'https://cdn.glitch.global/30af1d3b-4338-4f4a-a826-359ed81189cf/uki0lwy-360-panorama-view-park.jpeg?v=1678660202470', url : '', comicURL : [], coverURL : '' },
    { id: '3', uri: 'https://cdn.glitch.global/30af1d3b-4338-4f4a-a826-359ed81189cf/uki0lwy-360-panorama-view-park.jpeg?v=1678660202470' , url : '' , comicURL : [], coverURL : ''},
    { id: '4', uri: 'https://cdn.glitch.global/30af1d3b-4338-4f4a-a826-359ed81189cf/uki0lwy-360-panorama-view-park.jpeg?v=1678660202470' , url : ''  , comicURL : [] , coverURL : ''},
  ];


  // State to manage active tab
  const [activeTab, setActiveTab] = useState('tale');
  const [modalVisible, setModalVisible] = useState(false);
  const [storiesVisible, setStoriesVisible] = useState(false);
  const [arcVisible, setArcVisible] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState('');
  const [selectedArcPos, setSelectedArcPos] = useState<string[]>([]);
  const [hasStories, setHasStories] = useState(false);
  const [imgData, setImgData] = useState([]);
  const [imagesForStories, setImagesForStories] = useState<ImageItem[]>([]);
  const [imagesForTale, setImagesForTale] = useState<ImageItem[]>([]);
  const [arc, setArc] = useState<ImageItem[]>([]);

  const handlePressImage = (item :ImageItem) => {
   
    if(activeTab === 'tale')
    {
       setModalVisible(true);
       setSelectedImageUri(item.uri);
    }
    else{
      console.log(item.comicURL);
      setSelectedArcPos(item.comicURL);
      setArcVisible(true);
      
    }
  };


  return (
    <View style={styles.container}>
      <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
        <Text style={styles.username}>{user}</Text>
        {/* <Link href="/personaForm"> */}
        <TouchableOpacity onPress={() => { router.push('/personaScreen') }}>

          <TabBarIcon size={28} name="accessibility-outline" color="black" />
        </TouchableOpacity>
        {/* </Link> */}
      </View>
      <TouchableOpacity
        onPress={hasStories ? () => setStoriesVisible(true) : undefined}
        activeOpacity={hasStories ? 0.2 : 1}>
        {/* <Link
        href={{
          pathname: "/storyViewScreen",
          params: { images : ["https://cdn.glitch.global/30af1d3b-4338-4f4a-a826-359ed81189cf/uki0lwy-360-panorama-view-park.jpeg?v=1678660202470", "https://cdn.glitch.global/30af1d3b-4338-4f4a-a826-359ed81189cf/uki0lwy-360-panorama-view-park.jpeg?v=1678660202470"]}
        }}> */}
        <Image
          style={hasStories ? styles.profileImageHighlighted : styles.profileImage}
          source={personIcon}// Replace with your image URL
        />
        {/* </Link> */}
      </TouchableOpacity>
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Followers</Text>
          <Text style={styles.statNumber}>{followers}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Following</Text>
          <Text style={styles.statNumber}>{following}</Text>

        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Likes</Text>
          <Text style={styles.statNumber}>{likes}</Text>
        </View>
      </View>



      <View style={styles.tabRow}>
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'tale' && styles.activeTab]}
            onPress={() => setActiveTab('tale')}
          >
            <Text style={styles.tabText}>Tale</Text>
          </TouchableOpacity>



          <TouchableOpacity
            style={[styles.tab, activeTab === 'arc' && styles.activeTab]}
            onPress={() => setActiveTab('arc')}
          >
            <Text style={styles.tabText}>Arc</Text>
          </TouchableOpacity>
        </View>
        </View>
        <View style={styles.contentContainer}>
        {
          activeTab === 'tale' && imagesForTale.length > 0 &&
          <TouchableOpacity
            style={{}}
            onPress={() => createArc({ username: user, stories: imgData, imgData : imagesForTale })}
          >
            <Text style={styles.tabText}>Create ARC</Text>
          </TouchableOpacity>

        }
   {activeTab === 'tale' &&
        <View style={styles.contentContainer}>
              <FlatList
                key={activeTab}
                data={imagesForTale}
                renderItem={renderImageItem}
                keyExtractor={item => `${activeTab}-${item.id}`}
                numColumns={3}
                
              />
              </View>
      }
       {activeTab === 'arc' &&
        <View style={styles.contentContainer}>
              <FlatList
                key={activeTab}
                data={arc}
                renderItem={renderImageItem}
                keyExtractor={item => `${activeTab}-${item.id}`}
                numColumns={1}
              />
              </View>
      }

</View>



<Modal
            animationType="slide"
            transparent={true}
            visible={arcVisible}
            onRequestClose={() => {
              setArcVisible(!arcVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false} // Hides the horizontal scroll indicators
                style={styles.scrollView}
            >
                {selectedArcPos.map((uri, index) => (
                <Image key={index} source={{ uri}} style={styles.fullImage} />
                ))}
                </ScrollView>
         
                <TouchableOpacity
                  style={styles.buttonClose}
                  onPress={() => setArcVisible(false)}
                >
                  <Text style={styles.textStyle}>Arc Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>


     



          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Image source={{ uri: selectedImageUri }} style={styles.fullImage} />
                <View style={styles.overlayContainer}>
                  <View style={{ width: "100%", flexDirection: 'row', justifyContent: 'space-around' }}>
                    <View style={{ flex: 1, flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-end' }}>
                      <Text style={styles.text}>View</Text>
                    </View>
                    <View style={styles.iconsCol}>
                      <TabBarIcon name="chatbubble-outline" color="white" />
                    </View>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.buttonClose}
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <Text style={styles.textStyle}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          <Modal
            animationType="slide"
            transparent={false}
            visible={storiesVisible}
            onRequestClose={() => {
              setStoriesVisible(!storiesVisible);
            }}
          >
            <View style={styles.centeredView}>
                <TouchableOpacity onPress={() => setStoriesVisible(false)} style={styles.crossIcon}>
                  <TabBarIcon name="close" color="black" size={32} style={styles.crossIconStyle}/>
                </TouchableOpacity>
                <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false} // Hides the horizontal scroll indicators
                style={styles.scrollView}
            >
                {imagesForStories.map((img) => (
                  <Image key={img.id} source={{ uri: img.uri }} style={styles.imageStyle} />
                ))}
              </ScrollView>
              {/* <Button title="Hide" onPress={() => {
                console.log("Hide");
                setStoriesVisible(false);
              }} /> */}
{/*              
              <Button title="Create Comic" onPress={() => {
                //    console.log("Create");
                createComic({ username: user, stories: imgData });
              }} /> */}
              <TouchableOpacity
              style={styles.createComicButton}
              onPress={() => {
                // Call the createComic function
                createComic({ username: user, stories: imgData });
              }}
            >
              <Text style={styles.createComicButtonText}>Create Comic</Text>
            </TouchableOpacity>
            </View>
          </Modal>

        </View>
        );
}

        const styles = StyleSheet.create({
          container: {
          flex: 1,
        alignItems: 'center',
        //justifyContent: 'center',
        paddingTop: 50, // Adjust based on your screen size
        backgroundColor: '#fff', // Background color
  },
        tabRow: {
          flexDirection: 'column',
  },
        contentContainer: {
          flex: 1,
        width: '100%',
  },
        username: {
          fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 10,
  },
        profileImage: {
        width: 150,
        height: 150,
        borderRadius: 75, // Half of the width/height to create circle
        borderWidth: 2,
        borderColor: '#333', // Border color
  },
        scene: {
          flex: 1,
  },
  scrollView: {
    marginTop : 200,
    display: 'flex',
    flexDirection: 'row',
},
        statsContainer: {
          flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 20,
  },
        statBox: {
          alignItems: 'center',
        flex: 1,
  },
        statNumber: {
          fontSize: 18,
        fontWeight: 'bold',
  },
        statLabel: {
          fontSize: 16,
        color: '#666', // Text color for the stat labels
        marginTop: 4,
  },
        tabsContainer: {
          flexDirection: 'row',
        marginTop: 10,
  },
        tab: {
          padding: 10,
        // marginLeft: 20,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
  },
        activeTab: {
          borderBottomColor: 'blue',
  },
        tabText: {
          fontWeight: 'bold',
  },
        contentContainerArc: {
          flex: 1,
        height : '100%',
        backgroundColor : 'red'
  },
        contentContainerTale : {
          flex: 1,
        height : '100%',
        backgroundColor : 'blue'
  },
        contentContainerTaleInvisble : {
          flex: 1,
        height : '100%',
        backgroundColor : 'blue',
        display : 'none'
  },
        gridContainer: {
          flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
  },
        taleImage: {
          width: '33%', // slightly less than one-third
        height: 100,
        resizeMode:'contain',
        marginBottom: 10,
  },
        arcImage: {
          width: '100%', // slightly less than one-third
          height: 200,
          resizeMode:'contain',
          marginBottom: 10,

  },
        centeredView: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fff',
  },
        modalView: {
          margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
        height: 2,
    },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
  },
        fullImage: {
          width: 300,
        height: 300,
  },
        buttonClose: {
          backgroundColor: '#2196F3',
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        marginTop: 15,
  },
        textStyle: {
          color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
  },
        overlayContainer: {
          position: 'absolute',
        // Adjust this value to ensure it's above the nav bar
        bottom : 0,
        left: 2,
    
  },
        overlayContainerTop: {
          position: 'absolute',
        // Adjust this value to ensure it's above the nav bar
        top : 0,
        right : 2
  
  },
        text: {
          color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
  },
        iconsCol: {
          flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
  },
        profileImageHighlighted: {
        width: 150,
        height: 150,
        borderRadius: 75, // Half of the width/height to create circle
        borderWidth: 5,
        borderColor: 'blue', // Highlight color
  },
        scrollViewStyle: {
          alignItems: 'center',
          // justifyContent: 'center',
          width: '80%',
  },
        contentVisible: {
        flex: 1,
        height: '100%', // or another height depending on your design
        opacity: 1,
  },
        contentHidden: {
          display : 'none'
  },
        imageStyle: {
          width: 300,
          height: 300,
          marginHorizontal: 10,
          borderRadius: 10,
  },
  // scrollViewStyle: {
  //   width: '100%',
  //   height : '100%',
  //   flex: 1,
  //   // justifyContent: 'center',
  //   // alignItems: 'center',
  //   backgroundColor : 'white',
  //   flexDirection: 'row'
  // },
  // imageStyle: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   width : '100%', // Set image width to window width
  //   height : '94%', // Set image height to window height
  //   resizeMode: 'contain', // Cover to maintain aspect ratio
  // },
  crossIcon: {
    position: 'absolute',
    top: 40, // Position at the top of the screen, adjust as necessary
    left: 20, // Position at the left of the screen, adjust as necessary
    zIndex: 10, // Ensure it stays on top
  },
  crossIconStyle: {
    fontWeight: 'bold',
  },
  createComicButton: {
      position : 'absolute',
      bottom: 60,
      backgroundColor: '#C4AED7',
      padding: 15,
      borderRadius: 30,
      margin: 25
  },
  createComicButtonText:{
    fontSize: 17,
    fontWeight: "bold"
  }

});