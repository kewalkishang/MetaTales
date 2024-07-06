import { Link, Stack, useRouter  } from 'expo-router';
import React, { useState,  useContext} from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Text, View , Image} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { AuthContext } from '../context/AuthContext';

export default function SignInScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useContext(AuthContext);
  const router = useRouter();


  const handleSignIn = () => {
    signIn(username, password);
    router.push('(tabs)'); // Navigate to the home screen after sign-in
  };


  return (
    <>
      <Stack.Screen options={{ title: 'signin' }} />
      {/* <ThemedView style={styles.container}> */}
      <KeyboardAwareScrollView contentContainerStyle={styles.container} enableOnAndroid={true}>
        {/* <ThemedText type="title">This is the the sign in page.</ThemedText> */}
        <Image source={{ uri :
          'https://marketplace.canva.com/EAFpHYHYxmE/1/0/1600w/canva-black-white-simple-colorful-blank-comic-strip-oYRtJI7dHK0.jpg'
        }} style={styles.preview} />
        <Text style={styles.label}>Login</Text>

        
        <TextInput
          style={styles.input}
          onChangeText={setUsername}
          value={username}
          placeholder="Username"
          autoCapitalize="none"
        />
        
        <TextInput
          style={styles.input}
          onChangeText={setPassword}
          value={password}
          placeholder="Password"
          secureTextEntry
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.button} onPress={handleSignIn}>
          <ThemedText type="button" style={styles.buttontext}>Sign In</ThemedText>
        </TouchableOpacity>
        <Link href="/" style={styles.link}>
          <ThemedText type="link">Sign up!</ThemedText>
        </Link>
        </KeyboardAwareScrollView>
      {/* </ThemedView> */}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'white'
  },
  link: {
    marginTop: 10,
    paddingVertical: 15,
  },
  input: {
    width : '95%',
    height : '6%',
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
  },
  button: {
    marginTop: 10,
    backgroundColor: '#FFC300',
    padding: 15,
    borderRadius: 30,
  },
  preview : {
    width : '95%',
    height : '35%'
  },
  label: {
    marginTop: 10,
    fontSize: 30,
    marginBottom: 10,
    color : "black",
    fontWeight: "bold"
  },
  buttontext : {
    fontSize: 17,
    fontWeight: "bold"
  }
});
