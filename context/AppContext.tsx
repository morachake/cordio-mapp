import type React from "react"
import { createContext, useContext, useReducer, useEffect, type ReactNode, useState, useCallback } from "react"
import {
  type AppState,
  type GroupDetails,
  type Member,
  type MeetingData,
  StepData,
  type LoanRequestPayload,
  type MpesaPayment,
  type Loan,
} from "../types/app"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initialState, appReducer } from "../reducer/appReducer"
import * as actions from "../reducer/appActions"
import { useAuth } from "./AuthContext"

const BASE_URL = 'http://localhost:8081/api/v1';

// Updated utility functions for AsyncStorage
const loadState = async () => {
  try {
    const serializedState = await AsyncStorage.getItem('appState');
    if (serializedState === null) {
      return {};
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Failed to load state', err);
    return {};
  }
};

const saveState = async (state: any) => {
  try {
    const serializedState = JSON.stringify(state);
    await AsyncStorage.setItem('appState', serializedState);
  } catch (err) {
    console.error('Failed to save state', err);
  }
};

const updateState = async (key: string, value: any) => {
  try {
    const currentState = await loadState();
    const updatedState = { ...currentState, [key]: value };
    await saveState(updatedState);
  } catch (err) {
    console.error(`Failed to update state for key: ${key}`, err);
  }
};

const clearState = async () => {
  try {
    await AsyncStorage.removeItem('appState');
  } catch (err) {
    console.error('Failed to clear state', err);
  }
};

interface AppContextType {
  state: AppState
  generateMeetingCode: () => Promise<void>
  beginMeeting: (payload: MeetingData) => Promise<void>
  fetchGroupDetails: (groupId: number) => Promise<void>
  fetchMeetingAttendees: (meetingId: number) => Promise<void>
  updateMember: (memberId: number, updates: Partial<Member>) => void
  endMeeting: (finalData: any) => Promise<void>
  setCurrentStep: (step: string) => void
  setMeetingData: (data: MeetingData) => void
  setGroupDetails: (data: GroupDetails) => void
  updateAttendance: (memberId: number, status: Member["attendanceStatus"]) => void
  setMembers: (members: Member[]) => void
  resetMeetingData: () => void
  submitSociameetingData: () => Promise<void>
  updateStepData: (step: string, data: unknown) => void
  requestLoans: (LoanRequestPayload: LoanRequestPayload) => Promise<void>
  makeTransaction: (payload: MpesaPayment) => Promise<void>
  membersFetched: boolean
  setMembersFetched: React.Dispatch<React.SetStateAction<boolean>>
  fetchAllLoans: () => Promise<void>
  setLoans: (loans: Loan[]) => void
  clearLoanData: () => void
  closeMeeting: () => Promise<void>
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)
  const { getToken } = useAuth()
  const [membersFetched, setMembersFetched] = useState(false)

  useEffect(() => {
    const initializeState = async () => {
      try {
        const storedState = await loadState()
        if (storedState.meetingData) {
          dispatch(actions.setMeetingData(storedState.meetingData))
        }
        if (storedState.groupDetails) {
          dispatch(actions.setGroupDetails(storedState.groupDetails))
        }
        if (storedState.currentStep) {
          dispatch(actions.setCurrentStep(storedState.currentStep))
        }
        if (storedState.stepData) {
          // dispatch(actions.setStepData(storedState.stepData))
        }
      } catch (error) {
        console.error('Failed to initialize state', error)
      }
    }

    initializeState()
  }, [])

  useEffect(() => {
    saveState({
      meetingData: state.meetingData,
      groupDetails: state.groupDetails,
      currentStep: state.currentStep,
      stepData: state.stepData,
    })
  }, [state.meetingData, state.groupDetails, state.currentStep, state.stepData])

  const generateMeetingCode = async () => {
    dispatch(actions.generateMeetingCodeRequest())
   
    try {
      const token = getToken()
      if (!token) {
        throw new Error("No authentication token found")
      }
      const response = await fetch(`${BASE_URL}/meeting/start-codes/neema`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`API call failed: ${response.statusText}. ${JSON.stringify(errorData)}`)
      }
      const data = await response.json()
      dispatch(actions.generateMeetingCodeSuccess(data))
    } catch (error) {
      dispatch(actions.generateMeetingCodeFailure(error instanceof Error ? error.message : "An unknown error occurred"))
    }
  }

  const beginMeeting = async (payload: MeetingData) => {
    dispatch(actions.beginMeetingRequest())
    try {
      const token = getToken()
      if (!token) {
        throw new Error("No authentication token found")
      }
      // Save meeting code to AsyncStorage
      await AsyncStorage.setItem("meetingCode", JSON.stringify(payload.codes))
      const response = await fetch(`${BASE_URL}/meeting/begin`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`API call failed: ${response.statusText}. ${JSON.stringify(errorData)}`)
      }
      const data = await response.json()
      console.log("Begin Meeting Response:", data)
      dispatch(actions.beginMeetingSuccess())
      dispatch(actions.setMeetingData(data))
      dispatch(actions.setGroupDetails(data))
      dispatch(actions.setCurrentStep("attendance"))

      // Log the meetingId and groupId
      console.log("MeetingId:", data.meetingId)
      console.log("GroupId:", data.groupId)
    } catch (error) {
      console.error("Begin Meeting Error:", error)
      if (error instanceof Error && error.message.includes("Meeting already started")) {
        dispatch(
          actions.beginMeetingFailure(
            "Meeting has already started. Please end the current meeting before starting a new one.",
          ),
        )
      } else {
        dispatch(actions.beginMeetingFailure(error instanceof Error ? error.message : "An unknown error occurred"))
      }
    }
  }

  const fetchGroupDetails = async (groupId: number) => {
    dispatch(actions.setLoading(true))
    try {
      const token = getToken()
      if (!token) {
        throw new Error("No authentication token found")
      }
      const response = await fetch(`${BASE_URL}/group/${groupId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`API call failed: ${response.statusText}. ${JSON.stringify(errorData)}`)
      }
      const data = await response.json()
      console.log("group data", data)
      dispatch(actions.setGroupDetails(data.Attendance))
      if (data.accounts) {
        dispatch(actions.setMembers(data.accounts))
      }
    } catch (error) {
      dispatch(actions.setError(error instanceof Error ? error.message : "Failed to fetch group details"))
    } finally {
      dispatch(actions.setLoading(false))
    }
  }

  const fetchMeetingAttendees = useCallback(
    async (meetingId: number) => {
      if (membersFetched) return // If members have been fetched, don't fetch again
      dispatch(actions.setLoading(true))
      try {
        const token = getToken()
        if (!token) {
          throw new Error("No authentication token found")
        }
        
        try {
          const storedMembers = await AsyncStorage.getItem("meetingAttendees")
          if (storedMembers) {
            const parsedMembers = JSON.parse(storedMembers)
            dispatch(actions.setMembers(parsedMembers))
            setMembersFetched(true)
            return
          }
        } catch (err) {
          console.error("Error retrieving stored attendees", err)
        }
        
        const response = await fetch(`${BASE_URL}/meeting/${meetingId}/members`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(`API call failed: ${response.statusText}. ${JSON.stringify(errorData)}`)
        }
        const data = await response.json()
        dispatch(actions.setMembers(data))
        await AsyncStorage.setItem("meetingAttendees", JSON.stringify(data))
        setMembersFetched(true)
      } catch (error) {
        dispatch(actions.setError(error instanceof Error ? error.message : "Failed to fetch meeting attendees"))
      } finally {
        dispatch(actions.setLoading(false))
      }
    },
    [getToken, dispatch, membersFetched],
  )

  const updateMember = (memberId: number, updates: Partial<Member>) => {
    dispatch(actions.updateMember(memberId, updates))
  }

  const submitSociameetingData = async () => {
    dispatch(actions.setLoading(true))
    try {
      const token = getToken()
      if (!token) {
        throw new Error("No authentication token found")
      }
      const response = await fetch(`${BASE_URL}/socialfund/pay`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ members: state.groupDetails?.accounts }),
      })
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`API call failed: ${response.statusText}. ${JSON.stringify(errorData)}`)
      }
      await response.json()
      dispatch(actions.setCurrentStep("savings"))
    } catch (error) {
      dispatch(actions.setError(error instanceof Error ? error.message : "Failed to submit social fund"))
    } finally {
      dispatch(actions.setLoading(false))
    }
  }

  const endMeeting = async (finalData: any) => {
    dispatch(actions.setLoading(true))
    try {
      const token = getToken()
      if (!token) {
        throw new Error("No authentication token found")
      }
      if (!state.meetingData?.meetingId) {
        throw new Error("Meeting ID is missing")
      }

      // Ensure we're using the correct meetingId and groupId from the state
      const payload = {
        ...finalData,
        meetingId: state.meetingData.meetingId,
        groupId: state.meetingData.groupId,
      }

      console.log("Submitting meeting data:", payload)

      const response = await fetch(`${BASE_URL}/meeting/${state.meetingData.meetingId}/transactions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`API call failed: ${response.statusText}. ${JSON.stringify(errorData)}`)
      }
      const responseData = await response.json()
      console.log("End Meeting Response:", responseData)
      return responseData
    } catch (error) {
      dispatch(actions.setError(error instanceof Error ? error.message : "Failed to end meeting"))
      throw error // Re-throw the error so it can be caught in the component
    } finally {
      dispatch(actions.setLoading(false))
    }
  }

  const closeMeeting = async () => {
    dispatch(actions.setLoading(true))
    try {
      const token = getToken()
      if (!token) {
        throw new Error("No authentication token found")
      }
      if (!state.meetingData?.meetingId) {
        throw new Error("Meeting ID is missing")
      }

      // Get meeting code from AsyncStorage
      const meetingCode = await AsyncStorage.getItem("meetingCode")
      
      const response = await fetch(`${BASE_URL}meeting/close`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          meetingId: state.meetingData.meetingId, 
          groupId: state.meetingData.groupId, 
          codes: [meetingCode] 
        }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`API call failed: ${response.statusText}. ${JSON.stringify(errorData)}`)
      }
      const responseData = await response.json()
      console.log("Close Meeting Response:", responseData)
      return responseData
    } catch (error) {
      dispatch(actions.setError(error instanceof Error ? error.message : "Failed to close meeting"))
      throw error // Re-throw the error so it can be caught in the component
    } finally {
      dispatch(actions.setLoading(false))
    }
  }

  const requestLoans = async (loanRequestPayload: LoanRequestPayload) => {
    dispatch(actions.setLoading(true))
    try {
      const token = getToken()
      if (!token) {
        throw new Error("No authentication token found")
      }
      if (!state.meetingData?.meetingId || !state.meetingData?.groupId) {
        throw new Error("Meeting ID or Group ID is missing")
      }
      const payload = {
        ...loanRequestPayload,
        meetingId: state.meetingData.meetingId,
        groupId: state.meetingData.groupId,
      }
      const response = await fetch(`${BASE_URL}/loans/request`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`API call failed: ${response.statusText}. ${JSON.stringify(errorData)}`)
      }
      const data = await response.json()
      dispatch(actions.loanRequestSuccess(data))
      console.log("Loan Request Response:", data)
      return data
    } catch (error) {
      dispatch(actions.setError(error instanceof Error ? error.message : "Failed to request loan"))
      throw error
    } finally {
      dispatch(actions.setLoading(false))
    }
  }

  const makeTransaction = async (payload: MpesaPayment) => {
    dispatch(actions.makeTransactionRequest())
    try {
      const token = getToken()
      if (!token) {
        throw new Error("No authentication token found")
      }
      const response = await fetch(`${BASE_URL}/meeting/transact`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`API call failed: ${response.statusText}. ${JSON.stringify(errorData)}`)
      }
      const data = await response.json()
      dispatch(actions.makeTransactionSuccess(data))
      return data
    } catch (error) {
      dispatch(actions.makeTransactionFailure(error instanceof Error ? error.message : "Failed to process transaction"))
      throw error
    }
  }

  const setCurrentStep = (step: string) => {
    dispatch(actions.setCurrentStep(step))
    console.log("Updated current step:", step)
  }

  const setMeetingData = (data: MeetingData) => {
    dispatch(actions.setMeetingData(data))
  }

  const setGroupDetails = (data: GroupDetails) => {
    dispatch(actions.setGroupDetails(data))
  }

  const updateAttendance = (memberId: number, status: Member["attendanceStatus"]) => {
    dispatch(actions.updateAttendance(memberId, status))
  }

  const setMembers = (members: Member[]) => {
    dispatch(actions.setMembers(members))
  }

  const resetMeetingData = async () => {
    dispatch({ type: "RESET_MEETING_DATA" })
    await clearState()
    await clearLoanData()
  }

  const updateStepData = async (step: string, data: any) => {
    // dispatch(actions.updateStepData(step, data))
    await updateState("stepData", { ...state.stepData, [step]: data })
  }

  const fetchAllLoans = async () => {
    dispatch(actions.fetchLoansRequest())
    try {
      try {
        const storedLoans = await AsyncStorage.getItem("allLoans")
        if (storedLoans) {
          const parsedLoans = JSON.parse(storedLoans)
          dispatch(actions.fetchLoansSuccess(parsedLoans))
          return
        }
      } catch (err) {
        console.error("Error retrieving stored loans", err)
      }
      
      const token = getToken()
      if (!token) {
        throw new Error("No authentication token found")
      }
      const response = await fetch(`${BASE_URL}/loans/all`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`API call failed: ${response.statusText}. ${JSON.stringify(errorData)}`)
      }
      const data = await response.json()
      await AsyncStorage.setItem("allLoans", JSON.stringify(data))
      dispatch(actions.fetchLoansSuccess(data))
    } catch (error) {
      dispatch(actions.fetchLoansFailure(error instanceof Error ? error.message : "Failed to fetch loans"))
    }
  }

  const setLoans = (loans: Loan[]) => {
    dispatch(actions.setLoans(loans))
  }

  const clearLoanData = async () => {
    try {
      await AsyncStorage.removeItem("allLoans")
      await AsyncStorage.removeItem("loansData")
      dispatch(actions.setLoans([]))
    } catch (error) {
      console.error("Error clearing loan data", error)
    }
  }

  const contextValue: AppContextType = {
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
    submitSociameetingData,
    requestLoans,
    makeTransaction,
    membersFetched,
    setMembersFetched,
    fetchAllLoans,
    setLoans,
    clearLoanData,
    closeMeeting,
  }

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}