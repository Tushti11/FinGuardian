/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Users, User, ShieldAlert, CheckCircle, Info, ToggleLeft, ToggleRight, ArrowRight, UserCheck, Settings, Plus } from 'lucide-react';
import { Nominee, Asset } from '../types';

interface NomineeCenterProps {
  nominees: Nominee[];
  assets: Asset[];
  onTogglePermission: (id: string) => void;
  onAddNominee: (nominee: Nominee) => void;
}

export default function NomineeCenter({ nominees, assets, onTogglePermission, onAddNominee }: NomineeCenterProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('Mother');
  const [email, setEmail] = useState('');

  // Calculate allocated assets list for a nominee name
  const getAllocatedAssetsForNominee = (nomineeName: string) => {
    return assets.filter((a) => a.nomineeName === nomineeName);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    onAddNominee({
      id: `nom_${Date.now()}`,
      name,
      relationship,
      email,
      accessPermission: false,
    });

    setName('');
    setEmail('');
    setShowAddModal(false);
  };

  const RELATIONSHIPS = ['Mother', 'Father', 'Brother', 'Sister', 'Spouse', 'Partner', 'Child', 'Legal Counsel'];

  return (
    <div id="nominee-root" className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-display font-bold text-2xl text-white">Nominee & Beneficiary Hub</h2>
          <p className="text-slate-400 text-sm">Assign distinct asset folders to family members and configure emergency access clearances.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-brand-accent hover:bg-emerald-400 text-brand-dark font-bold text-sm px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <Plus className="w-4.5 h-4.5 stroke-[2.5]" /> Register Nominee
        </button>
      </div>

      {/* Interactive Family Tree / Nodes Visual (Hackathon High-Value Graphic) */}
      <div className="glass-panel p-8 rounded-3xl relative overflow-hidden border-[#10B981]/15">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/5 rounded-full blur-2xl pointer-events-none" />
        <h3 className="text-white text-sm font-semibold tracking-wide uppercase font-mono mb-6 pb-2 border-b border-white/5 flex items-center gap-2">
          <Users className="w-4 h-4 text-brand-accent" /> Estate Allocation Network Mapping
        </h3>

        {/* Visual Graph Layout */}
        <div className="relative py-8 flex flex-col items-center justify-center min-h-[220px]">
          {/* Centered Primary Node */}
          <div className="relative z-10 bg-[#0B192C] border-2 border-brand-accent p-4 rounded-ful rounded-2xl text-center shadow-lg shadow-brand-accent/10 min-w-[150px]">
            <span className="text-[10px] font-mono text-brand-accent block font-bold leading-none mb-1">PRINCIPAL TRUSTEE</span>
            <span className="text-white font-bold text-sm">Aditya Sharma (You)</span>
          </div>

          {/* Connected SVG lines */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <svg className="w-full h-full min-h-[220px]" style={{ overflow: 'visible' }}>
              {/* Dynamic Connecting Lines depending on amount of nominees. Let's draw 4 neat paths from center (50%, 50%) to nodes */}
              <line x1="50%" y1="50%" x2="15%" y2="15%" stroke="rgba(16, 185, 129, 0.25)" strokeWidth="1.5" strokeDasharray="4" />
              <line x1="50%" y1="50%" x2="85%" y2="15%" stroke="rgba(16, 185, 129, 0.25)" strokeWidth="1.5" strokeDasharray="4" />
              <line x1="50%" y1="50%" x2="15%" y2="85%" stroke="rgba(16, 185, 129, 0.25)" strokeWidth="1.5" strokeDasharray="4" />
              <line x1="50%" y1="50%" x2="85%" y2="85%" stroke="rgba(16, 185, 129, 0.25)" strokeWidth="1.5" strokeDasharray="4" />
            </svg>
          </div>

          {/* Node Positions */}
          <div className="absolute left-[5%] top-[5%] bg-slate-900/90 border border-white/10 px-3 py-2 rounded-xl text-xs text-center min-w-[120px]">
            <span className="text-[9px] font-mono text-slate-500 block">MOTHER</span>
            <span className="text-white font-bold">Savitri Devi</span>
          </div>
          <div className="absolute right-[5%] top-[5%] bg-slate-900/90 border border-white/10 px-3 py-2 rounded-xl text-xs text-center min-w-[120px]">
            <span className="text-[9px] font-mono text-slate-500 block">BROTHER</span>
            <span className="text-white font-bold">Rohan Sharma</span>
          </div>
          <div className="absolute left-[5%] bottom-[5%] bg-slate-900/90 border border-white/10 px-3 py-2 rounded-xl text-xs text-center min-w-[120px]">
            <span className="text-[9px] font-mono text-slate-500 block">PARTNER</span>
            <span className="text-white font-bold">Aditi Verma</span>
          </div>
          <div className="absolute right-[5%] bottom-[5%] bg-slate-900/90 border border-white/10 px-3 py-2 rounded-xl text-xs text-center min-w-[120px]">
            <span className="text-[9px] font-mono text-slate-500 block">FATHER</span>
            <span className="text-white font-bold">Vikram Sharma</span>
          </div>
        </div>
      </div>

      {/* Grid of Beneficiary Cards */}
      <div id="nominee-list-container" className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {nominees.map((nom) => {
          const matchedAssets = getAllocatedAssetsForNominee(nom.name);
          const totalAssignedValue = matchedAssets.reduce((s, a) => s + a.value, 0);

          return (
            <div
              key={nom.id}
              className="glass-panel p-6 rounded-2xl flex flex-col justify-between relative border-white/[0.04]"
            >
              {/* Profile Details */}
              <div>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="bg-slate-800 p-2.5 rounded-xl text-brand-accent">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-base">{nom.name}</h4>
                      <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider font-mono mt-0.5">{nom.relationship}</p>
                    </div>
                  </div>

                  {/* Permission Toggle Switch */}
                  <div className="flex items-center gap-1.5 bg-[#060c12] rounded-xl px-2.5 py-1.5 border border-white/5">
                    <span className="text-[9px] font-mono text-slate-400">EMERGENCY SYNC</span>
                    <button
                      onClick={() => onTogglePermission(nom.id)}
                      className="text-brand-accent transition-colors"
                      title="Toggle emergency notification permissions"
                    >
                      {nom.accessPermission ? (
                        <ToggleRight className="w-7 h-7 text-brand-accent" />
                      ) : (
                        <ToggleLeft className="w-7 h-7 text-slate-500" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="mt-4 text-xs font-mono text-slate-400">
                  <span>Registered: </span>
                  <span className="text-white">{nom.email}</span>
                </div>
              </div>

              {/* Mapped Assets */}
              <div className="mt-6 border-t border-white/[0.05] pt-4">
                <div className="flex justify-between items-center text-xs font-mono uppercase mb-3">
                  <span className="text-slate-450">Nominated Assets Pool</span>
                  <span className="text-brand-accent font-bold">₹{totalAssignedValue.toLocaleString('en-IN')}</span>
                </div>

                {matchedAssets.length === 0 ? (
                  <span className="text-[11px] text-slate-500 italic block">No specific assets assigned currently. Holds generic fallback share.</span>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {matchedAssets.map((asset) => (
                      <span
                        key={asset.id}
                        className="bg-brand-accent/5 border border-brand-accent/15 text-brand-accent text-[10px] font-mono px-2 py-1 rounded inline-flex items-center gap-1"
                      >
                        <UserCheck className="w-3 h-3" /> {asset.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Nominee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-[#060c16]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel bg-[#0B192C] w-full max-w-md p-8 rounded-3xl border border-white/10 relative">
            <h3 className="font-display font-bold text-xl text-white mb-6">Register Estate Nominee</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-mono uppercase font-semibold">Nominee Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Priyanshu Sharma"
                  className="w-full glass-input p-3 rounded-xl text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-mono uppercase font-semibold">Family Relationship</label>
                <select
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  className="w-full glass-input p-3 rounded-xl text-xs"
                >
                  {RELATIONSHIPS.map((relStr) => (
                    <option key={relStr} value={relStr}>{relStr}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-mono uppercase font-semibold">Secure Communication Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. relative@trustee.com"
                  className="w-full glass-input p-3 rounded-xl text-xs"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white font-medium py-3 rounded-xl transition-all text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-brand-accent hover:bg-emerald-400 text-brand-dark font-bold py-3 rounded-xl transition-all text-xs cursor-pointer"
                >
                  Save Nominee Node
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
