import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '@/context/AppContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';
import SocialFund from '@/components/homepage/socialFund';
import Savings from '@/components/homepage/savings';
import Fines from '@/components/homepage/fines';
import Loans from '@/components/homepage/loans';
import Summary from '@/components/homepage/summary';
import LoanRequest from '@/components/homepage/LoanRequest';
import MeetingAttendance from '@/components/homepage/meetingAttendance';
import StartMeeting from '@/components/meeting';

export default function MeetingStepsFlow () {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetchingMembers, setFetchingMembers] = useState(false);
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const { state, fetchMeetingAttendees, setCurrentStep: setAppStep, updateStepData, resetMeetingData, setMembersFetched } = useApp();

  // Define the steps for the meeting flow
  const steps = [
    {
      component: StartMeeting,
      title: 'Start Meeting',
      key: 'start'
    },
    {
      component: MeetingAttendance,
      title: 'Meeting Attendance',
      key: 'attendance'
    },
    {
      component: SocialFund,
      title: 'Social Fund',
      key: 'social'
    },
    {
      component: Savings,
      title: 'Savings',
      key: 'savings'
    },
    {
      component: Fines,
      title: 'Fines',
      key: 'fines'
    },
    {
      component: Loans,
      title: 'Loans',
      key: 'loans'
    },
    {
      component: Summary,
      title: 'Summary',
      key: 'summary'
    },
    {
      component: LoanRequest,
      title: 'Issue Loans',
      key: 'issuance'
    }
  ];

  // Initialize data on component mount
  useEffect(() => {
    const initializeFlow = async () => {
      try {
        // Check if a step was previously saved
        const savedStep = await AsyncStorage.getItem('currentMeetingStep');
        if (savedStep) {
          const stepIndex = parseInt(savedStep);
          if (!isNaN(stepIndex) && stepIndex >= 0 && stepIndex < steps.length) {
            // Check if meeting data is available for steps after "Start Meeting"
            if (stepIndex > 0 && !state.meetingData?.meetingId) {
              console.log("Meeting data missing but step > 0, resetting to start step");
              setCurrentStep(0);
              await AsyncStorage.setItem('currentMeetingStep', '0');
            } else {
              setCurrentStep(stepIndex);
            }
          }
        }
      } catch (error) {
        console.error("Error initializing meeting flow:", error);
        // Reset to first step on error
        setCurrentStep(0);
        await AsyncStorage.setItem('currentMeetingStep', '0');
      }
    };

    initializeFlow();
  }, []);

  // Load members data if needed when moving to attendance step
  useEffect(() => {
    const loadMembersIfNeeded = async () => {
      // Only try to load members if we're on the attendance step and have a meeting ID
      if (currentStep === 1 && state.meetingData?.meetingId && (!state.members || state.members.length === 0)) {
        try {
          console.log("Attendance step - fetching members for meeting ID:", state.meetingData.meetingId);
          setFetchingMembers(true);
          
          // Reset membersFetched flag to ensure a fresh fetch
          setMembersFetched(false);
          
          await fetchMeetingAttendees(state.meetingData.meetingId);
          
          setFetchingMembers(false);
        } catch (error) {
          console.error("Error fetching members for attendance:", error);
          setFetchingMembers(false);
        }
      }
    };

    loadMembersIfNeeded();
  }, [currentStep, state.meetingData?.meetingId, state.members]);

  // Handle moving to the next step
  const goNext = async () => {
    if (currentStep < steps.length - 1) {
      const nextStep = currentStep + 1;
      
      // If moving from start to attendance, ensure we have meeting data
      if (currentStep === 0 && nextStep === 1) {
        if (!state.meetingData?.meetingId) {
          return;
        }
        
        // Load members for attendance step
        setFetchingMembers(true);
        try {
          // Reset membersFetched flag to ensure a fresh fetch
          setMembersFetched(false);
          
          await fetchMeetingAttendees(state.meetingData.meetingId);
        } catch (fetchError) {
          console.error("Error fetching members:", fetchError);
          setFetchingMembers(false);
          return;
        }
        setFetchingMembers(false);
      }
      
      setCurrentStep(nextStep);
      // Save current step to AsyncStorage
      await AsyncStorage.setItem('currentMeetingStep', nextStep.toString());
      // Update step in app context
      setAppStep(steps[nextStep].key);
    }
  };

  // Handle going back a step
  const goBack = async () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      // Save current step to AsyncStorage
      await AsyncStorage.setItem('currentMeetingStep', prevStep.toString());
      // Update step in app context
      setAppStep(steps[prevStep].key);
    } else {
      // Go back to previous screen if on first step
      navigation.goBack();
    }
  };

  // Handle step completion
  const handleStepComplete = async (data, key) => {
    try {
      setError(null);
      
      // For start meeting step, we just advance without saving data
      if (key === 'start') {
        if (!state.meetingData?.meetingId) {
          return;
        }
        goNext();
        return;
      }
      
      // Save step data
      const newFormData = { ...formData, [key]: data };
      setFormData(newFormData);
      
      // Save step data to context
      await updateStepData(key, data);
      
      // Mark step as completed
      await AsyncStorage.setItem(`${key}Completed`, 'true');
      
      // Move to next step
      goNext();
    } catch (error) {
      console.error(`Error completing ${key} step:`, error);
    }
  };

  // Handle form submission (final step)
  const handleSubmit = async () => {
    try {
      setLoading(true);
      console.log('Submitting data:', formData);
      
      // Additional submission logic as needed
      // ...
      
      // Reset steps after successful submission
      await AsyncStorage.removeItem('currentMeetingStep');
      
      // Clear completed flags
      for (const step of steps) {
        await AsyncStorage.removeItem(`${step.key}Completed`);
      }
      
      setLoading(false);
      
      // Navigate to another screen after submission if needed
      // navigation.navigate('Home');
      
      // Display success message
      setError(null);
    } catch (error) {
      console.error('Error submitting form:', error);
      setLoading(false);
    }
  };

  // Reset the entire flow
  const resetFlow = async () => {
    try {
      setLoading(true);
      
      // Reset meeting data in context
      resetMeetingData();
      
      // Clear all related AsyncStorage keys
      const keysToRemove = [
        'currentMeetingStep', 
        'meetingCodes', 
        'attendanceData',
        'meetingCode',
        ...steps.map(step => `${step.key}Completed`)
      ];
      
      await Promise.all(keysToRemove.map(key => AsyncStorage.removeItem(key)));
      
      // Reset to first step
      setCurrentStep(0);
      setFormData({});
      setError(null);
      
      setLoading(false);
    } catch (error) {
      console.error('Error resetting flow:', error);
      setLoading(false);
    }
  };

  // Show global loading state
  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Processing...</Text>
      </SafeAreaView>
    );
  }

  // Show fetching members loading state (specific to attendance step transition)
  if (fetchingMembers) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Loading member data...</Text>
        <Text style={styles.loadingSubText}>Please wait while we fetch attendance information</Text>
      </SafeAreaView>
    );
  }

  // Get current component and key
  const CurrentStepComponent = steps[currentStep].component;
  const currentStepKey = steps[currentStep].key;

  // Check if we need to show special error state for steps after start meeting
  if (currentStep > 0 && !state.meetingData?.meetingId) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>No active meeting found.</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={resetFlow}
        >
          <Text style={styles.retryButtonText}>Start New Meeting</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Special check for attendance step without members
  if (currentStep === 1 && (!state.members || state.members.length === 0) && state.meetingData?.meetingId) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>No members found for this meeting.</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={async () => {
            setFetchingMembers(true);
            try {
              // Reset membersFetched flag to ensure a fresh fetch
              setMembersFetched(false);
              await fetchMeetingAttendees(state.meetingData.meetingId);
            } catch (e) {
              setError("Failed to fetch members");
            }
            setFetchingMembers(false);
          }}
        >
          <Text style={styles.retryButtonText}>Load Members</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with back button and title */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={18} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{steps[currentStep].title}</Text>
        
        {/* Show reset button in header */}
        <TouchableOpacity onPress={resetFlow} style={styles.resetButton}>
          <FontAwesome name="refresh" size={18} color="#dc3545" />
        </TouchableOpacity>
      </View>
      
      {/* Error message if any */}
      {error && (
        <View style={styles.errorBar}>
          <Text style={styles.errorBarText}>{error}</Text>
          <TouchableOpacity onPress={() => setError(null)}>
            <FontAwesome name="times" size={16} color="white" />
          </TouchableOpacity>
        </View>
      )}
      
      {/* Content area */}
      <View style={styles.contentContainer}>
        <CurrentStepComponent 
          onNext={(data) => handleStepComplete(data, currentStepKey)}
          initialData={currentStepKey === 'attendance' ? state.members : null}
        />
      </View>
      
      {/* Fixed bottom navigation - only show for start step */}
      {currentStep === 0 && (
        <View style={styles.bottomNavigation}>
          <TouchableOpacity 
            style={styles.bottomBackButton}
            onPress={goBack}
          >
            <FontAwesome name="arrow-left" size={16} color="#666" style={styles.buttonIcon} />
            <Text style={styles.bottomBackButtonText}>Back</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.bottomNextButton,
              !state.meetingData?.meetingId && styles.disabledButton
            ]} 
            onPress={goNext}
            disabled={!state.meetingData?.meetingId}
          >
            <Text style={styles.bottomNextButtonText}>Next</Text>
            <FontAwesome name="arrow-right" size={16} color="#fff" style={styles.buttonIcon} />
          </TouchableOpacity>
        </View>
      )}
      
      {/* For the final step, show submit button */}
      {currentStep === steps.length - 1 && (
        <View style={styles.bottomNavigation}>
          <TouchableOpacity 
            style={styles.bottomBackButton}
            onPress={goBack}
          >
            <FontAwesome name="arrow-left" size={16} color="#666" style={styles.buttonIcon} />
            <Text style={styles.bottomBackButtonText}>Back</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.bottomNextButton} onPress={handleSubmit}>
            <Text style={styles.bottomNextButtonText}>Submit</Text>
            <FontAwesome name="check" size={16} color="#fff" style={styles.buttonIcon} />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  resetButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  errorBar: {
    backgroundColor: '#dc3545',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorBarText: {
    color: 'white',
    flex: 1,
    marginRight: 10,
  },
  contentContainer: {
    flex: 1,
  },
  bottomNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  bottomBackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  bottomBackButtonText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 6,
  },
  bottomNextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 4,
  },
  disabledButton: {
    backgroundColor: '#a0aec0',
  },
  bottomNextButtonText: {
    fontSize: 16,
    color: '#fff',
    marginRight: 6,
  },
  buttonIcon: {
    marginHorizontal: 4,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  loadingSubText: {
    marginTop: 8,
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#dc3545',
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  retryButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});
