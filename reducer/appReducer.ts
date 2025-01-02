import { AppState, AppAction } from '../types/app';

export const initialState: AppState = {
  isLoading: false,
  error: null,
  meetingData: null,
  groupDetails: null,
  currentStep: '',
  members: [],
};

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_MEETING_DATA':
      return { ...state, meetingData: action.payload };
    case 'SET_GROUP_DETAILS':
      return { ...state, groupDetails: action.payload };
    case 'SET_CURRENT_STEP':
      return { ...state, currentStep: action.payload };
    case 'SET_MEMBERS':
      return { ...state, members: action.payload };
    case 'UPDATE_MEMBER':
      return {
        ...state,
        groupDetails: state.groupDetails
          ? {
              ...state.groupDetails,
              accounts: state.groupDetails.accounts.map(member =>
                member.id === action.payload.id
                  ? { ...member, ...action.payload }
                  : member
              ),
            }
          : null,
      };
      case 'UPDATE_ATTENDANCE':
        return {
          ...state,
          members: state.members?.map(member =>
            member.id === action.payload.memberId
              ? { ...member, attendanceStatus: action.payload.status }
              : member
          ),
        };
      
    case 'GENERATE_MEETING_CODE_REQUEST':
    case 'BEGIN_MEETING_REQUEST':
      return { ...state, isLoading: true, error: null };
    case 'GENERATE_MEETING_CODE_SUCCESS':
      return {
        ...state,
        isLoading: false,
        meetingData: action.payload,
      };
    case 'RESET_MEETING_DATA':
      return { ...state, meetingData: null, error: null, currentStep: 'Start' };
    case 'BEGIN_MEETING_SUCCESS':
      return { ...state, isLoading: false };
    case 'GENERATE_MEETING_CODE_FAILURE':
    case 'BEGIN_MEETING_FAILURE':
      return { ...state, isLoading: false, error: action.payload };
    case 'RESET_APP_STATE':
      return initialState;
    default:
      return state;
  }
}
