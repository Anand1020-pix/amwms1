import React, { useState } from 'react';
import { View, TextInput, Pressable, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
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
  resetButton: {
    backgroundColor: '#208036',
    padding: 10,
    margin: 10,
    borderRadius: 5,
    alignItems: 'center', 
    justifyContent: 'center', 
    width: '80%',
  },
  resetText: {
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

const PasswordReset = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handlePasswordReset = async () => {
    try {
      const response = await axios.post('https://5ff4-1-22-125-92.ngrok-free.app/password-reset', {
        email: email
      });

      if (response.status === 200) {
        setErrorMessage('Password reset link sent to your email');
      } else {
        setErrorMessage('Error sending password reset link');
      }
    } catch (error) {
      setErrorMessage('Error sending password reset link');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo-ef.png')} style={styles.logo} />
      <Text style={styles.title}>Reset Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {errorMessage !== '' && <Text style={styles.errorText}>{errorMessage}</Text>}
      <Pressable style={styles.resetButton} onPress={handlePasswordReset}>
        <Text style={styles.resetText}>RESET PASSWORD</Text>
      </Pressable>
      <Pressable onPress={() => navigation.navigate('Login')}>
        <Text style={styles.Text}>Remember your password? <Text style={styles.loginText}>Login</Text></Text>
      </Pressable>
    </View>
  );
};

export default PasswordReset;