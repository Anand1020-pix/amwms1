import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Pressable, TextInput, Modal, Alert, ActivityIndicator } from "react-native";
import BottomNav from '../components/Bottomnav'; 
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons'; 
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LineChart } from 'react-native-chart-kit';
import { DATA_URL } from "../../config";

export default function Home({ navigation }) {
  const [data, setData] = useState([
    { id: '1', title: 'DO', value: '' },
    { id: '2', title: 'ORP_value', value: '' },
    { id: '3', title: 'conductivity', value: '' },
    { id: '4', title: 'pH', value: '' },
    { id: '5', title: 'temperature', value: '' },
    { id: '6', title: 'timestamp', value: '' }
  ]);

  const [fetchedData, setFetchedData] = useState(null);
  const [loading, setLoading] = useState(true);

  const titleMapping = {
    'DO': 'Dissolved Oxygen',
    'ORP_value': 'Oxidation-Reduction Potential',
    'conductivity': 'Salinity',
    'pH': 'pH Level',
    'temperature': 'Temperature',
    'timestamp': 'Date & Time'
  };

  const colorMapping = {
    'DO': '#e26a00',
    'ORP_value': '#1e90ff',
    'conductivity': '#32cd32',
    'pH': '#ff4500',
    'temperature': '#ffa500',
    'timestamp': '#6a5acd'
  };

  const [selectedLocation, setSelectedLocation] = useState('');
  const [locations, setLocations] = useState([
    { label: 'Gachibowli', value: 'location1' },
    { label: 'Adibatla', value: 'location2' },
  ]);
  const [newLocationName, setNewLocationName] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [graphModalVisible, setGraphModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [graphData, setGraphData] = useState({ categories: [], values: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(DATA_URL + '/data');
        const latestData = response.data;

        const latestPayload = latestData[0]?.payload || {};

        setFetchedData(latestPayload);

        setData(prevData => prevData.map(item => ({
          ...item,
          value: latestPayload[item.title] || 'N/A'
        })));

        if (selectedItem && latestPayload[selectedItem.title]) {
          setGraphData({
            categories: latestPayload[selectedItem.title].categories || [],
            values: (latestPayload[selectedItem.title].values || []).map(value => parseFloat(value) || 0)
          });
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedItem]);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');

      navigation.navigate('Login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const addLocation = () => {
    if (newLocationName.trim() === '') {
      Alert.alert('Invalid Input', 'Please enter a valid location name.');
      return;
    }
    const newLocation = { label: newLocationName, value: newLocationName.toLowerCase().replace(/\s+/g, '') };
    setLocations([...locations, newLocation]);
    setNewLocationName('');
    setModalVisible(false);
    Alert.alert('New Location Added', `${newLocationName} has been added.`);
  };
  const handleItemPress = async (item) => {
    setSelectedItem(item);
  
    if (!fetchedData) {
      console.error('Fetched data is not available.');
      return;
    }
  
    try {
      const response = await axios.get(DATA_URL + '/graph');
      const latestData = response.data;
  
      if (!latestData || latestData.length < 5) {
        console.error('Insufficient data received from the endpoint.');
        return;
      }
  
      // Extract the latest 5 values and timestamps
      const latestValues = latestData.map(data => parseFloat(data.payload[item.title]) || 0);
      const latestTimestamps = latestData.map(data => graphtime(parseFloat(data.timestamp)));
  
      // Ensure we have exactly 5 values
      if (latestValues.length !== 5 || latestTimestamps.length !== 5) {
        console.error('Received data does not contain exactly 5 values.');
        return;
      }
  
      // Set the graph data
      setGraphData({
        categories: latestTimestamps,
        values: latestValues
      });
  
      setGraphModalVisible(true);
    } catch (error) {
      console.error('Error fetching data from the endpoint:', error);
    }
  };
  
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric',  fractionalSecondDigits: 3, hour12: true, timeZone: 'UTC' };
    return date.toLocaleString('en-US', options);
  };

  const graphtime = (timestamp) =>{
       const date = new Date(timestamp * 1000);
    const options = { hour: 'numeric', minute: 'numeric',  fractionalSecondDigits: 3, hour12: true, timeZone: 'UTC' };
    return date.toLocaleString('en-US', options);

  }

  const renderItem = ({ item }) => {
    let formattedValue = item.value;
    if (item.title === 'timestamp') {
      formattedValue = formatTimestamp(item.value);
    } else {
      const numericValue = parseFloat(item.value);
      if (!isNaN(numericValue)) {
        formattedValue = numericValue.toFixed(2);
      }
    }

    return (
      <Pressable onPress={() => handleItemPress(item)} style={styles.card}>
        <Text style={styles.cardText}>{titleMapping[item.title]}</Text>
        <Text style={styles.cardValue}>{formattedValue}</Text>
      </Pressable>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
            <Picker.Item label="Location" value=""   />
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
       <Text></Text>
       <Text></Text>
      <Text style={styles.headerText}>Water Quality Performance(Fish)</Text>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
      />
      <BottomNav navigation={navigation} />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <TextInput
              style={styles.textInput}
              placeholder="Enter new location"
              value={newLocationName}
              onChangeText={setNewLocationName}
            />
            <Pressable onPress={addLocation} style={styles.button}>
              <Text style={styles.buttonText}>Add</Text>
            </Pressable>
            <Pressable onPress={() => setModalVisible(false)} style={styles.button}>
              <Text style={styles.buttonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={graphModalVisible}
        onRequestClose={() => setGraphModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Graph for {titleMapping[selectedItem?.title]}</Text>
            {selectedItem && (
              <LineChart
                data={{
                  labels: graphData.categories,
                  datasets: [
                    {
                      data: graphData.values,
                    },
                  ],
                }}
                width={400}
                height={220}
                yAxisLabel=""
                yAxisSuffix=""
                chartConfig={{
                  backgroundColor: colorMapping[selectedItem.title],
                  backgroundGradientFrom: colorMapping[selectedItem.title],
                  backgroundGradientTo: colorMapping[selectedItem.title],
                  decimalPlaces: 2,
                  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                  propsForDots: {
                    r: '6',
                    strokeWidth: '2',
                    stroke: '#ffa726',
                  },
                }}
                bezier
                style={{
                  marginVertical: 8,
                  borderRadius: 16,
                }}
              />
            )}
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setGraphModalVisible(false)}
            >
              <Text style={styles.buttonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign:'center',
  },
  logoutButton: {
    alignItems: 'right',
    padding: 10,
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
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
  },
  cardText: {
    color: '#ffffff',
  },
  cardValue: {
    color: '#ffffff',
    fontSize: 18,
    marginTop: 10,
  },
  button: {
    backgroundColor: '#208036',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    margin: 5,
    width: 100,
  },
  buttonText: {
    color: 'white', 
    fontSize: 16,
  },
  pickerContainer: {
    marginLeft: 10,
  },
  picker: {
    height: 50,
    width: 160,
    color: '#444544',
    fontWeight: "strong",
  },
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 10,
    padding: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: 400,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  addButton: {
    marginRight: 10,
    width: 30,
  },
  buttonClose: {
    backgroundColor: '#ff0000',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});