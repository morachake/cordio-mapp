import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useApp } from '@/context/AppContext';
import MeetingCircle from './MeetingCircle';
import GeneratedMeeting from './generatedMeeting';


const MeetingSection = () => {
  const { generateMeetingCode, state, resetMeetingData } = useApp();
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (state.meetingData) {
      setIsGenerating(false);
    }
  }, [state.meetingData]);

  const handleGenerateCode = async () => {
    try {
      setIsGenerating(true);
      await generateMeetingCode();
    } catch (error) {
      setIsGenerating(false);
    }
  };

  const renderMeetingContent = () => {
    if (isGenerating) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6C3CE3" />
          <Text style={styles.loadingText}>Generating meeting code...</Text>
        </View>
      );
    }

    if (state.meetingData) {
      return <GeneratedMeeting meetingData={state.meetingData} resetMeetingData={resetMeetingData} />;
    }

    return (
      <>
        <View style={styles.todayMeeting}>
          <MeetingCircle letter="M" />
          <View style={styles.meetingInfo}>
            <Text style={styles.meetingName}>Today's Meeting</Text>
            <Text style={styles.meetingTime}>{new Date().toLocaleTimeString()}</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.startButton} 
          onPress={handleGenerateCode}
          disabled={isGenerating}
        >
          <Text style={styles.startButtonText}>GET CODE</Text>
        </TouchableOpacity>
      </>
    );
  };

  return (
    <>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Meeting</Text>
        <AntDesign name="caretdown" size={24} color="black" />
      </View>
      
      <View style={styles.meetingCard}>
        {renderMeetingContent()}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 2,
    marginBottom: 16,
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
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
});

export default MeetingSection;