import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Welcome = ({ userName }) => {
  return (
    <View style={styles.welcomeSection}>
      <Text style={styles.welcomeTitle}>Hi, {userName}.</Text>
      <Text style={styles.welcomeSubtitle}>
        <Text style={styles.welcomeLight}>Welcome to </Text>
        <Text style={styles.welcomeDark}>Neema </Text>
        <Text style={styles.welcomeLight}>Group</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  welcomeSection: {
    padding: 20,
    paddingTop: 0,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 18,
  },
  welcomeLight: {
    color: '#7D89B0',
  },
  welcomeDark: {
    color: '#000',
  },
});

export default Welcome;