import type { UserStatus } from "@/const"

export type User = {
  id: string
  organization: string
  username: string
  email: string
  phoneNumber: string
  dateJoined: string
  status: UserStatus
  profile: {
    fullName: string
    avatarUrl: string | null
    bvn: string
    gender: string
    maritalStatus: string
    children: string
    typeOfResidence: string
  }
  tier: 1 | 2 | 3
  accountSummary: {
    balance: number
    accountNumber: string
    bankName: string
  }
  educationAndEmployment: {
    levelOfEducation: string
    employmentStatus: string
    sectorOfEmployment: string
    durationOfEmployment: string
    officeEmail: string
    monthlyIncome: [number, number]
    loanRepayment: number
  }
  socials: {
    twitter: string
    facebook: string
    instagram: string
  }
  guarantors: Array<{
    fullName: string
    phoneNumber: string
    email: string
    relationship: string
  }>
}