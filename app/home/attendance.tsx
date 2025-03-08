import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SocialFund from '@/components/homepage/socialFund';
import Savings from '@/components/homepage/savings';
import FInes from '@/components/homepage/fines';
import Summary from '@/components/homepage/summary';
import IssueLoans from '@/components/homepage/issueLoans';
import MeetingAttendance from '@/components/homepage/meetingAttendance';
import Loans from '@/components/homepage/loans';
import { FontAwesome } from '@expo/vector-icons';

const Attendance = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const navigation = useNavigation();

  const steps = [
    {
      component: MeetingAttendance,
      title: 'Meeting Attendance',
    },
    {
      component: SocialFund,
      title: 'Social Fund',
    },
    {
      component: Savings,
      title: 'Savings',
    },
    {
      component: FInes,
      title: 'Fines',
    },
    {
      component: Loans,
      title: 'Loans',
    },
    {
      component: Summary,
      title: 'Summary',
    },
    {
      component: IssueLoans,
      title: 'Issue Loans',
    }
  ];

  const goNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      // Go back to previous screen if on first step
      navigation.goBack();
    }
  };

  const handleSubmit = async () => {
    try {
      console.log('Submitting data:', formData);
      // Navigate to another screen after submission if needed
      // navigation.navigate('Home');
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  // Render current step
  const CurrentStepComponent = steps[currentStep].component;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with back button and title */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={18} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{steps[currentStep].title}</Text>
        <View style={styles.headerRightSpace} />
      </View>
      
      {/* Content area */}
      <ScrollView style={styles.contentContainer}>
        <CurrentStepComponent 
          formData={formData}
          setFormData={setFormData}
        />
      </ScrollView>
      
      {/* Fixed bottom navigation */}
      <View style={styles.bottomNavigation}>
        <TouchableOpacity 
          style={styles.bottomBackButton}
          onPress={goBack}
        >
          <FontAwesome name="arrow-left" size={16} color="#666" style={styles.buttonIcon} />
          <Text style={styles.bottomBackButtonText}>Back</Text>
        </TouchableOpacity>
        
        {currentStep < steps.length - 1 ? (
          <TouchableOpacity style={styles.bottomNextButton} onPress={goNext}>
            <Text style={styles.bottomNextButtonText}>Next</Text>
            <FontAwesome name="arrow-right" size={16} color="#fff" style={styles.buttonIcon} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.bottomNextButton} onPress={handleSubmit}>
            <Text style={styles.bottomNextButtonText}>Submit</Text>
            <FontAwesome name="check" size={16} color="#fff" style={styles.buttonIcon} />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  headerRightSpace: {
    width: 24, // For balanced header
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
  bottomNextButtonText: {
    fontSize: 16,
    color: '#fff',
    marginRight: 6,
  },
  buttonIcon: {
    marginHorizontal: 4,
  },
});

export default Attendance;