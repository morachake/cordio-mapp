import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MeetingCircle from './MeetingCircle';


const PreviousMeeting = () => {
  return (
    <View style={styles.previousContainer}>
      <Text style={styles.sectionTitle}>Previous meeting</Text>
      <View style={styles.meetingRow}>
        <View style={styles.dateContainer}>
          <MeetingCircle letter="M" small dark />
          <Text>July 29th 2025</Text>
        </View>
        <Text>10:20 am</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  previousContainer: {
    borderWidth: 1,
    borderColor: '#E8EEF9',
    marginTop: 24,
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  meetingRow: {
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  dateContainer: {
    flexDirection: 'row', 
    alignItems: 'center',
    marginRight: 10,
  },
});

export default PreviousMeeting;