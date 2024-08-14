import React, { useState } from 'react';
import { View, TextInput, Pressable, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    backgroundColor: "#d4d9d6",
    width: '80%',
    marginBottom: 10,
    padding: 10,
    color: '#333',
    borderRadius: 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
  },
  icon: {
    justifyContent: 'center', 
    position: 'absolute',
    right: 10,
    height: '100%',
    paddingBottom:10,
  },
  errorText: {
    color: 'red',
    width: '80%',
    textAlign: 'left',
    marginBottom: 5,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    fontWeight:'bold',
    fontSize:30,
    textAlign:'left',
    paddingRight: 200,
    color:'#208036',
  },
  signupButton: {
    backgroundColor: '#208036',
    padding: 10,
    margin: 10,
    borderRadius: 5,
    alignItems: 'center', 
    justifyContent: 'center', 
    width: '80%',
  },
  signupText: {
    color: 'white',
    fontSize: 18,
    textAlign:'center',
    fontWeight:'500',
  },
  loginText:{
    color: '#208036',
    fontSize: 15,
    fontWeight:'700',
  },
  Text:{
    fontWeight:"400"
  },
  logo: { 
    marginBottom: 20,
  },
});

const Signup = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }
  
    try {
      const response = await axios.post('https://a251-103-203-172-229.ngrok-free.app/adminregister', {
        name: username,
        setPassword: password
      });
  
      if (response.status === 200) {
        navigation.navigate('Login');
      } else {
        setErrorMessage('Signup failed: Please try again');
      }
    } catch (error) {
      console.error("Error signing up:", error);
      setErrorMessage('Signup failed: Please try again');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo-ef.png')} style={styles.logo} />
      <Text style={styles.title}>Signup</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <View style={styles.inputRow}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!passwordVisible}
        />
        <TouchableOpacity
          style={styles.icon}
          onPress={() => setPasswordVisible(!passwordVisible)}
        >
          <Ionicons name={passwordVisible ? 'eye' : 'eye-off'} size={24} color="gray" />
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry={!passwordVisible}
      />
      {errorMessage !== '' && <Text style={styles.errorText}>{errorMessage}</Text>}
      <Pressable style={styles.signupButton} onPress={handleSignup}>
        <Text style={styles.signupText}>SIGNUP</Text>
      </Pressable>
      <Pressable onPress={() => navigation.navigate('Login')}>
        <Text style={styles.Text}>Already have an account? <Text style={styles.loginText}>Login</Text></Text>
      </Pressable>
    </View>
  );
};

export default Signup;