import React, { useContext } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon6 from 'react-native-vector-icons/FontAwesome6';
import { ActiveIndexContext } from '../components/ActiveIndexContext';

export default function BottomNav({ navigation }) {
  const { activeIndex, setActiveIndex } = useContext(ActiveIndexContext);
  const scale = new Animated.Value(1);

  const handlePress = (index, route) => {
    setActiveIndex(index);
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      navigation.navigate(route);
    });
  };

  return (
    <View style={styles.navContainer}>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => handlePress(0, 'Home')}
      >
        <Animated.View style={{ transform: [{ scale: activeIndex === 0 ? scale : 1 }] }}>
          <Icon6 name="fish" size={30} color={activeIndex === 0 ? "#208036" : "#444544"} />
        </Animated.View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => handlePress(1, 'Shrimp')}
      >
        <Animated.View style={{ transform: [{ scale: activeIndex === 1 ? scale : 1 }] }}>
          <Icon6 name="shrimp" size={30} color={activeIndex === 1 ? "#208036" : "#444544"} />
        </Animated.View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => handlePress(2, 'Alertpage')}
      >
        <Animated.View style={{ transform: [{ scale: activeIndex === 2 ? scale : 1 }] }}>
          <Icon name="warning" size={30} color={activeIndex === 2 ? "#208036" : "#444544"} />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#ffffff',
    padding: 10,
  },
  navItem: {
    alignItems: 'center',
  },
});