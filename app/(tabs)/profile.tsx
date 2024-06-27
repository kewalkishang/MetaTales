import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Platform,Text, View, TouchableOpacity, FlatList, Modal } from 'react-native';


import React, { useState } from 'react';

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
   </TouchableOpacity>
  );

  
  const username = 'kewalkishang';
  const followers = 1200;
  const following = 75;
  const likes = 3400;

  const imagesForTale : ImageItem[]  = [
    { id: '1', uri: 'https://cdn.glitch.global/30af1d3b-4338-4f4a-a826-359ed81189cf/uki0lwy-360-panorama-view-park.jpeg?v=1678660202470' },
    { id: '2', uri: 'https://cdn.glitch.global/30af1d3b-4338-4f4a-a826-359ed81189cf/uki0lwy-360-panorama-view-park.jpeg?v=1678660202470' },
    { id: '3', uri: 'https://cdn.glitch.global/30af1d3b-4338-4f4a-a826-359ed81189cf/uki0lwy-360-panorama-view-park.jpeg?v=1678660202470' },
    { id: '4', uri: 'https://cdn.glitch.global/30af1d3b-4338-4f4a-a826-359ed81189cf/uki0lwy-360-panorama-view-park.jpeg?v=1678660202470' },
    { id: '5', uri: 'https://cdn.glitch.global/30af1d3b-4338-4f4a-a826-359ed81189cf/uki0lwy-360-panorama-view-park.jpeg?v=1678660202470' },
    { id: '6', uri: 'https://cdn.glitch.global/30af1d3b-4338-4f4a-a826-359ed81189cf/uki0lwy-360-panorama-view-park.jpeg?v=1678660202470' },
    { id: '7', uri: 'https://cdn.glitch.global/30af1d3b-4338-4f4a-a826-359ed81189cf/uki0lwy-360-panorama-view-park.jpeg?v=1678660202470' },
    { id: '8', uri: 'https://cdn.glitch.global/30af1d3b-4338-4f4a-a826-359ed81189cf/uki0lwy-360-panorama-view-park.jpeg?v=1678660202470' },
    { id: '9', uri: 'https://cdn.glitch.global/30af1d3b-4338-4f4a-a826-359ed81189cf/uki0lwy-360-panorama-view-park.jpeg?v=1678660202470' },
    { id: '10', uri: 'https://cdn.glitch.global/30af1d3b-4338-4f4a-a826-359ed81189cf/uki0lwy-360-panorama-view-park.jpeg?v=1678660202470' },
    { id: '11', uri: 'https://cdn.glitch.global/30af1d3b-4338-4f4a-a826-359ed81189cf/uki0lwy-360-panorama-view-park.jpeg?v=1678660202470' },
    { id: '12', uri: 'https://cdn.glitch.global/30af1d3b-4338-4f4a-a826-359ed81189cf/uki0lwy-360-panorama-view-park.jpeg?v=1678660202470' },
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
    <Text style={styles.username}>{username}</Text>
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
    marginTop : 20,
    padding: 10,
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
    width: '100%', // full width
    height: 200,
    marginBottom: 10,
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
});