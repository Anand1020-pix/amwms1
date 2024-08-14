import React from 'react';
import { View, Modal, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const GraphComponent = ({ visible, data, onClose }) => {
  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <LineChart
          data={{
            labels: data.categories,
            datasets: [
              {
                data: data.values,
              },
            ],
          }}
          width={320} // from react-native
          height={220}
          yAxisLabel=""
          yAxisSuffix=""
          chartConfig={{
            backgroundColor: '#e26a00',
            backgroundGradientFrom: '#fb8c00',
            backgroundGradientTo: '#ffa726',
            decimalPlaces: 2, // optional, defaults to 2dp
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
        <Ionicons name="ios-close" size={36} color="black" onPress={onClose} style={styles.closeIcon} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  closeIcon: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
});

export default GraphComponent;