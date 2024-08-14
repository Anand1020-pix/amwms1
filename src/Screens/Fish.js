import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import BottomNav from '../components/Bottomnav'; 
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons'; 
import { DATA_URL } from "../../config";

export default function Fish({ navigation }) {
  const [data, setData] = useState([
    { id: '1', title: 'DO', value: '' },
    { id: '2', title: 'ORP_value', value: '' },
    { id: '3', title: 'conductivity', value: '' },
    { id: '4', title: 'pH', value: '' },
    { id: '5', title: 'temperature', value: '' },
    { id: '6', title: 'timestamp', value: '' }
  ]);

  const titleMapping = {
    'DO': 'Dissolved Oxygen',
    'ORP_value': 'Oxidation-Reduction Potential',
    'conductivity': 'Conductivity',
    'pH': 'pH Level',
    'temperature': 'Temperature',
    'timestamp': 'Timestamp'
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get( DATA_URL+'/data');
        const latestData = response.data;

        setData(prevData => prevData.map(item => ({
          ...item,
          value: latestData[item.title]?.values.slice(-1)[0] || 'N/A'
        })));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    // Implement your logout logic here
    console.log('Logout clicked');
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardText}>{titleMapping[item.title]}</Text>
      <Text style={styles.cardValue}>{item.value}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}></Text>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text></Text>
        <Ionicons name="log-out-outline" size={29} color="white" />
      </TouchableOpacity>
      
      <Text style={styles.headerText}>Water Quality Performance(Fish)</Text>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
      />
      <BottomNav navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    padding: 10,
    backgroundColor: '#208036',
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 20,
  },
  logoutButton: {
    alignItems: 'flex-end',
    padding: 10,
    backgroundColor: '#208036',
  },
  listContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 10,
  },
  card: {
    flex: 1,
    margin: 5,
    padding: 20,
    backgroundColor: '#208036',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: {
    color: '#ffffff',
  },
  cardValue: {
    color: '#ffffff',
    fontSize: 18,
    marginTop: 10,
  },
  headerText:{
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    fontFamily:'sans-serif-medium '
  }
});