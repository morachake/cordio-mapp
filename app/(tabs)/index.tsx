import MemberDetails from '@/components/ memberDetails';
import Header from '@/components/header';
import MeetingSection from '@/components/meeting';
import MeetingCircle from '@/components/MeetingCircle';
import PreviousMeeting from '@/components/previousMeeting';
import Welcome from '@/components/Welcome';
import { useApp } from '@/context/AppContext';
import React from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar, ScrollView } from 'react-native';


const HomeScreen = () => {
  const { state } = useApp();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <StatusBar barStyle="dark-content" />
        <Header />
        <Welcome userName="Umaya" />
        <View style={styles.section}>
          <MeetingSection />
          <PreviousMeeting />
          <MemberDetails />
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
  section: {
    padding: 20,
  },
});

export default HomeScreen;