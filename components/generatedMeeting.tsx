import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useApp } from '@/context/AppContext';
import MeetingCircle from './MeetingCircle';
import CodesList from './codeList';


const GeneratedMeeting = ({ meetingData, resetMeetingData }) => {
  const { beginMeeting, state } = useApp();
  const [codes, setCodes] = useState([]);
  const [codeInput, setCodeInput] = useState('');
  const [localError, setLocalError] = useState('');
  const [meetingStarted, setMeetingStarted] = useState(false);

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
    if (codes.length === 0) {
      setLocalError("Please add at least one code");
      return;
    }
    try {
      setLocalError('');
      await beginMeeting({
        meetingId: meetingData.meetingId,
        codes: [codes],
        venue: "mpeketoni",
        groupId: meetingData.groupId,
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

  return (
    <>
      <View style={styles.todayMeeting}>
        <MeetingCircle letter="M" />
        <View style={styles.meetingInfo}>
          <Text style={styles.meetingName}>Meeting Code Generated</Text>
          <Text style={styles.meetingTime}>ID: {meetingData.meetingId}</Text>
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

      {codes.length > 0 && <CodesList codes={codes} onRemoveCode={handleRemoveCode} />}

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
    </>
  );
};

const styles = StyleSheet.create({
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
  errorText: {
    color: 'red',
    marginTop: 8,
    fontSize: 14,
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
  startButton: {
    flex: 1,
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
  startButtonDisabled: {
    backgroundColor: '#A8A8A8',
  },
});

export default GeneratedMeeting;