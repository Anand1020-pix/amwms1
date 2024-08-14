import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, Pressable } from 'react-native';
import BottomNav from '../components/Bottomnav'; 
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { DATA_URL } from '../../config'; 

const handleLogout = async (navigation) => {
  try {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userData');
    navigation.navigate('Login');
  } catch (error) {
    console.error('Error logging out:', error);
  }
};

// Optimum conditions
const optimumConditions = {
  shrimp: {
    temperature: [28, 30],
    ph: [7.5, 8.5],
    orp: [200, 300],
    ec: [1, 3],
    do: [5, 8],
  },
  fish: {
    temperature: [24, 28],
    ph: [6.5, 8],
    orp: [150, 250],
    ec: [0.5, 2],
    do: [6, 9],
  },
};

const checkConditions = (data, type) => {
  const alerts = [];
  const conditions = optimumConditions[type];

  Object.keys(conditions).forEach(key => {
    if (data[key] && data[key].values) {
      data[key].values.forEach((value, index) => {
        if (value !== "" && value !== 0) {
          const numericValue = parseFloat(value);
          const [min, max] = conditions[key];
          if (numericValue < min || numericValue > max) {
            alerts.push({
              title: `Warning: ${key.toUpperCase()} level`,
              message: `${key.toUpperCase()} level is ${numericValue} at ${data[key].categories[index]}, which is outside the optimum range of ${min}-${max}.`,
            });
          }
        }
      });
    }
  });

  return alerts;
};

// Define your scenes for tabs
const ShrimpRoute = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await fetch( DATA_URL + '/data');
        
        // Check if the response is successful
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Log the raw response text for debugging
        const responseText = await response.text();

        // Attempt to parse the response as JSON
        const data = JSON.parse(responseText);
        const shrimpAlerts = checkConditions(data, 'shrimp');
        setAlerts(shrimpAlerts);
      } catch (error) {
        console.error('Error fetching shrimp alerts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  const renderAlert = ({ item }) => (
    <View style={styles.alertBox}>
      <Text style={styles.alertTitle}>{item.title}</Text>
      <Text style={styles.alertMessage}>{item.message}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container1}>
        <ActivityIndicator size="large" color="#208036" />
      </View>
    );
  }

  return (
    <View style={styles.container1}>
      <FlatList
        data={alerts}
        renderItem={renderAlert}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const FishRoute = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await fetch( DATA_URL + '/data');
        
        // Check if the response is successful
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Log the raw response text for debugging
        const responseText = await response.text();
        

        // Attempt to parse the response as JSON
        const data = JSON.parse(responseText);
        const fishAlerts = checkConditions(data, 'fish');
        setAlerts(fishAlerts);
      } catch (error) {
       
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  const renderAlert = ({ item }) => (
    <View style={styles.alertBox}>
      <Text style={styles.alertTitle}>{item.title}</Text>
      <Text style={styles.alertMessage}>{item.message}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container1}>
        <ActivityIndicator size="large" color="#208036" />
      </View>
    );
  }

  

  return (
    <View style={styles.container1}>
      <FlatList
        data={alerts}
        renderItem={renderAlert}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default function Alertpage({ navigation }) {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'shrimp', title: 'Shrimp' },
    { key: 'fish', title: 'Fish' },
  ]);
  const [selectedLocation, setSelectedLocation] = useState('');

  const renderScene = SceneMap({
    shrimp: ShrimpRoute,
    fish: ShrimpRoute,
  });

  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={styles.indicator}
      style={styles.tabBar}
      labelStyle={styles.tabLabel}
    />
  );

  const [locations, setLocations] = useState([
    { label: 'Gachibowli', value: 'location1' },
    { label: 'Adibatla', value: 'location2' },
  ]);

  return (
    <View style={styles.container1}>
      <View style={styles.header}>
        <Text style={styles.headerText}></Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="location" size={29} color="green" style={{ marginRight: -10 }}/>
          <Picker
            selectedValue={selectedLocation}
            onValueChange={(itemValue) => setSelectedLocation(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Location" value="" />
            {locations.map((location, index) => (
              <Picker.Item key={index} label={location.label} value={location.value} />
            ))}
          </Picker>
          <Pressable onPress={() => setModalVisible(true)} style={styles.addButton}>
            <Ionicons name="add-circle-outline" size={29} color="green" />
          </Pressable>
        </View>
        <Pressable onPress={handleLogout} style={{ width: 29, marginRight: 10 }}>
          <Ionicons name="log-out-outline" size={29} color="red" />
        </Pressable>
      </View>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: 360 }}
        renderTabBar={renderTabBar}
      />
      <BottomNav navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container1: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 10,
  },
  alertBox: {
    backgroundColor: '#ffffff',
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    borderColor: '#000',
    borderWidth: 1,
    shadowColor: '#000',
    borderStyle: 'solid',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  alertMessage: {
    fontSize: 14,
    color: '#666',
  },
  tabBar: {
    backgroundColor: '#208036',
  },
  tabLabel: {
    color: '#ffffff',
  },
  indicator: {
    backgroundColor: '#ffffff',
  },
  header: {
    backgroundColor: '#208036',
    padding: 10,
  },
  headerText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  picker: {
    height: 50,
    width: 180,
    color: '#333',
  },
});