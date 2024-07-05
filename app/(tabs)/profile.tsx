import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Platform,Text, View, TouchableOpacity, FlatList, Modal } from 'react-native';
import { Link, router } from 'expo-router';

import React, { useState } from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';

const personIcon = require('../../assets/images/man.png');

interface ImageItem {
  id: string;
  uri: string;
}

export default function ProfileScreen() {

  const renderImageItem = ({ item }: { item: ImageItem }) => (
     <TouchableOpacity onPress={() => handlePressImage(item.uri)} style={activeTab === 'tale' ? styles.taleImage : styles.arcImage}>
    <Image
      source={{ uri: item.uri }}
      style={{ flex: 1, height: undefined, width: undefined, resizeMode: 'cover' }}
    />
       <View style={styles.overlayContainer}> 
        <View style={{ width : "100%", flexDirection : 'row', justifyContent : 'space-around'}}>
        <View style={{ flex : 1, flexDirection : 'row', alignItems : 'center'}}>
       <TabBarIcon size={14} name="eye-outline" color="white" />
        <Text style={styles.text}>2</Text>
        </View>
        </View>
        </View>
        <View style={styles.overlayContainerTop}> 
        <View style={styles.iconsCol}>
            <TabBarIcon size={18} name="image-outline" color="white" />
        </View>
        </View>
     
     
   </TouchableOpacity>
  );

  
  const username = 'kewalkishang';
  const followers = 1200;
  const following = 75;
  const likes = 3400;

  const imagesForTale : ImageItem[]  = [
    { id: '1', uri: 'https://images.unsplash.com/photo-1512757776214-26d36777b513?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { id: '2', uri: 'https://images.unsplash.com/photo-1530907487668-af02f65b4afe?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { id: '3', uri: 'https://images.unsplash.com/photo-1501426026826-31c667bdf23d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHN1bW1lcnxlbnwwfHwwfHx8MA%3D%3D' },
    { id: '4', uri: 'https://images.unsplash.com/photo-1576506295286-5cda18df43e7?q=80&w=3024&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { id: '5', uri: 'https://plus.unsplash.com/premium_photo-1663133679087-bc5deb50ab00?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YmVhY2h8ZW58MHx8MHx8fDA%3D' },
    { id: '6', uri: 'https://plus.unsplash.com/premium_photo-1676517030094-3a49a6d598e6?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzd8fGJlYWNofGVufDB8fDB8fHww' },
    { id: '7', uri: 'https://images.unsplash.com/photo-1542224566-6e85f2e6772f?q=80&w=3088&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { id: '8', uri: 'https://plus.unsplash.com/premium_photo-1669748158361-d0f740b80b08?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzd8fG1vdW50YWluc3xlbnwwfHwwfHx8MA%3D%3D' },
    { id: '9', uri: 'https://plus.unsplash.com/premium_photo-1673736135967-1c9aaa4aa7f8?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8aGlrZXxlbnwwfHwwfHx8MA%3D%3D' },
    // { id: '10', uri: 'https://cdn.glitch.global/30af1d3b-4338-4f4a-a826-359ed81189cf/uki0lwy-360-panorama-view-park.jpeg?v=1678660202470' },
    // { id: '11', uri: 'https://cdn.glitch.global/30af1d3b-4338-4f4a-a826-359ed81189cf/uki0lwy-360-panorama-view-park.jpeg?v=1678660202470' },
    // { id: '12', uri: 'https://cdn.glitch.global/30af1d3b-4338-4f4a-a826-359ed81189cf/uki0lwy-360-panorama-view-park.jpeg?v=1678660202470' },
  ];

  const imagesForArc :  ImageItem[]  = [
    { id: '1', uri: 'https://cdn.glitch.global/30af1d3b-4338-4f4a-a826-359ed81189cf/uki0lwy-360-panorama-view-park.jpeg?v=1678660202470' },
    { id: '2', uri: 'https://cdn.glitch.global/30af1d3b-4338-4f4a-a826-359ed81189cf/uki0lwy-360-panorama-view-park.jpeg?v=1678660202470' },
    { id: '3', uri: 'https://cdn.glitch.global/30af1d3b-4338-4f4a-a826-359ed81189cf/uki0lwy-360-panorama-view-park.jpeg?v=1678660202470' },
    { id: '4', uri: 'https://cdn.glitch.global/30af1d3b-4338-4f4a-a826-359ed81189cf/uki0lwy-360-panorama-view-park.jpeg?v=1678660202470' },
  ];
  

    // State to manage active tab
  const [activeTab, setActiveTab] = useState('tale');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState('');

  const handlePressImage = (uri: string) => {
    setSelectedImageUri(uri);
    setModalVisible(true);
  };


  return (
    <View style={styles.container}>
      <View style={{ width : '100%', flexDirection : 'row', justifyContent : 'space-around', alignItems : 'center'}}> 
    <Text style={styles.username}>{username}</Text>
    {/* <Link href="/personaForm"> */}
    <TouchableOpacity onPress={() => {router.push('/personaScreen')}}>

    <TabBarIcon size={28} name="accessibility-outline" color="black" />
    </TouchableOpacity>
    {/* </Link> */}
    </View>
    <Image
      style={styles.profileImage}
      source={personIcon} // Replace with your image URL
    />
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
    {/* <View style={styles.tabRow}> */}
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
    {/* </View> */}
      {/* Content based on active tab */}
      <View style={styles.contentContainer}>
         <FlatList
          key={activeTab}  // Dynamic key based on the active tab
          data={activeTab === 'tale' ? imagesForTale : imagesForArc}
          renderItem={renderImageItem}
          keyExtractor={item => `${activeTab}-${item.id}`} 
          numColumns={activeTab === 'tale' ? 3 : 3}
        />
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
        <View style={{ width : "100%", flexDirection : 'row', justifyContent : 'space-around'}}>
        <View style={{ flex : 1, flexDirection : 'column', alignItems : 'flex-start', justifyContent :'flex-end' }}>
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
      </View>
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
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75, // Half of the width/height to create circle
    borderWidth: 3,
    borderColor: '#333', // Border color
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
  contentContainer: {
    flex: 1,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  taleImage: {
    width: '32%', // slightly less than one-third
    height: 100,
    marginBottom: 10,
  },
  arcImage: {
  flex: 1,
    resizeMode: 'cover',
    backgroundColor: 'blue', 
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
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
});