import React , {useState, useContext} from 'react';
import {  View, Text, TextInput, Button, StyleSheet, ScrollView , Image} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { postPersona } from '@/api/persona';
import { AuthContext } from '../context/AuthContext';


function PersonaScreen() {
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: '',
    physicalFeatures: '',
    clothing: '',
    personality: '',
    artStyle: ''
});

const handleChange = (name : string, value : string) => {
    setFormData(prevState => ({
        ...prevState,
        [name]: value
    }));
};

const handleSubmit = () => {
  console.log('Form Data:', formData);
  postPersona({username: user , formD : formData });
  // Here you might want to send the data to a backend server or handle it accordingly
};

return (
  <View style={{ backgroundColor : 'white', height : '100%' }}>
    <Image source={{ uri :
      'https://img.freepik.com/free-vector/hand-drawn-collection-different-profile-icons_23-2149081372.jpg?size=626&ext=jpg&ga=GA1.1.1413502914.1719964800&semt=sph'
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
}
});

export default PersonaScreen;
