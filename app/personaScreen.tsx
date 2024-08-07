import React , {useState, useContext, useEffect } from 'react';
import {  View, Text, TextInput, Button, StyleSheet, ScrollView , Image} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { postPersona , getPersona } from '@/api/persona';
import { AuthContext } from '../context/AuthContext';


function PersonaScreen() {
  const { user } = useContext(AuthContext);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    physicalFeatures: '',
    clothing: '',
    personality: '',
    artStyle: '',
    characterURL : 'https://img.freepik.com/free-vector/hand-drawn-collection-different-profile-icons_23-2149081372.jpg?size=626&ext=jpg&ga=GA1.1.1413502914.1719964800&semt=sph'
});

const handleChange = (name : string, value : string) => {
    setFormData(prevState => ({
        ...prevState,
        [name]: value
    }));
};

const fetchData = async () => {
  try {
    const response = await getPersona({ username: user });
    if (response.success) {
      // Assuming response.data directly contains the imageURLs array
      console.log("Persona", response.data);
      const persona = response.data[0];  // Assuming 'data' directly contains the persona object
      setFormData({
        name: persona.name.S,
        physicalFeatures: persona.physicalFeatures.S,
        clothing: persona.clothing.S,
        personality: persona.personality.S,
        artStyle: persona.artStyle.S,
        characterURL : response.img ? response.img : 'https://img.freepik.com/free-vector/hand-drawn-collection-different-profile-icons_23-2149081372.jpg?size=626&ext=jpg&ga=GA1.1.1413502914.1719964800&semt=sph',
      });

    } else {
      console.error("Failed to fetch data:", response.message);
    }
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }
};

useEffect(() => {
  //Comment it out if you are not testing stories.
  fetchData();
}, []);


const handleSubmit = () => {
  console.log('Form Data:', formData);
  postPersona({username: user , formD : formData });
  setIsSubmitted(true);
  setTimeout(() => setIsSubmitted(false), 2000);
  // Here you might want to send the data to a backend server or handle it accordingly
};

return (
  <View style={{ backgroundColor : 'white', height : '100%' }}>
    <Image source={{ uri :
       formData.characterURL
    }} style={styles.preview} />
    <KeyboardAwareScrollView contentContainerStyle={styles.container} enableOnAndroid={true}>
  <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Name</Text>
      <TextInput
          style={styles.input}
          value={formData.name}
          onChangeText={(text) => handleChange('name', text)}
          placeholder="Enter your character's name"
      />

      <Text style={styles.label}>Physical Features</Text>
      <TextInput
          style={styles.input}
          value={formData.physicalFeatures}
          onChangeText={(text) => handleChange('physicalFeatures', text)}
          placeholder="What are your character's physical features?"
      />

      <Text style={styles.label}>Clothing</Text>
      <TextInput
          style={styles.input}
          value={formData.clothing}
          onChangeText={(text) => handleChange('clothing', text)}
          placeholder='What attire is your character wearing?'
      />

      <Text style={styles.label}>Character Personality</Text>
      <TextInput
          style={styles.input}
          value={formData.personality}
          onChangeText={(text) => handleChange('personality', text)}
          placeholder='What is your character personality?'
      />

      <Text style={styles.label}>Art Style</Text>
      <TextInput
          style={styles.input}
          value={formData.artStyle}
          onChangeText={(text) => handleChange('artStyle', text)}
          placeholder='What art style do you want?'
      />

      <Button title="Submit" onPress={handleSubmit} />
  </ScrollView>
  </KeyboardAwareScrollView>
  {isSubmitted && (
    <View style={styles.centeredMessageContainer}>
      <Text style={styles.centeredMessageText}>Form Submitted</Text>
    </View>
  )}
  </View>
);
}

const styles = StyleSheet.create({
container: {
  padding: 20,
  justifyContent: 'center',
  backgroundColor : 'white',
},
input: {
  height: 40,
  marginBottom: 12,
  borderWidth: 1,
  padding: 10,
  borderColor: "#E6E6E6",
  backgroundColor: '#F3F1F1',
  borderRadius: 30
},
label: {
  fontSize: 16,
  marginBottom: 5,
  color : "black",
  fontWeight: "bold"
},
preview : {
  width : '100%',
  height : 250
},
centeredMessageContainer: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#F1F1F1', // Optional: to make the background a bit darker
},
centeredMessageText: {
  backgroundColor: 'F1F1F1',
  padding: 20,
  borderRadius: 10,
  color: 'black',
  fontWeight: 'bold',
  textAlign: 'center',
}
});

export default PersonaScreen;
