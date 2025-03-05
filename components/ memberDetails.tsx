import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';

const MemberDetails= () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.memberSection} onPress={( ) => router.push('/home/attendance')}>
        <Text style={styles.sectionTitle}>Member's Details</Text>
        <Text style={styles.arrow}>
          <AntDesign name="caretright" size={24} color="black" />
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  memberSection: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  arrow: {
    fontSize: 16,
    color: '#666',
  },
});

export default MemberDetails;