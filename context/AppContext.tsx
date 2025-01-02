import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState,  GroupDetails, Member, MeetingData } from '../types/app';
import { useAuth } from './AuthContext';
import { initialState, appReducer } from '../reducer/appReducer';
import * as actions from '../reducer/appActions';

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
  updateStepData : (step: string, data: unknown) => void;
}

const AppContext = createContext<AppContextType | null>(null);


export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { getToken } = useAuth();
 
  useEffect(() => {
    const loadState = async () => {
      try {
        const storedStateString = await AsyncStorage.getItem('appState');
        if (storedStateString) {
          const parsedState = JSON.parse(storedStateString);
          if (parsedState) {
            if (parsedState.meetingData) {
              dispatch(actions.setMeetingData(parsedState.meetingData));
            }
            if (parsedState.groupDetails) {
              dispatch(actions.setGroupDetails(parsedState.groupDetails));
            }
            if (parsedState.currentStep) {
              dispatch(actions.setCurrentStep(parsedState.currentStep));
            }
            if (parsedState.stepData) {
              Object.entries(parsedState.stepData).forEach(([step, data]) => {
                dispatch(actions.updateStepData(step, data));
              });
            }
            console.log('Loaded state from storage:', parsedState);
          }
        }
      } catch (error) {
        console.error('Failed to load state from storage:', error);
        await AsyncStorage.removeItem('appState');
      }
    };

    loadState();
  }, []);

  useEffect(() => {
    const saveState = async () => {
      try {
        const stateToStore = {
          meetingData: state.meetingData,
          groupDetails: state.groupDetails,
          currentStep: state.currentStep,
          stepData: state.stepData
        };
        const serializedState = JSON.stringify(stateToStore);
        if (serializedState) {
          await AsyncStorage.setItem('appState', serializedState);
          console.log('State saved successfully');
        }
      } catch (error) {
        console.error('Failed to save state to storage:', error);
      }
    };
    if (state.meetingData || state.groupDetails || state.currentStep || Object.keys(state.stepData || {}).length > 0) {
      saveState();
    }
  }, [state.meetingData, state.groupDetails, state.currentStep, state.stepData]);

  const generateMeetingCode = async () => {
    dispatch(actions.generateMeetingCodeRequest());
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }
      const response = await fetch(`${BASE_URL}/meeting/start-codes/neema`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`API call failed: ${response.statusText}. ${JSON.stringify(errorData)}`);
      }
      const data = await response.json();
      dispatch(actions.generateMeetingCodeSuccess(data));
    } catch (error) {
      dispatch(actions.generateMeetingCodeFailure(error instanceof Error ? error.message : 'An unknown error occurred'));
    }
  };

  const beginMeeting = async (payload:MeetingData ) => {
    dispatch(actions.beginMeetingRequest());
    try {
      const token = getToken();
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
      // await fetchMeetingAttendees(payload.meetingId)
    } catch (error) {
      console.error('Begin Meeting Error:', error);
      if (error instanceof Error && error.message.includes("Meeting already started")) {
        dispatch(actions.beginMeetingFailure("Meeting has already started. Please end the current meeting before starting a new one."));
      } else {
        dispatch(actions.beginMeetingFailure(error instanceof Error ? error.message : 'An unknown error occurred'));
      }
    }
  };

  const fetchGroupDetails = async (groupId: number) => {
    dispatch(actions.setLoading(true));
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }
      const response = await fetch(`${BASE_URL}/group/${groupId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`API call failed: ${response.statusText}. ${JSON.stringify(errorData)}`);
      }
      const data = await response.json();
      console.log("group data", data)
      dispatch(actions.setGroupDetails(data.Attendance));
      if (data.accounts) {
        dispatch(actions.setMembers(data.accounts));
      }
    } catch (error) {
      dispatch(actions.setError(error instanceof Error ? error.message : 'Failed to fetch group details'));
    } finally {
      dispatch(actions.setLoading(false));
    }
  };

  const fetchMeetingAttendees = async (meetingId: number) => {
    dispatch(actions.setLoading(true));
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }
      const response = await fetch(`${BASE_URL}/meeting/${meetingId}/members`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`API call failed: ${response.statusText}. ${JSON.stringify(errorData)}`);
      }
      const data = await response.json();
      console.log("Attendees", data)
      dispatch(actions.setMembers(data));
      if (data.accounts) {
        dispatch(actions.setMembers(data.accounts));
      }
    } catch (error) {
      dispatch(actions.setError(error instanceof Error ? error.message : 'Failed to fetch group details'));
    } finally {
      dispatch(actions.setLoading(false));
    }
  };

  const updateMember = (memberId: number, updates: Partial<Member>) => {
    dispatch(actions.updateMember(memberId, updates));
  };


  const submitSociameetingData = async () => {
    dispatch(actions.setLoading(true));
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }
      const response = await fetch(`${BASE_URL}/socialfund/pay`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ members: state.groupDetails?.accounts }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`API call failed: ${response.statusText}. ${JSON.stringify(errorData)}`);
      }
      await response.json();
      dispatch(actions.setCurrentStep('savings'));
    } catch (error) {
      dispatch(actions.setError(error instanceof Error ? error.message : 'Failed to submit social fund'));
    } finally {
      dispatch(actions.setLoading(false));
    }
  };

 


  const endMeeting = async () => {
    dispatch(actions.setLoading(true));
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }
      const response = await fetch(`${BASE_URL}/members/close`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(state.meetingData),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`API call failed: ${response.statusText}. ${JSON.stringify(errorData)}`);
      }
      await response.json();
      dispatch(actions.resetAppState());
    } catch (error) {
      dispatch(actions.setError(error instanceof Error ? error.message : 'Failed to end meeting'));
    } finally {
      dispatch(actions.setLoading(false));
    }
  };

  const setCurrentStep = (step: string) => {
    dispatch(actions.setCurrentStep(step));
    console.log('Updated current step:', step);
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

  const updateStepData = (step: string, data: any) => {
    dispatch(actions.updateStepData(step, data));
  };

  const contextValue: AppContextType ={
    state,
    generateMeetingCode,
    updateStepData,
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
    submitSociameetingData
  }

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
