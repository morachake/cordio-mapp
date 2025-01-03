import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { Entypo, AntDesign } from '@expo/vector-icons';
import { useApp } from '@/context/AppContext';

const HomeScreen = () => {
  const { generateMeetingCode, state, beginMeeting, resetMeetingData } = useApp();
  const [codes, setCodes] = useState([]);
  const [codeInput, setCodeInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [localError, setLocalError] = useState('');
  const [meetingStarted, setMeetingStarted] = useState(false);

  useEffect(() => {
    if (state.meetingData) {
      setIsGenerating(false);
    }
  }, [state.meetingData]);

  const handleGenerateCode = async () => {
    try {
      setIsGenerating(true);
      setLocalError('');
      await generateMeetingCode();
    } catch (error) {
      setLocalError("Error occurred while generating code");
      setIsGenerating(false);
    }
  };

  const handleAddCode = () => {
    if (codeInput && !codes.includes(codeInput)) {
      setCodes([...codes, codeInput]);
      setCodeInput('');
      setLocalError('');
    }
  };

  const handleRemoveCode = (codeToRemove) => {
    setCodes(codes.filter(code => code !== codeToRemove));
  };

  const handleBeginMeeting = async () => {
    if (!state.meetingData) {
      setLocalError("Please generate a code first");
      return;
    }
    if (codes.length === 0) {
      setLocalError("Please add at least one code");
      return;
    }
    try {
      setLocalError('');
      await beginMeeting({
        meetingId: state.meetingData.meetingId,
        codes,
        venue: "mpeketoni",
        groupId: state.meetingData.groupId,
      });
      setMeetingStarted(true);
    } catch (error) {
      setLocalError("Error occurred while starting meeting");
    }
  };

  const handleStartNewMeeting = () => {
    setMeetingStarted(false);
    setCodes([]);
    setCodeInput('');
    setLocalError('');
    resetMeetingData();
  };

  const MeetingCircle = ({ letter }) => (
    <View style={styles.circle}>
      <Text style={styles.circleLetter}>{letter}</Text>
    </View>
  );

  const renderMeetingSection = () => {
    if (isGenerating) {
      return (
        <View style={styles.meetingCard}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6C3CE3" />
            <Text style={styles.loadingText}>Generating meeting code...</Text>
          </View>
        </View>
      );
    }

    if (state.meetingData) {
      return (
        <View style={styles.meetingCard}>
          <View style={styles.todayMeeting}>
            <MeetingCircle letter="M" />
            <View style={styles.meetingInfo}>
              <Text style={styles.meetingName}>Meeting Code Generated</Text>
              <Text style={styles.meetingTime}>ID: {state.meetingData.meetingId}</Text>
            </View>
          </View>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={codeInput}
              onChangeText={setCodeInput}
              placeholder="Enter code"
              placeholderTextColor="#666"
            />
            <TouchableOpacity 
              style={[styles.addButton, !codeInput && styles.addButtonDisabled]}
              onPress={handleAddCode}
              disabled={!codeInput}
            >
              <Text style={styles.addButtonText}>Add Code</Text>
            </TouchableOpacity>
          </View>

          {codes.length > 0 && (
            <View style={styles.codesList}>
              {codes.map((code, index) => (
                <View key={index} style={styles.codeItem}>
                  <Text style={styles.codeText}>{code}</Text>
                  <TouchableOpacity
                    onPress={() => handleRemoveCode(code)}
                    style={styles.removeButton}
                  >
                    <Text style={styles.removeButtonText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {localError ? <Text style={styles.errorText}>{localError}</Text> : null}

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.restartButton}
              onPress={handleStartNewMeeting}
            >
              <Text style={styles.restartButtonText}>Restart</Text>
            </TouchableOpacity>

            {meetingStarted ? (
              <TouchableOpacity 
                style={styles.startButton}
                onPress={() => {/* Handle next step */}}
              >
                <Text style={styles.startButtonText}>Next</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={[styles.startButton, (codes.length === 0 || state.loading) && styles.startButtonDisabled]}
                onPress={handleBeginMeeting}
                disabled={codes.length === 0 || state.loading}
              >
                <Text style={styles.startButtonText}>
                  {state.loading ? 'Starting...' : 'Start Meeting'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      );
    }

    return (
      <View style={styles.meetingCard}>
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
      </View>
    );
  };

  // Rest of your component remains the same...
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <StatusBar barStyle="dark-content" />
        
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>
              <Entypo name="home" size={28} color="black" />
            </Text>
            <Text style={styles.logoText}>Neema</Text>
          </View>
        </View>

        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Hi, Umaya.</Text>
          <Text style={styles.welcomeSubtitle}>
            <Text style={styles.welcomeLight}>Welcome to </Text>
            <Text style={styles.welcomeDark}>Neema </Text>
            <Text style={styles.welcomeLight}>Group</Text>
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Meeting</Text>
            <AntDesign name="caretdown" size={24} color="black" />
          </View>
          
          {renderMeetingSection()}

          <View style={styles.memberDetailsContainer}>
            <TouchableOpacity style={styles.memberSection}>
              <Text style={styles.sectionTitle}>Member's Details</Text>
              <Text style={styles.arrow}>
                <AntDesign name="caretright" size={24} color="black" />
              </Text>
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 2,
    marginBottom: 16,
  },
  inputContainer: {
    marginVertical: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E8EEF9',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginTop: 8,
    fontSize: 14,
  },
  meetingDetails: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#F8F9FD',
    borderRadius: 8,
  },
  meetingDetailText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  memberDetailsContainer: {
    borderWidth: 1,
    borderColor: '#E8EEF9',
    marginTop: 24,
    borderRadius: 12,
  },
  addButton: {
    backgroundColor: '#6C3CE3',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  addButtonDisabled: {
    backgroundColor: '#A8A8A8',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  codesList: {
    marginTop: 16,
  },
  codeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8F9FD',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  codeText: {
    fontSize: 16,
  },
  removeButton: {
    backgroundColor: '#FF4444',
    borderRadius: 6,
    padding: 8,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  restartButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#6C3CE3',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginRight: 8,
  },
  restartButtonText: {
    color: '#6C3CE3',
    fontWeight: 'bold',
    fontSize: 14,
  },
 
  startButtonDisabled: {
    backgroundColor: '#A8A8A8',
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

export default HomeScreen;