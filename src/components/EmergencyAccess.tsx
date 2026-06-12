/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, Key, Clock, Fingerprint, RefreshCw, Smartphone, CircleAlert, FileClock } from 'lucide-react';
import { EmergencyStatus, EmergencyActionLog } from '../types';

interface EmergencyAccessProps {
  logs: EmergencyActionLog[];
  onAddLog: (actionText: string, status: 'alert' | 'info' | 'success') => void;
}

const STEPS = [
  { id: 'request', label: '1. Request Access', desc: 'Beneficiary submits notarized death certificate or casualty certificate.', icon: Key },
  { id: 'verify', label: '2. Identity Verification', desc: 'FinGuardian verifies claimant biometrics, email tokens, and notarization.', icon: Fingerprint },
  { id: 'dms', label: '3. Dead Man\'s Switch', desc: 'System executes multiple ping alerts (email, SMS, call) to the principal.', icon: Smartphone },
  { id: 'cooldown', label: '4. 30 Day Cooldown', desc: 'Grace cooling window to protect principal against fraudulent claims.', icon: Clock },
  { id: 'approve', label: '5. Access Approval', desc: 'AES keys are decrypted and assets shared securely with the nominee.', icon: ShieldCheck },
];

export default function EmergencyAccess({ logs, onAddLog }: EmergencyAccessProps) {
  const [status, setStatus] = useState<EmergencyStatus>({
    stage: 'idle',
    cooldownDaysRemaining: 30,
    initiatedBy: '',
  });

  const handleSimulateClaim = () => {
    setStatus({
      stage: 'verification',
      cooldownDaysRemaining: 30,
      initiatedBy: 'Savitri Devi (Mother)',
      initiationDate: new Date().toISOString().split('T')[0],
    });
    onAddLog('Emergency Access Request initiated by Savitri Devi. Verification in progress.', 'alert');
  };

  const handleTriggerDeadMan = () => {
    setStatus((prev) => ({
      ...prev,
      stage: 'cooldown',
      cooldownDaysRemaining: 29,
    }));
    onAddLog('Dead Man\'s Switch dispatched. No response from principal. 30-day grace timer initiated.', 'alert');
  };

  const handleDismissClaim = () => {
    setStatus({
      stage: 'idle',
      cooldownDaysRemaining: 30,
      initiatedBy: '',
    });
    onAddLog('SECURITY LOCKOUT: Active access claim dismissed by original trustee. Security seals restored.', 'success');
  };

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    claimantName: "",
    relation: "",
    nomineeName: "",
    deathCertificate: null as File | null,
  });

  const [accessDenied, setAccessDenied] = useState("");



  return (

    <div id="emergency-root" className="space-y-8">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-display font-bold text-2xl text-white">Emergency Access Center</h2>
          <p className="text-slate-400 text-sm">Review, test, or intercept fail-safe recovery switchboards and security lockout logs.</p>
        </div>
        {status.stage === 'idle' ? (
          <button
            onClick={() => setShowForm(true)}
            className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs px-4.5 py-3 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
          >
            🏁 Simulate Emergency Claim
          </button>
        ) : (
          <button
            onClick={handleDismissClaim}
            className="bg-[#10B981] hover:bg-emerald-400 text-brand-dark font-bold text-xs px-4.5 py-3 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
          >
            🛡️ Resolve & Lockout Gateway
          </button>
        )}
      </div>


      {/* Security Alerts (Visible when claim is active) */}
      {status.stage !== 'idle' && (
        <div className="p-5 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-start gap-4">
          <ShieldAlert className="w-6 h-6 text-rose-505 animate-pulse shrink-0 mt-0.5" />
          <div className="space-y-2 flex-1">
            <h4 className="text-white text-sm font-bold">CRITICAL ALARM: Active Estate Claim Dispatched</h4>
            <p className="text-slate-350 text-xs">
              Savitri Devi has submitted a credential token claim. Identity is verified. System is attempting to contact you. If you are safe, tap <strong className="text-white">Resolve & Lockout Gateway</strong> immediately to kill the threat.
            </p>
            {status.stage === 'verification' && (
              <button
                onClick={handleTriggerDeadMan}
                className="bg-rose-600/20 hover:bg-rose-600/35 border border-rose-600/40 text-rose-400 text-[10px] font-mono font-bold px-3 py-1.5 rounded-lg transition-all"
              >
                PROCEED TO STEP 3: DMS PINGS
              </button>
            )}
          </div>
        </div>
      )}

      {/* Timeline Visual Progress Layout */}
      <div className="glass-panel p-8 rounded-3xl border-white/[0.04]">
        <h3 className="text-white text-sm font-semibold uppercase font-mono tracking-wide mb-8">
          Estate Recovery Workflow State
        </h3>

        <div className="relative">
          {/* Connecting line */}
          <div className="absolute top-6 left-[22px] right-6 h-0.5 bg-slate-800 -z-10" />

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {STEPS.map((step, idx) => {
              const StepIcon = step.icon;
              let isPassed = false;
              let isActive = false;

              if (status.stage === 'idle') {
                isPassed = false;
              } else if (status.stage === 'verification') {
                if (idx === 0) isPassed = true;
                if (idx === 1) isActive = true;
              } else if (status.stage === 'cooldown' || status.stage === 'approved') {
                if (idx < 3) isPassed = true;
                if (idx === 3 && status.stage === 'cooldown') isActive = true;
                if (idx === 3 && status.stage === 'approved') isPassed = true;
                if (idx === 4 && status.stage === 'approved') isActive = true;
              }

              return (
                <div key={step.id} className="space-y-3">
                  <div className="flex items-center md:flex-col md:text-center gap-3">
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center border transition-all ${isPassed
                      ? 'bg-brand-accent border-brand-accent text-brand-dark shadow-md'
                      : isActive
                        ? 'bg-amber-500/10 border-amber-550 text-amber-550 animate-pulse'
                        : 'bg-slate-900 border-white/10 text-slate-500'
                      }`}>
                      <StepIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className={`text-xs font-bold ${isActive ? 'text-amber-450' : 'text-white'}`}>{step.label}</h4>
                      {isActive && step.id === 'cooldown' && (
                        <span className="text-[10px] font-mono bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded block mt-0.5 animate-pulse">
                          {status.cooldownDaysRemaining} DAYS LEFT
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-slate-400 text-xs hidden md:block max-w-[155px] mx-auto text-center leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Activity logs & alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Operations Logs (Takes 2 Columns) */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border-white/[0.04] space-y-6">
          <h3 className="text-white text-sm font-semibold uppercase font-mono tracking-wide flex items-center gap-1.5 pb-2 border-b border-white/5">
            <FileClock className="w-4 h-4 text-brand-accent" /> Security Access Operations Audit Tree
          </h3>

          <div id="operation-logs-list" className="space-y-4 max-h-96 overflow-y-auto pr-1">
            {logs.map((log) => (
              <div
                key={log.id}
                className="flex justify-between items-start gap-4 p-3.5 bg-[#060c12] rounded-xl border border-white/5 text-xs"
              >
                <div className="space-y-1">
                  <p className="text-slate-200 leading-relaxed font-sans">{log.action}</p>
                  <div className="flex gap-4 text-[10px] text-slate-500 font-mono">
                    <span>{log.dateTime}</span>
                    <span>•</span>
                    <span>IP: {log.ipAddress}</span>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded text-[8px] font-mono shrink-0 ${log.status === 'success'
                  ? 'bg-brand-accent/10 text-brand-accent border border-brand-accent/20'
                  : log.status === 'alert'
                    ? 'bg-rose-500/10 text-rose-455 border border-rose-550/20'
                    : 'bg-blue-500/10 text-blue-400 border border-blue-550/20'
                  }`}>
                  {log.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Info panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-6 rounded-3xl border-white/[0.04]">
            <h4 className="font-display font-bold text-sm text-white mb-4">Fail-Safe Interconnection</h4>
            <p className="text-slate-400 text-xs leading-relaxed mb-4 font-sans">
              Normally, the FinGuardian watchdog sweeps daily logs for activity sign-offs. If no logging occurs across 90 continuous days (customizable), the emergency recovery protocol springs to life.
            </p>
            <p className="text-slate-450 text-xs leading-relaxed font-mono text-brand-accent bg-[#10B981]/5 p-3 rounded-xl border border-[#10B981]/10">
              * Active Nominees mapped with backup keys: Mother, Partner, Father (Spinal Crypt Shield initialized).
            </p>
          </div>
        </div>
      </div>
      {showForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

          <div className="bg-[#0b0f14] p-6 rounded-2xl w-[420px] space-y-4 border border-white/10">

            <h2 className="text-white font-bold text-lg">
              Emergency Access Verification
            </h2>

            <input
              className="w-full p-2 rounded bg-black/40 text-white border border-white/10"
              placeholder="Claimant Name"
              onChange={(e) =>
                setFormData({ ...formData, claimantName: e.target.value })
              }
            />

            <input
              className="w-full p-2 rounded bg-black/40 text-white border border-white/10"
              placeholder="Relation"
              onChange={(e) =>
                setFormData({ ...formData, relation: e.target.value })
              }
            />

            <input
              className="w-full p-2 rounded bg-black/40 text-white border border-white/10"
              placeholder="Nominee Name"
              onChange={(e) =>
                setFormData({ ...formData, nomineeName: e.target.value })
              }
            />

            <input
              type="file"
              className="w-full text-white"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  deathCertificate: e.target.files?.[0] || null,
                })
              }
            />

            {accessDenied && (
              <p className="text-red-400 text-xs">{accessDenied}</p>
            )}

            <div className="flex gap-2">
              <button
                className="bg-emerald-500 text-black px-4 py-2 rounded"
                onClick={() => {
                  const realNominee = "Savitri Devi"; // replace with your real data later

                  if (formData.nomineeName === realNominee) {
                    setStatus((prev) => ({
                      ...prev,
                      stage: "cooldown",
                      cooldownDaysRemaining: 30,
                      initiatedBy: formData.claimantName,
                    }));

                    setShowForm(false);
                    setAccessDenied("");
                  } else {
                    setAccessDenied("❌ You are not the nominee");
                  }
                }}
              >
                Submit
              </button>

              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
