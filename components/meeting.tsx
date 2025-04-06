import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  FlatList,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'expo-router';

// Props interface to match the React component
interface StartMeetingProps {
  onNext: (data: any) => void;
}

export default function StartMeeting({ onNext }: StartMeetingProps) {
  const { state, generateMeetingCode, beginMeeting, resetMeetingData, fetchMeetingAttendees, setMembersFetched } = useApp();
  const router = useRouter();
  const [codes, setCodes] = useState<string[]>([]);
  const [codeInput, setCodeInput] = useState("");
  const [meetingStarted, setMeetingStarted] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // Monitor when meeting data changes
  useEffect(() => {
    if (state.meetingData && isGenerating) {
      setIsGenerating(false);
      console.log("Meeting data received:", state.meetingData);
    }
  }, [state.meetingData, isGenerating]);

  const handleGenerateMeetingCode = async () => {
    try {
      setIsGenerating(true);
      setLocalError(null);
      console.log("Beginning generateMeetingCode call");
      await generateMeetingCode();
      console.log("Finished generateMeetingCode call");
    } catch (error) {
      console.error("Error generating code:", error);
      setLocalError("Failed to generate meeting code. Please try again.");
      setIsGenerating(false);
    }
  };

  const handleAddCode = () => {
    if (codeInput && !codes.includes(codeInput)) {
      setCodes([...codes, codeInput]);
      setCodeInput("");
      setLocalError(null);
    }
  };

  const handleRemoveCode = (code: string) => {
    setCodes(codes.filter((c) => c !== code));
  };

  const handleBeginMeeting = async () => {
    if (!state.meetingData) {
      setLocalError("Please generate a meeting code first");
      return;
    }
    if (codes.length === 0) {
      setLocalError("Please add at least one code");
      return;
    }

    try {
      console.log("Starting meeting with data:", {
        meetingId: state.meetingData.meetingId,
        codes,
        venue: "mpeketoni",
        groupId: state.meetingData.groupId,
      });
      
      setLocalError(null);
      await beginMeeting({
        meetingId: state.meetingData.meetingId,
        codes,
        venue: "mpeketoni",
        groupId: state.meetingData.groupId,
      });
      
      console.log("Meeting started successfully");
      setMeetingStarted(true);
      
      // Start loading and navigating process
      setIsNavigating(true);
      
      try {
        // Reset membersFetched flag to ensure a fresh fetch
        setMembersFetched(false);
        
        // Pre-fetch attendance data
        console.log("Fetching attendees for meeting ID:", state.meetingData.meetingId);
        await fetchMeetingAttendees(state.meetingData.meetingId);
        console.log("Successfully fetched attendees, continuing to next step");
        
        // Success - call onNext to advance in the flow
        if (onNext) {
          onNext({});
        }
        
        setIsNavigating(false);
      } catch (fetchError) {
        console.error("Error fetching attendees:", fetchError);
        setLocalError("Meeting started, but there was an error loading attendees. Please try again.");
        setIsNavigating(false);
      }
    } catch (error) {
      console.error("Error starting meeting:", error);
      setLocalError("Failed to start meeting. Please try again.");
      setIsNavigating(false);
    }
  };

  const handleStartNewMeeting = async () => {
    setMeetingStarted(false);
    setCodes([]);
    setCodeInput("");
    setLocalError(null);
    setIsNavigating(false);
    resetMeetingData();
    
    // Clear all local storage items - adapted for AsyncStorage
    const keysToRemove = [
      'meetingCodes', 'meetingCode'
    ];
    
    try {
      await Promise.all(keysToRemove.map(key => AsyncStorage.removeItem(key)));
    } catch (error) {
      console.error("Error clearing AsyncStorage:", error);
    }
  };

  const renderCodeItem = ({ item }: { item: string }) => (
    <View style={styles.codeItem}>
      <Text style={styles.codeText}>{item}</Text>
      <TouchableOpacity 
        style={styles.removeButton} 
        onPress={() => handleRemoveCode(item)}
      >
        <Text style={styles.removeButtonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  // If we're in the navigating state, show a loading indicator
  if (isNavigating) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6C3CE3" />
        <Text style={styles.loadingText}>Starting meeting and loading members...</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <View style={styles.card}>
        {!state.meetingData ? (
          <TouchableOpacity 
            style={styles.generateButton} 
            onPress={handleGenerateMeetingCode} 
            disabled={isGenerating}
          >
            <Text style={styles.buttonText}>
              {isGenerating ? "Generating Code..." : "Generate Meeting Code"}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Add Code</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  value={codeInput}
                  onChangeText={setCodeInput}
                  placeholder="Enter code"
                />
                <TouchableOpacity 
                  style={styles.addButton} 
                  onPress={handleAddCode}
                >
                  <Text style={styles.buttonText}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>

            {codes.length > 0 && (
              <View style={styles.codesContainer}>
                <Text style={styles.codesHeader}>Meeting Codes:</Text>
                <FlatList
                  data={codes}
                  renderItem={renderCodeItem}
                  keyExtractor={(item, index) => index.toString()}
                  style={styles.codesList}
                  nestedScrollEnabled={true}
                />
              </View>
            )}

            {state.error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>API Error: {state.error}</Text>
              </View>
            )}

            {localError && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{localError}</Text>
              </View>
            )}

            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={styles.outlineButton} 
                onPress={handleStartNewMeeting}
              >
                <Text style={styles.outlineButtonText}>Restart</Text>
              </TouchableOpacity>

              {meetingStarted ? (
                <TouchableOpacity 
                  style={styles.primaryButton} 
                  onPress={() => {
                    // Call onNext to advance in the flow
                    if (onNext) {
                      onNext({});
                    }
                  }}
                >
                  <Text style={styles.buttonText}>Next</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity 
                  style={[
                    styles.primaryButton,
                    (codes.length === 0 || state.isLoading) && styles.disabledButton
                  ]} 
                  onPress={handleBeginMeeting}
                  disabled={codes.length === 0 || state.isLoading}
                >
                  <Text style={styles.buttonText}>
                    {state.isLoading ? "Starting..." : "Start Meeting"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formContainer: {
    gap: 16,
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 12,
    backgroundColor: '#f9f9f9',
  },
  addButton: {
    backgroundColor: '#6C3CE3',
    borderRadius: 6,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  codesContainer: {
    marginTop: 8,
    marginBottom: 12,
  },
  codesHeader: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  codesList: {
    maxHeight: 200,
  },
  codeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 6,
    marginBottom: 8,
  },
  codeText: {
    flex: 1,
  },
  removeButton: {
    backgroundColor: '#e53e3e',
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  errorContainer: {
    backgroundColor: '#fed7d7',
    borderWidth: 1,
    borderColor: '#f56565',
    borderRadius: 6,
    padding: 12,
    marginVertical: 8,
  },
  errorText: {
    color: '#c53030',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    gap: 12,
  },
  outlineButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#6C3CE3',
    borderRadius: 6,
    padding: 12,
    alignItems: 'center',
  },
  outlineButtonText: {
    color: '#6C3CE3',
    fontWeight: 'bold',
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#6C3CE3',
    borderRadius: 6,
    padding: 12,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#a0aec0',
  },
  generateButton: {
    backgroundColor: '#6C3CE3',
    borderRadius: 6,
    padding: 12,
    alignItems: 'center',
    width: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});