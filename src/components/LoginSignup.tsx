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
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please input your registered email address.');
      return;
    }
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
    }, 1000);
  };

  const handleOTPChange = (index: number, val: string) => {
    if (isNaN(Number(val))) return;
    const newOtp = [...otpCode];
    newOtp[index] = val.slice(-1);
    setOtpCode(newOtp);

    // Auto focus next input
    if (val && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess(email);
    }, 1200);
  };

  return (
    <div id="auth-container" className="min-h-screen flex items-center justify-center bg-[#060c16] px-6 py-12 relative overflow-hidden">
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

        {/* Auth Panel */}
        <motion.div
          key={otpSent ? 'otp-panel' : 'login-panel'}
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

          {!otpSent ? (
            <form onSubmit={handleSendOTP} className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block font-mono">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    id="auth-email-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full glass-input py-3 pl-11 pr-4 rounded-xl text-sm"
                    placeholder="Enter email e.g. name@corporate.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block font-mono">Secret Key / Password</label>
                  <a href="#" className="text-xs text-brand-accent hover:underline font-semibold">Decryption Key?</a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    id="auth-password-input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full glass-input py-3 pl-11 pr-4 rounded-xl text-sm"
                    placeholder="Input secure ledger password"
                    required
                  />
                </div>
              </div>

              <button
                id="auth-submit-credentials"
                type="submit"
                disabled={loading}
                className="w-full bg-brand-accent hover:bg-emerald-400 text-brand-dark font-bold py-3.5 rounded-xl shadow-lg shadow-brand-accent/15 flex items-center justify-center gap-2 transition-all duration-300 transform active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Securing Session...' : 'Verify Credentials'} <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <span className="text-xs text-slate-500">
                  By signing in, you activate AES-256 end-to-end decryption.
                </span>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div className="text-center mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono block mb-1">MFA Authentication</span>
                <p className="text-slate-300 text-xs">An encrypted OTP has been transmitted to <span className="text-white font-semibold font-mono">{email}</span></p>
              </div>

              <div className="flex justify-center gap-3">
                {otpCode.map((char, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={char}
                    onChange={(e) => handleOTPChange(index, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !char && index > 0) {
                        const prevInput = document.getElementById(`otp-${index - 1}`);
                        prevInput?.focus();
                      }
                    }}
                    className="w-12 h-14 bg-brand-dark flex items-center justify-center text-center text-xl font-bold rounded-xl border border-white/10 text-brand-accent focus:border-brand-accent outline-none"
                    required
                  />
                ))}
              </div>

              <div className="text-center text-xs text-slate-400">
                Resend security token in <span className="font-mono text-brand-accent">59s</span>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer text-sm"
                >
                  <ArrowLeft className="w-4 h-4" /> Clear
                </button>

                <button
                  id="auth-submit-otp"
                  type="submit"
                  disabled={loading}
                  className="flex-2 bg-brand-accent hover:bg-emerald-400 text-brand-dark font-bold py-3.5 rounded-xl shadow-lg shadow-brand-accent/15 flex items-center justify-center gap-1.5 transition-all duration-300 cursor-pointer text-sm"
                >
                  {loading ? 'Decrypting...' : 'Verify & Enter'} <ShieldCheck className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
