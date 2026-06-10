/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Asset, Liability, Nominee, Document, EmergencyActionLog } from '../types';

export const INITIAL_NOMINEES: Nominee[] = [
  {
    id: 'n1',
    name: 'Savitri Devi',
    relationship: 'Mother',
    email: 'savitri.devi@family.com',
    accessPermission: true,
  },
  {
    id: 'n2',
    name: 'Rohan Sharma',
    relationship: 'Brother',
    email: 'rohan.sharma99@gmail.com',
    accessPermission: false,
  },
  {
    id: 'n3',
    name: 'Aditi Verma',
    relationship: 'Partner',
    email: 'aditi.verma@ventures.co',
    accessPermission: true,
  },
  {
    id: 'n4',
    name: 'Vikram Sharma',
    relationship: 'Father',
    email: 'vikram.sharma.retired@gov.in',
    accessPermission: false,
  },
];

export const INITIAL_ASSETS: Asset[] = [
  // Liquid Assets
  {
    id: 'a1',
    type: 'liquid',
    category: 'Bank Account',
    name: 'HDFC Savings Account (***4820)',
    value: 1250000,
    nomineeName: 'Savitri Devi',
    lastUpdated: '2026-06-01',
  },
  {
    id: 'a2',
    type: 'liquid',
    category: 'Mutual Funds',
    name: 'Parag Parikh Flexi Cap Fund',
    value: 3200000,
    nomineeName: 'Savitri Devi',
    lastUpdated: '2026-06-08',
  },
  {
    id: 'a3',
    type: 'liquid',
    category: 'Stocks',
    name: 'Zerodha Portfolio (Reliance, TCS)',
    value: 4500000,
    nomineeName: 'Aditi Verma',
    lastUpdated: '2026-06-09',
  },
  {
    id: 'a4',
    type: 'liquid',
    category: 'Fixed Deposits',
    name: 'SBI Tax Saver FD',
    value: 1500000,
    nomineeName: 'Vikram Sharma',
    lastUpdated: '2026-05-15',
  },
  {
    id: 'a5',
    type: 'liquid',
    category: 'Crypto',
    name: 'WazirX Cold Wallet (BTC, ETH)',
    value: 850000,
    nomineeName: 'Rohan Sharma',
    lastUpdated: '2026-06-10',
  },

  // Non-Liquid Assets
  {
    id: 'a6',
    type: 'non-liquid',
    category: 'Property',
    name: '3BHK Apartment - Gurgaon Sec 54',
    value: 12000000,
    nomineeName: 'Rohan Sharma',
    lastUpdated: '2026-01-10',
  },
  {
    id: 'a7',
    type: 'non-liquid',
    category: 'Land',
    name: 'Agricultural Land - Yamuna Expressway',
    value: 6500000,
    nomineeName: 'Savitri Devi',
    lastUpdated: '2026-03-24',
  },
  {
    id: 'a8',
    type: 'non-liquid',
    category: 'Gold',
    name: 'Physical Gold Bullion (Tanishq Vault)',
    value: 2400000,
    nomineeName: 'Savitri Devi',
    lastUpdated: '2026-05-20',
  },
  {
    id: 'a9',
    type: 'non-liquid',
    category: 'Vehicles',
    name: 'BMW 3 Series (DL 3C XX 1234)',
    value: 3500000,
    nomineeName: 'Aditi Verma',
    lastUpdated: '2025-11-12',
  },
  {
    id: 'a10',
    type: 'non-liquid',
    category: 'Businesses',
    name: 'FinTech Startup Equity (20% share)',
    value: 8000000,
    nomineeName: 'Aditi Verma',
    lastUpdated: '2026-04-18',
  },
  {
    id: 'a11',
    type: 'non-liquid',
    category: 'Bank Locker',
    name: 'ICICI Safe Deposit Locker (L-092)',
    value: 1800000,
    nomineeName: 'Savitri Devi',
    lastUpdated: '2026-02-05',
  },
];

export const INITIAL_LIABILITIES: Liability[] = [
  {
    id: 'l1',
    category: 'Home Loan',
    name: 'HDFC Housing Loan',
    outstandingAmount: 4800000,
    emi: 42500,
    interestRate: 8.4,
  },
  {
    id: 'l2',
    category: 'Education Loan',
    name: 'SBI Scholar Loan (Brother Rohan)',
    outstandingAmount: 1200000,
    emi: 15400,
    interestRate: 9.1,
  },
  {
    id: 'l3',
    category: 'Car Loan',
    name: 'BMW Financial Services',
    outstandingAmount: 1800000,
    emi: 32000,
    interestRate: 7.9,
  },
  {
    id: 'l4',
    category: 'Credit Card Debt',
    name: 'AMEX Platinum Outstanding',
    outstandingAmount: 250000,
    emi: 25000,
    interestRate: 36.0,
  },
];

export const INITIAL_DOCUMENTS: Document[] = [
  {
    id: 'd1',
    name: 'LIC_TermInsurance_Policy_2026.pdf',
    category: 'Insurance Policies',
    uploadDate: '2026-04-12',
    fileSize: '2.4 MB',
    ocrStatus: 'completed',
    summary: 'LIC Tech-Term Policy (No. 8829472). Sum assured ₹1.5 Crore. Term: 30 Years. Premium ₹18,400/yr. Active. Beneficiary: Savitri Devi (Mother).',
  },
  {
    id: 'd2',
    name: 'Gurgaon_Flat502_SaleDeed.pdf',
    category: 'Property Documents',
    uploadDate: '2026-03-20',
    fileSize: '12.8 MB',
    ocrStatus: 'completed',
    summary: 'Gurgaon Sec 54 Flat 502 Sale Deed. Owner: Aditya Sharma. Registered with Haryana Govt. Valuation ₹1.2 Cr.',
  },
  {
    id: 'd3',
    name: 'HDFC_HomeLoan_Agreement.pdf',
    category: 'Loan Documents',
    uploadDate: '2026-04-01',
    fileSize: '4.1 MB',
    ocrStatus: 'completed',
    summary: 'HDFC Housing Loan Contract. Principal ₹55 Lakhs. Sanction Date Nov 2024. Rate: Floating at 8.4%. Tenure: 20 Years.',
  },
  {
    id: 'd4',
    name: 'Form16_FY25_26.pdf',
    category: 'Tax Documents',
    uploadDate: '2026-05-30',
    fileSize: '1.2 MB',
    ocrStatus: 'completed',
    summary: 'Form 16 Tax assessment for Financial Year 2025-26. Income under head salary: ₹32,00,000. Total Tax Paid: ₹6,45,000.',
  },
  {
    id: 'd5',
    name: 'PAN_Aditya_Sharma.pdf',
    category: 'PAN',
    uploadDate: '2026-01-15',
    fileSize: '0.8 MB',
    ocrStatus: 'completed',
    summary: 'Permanent Account Number Card. No. BPXPS8821K. Holder: Aditya Sharma. DOB: 14-08-1995.',
  },
  {
    id: 'd6',
    name: 'Aadhaar_Secure_Masked.pdf',
    category: 'Aadhaar',
    uploadDate: '2026-01-15',
    fileSize: '1.1 MB',
    ocrStatus: 'completed',
    summary: 'Aadhaar Card copy. Masked UID **** **** 8829. Name: Aditya Sharma. Mobile Linked: +91 99******82.',
  },
  {
    id: 'd7',
    name: 'FinGuardian_Digital_Will.pdf',
    category: 'Digital Will',
    uploadDate: '2026-06-09',
    fileSize: '3.6 MB',
    ocrStatus: 'completed',
    summary: 'Comprehensive Digital Will drafted & notarized via FinGuardian. Witnesses: Aditi Verma & Rohan Sharma. Distribution: 50% Savitri Devi, 30% Aditi Verma, 20% Rohan Sharma.',
  },
];

export const INITIAL_ACTION_LOGS: EmergencyActionLog[] = [
  {
    id: 'log1',
    action: 'Document "FinGuardian_Digital_Will.pdf" uploaded and digitally notarized.',
    dateTime: '2026-06-09 18:24:10',
    ipAddress: '103.44.112.98',
    status: 'success',
  },
  {
    id: 'log2',
    action: 'Nominee "Aditi Verma" security clearance granted by principal.',
    dateTime: '2026-06-08 11:15:44',
    ipAddress: '103.44.112.98',
    status: 'info',
  },
  {
    id: 'log3',
    action: 'Dead Man\'s Switch ping check completed successfully.',
    dateTime: '2026-06-07 09:00:00',
    ipAddress: 'System Daemon',
    status: 'success',
  },
  {
    id: 'log4',
    action: 'Security Alert: Login attempt from unauthorized browser blocked.',
    dateTime: '2026-05-24 23:41:02',
    ipAddress: '198.11.22.45 (Frankfurt, DE)',
    status: 'alert',
  },
];
