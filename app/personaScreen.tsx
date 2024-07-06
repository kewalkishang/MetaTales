import React , {useState, useContext} from 'react';
import {  View, Text, TextInput, Button, StyleSheet, ScrollView , Image} from 'react-native';
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
      'https://cdn.glitch.global/30af1d3b-4338-4f4a-a826-359ed81189cf/uki0lwy-360-panorama-view-park.jpeg?v=1678660202470'
    }} style={styles.preview} />
  <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Name</Text>
      <TextInput
          style={styles.input}
          value={formData.name}
          onChangeText={(text) => handleChange('name', text)}
      />

      <Text style={styles.label}>Physical Features</Text>
      <TextInput
          style={styles.input}
          value={formData.physicalFeatures}
          onChangeText={(text) => handleChange('physicalFeatures', text)}
      />

      <Text style={styles.label}>Clothing</Text>
      <TextInput
          style={styles.input}
          value={formData.clothing}
          onChangeText={(text) => handleChange('clothing', text)}
      />

      <Text style={styles.label}>Character Personality</Text>
      <TextInput
          style={styles.input}
          value={formData.personality}
          onChangeText={(text) => handleChange('personality', text)}
      />

      <Text style={styles.label}>Art Style</Text>
      <TextInput
          style={styles.input}
          value={formData.artStyle}
          onChangeText={(text) => handleChange('artStyle', text)}
      />

      <Button title="Submit" onPress={handleSubmit} />
  </ScrollView>
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
  padding: 10
},
label: {
  fontSize: 16,
  marginBottom: 5
},
preview : {
  width : '100%',
  height : 200
}
});

export default PersonaScreen;
