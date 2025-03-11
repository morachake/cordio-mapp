import MemberDetails from '@/components/ memberDetails';
import Header from '@/components/header';
import PreviousMeeting from '@/components/previousMeeting';
import Welcome from '@/components/Welcome';
import { useApp } from '@/context/AppContext';
import React from 'react';
import { View, StyleSheet, StatusBar, ScrollView } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";


const HomeScreen = () => {
  const { state } = useApp();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <StatusBar barStyle="dark-content" />
        <Header />
        <Welcome userName="Umaya" />
        <View style={styles.section}>
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