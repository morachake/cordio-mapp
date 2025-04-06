import type { MeetingData, GroupDetails, Member, LoanRequestPayload, Loan } from "../types/app"

// Action types
export const SET_LOADING = "SET_LOADING"
export const SET_ERROR = "SET_ERROR"
export const SET_MEETING_DATA = "SET_MEETING_DATA"
export const SET_GROUP_DETAILS = "SET_GROUP_DETAILS"
export const SET_CURRENT_STEP = "SET_CURRENT_STEP"
export const UPDATE_MEMBER = "UPDATE_MEMBER"
export const RESET_APP_STATE = "RESET_APP_STATE"
export const SET_MEMBERS = "SET_MEMBERS"
export const UPDATE_ATTENDANCE = "UPDATE_ATTENDANCE"
export const GENERATE_MEETING_CODE_REQUEST = "GENERATE_MEETING_CODE_REQUEST"
export const GENERATE_MEETING_CODE_SUCCESS = "GENERATE_MEETING_CODE_SUCCESS"
export const GENERATE_MEETING_CODE_FAILURE = "GENERATE_MEETING_CODE_FAILURE"
export const BEGIN_MEETING_REQUEST = "BEGIN_MEETING_REQUEST"
export const BEGIN_MEETING_SUCCESS = "BEGIN_MEETING_SUCCESS"
export const BEGIN_MEETING_FAILURE = "BEGIN_MEETING_FAILURE"
export const RESET_MEETING_DATA = "RESET_MEETING_DATA"
export const FETCH_MEMBERS_REQUEST = "FETCH_MEMBERS_REQUEST"
export const FETCH_MEMBERS_SUCCESS = "FETCH_MEMBERS_SUCCESS"
export const FETCH_MEMBERS_FAILURE = "FETCH_MEMBERS_FAILURE"
export const UPDATE_STEP_DATA = "UPDATE_STEP_DATA"
export const LOAN_REQUEST_START = "LOAN_REQUEST_START"
export const LOAN_REQUEST_SUCCESS = "LOAN_REQUEST_SUCCESS"
export const LOAN_REQUEST_FAILURE = "LOAN_REQUEST_FAILURE"
export const MAKE_TRANSACTION_REQUEST = "MAKE_TRANSACTION_REQUEST"
export const MAKE_TRANSACTION_SUCCESS = "MAKE_TRANSACTION_SUCCESS"
export const MAKE_TRANSACTION_FAILURE = "MAKE_TRANSACTION_FAILURE"
export const FETCH_LOANS_REQUEST = "FETCH_LOANS_REQUEST"
export const FETCH_LOANS_SUCCESS = "FETCH_LOANS_SUCCESS"
export const FETCH_LOANS_FAILURE = "FETCH_LOANS_FAILURE"
export const SET_LOANS = "SET_LOANS"

// Action creators
export const setLoading = (isLoading: boolean) =>
  ({
    type: SET_LOADING,
    payload: isLoading,
  }) as const

export const setError = (error: string | null) =>
  ({
    type: SET_ERROR,
    payload: error,
  }) as const

export const setMeetingData = (data: MeetingData) =>
  ({
    type: SET_MEETING_DATA,
    payload: data,
  }) as const

export const setGroupDetails = (data: GroupDetails) =>
  ({
    type: SET_GROUP_DETAILS,
    payload: data,
  }) as const

export const setCurrentStep = (step: string) =>
  ({
    type: SET_CURRENT_STEP,
    payload: step,
  }) as const

export const updateMember = (id: number, updates: Partial<Member>) =>
  ({
    type: UPDATE_MEMBER,
    payload: { id, updates },
  }) as const

export const resetAppState = () =>
  ({
    type: RESET_APP_STATE,
  }) as const

export const setMembers = (members: Member[]) =>
  ({
    type: SET_MEMBERS,
    payload: members,
  }) as const

export const updateAttendance = (memberId: number, status: Member["attendanceStatus"]) =>
  ({
    type: UPDATE_ATTENDANCE,
    payload: { memberId, status },
  }) as const

export const generateMeetingCodeRequest = () =>
  ({
    type: GENERATE_MEETING_CODE_REQUEST,
  }) as const

export const generateMeetingCodeSuccess = (data: MeetingData) =>
  ({
    type: GENERATE_MEETING_CODE_SUCCESS,
    payload: data,
  }) as const

export const generateMeetingCodeFailure = (error: string) =>
  ({
    type: GENERATE_MEETING_CODE_FAILURE,
    payload: error,
  }) as const

export const beginMeetingRequest = () =>
  ({
    type: BEGIN_MEETING_REQUEST,
  }) as const

export const beginMeetingSuccess = () =>
  ({
    type: BEGIN_MEETING_SUCCESS,
  }) as const

export const beginMeetingFailure = (error: string) =>
  ({
    type: BEGIN_MEETING_FAILURE,
    payload: error,
  }) as const

export const resetMeetingData = () =>
  ({
    type: RESET_MEETING_DATA,
  }) as const

export const updateStepData = (step: string, data: any) =>
  ({
    type: UPDATE_STEP_DATA,
    payload: { step, data },
  }) as const

export const loanRequestStart = () =>
  ({
    type: LOAN_REQUEST_START,
  }) as const

export const loanRequestSuccess = (data: any) =>
  ({
    type: LOAN_REQUEST_SUCCESS,
    payload: data,
  }) as const

export const loanRequestFailure = (error: string) =>
  ({
    type: LOAN_REQUEST_FAILURE,
    payload: error,
  }) as const

export const setLoanRequests = (loanRequests: LoanRequestPayload) =>
  ({
    type: "SET_LOAN_REQUESTS",
    payload: loanRequests,
  }) as const

export const makeTransactionRequest = () =>
  ({
    type: MAKE_TRANSACTION_REQUEST,
  }) as const

export const makeTransactionSuccess = (data: any) =>
  ({
    type: MAKE_TRANSACTION_SUCCESS,
    payload: data,
  }) as const

export const makeTransactionFailure = (error: string) =>
  ({
    type: MAKE_TRANSACTION_FAILURE,
    payload: error,
  }) as const

export const fetchLoansRequest = () =>
  ({
    type: FETCH_LOANS_REQUEST,
  }) as const

export const fetchLoansSuccess = (loans: Loan[]) =>
  ({
    type: FETCH_LOANS_SUCCESS,
    payload: loans,
  }) as const

export const fetchLoansFailure = (error: string) =>
  ({
    type: FETCH_LOANS_FAILURE,
    payload: error,
  }) as const

export const setLoans = (loans: Loan[]) =>
  ({
    type: SET_LOANS,
    payload: loans,
  }) as const

// Action types definition
export type AppAction =
  | { type: typeof SET_LOADING; payload: boolean }
  | { type: typeof SET_ERROR; payload: string | null }
  | { type: typeof SET_MEETING_DATA; payload: MeetingData }
  | { type: typeof SET_GROUP_DETAILS; payload: GroupDetails }
  | { type: typeof SET_CURRENT_STEP; payload: string }
  | { type: typeof UPDATE_MEMBER; payload: { id: number; updates: Partial<Member> } }
  | { type: typeof SET_MEMBERS; payload: Member[] }
  | { type: typeof UPDATE_ATTENDANCE; payload: { memberId: number; status: Member["attendanceStatus"] } }
  | { type: typeof GENERATE_MEETING_CODE_REQUEST }
  | { type: typeof GENERATE_MEETING_CODE_SUCCESS; payload: MeetingData }
  | { type: typeof GENERATE_MEETING_CODE_FAILURE; payload: string }
  | { type: typeof BEGIN_MEETING_REQUEST }
  | { type: typeof BEGIN_MEETING_SUCCESS }
  | { type: typeof BEGIN_MEETING_FAILURE; payload: string }
  | { type: typeof RESET_APP_STATE }
  | { type: typeof RESET_MEETING_DATA }
  | { type: "UPDATE_STEP_DATA"; payload: { step: string; data: any } }
  | ReturnType<typeof loanRequestStart>
  | ReturnType<typeof loanRequestSuccess>
  | ReturnType<typeof loanRequestFailure>
  | ReturnType<typeof setLoanRequests>
  | ReturnType<typeof makeTransactionRequest>
  | ReturnType<typeof makeTransactionSuccess>
  | ReturnType<typeof makeTransactionFailure>
  | ReturnType<typeof fetchLoansRequest>
  | ReturnType<typeof fetchLoansSuccess>
  | ReturnType<typeof fetchLoansFailure>
  | ReturnType<typeof setLoans>
export type AppDispatch = React.Dispatch<AppAction>
