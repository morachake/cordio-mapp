
export interface Member {
  id: number;
  firstName: string;
  middleName: string;
  lastName: string;
  savings: number;
  shares: number;
  baseFund: number;
  baseFundRedeemed: number | null;
  totalUnpaidLoan: number;
  socialFundLoanIssued: number;
  socialFundLoanPaid: number;
  socialFundLoanUnpaid: number;
  totalPersonalSavings: number;
  balanceToMatch: number;
  totalLoanPayment: number;
  totalFine: number;
  totalShares: number;
  socialFund: number;
  attendanceStatus: 'PRESENT' | 'ABSENT' | 'APOLOGY' | 'LATE' ;
  moneyOut: number;
  accKey: string;
  visibility: 'ACTIVE' | 'INACTIVE';
  primaryLivelihood: string;
  location: string;
  nextOfKin: string;
  totalPersonalLoan: number;
  totalPersonalLoanPaid: number;
  transactions: []; 
  groupName: string;
  totalWithdrawals: number;
  totalLoans: number;
  LoanAmount?: number; 
  payments?: number; 
}

export interface GroupDetails {
  id: number;
  members:[],
  groupName: string;
  totalAccBalance: number;
  cummulativeBalance: number;
  accounts: Member[];
  fineAmount: number;
  socialFundAmount: number;
  currentMeetingNum: number;
  accountBalance: number;
}


export interface MeetingData {
  meetingId: string;
  groupId: number;
  meetingNum: number;
  groupName: string;
  totalAccBalance: number;
  totalSocialFund: number;
  meetingDate: number;
  startTime: number;
  venue: string;
  status: string;
  code: string[],
  codes: number;
}

export  interface StepData {
  [key: string]: any;
}
 
export interface StepComponentProps {
  onNext: () => void;
  onPrevious: () => void;
  updateMeetingData: (stepData: Partial<MeetingState>) => void;
  groupId: number;
}
export interface AppState {
  isLoading: boolean;
  error: string | null;
  meetingData: MeetingData | null;
  groupDetails: GroupDetails | null;
  currentStep: string;
  stepData: StepData;
//   initialState: initialState;
  members: Member[] | null;
}

export interface GenerateMeetingCodeResponse {
  meetingId: string;
  meetingCodes: string[];
}



export interface Payment {
  amount: number;
  method: 'cash' | 'mpesa';
  transactionId?: string;
  status: 'pending' | 'completed';
}

export interface ProgressBarStep {
  name: string;
  icon: string;
  status: 'current' | 'complete' | 'upcoming';
}

export interface MeetingState {
  meetingId: string;
  members: Member[];
  currentStep: string;
}
