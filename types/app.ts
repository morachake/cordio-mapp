

export interface Member {
  id: number
  firstName: string
  middleName: string
  lastName: string
  savings: number
  shares: number
  baseFund: number
  baseFundRedeemed: number | null
  totalUnpaidLoan: number
  socialFundLoanIssued: number
  socialFundLoanPaid: number
  socialFundLoanUnpaid: number
  totalPersonalSavings: number
  balanceToMatch: number
  totalLoanPayment: number
  has_guaranteed: boolean
  totalFine: number
  totalShares: number
  socialFund: number
  attendanceStatus: "PRESENT" | "ABSENT" | "APOLOGY" | "LATE"
  moneyOut: number
  accKey: string
  visibility: "ACTIVE" | "INACTIVE"
  primaryLivelihood: string
  location: string
  nextOfKin: string
  totalPersonalLoan: number
  totalPersonalLoanPaid: number
  transactions: []
  groupName: string
  totalWithdrawals: number
  totalLoans: number
  LoanAmount?: number
  payments?: number
}

export interface GroupDetails {
  id: number
  members: []
  groupName: string
  totalAccBalance: number
  cummulativeBalance: number
  accounts: Member[]
  fineAmount: number
  socialFundAmount: number
  currentMeetingNum: number
  accountBalance: number
}

export interface MeetingData {
  meetingId: string
  groupId: number
  meetingNum: number
  groupName: string
  totalAccBalance: number
  totalSocialFund: number
  meetingDate: number
  startTime: number
  venue: string
  status: string
  code: string[]
  minAmountPerShare: number
  maxAmountPerShare: number
  currentMeetingNum: number
  fineAmount: number
  socialFundAmount: number
  cummulativeBalance: number
}

export interface StepData {
  [key: string]: any
}

export interface StepComponentProps {
  onNext: () => void
  onPrevious: () => void
  updateMeetingData: (stepData: Partial<MeetingState>) => void
  groupId: number
}
export interface AppState {
  isLoading: boolean
  error: string | null
  meetingData: MeetingData | null
  groupDetails: GroupDetails | null
  currentStep: string
  stepData: StepData
  members: Member[] | null
  loanRequests: LoanRequest[]
  transactionStatus: string | null
  loans: Loan[]
}

export interface GenerateMeetingCodeResponse {
  meetingId: string
  meetingCodes: string[]
}

export interface Payment {
  amount: number
  method: "cash" | "mpesa"
  transactionId?: string
  status: "pending" | "completed"
}

export interface ProgressBarStep {
  name: string
  icon: string
  status: "current" | "complete" | "upcoming"
}

export interface MeetingAttendance {
  memberId: number
  name: string
  status: "PRESENT" | "ABSENT" | "APOLOGY" | "LATE"
}

export interface SocialFundPayment {
  memberId: number
  name: string
  existingSocialFund: number
  neContributions: number
  paymentMode: string
  phoneNumber?: string
}

export interface SavingsContribution {
  memberId: number
  name: string
  contribution: number
  phoneNumber?: number
  paymentMode: string
}

export interface FinePayment {
  memberId: number
  name: string
  previousFine: number
  newFine: number
  totalFine: number
  paymentMode: string
}

export interface LoanPayment {
  id: number
  loanId: number
  amountToPay: number
  memberName: string
  paymentMode: string
  meetingId: string
  groupId: number
  memberId: number
  status: string
  reason: string
  meetingNum: number
  createdAt: number[]
}

export interface Loan {
  id: number
  amount: number
  amountPaid: number
  unpaidAmount: number
  interestGained: number
  paymentMode: string
  interest: number
  reason: string
  status: string
  guarantors: any[]
  type: string | null
  memberId: number
  meetingId: string
  groupId: number
  meetingNum: number
  clearDate: number[]
  loanPayments: LoanPayment[]
  createdAt: number[]
  updatedAt: number[]
}

export interface StepData {
  attendance?: {
    attendance: MeetingAttendance[]
  }
  socialfund?: {
    socialFundPays: SocialFundPayment[]
  }
  savings?: {
    contributions: SavingsContribution[]
  }
  fines?: {
    payments: FinePayment[]
  }
  loans?: {
    payments: LoanPayment[]
  }
  LoanRequests?: LoanRequest[]
}

export interface LoanRequest {
  memberId: number
  amount: number
  paymentMode: "cash" | "mpesa"
  reason: string
  interest: number
  guarantors: Guarantor[]
}

export interface Guarantor {
  guarantorId: number
  amount: number
}

export interface LoanRequestPayload {
  meetingId: string
  groupId: number
  loanReqs: LoanRequest[]
}

export interface MpesaPayment {
  accountId: Member
  contributionType: "fine" | "socialFund" | "savings" | "loan"
  amount: number
  groupId: number
  groupName: string
  phone: number
}

