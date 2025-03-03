import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AppState, GroupDetails, Member, MeetingData } from '../types/app';
import { useAuth } from './AuthContext';
import { initialState, appReducer } from '../reducer/appReducer';
import * as actions from '../reducer/appActions';
import * as SecureStore from 'expo-secure-store';

const BASE_URL = 'http://localhost:8081/api/v1';

interface AppContextType {
  state: AppState;
  generateMeetingCode: () => Promise<void>;
  beginMeeting: (payload: MeetingData) => Promise<void>;
  fetchGroupDetails: (groupId: number) => Promise<void>;
  fetchMeetingAttendees: (meetingId: number) => Promise<void>;
  updateMember: (memberId: number, updates: Partial<Member>) => void;
  endMeeting: () => Promise<void>;
  setCurrentStep: (step: string) => void;
  setMeetingData: (data: MeetingData) => void;
  setGroupDetails: (data: GroupDetails) => void;
  updateAttendance: (memberId: number, status: Member['attendanceStatus']) => void;
  setMembers: (members: Member[]) => void;
  resetMeetingData: () => void;
  submitSociameetingData: () => Promise<void>;
  updateStepData: (step: string, data: unknown) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { getToken } = useAuth();

  // Log state and avoid direct Promise logging
  useEffect(() => {
    console.log("Here is state", state);
    
    const fetchToken = async () => {
      try {
        const token = await SecureStore.getItemAsync('token');
        console.log("Here is app token", token);
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    };
    
    fetchToken();
  }, [state]);

  const beginMeeting = async (payload: MeetingData) => {
    console.log('Begin meeting code');
    dispatch(actions.beginMeetingRequest());
    try {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }
      console.log('Begin Meeting Payload:', payload);
      const response = await fetch(`${BASE_URL}/meeting/begin`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`API call failed: ${response.statusText}. ${JSON.stringify(errorData)}`);
      }
      const data = await response.json();
      console.log('Begin Meeting Response:', data);
      dispatch(actions.beginMeetingSuccess());
      dispatch(actions.setMeetingData(data));
      dispatch(actions.setGroupDetails(data));
      dispatch(actions.setCurrentStep('attendance'));
    } catch (error) {
      console.error('Begin Meeting Error:', error);
      if (error instanceof Error && error.message.includes("Meeting already started")) {
        dispatch(actions.beginMeetingFailure("Meeting has already started. Please end the current meeting before starting a new one."));
      } else {
        dispatch(actions.beginMeetingFailure(error instanceof Error ? error.message : 'An unknown error occurred'));
      }
    }
  };

  // Add stub implementations for all other required functions
  const generateMeetingCode = async () => {
    // Implement this function
  };

  const fetchGroupDetails = async (groupId: number) => {
    // Implement this function
  };

  const fetchMeetingAttendees = async (meetingId: number) => {
    // Implement this function
  };

  const updateMember = (memberId: number, updates: Partial<Member>) => {
    dispatch(actions.updateMember(memberId, updates));
  };

  const endMeeting = async () => {
    // Implement this function
  };

  const setCurrentStep = (step: string) => {
    dispatch(actions.setCurrentStep(step));
  };

  const setMeetingData = (data: MeetingData) => {
    dispatch(actions.setMeetingData(data));
  };

  const setGroupDetails = (data: GroupDetails) => {
    dispatch(actions.setGroupDetails(data));
  };

  const updateAttendance = (memberId: number, status: Member['attendanceStatus']) => {
    dispatch(actions.updateAttendance(memberId, status));
  };

  const setMembers = (members: Member[]) => {
    dispatch(actions.setMembers(members));
  };

  const resetMeetingData = () => {
    dispatch({type: 'RESET_MEETING_DATA'});
  };

  const submitSociameetingData = async () => {
    // Implement this function
  };

  const updateStepData = (step: string, data: unknown) => {
    dispatch(actions.updateStepData(step, data));
  };

  const contextValue: AppContextType = {
    state,
    generateMeetingCode,
    beginMeeting,
    fetchGroupDetails,
    fetchMeetingAttendees,
    updateMember,
    endMeeting,
    setCurrentStep,
    setMeetingData,
    setGroupDetails,
    updateAttendance,
    setMembers,
    resetMeetingData,
    submitSociameetingData,
    updateStepData
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};