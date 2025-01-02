import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, ScrollView } from 'react-native';
import {Entypo,AntDesign} from '@expo/vector-icons';

const HomeScreen = () => {
  const previousMeetings = [
    { date: 'July 14, 2024', time: '10:40 am' },
    { date: 'June 29, 2024', time: '10:40 am' },
    { date: 'June 14, 2024', time: '10:40 am' },
  ];

  const MeetingCircle = ({ letter }) => (
    <View style={styles.circle}>
      <Text style={styles.circleLetter}>{letter}</Text>
    </View>
  );

  const PreviousMeetingItem = ({ date, time }) => (
    <View style={styles.previousMeetingItem}>
      <View style={[styles.circle, styles.smallCircle, styles.darkCircle]}>
        <Text style={[styles.circleLetter, styles.smallLetter]}>J</Text>
      </View>
      <View style={styles.meetingInfo}>
        <Text style={styles.meetingDate}>{date}</Text>
        <Text style={styles.meetingTime}>{time}</Text>
      </View>
    </View>
  );

  return (         
  <SafeAreaView style={styles.container}>

    <ScrollView>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>
            <Entypo name="home" size={28} color="black" />
          </Text>
          <Text style={styles.logoText}>Neema</Text>
        </View>
      </View>

      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeTitle}>Hi, Umaya.</Text>
        <Text style={styles.welcomeSubtitle}>
          <Text style={styles.welcomeLight}>Welcome to </Text>
          <Text style={styles.welcomeDark}>Neema </Text>
          <Text style={styles.welcomeLight}>Group</Text>
        </Text>
      </View>

      {/* Meeting Section */}
      <View style={styles.section}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding:2 }}>
          <Text style={styles.sectionTitle}>Meeting</Text>
          <AntDesign name="caretdown" size={24} color="black" />
        </View>
        
        {/* Today's Meeting Card */}
        <View style={styles.meetingCard}>
          <View style={styles.todayMeeting}>
            <MeetingCircle letter="M" />
            <View style={styles.meetingInfo}>
              <Text style={styles.meetingName}>Today's Meeting</Text>
              <Text style={styles.meetingTime}>09:30 am</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.startButton}>
            <Text style={styles.startButtonText}>+ START MEETING</Text>
          </TouchableOpacity>
        </View>

        {/* Previous Meetings */}
        <View style={styles.previousMeetings}>
          <Text style={styles.previousTitle}>Previous Meeting I</Text>
          {previousMeetings.map((meeting, index) => (
            <PreviousMeetingItem
              key={index}
              date={meeting.date}
              time={meeting.time}
            />
          ))}
        </View>

        {/* Member's Details Section */}
      <View style={{borderWidth:1, borderColor:'#E8EEF9', marginTop:24, padding:2, borderRadius:12}}>
      <TouchableOpacity style={styles.memberSection}>
        <Text style={styles.sectionTitle}>Member's Details</Text>
        <Text style={styles.arrow}><AntDesign name="caretright" size={24} color="black" /></Text>
      </TouchableOpacity>
      </View>
      </View>
      
    </ScrollView>
    </SafeAreaView>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    fontSize: 24,
    marginRight: 8,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
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
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  meetingCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  todayMeeting: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  circle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8EEF9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  circleLetter: {
    fontSize: 20,
    color: '#000',
    fontWeight: '500',
  },
  meetingInfo: {
    flex: 1,
  },
  meetingName: {
    fontSize: 16,
    fontWeight: '500',
  },
  meetingTime: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  startButton: {
    backgroundColor: '#6C3CE3',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  previousMeetings: {
    borderWidth: 1,
    borderColor: '#E8EEF9',
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
  },
  previousTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  previousMeetingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  smallCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  darkCircle: {
    backgroundColor: '#1E2D3D',
  },
  smallLetter: {
    fontSize: 16,
    color: '#fff',
  },
  meetingDate: {
    fontSize: 16,
    fontWeight: '500',
  },
  memberSection: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  arrow: {
    fontSize: 16,
    color: '#666',
  },
});

export default HomeScreen;