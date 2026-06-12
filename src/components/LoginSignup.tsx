/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Lock, ShieldAlert, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

interface LoginSignupProps {
  onLoginSuccess: (email: string) => void;
  userEmail?: string;
}

export default function LoginSignup({ onLoginSuccess, userEmail = 'tushtigupta2006@gmail.com' }: LoginSignupProps) {
  const [email, setEmail] = useState(userEmail);
  const [password, setPassword] = useState('••••••••••••');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [loginStep, setLoginStep] = useState(1);
  const [signupStep, setSignupStep] = useState(1);
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [signupData, setSignupData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dob: '',

    password: '',
    confirmPassword: '',

    pan: '',
    aadhaar: '',
    address: '',

    bankName: '',
    accountNumber: '',
    insuranceProvider: '',

    nomineeName: '',
    nomineePhone: '',
    nomineeRelation: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLoginEmailVerification = () => {
    setLoginStep(2);
  };

  const handleOTPVerification = () => {
    setLoginStep(3);
  };

  const handlePasswordVerification = () => {

    const savedUser = JSON.parse(
      localStorage.getItem("finguardianUser") || "{}"
    );

    if (
      email === savedUser.email &&
      password === savedUser.password
    ) {

      onLoginSuccess(email);

    } else {

      setError("Invalid Email or Password");

    }
  };

  const handleSignupNext = () => {
    setSignupStep(signupStep + 1);
  };

  const handleCreateAccount = () => {

    if (
      signupData.password !== signupData.confirmPassword
    ) {
      setError("Passwords do not match");
      return;
    }

    localStorage.setItem(
      "finguardianUser",
      JSON.stringify(signupData)
    );

    setEmail(signupData.email);
    setPassword(signupData.password);

    alert("FinGuardian Vault Created Successfully");

    onLoginSuccess(signupData.email);
  };

  return (
    <div
      id="auth-container"
      className="min-h-screen flex items-center justify-center px-6 py-12 relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `
      linear-gradient(
        rgba(0,0,0,0.25)
      ),
      url('/fin.png')
    `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >

      {/* Absolute design accents */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-brand-accent/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-brand-medium/10 rounded-full blur-3xl -z-10" />

      <div className="w-full max-w-md">
        {/* Logo Card */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3.5 bg-brand-accent/10 rounded-2xl mb-3 border border-brand-accent/20">
            <ShieldCheck className="w-8 h-8 text-brand-accent" />
          </div>
          <h2 className="font-display font-extrabold text-3xl text-white tracking-tight">FinGuardian Secure Login</h2>
          <p className="text-slate-400 text-sm mt-1.5">Asset Legacy Dual-Factor Authorization</p>
        </div>

        <div className="flex mb-6 bg-white/5 rounded-xl p-1">
          <button
            onClick={() => setAuthMode('login')}
            className={`flex-1 py-3 rounded-xl font-semibold ${authMode === 'login'
              ? 'bg-brand-accent text-black'
              : 'text-white'
              }`}
          >
            Login
          </button>

          <button
            onClick={() => setAuthMode('signup')}
            className={`flex-1 py-3 rounded-xl font-semibold ${authMode === 'signup'
              ? 'bg-brand-accent text-black'
              : 'text-white'
              }`}
          >
            Sign Up
          </button>
        </div>

        {/* Auth Panel */}
        <motion.div
          key={`${authMode}-${loginStep}-${signupStep}`}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="glass-panel p-8 rounded-3xl relative overflow-hidden border-white/[0.05]"
        >
          {error && (
            <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {authMode === 'login' && loginStep === 1 && (
            <div className="space-y-6">

              <h3 className="text-white text-xl font-bold">
                Identity Verification
              </h3>

              <p className="text-slate-400 text-sm">
                We detected a login request for this account.
              </p>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full glass-input py-3 px-4 rounded-xl"
              />

              <button
                onClick={handleLoginEmailVerification}
                className="w-full bg-brand-accent text-black py-3 rounded-xl font-bold"
              >
                Yes, It's Me
              </button>

            </div>
          )}


          {authMode === 'login' && loginStep === 2 && (
            <div className="space-y-6">

              <h3 className="text-white text-xl font-bold">
                Mobile OTP Verification
              </h3>

              <p className="text-slate-400">
                OTP sent to +91 XXXXXXXX89
              </p>

              <div className="flex gap-2 justify-center">
                {otpCode.map((digit, index) => (
                  <input
                    key={index}
                    maxLength={1}
                    value={digit}
                    onChange={(e) => {
                      const temp = [...otpCode];
                      temp[index] = e.target.value;
                      setOtpCode(temp);
                    }}
                    className="w-12 h-12 rounded-xl bg-white/5 text-white text-center"
                  />
                ))}
              </div>

              <button
                onClick={handleOTPVerification}
                className="w-full bg-brand-accent text-black py-3 rounded-xl font-bold"
              >
                Verify OTP
              </button>

            </div>
          )}


          {authMode === 'login' && loginStep === 3 && (
            <div className="space-y-6">

              <h3 className="text-white text-xl font-bold">
                Master Password
              </h3>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full glass-input py-3 px-4 rounded-xl"
              />

              <button
                onClick={handlePasswordVerification}
                className="w-full bg-brand-accent text-black py-3 rounded-xl font-bold"
              >
                Login Securely
              </button>

            </div>
          )}

          {authMode === 'signup' && signupStep === 4 && (
            <div className="space-y-5">

              <h3 className="text-white text-xl font-bold">
                Review & Create Vault
              </h3>

              <div className="glass-panel p-4 rounded-xl space-y-2 text-sm">

                <p className="text-white">
                  <strong>Name:</strong> {signupData.fullName}
                </p>

                <p className="text-white">
                  <strong>Email:</strong> {signupData.email}
                </p>

                <p className="text-white">
                  <strong>Phone:</strong> {signupData.phone}
                </p>

                <p className="text-white">
                  <strong>Bank:</strong> {signupData.bankName}
                </p>

                <p className="text-white">
                  <strong>Nominee:</strong> {signupData.nomineeName}
                </p>

              </div>

              <button
                onClick={handleCreateAccount}
                className="w-full bg-brand-accent text-black py-3 rounded-xl font-bold"
              >
                Create FinGuardian Vault
              </button>

            </div>
          )}


          {authMode === 'signup' && signupStep === 1 && (
            <div className="space-y-5">

              <h3 className="text-white text-xl font-bold">
                Create Your FinGuardian Account
              </h3>

              <input
                type="text"
                placeholder="Full Name"
                value={signupData.fullName}
                onChange={(e) =>
                  setSignupData({ ...signupData, fullName: e.target.value })
                }
                className="w-full glass-input py-3 px-4 rounded-xl"
              />

              <input
                type="email"
                placeholder="Email Address"
                value={signupData.email}
                onChange={(e) =>
                  setSignupData({ ...signupData, email: e.target.value })
                }
                className="w-full glass-input py-3 px-4 rounded-xl"
              />

              <input
                type="text"
                placeholder="Mobile Number"
                value={signupData.phone}
                onChange={(e) =>
                  setSignupData({ ...signupData, phone: e.target.value })
                }
                className="w-full glass-input py-3 px-4 rounded-xl"
              />

              <input
                type="password"
                placeholder="Password"
                value={signupData.password}
                onChange={(e) =>
                  setSignupData({ ...signupData, password: e.target.value })
                }
                className="w-full glass-input py-3 px-4 rounded-xl"
              />

              <input
                type="password"
                placeholder="Confirm Password"
                value={signupData.confirmPassword}
                onChange={(e) =>
                  setSignupData({ ...signupData, confirmPassword: e.target.value })
                }
                className="w-full glass-input py-3 px-4 rounded-xl"
              />

              <button
                onClick={handleSignupNext}
                className="w-full bg-brand-accent text-black py-3 rounded-xl font-bold"
              >
                Continue
              </button>

            </div>
          )}

          {authMode === 'signup' && signupStep === 2 && (
            <div className="space-y-5">

              <h3 className="text-white text-xl font-bold">
                Financial Profile Setup
              </h3>

              <input
                type="date"
                value={signupData.dob}
                onChange={(e) =>
                  setSignupData({
                    ...signupData,
                    dob: e.target.value
                  })
                }
                className="w-full glass-input py-3 px-4 rounded-xl"
              />

              <input
                placeholder="Insurance Provider"
                value={signupData.insuranceProvider}
                onChange={(e) =>
                  setSignupData({
                    ...signupData,
                    insuranceProvider: e.target.value
                  })
                }
                className="w-full glass-input py-3 px-4 rounded-xl"
              />

              <input
                placeholder="PAN Number"
                value={signupData.pan}
                onChange={(e) =>
                  setSignupData({ ...signupData, pan: e.target.value })
                }
                className="w-full glass-input py-3 px-4 rounded-xl"
              />

              <input
                placeholder="Aadhaar Number"
                value={signupData.aadhaar}
                onChange={(e) =>
                  setSignupData({ ...signupData, aadhaar: e.target.value })
                }
                className="w-full glass-input py-3 px-4 rounded-xl"
              />

              <input
                placeholder="Primary Bank Name"
                value={signupData.bankName}
                onChange={(e) =>
                  setSignupData({ ...signupData, bankName: e.target.value })
                }
                className="w-full glass-input py-3 px-4 rounded-xl"
              />

              <input
                placeholder="Primary Account Number"
                value={signupData.accountNumber}
                onChange={(e) =>
                  setSignupData({ ...signupData, accountNumber: e.target.value })
                }
                className="w-full glass-input py-3 px-4 rounded-xl"
              />

              <button
                onClick={handleSignupNext}
                className="w-full bg-brand-accent text-black py-3 rounded-xl font-bold"
              >
                Continue
              </button>

            </div>
          )}

          {authMode === 'signup' && signupStep === 3 && (
            <div className="space-y-5">

              <h3 className="text-white text-xl font-bold">
                Nominee Information
              </h3>

              <input
                placeholder="Nominee Full Name"
                value={signupData.nomineeName}
                onChange={(e) =>
                  setSignupData({ ...signupData, nomineeName: e.target.value })
                }
                className="w-full glass-input py-3 px-4 rounded-xl"
              />

              <input
                placeholder="Nominee Mobile Number"
                value={signupData.nomineePhone}
                onChange={(e) =>
                  setSignupData({ ...signupData, nomineePhone: e.target.value })
                }
                className="w-full glass-input py-3 px-4 rounded-xl"
              />

              <div className="glass-panel p-4 rounded-xl">

                <h4 className="text-white font-semibold mb-2">
                  Emergency Access Protocol
                </h4>

                <p className="text-slate-400 text-sm">
                  Nominee receives access only after
                  inactivity verification and 30-day
                  security cooldown.
                </p>

              </div>

              <button
                onClick={handleSignupNext}
                className="w-full bg-brand-accent text-black py-3 rounded-xl font-bold"
              >
                Continue
              </button>

            </div>
          )}


        </motion.div>
      </div>
    </div>
  );
}
