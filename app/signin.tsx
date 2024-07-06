import { Link, Stack, useRouter  } from 'expo-router';
import React, { useState,  useContext} from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Text, View } from 'react-native';

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
      <ThemedView style={styles.container}>
        {/* <ThemedText type="title">This is the the sign in page.</ThemedText> */}

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
        <ThemedText type="button">Sign In</ThemedText>
      </TouchableOpacity>
        <Link href="/" style={styles.link}>
          <ThemedText type="link">Sign in!</ThemedText>
        </Link>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  input: {
    width: '100%',
    height: 50,
    padding: 10,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
  },
  button: {
    marginTop: 10,
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
});
