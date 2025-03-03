import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MeetingCircle = ({ letter, small = false, dark = false }) => {
  return (
    <View style={[
      styles.circle, 
      small && styles.smallCircle,
      dark && styles.darkCircle
    ]}>
      <Text style={[
        styles.circleLetter,
        dark && styles.darkCircleLetter,
        small && styles.smallLetter
      ]}>
        {letter}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  circle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8EEF9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  smallCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  darkCircle: {
    backgroundColor: '#1E2D3D',
  },
  circleLetter: {
    fontSize: 20,
    color: '#000',
    fontWeight: '500',
  },
  darkCircleLetter: {
    color: '#fff',
  },
  smallLetter: {
    fontSize: 16,
  }
});

export default MeetingCircle;