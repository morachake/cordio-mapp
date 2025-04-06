import type { AppState } from "@/types/app"

const APP_STORAGE_KEY = "meeting_management_app"

export const loadState = (): Partial<AppState> => {
  try {
    const serializedState = localStorage.getItem(APP_STORAGE_KEY)
    if (serializedState === null) {
      return {}
    }
    return JSON.parse(serializedState)
  } catch (err) {
    console.error("Error loading state from localStorage:", err)
    return {}
  }
}

export const saveState = (state: Partial<AppState>) => {
  try {
    const serializedState = JSON.stringify(state)
    localStorage.setItem(APP_STORAGE_KEY, serializedState)
  } catch (err) {
    console.error("Error saving state to localStorage:", err)
  }
}

export const updateState = (key: keyof AppState, value: any) => {
  const currentState = loadState()
  const newState = { ...currentState, [key]: value }
  saveState(newState)
}

export const clearState = () => {
  try {
    localStorage.removeItem(APP_STORAGE_KEY)
  } catch (error) {
    console.error("Error clearing state from local storage", error)
  }
}

export const loadFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.warn(`Error parsing ${key} from localStorage:`, error)
    return defaultValue
  }
}

export const saveToLocalStorage = (key: string, value: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.warn(`Error saving ${key} to localStorage:`, error)
  }
}

export const clearLocalStorage = (keys: string[]) => {
  keys.forEach((key) => {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.warn(`Error removing ${key} from localStorage:`, error)
    }
  })
}

export const clearMeetingRelatedData = () => {
  const keysToRemove = [
    "loanRequests",
    "guarantors",
    "attendanceData",
    "finesData",
    "meetingData",
    "meetingAttendees",
    "meetingCodes",
    "loansData",
    "members",
    "savingsData",
    "currentStep",
    "stepData",
    "completedSteps",
    "socialFundData",
    "meetingCode",
  ];

  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
  });
}

