/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  name: string;
  email: string;
  isLoggedIn: boolean;
  step: 'auth' | 'otp' | 'completed';
}

export type AssetType = 'liquid' | 'non-liquid';

export interface Asset {
  id: string;
  type: AssetType;
  category: string; // "Bank Account", "Mutual Fund", etc.
  name: string;
  value: number;
  nomineeName: string;
  lastUpdated: string;
}

export interface Liability {
  id: string;
  category: string; // "Home Loan", "Education Loan", etc.
  name: string;
  outstandingAmount: number;
  emi: number;
  interestRate: number;
}

export interface Nominee {
  id: string;
  name: string;
  relationship: string; // "Mother", "Brother", "Partner", "Spouse", etc.
  email: string;
  accessPermission: boolean; // "Permission Controls"
}

export type DocumentCategory =
  | 'Insurance Policies'
  | 'Property Documents'
  | 'Loan Documents'
  | 'Tax Documents'
  | 'PAN'
  | 'Aadhaar'
  | 'Digital Will';

export interface Document {
  id: string;
  name: string;
  category: DocumentCategory;
  uploadDate: string;
  fileSize: string;
  ocrStatus: 'completed' | 'processing' | 'failed';
  summary?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export interface EmergencyActionLog {
  id: string;
  action: string;
  dateTime: string;
  ipAddress: string;
  status: 'alert' | 'info' | 'success';
}

export interface EmergencyStatus {
  stage: 'idle' | 'requested' | 'verification' | 'cooldown' | 'approved';
  cooldownDaysRemaining: number;
  initiatedBy: string;
  initiationDate?: string;
}
