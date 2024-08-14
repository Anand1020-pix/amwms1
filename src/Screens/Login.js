import React, { useState } from 'react';
import { View, TextInput, Pressable, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { DATA_URL } from '../../config';

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
  forgetText: {
    marginTop: 5,
    color: '#208036',
    paddingLeft:180,
    textAlign:'right',
    fontWeight:'500',
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
  loginbutton: {
    backgroundColor: '#208036',
    padding: 10,
    margin: 10,
    borderRadius: 5,
    alignItems: 'center', 
    justifyContent: 'center', 
    width: '80%',
  },
  loginText: {
    color: 'white',
    fontSize: 18,
    textAlign:'center',
    fontWeight:'500',
  },
  signupText:{
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

const Login = ({ navigation }) => {
  const [name, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post(  DATA_URL +'/admin', {
        name: name,
        setPassword: password
      });

      if (response.status === 200) {
        navigation.navigate('Home');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setErrorMessage('Username or password is incorrect');
      } else {
        console.error("Error logging in:", error);
        setErrorMessage('Login failed: Please try again');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo-ef.png')} style={styles.logo} />
      <Text style={styles.title}>Welcome!</Text>
      <TextInput
        style={styles.input}
        placeholder="username"
        value={name}
        onChangeText={setUsername}
        keyboardType="text"
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
      {errorMessage !== '' && <Text style={styles.errorText}>{errorMessage}</Text>}
      <TouchableOpacity>
        <Text style={styles.forgetText} onPress={() => navigation.navigate('PasswordReset')}>Forgot Password?</Text>
      </TouchableOpacity>
      <Pressable style={styles.loginbutton} onPress={handleLogin}>
        <Text style={styles.loginText}>LOGIN</Text>
      </Pressable>
      <Pressable onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.Text}>Don't have an account? <Text style={styles.signupText}>Signup</Text></Text>
      </Pressable>
    </View>
  );
};

export default Login;