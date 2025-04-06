import { Member, Payment } from "./app";

export interface User {
  username: string;
  email: string;
  fullName: string;
  roles:[];
  token:string;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password:string;
}

export interface RegisterCredentials extends LoginCredentials {
  fullName: string;
}

// export interface Member {
//   id: number;
//   name: string;
//   socialFundAmount: number;
//   shares?: number;
//   fineAmount?: number;
//   attendanceStatus?: 'PRESENT' | 'ABSENT' | 'APOLOGY' | 'LATE';
//   loans?: Loan[];
//   payments?: {
//     socialFund?: Payment;
//     savings?: Payment;
//     fines?: Payment;
//   };
// }


export interface Loan {
  id: number;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
}

export interface MeetingInfo {
  groupName: string;
  meetingNumber: number;
  startTime: string;
  venue: string;
}

export type StepStatus = 'complete' | 'current' | 'upcoming';

export interface Step {
  name: string;
  status: StepStatus;
}

