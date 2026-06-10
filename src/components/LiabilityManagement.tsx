/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PanelTop, Plus, Percent, AlertCircle, Calendar, Trash2, ShieldAlert } from 'lucide-react';
import { Liability } from '../types';

interface LiabilityManagementProps {
  liabilities: Liability[];
  onAddLiability: (liability: Omit<Liability, 'id'>) => void;
  onDeleteLiability: (id: string) => void;
}

export default function LiabilityManagement({ liabilities, onAddLiability, onDeleteLiability }: LiabilityManagementProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [category, setCategory] = useState('Home Loan');
  const [name, setName] = useState('');
  const [outstandingAmount, setOutstandingAmount] = useState('');
  const [emi, setEmi] = useState('');
  const [interestRate, setInterestRate] = useState('');

  const totalOutstanding = liabilities.reduce((sum, l) => sum + l.outstandingAmount, 0);
  const totalEmi = liabilities.reduce((sum, l) => sum + l.emi, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !outstandingAmount || !emi || !interestRate) return;

    onAddLiability({
      category,
      name,
      outstandingAmount: Number(outstandingAmount),
      emi: Number(emi),
      interestRate: Number(interestRate),
    });

    // Reset Form
    setName('');
    setOutstandingAmount('');
    setEmi('');
    setInterestRate('');
    setShowAddModal(false);
  };

  const categories = ['Home Loan', 'Education Loan', 'Car Loan', 'Personal Loan', 'Mortgages', 'Credit Card Debt'];

  return (
    <div id="liability-root" className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-display font-bold text-2xl text-white">Liabilities Ledger</h2>
          <p className="text-slate-400 text-sm">Track active mortgages and commercial loan books to establish fail-safe payoff coverage.</p>
        </div>
        <button
          id="btn-add-liability-trigger"
          onClick={() => setShowAddModal(true)}
          className="bg-brand-accent hover:bg-emerald-400 text-brand-dark font-bold text-sm px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <Plus className="w-4.5 h-4.5 stroke-[2.5]" /> Register Liability
        </button>
      </div>

      {/* Aggregate Debt Stats bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-brand-dark/40 border border-white/5 rounded-2xl p-6">
        <div>
          <span className="text-xs font-mono font-bold text-slate-400">COMBINED OUTSTANDING DEBT BOOK</span>
          <span className="text-3xl font-display font-extrabold text-rose-500 block mt-1">₹{totalOutstanding.toLocaleString('en-IN')}</span>
        </div>
        <div>
          <span className="text-xs font-mono font-bold text-slate-400">TOTAL ESTIMATED MONTHLY DEBT SERVICE (EMI)</span>
          <span className="text-2xl font-display font-extrabold text-white block mt-1">₹{totalEmi.toLocaleString('en-IN')}/mo</span>
        </div>
      </div>

      {/* Liability cards */}
      {liabilities.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-2xl">
          <PanelTop className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <h3 className="text-white font-semibold text-lg">No Liabilities Tracked</h3>
          <p className="text-slate-400 text-sm mt-1 max-w-sm mx-auto">Outstanding debts and mortgages are clean. Great job maintaining an unencumbered estate!</p>
        </div>
      ) : (
        <div id="liabilities-grid-display" className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {liabilities.map((l) => {
            const isHighApr = l.interestRate > 15;
            return (
              <div
                key={l.id}
                className={`glass-panel p-6 rounded-2xl flex flex-col justify-between relative border ${
                  isHighApr ? 'border-amber-500/30 bg-amber-500/[0.02]' : 'border-white/[0.05]'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <span className="bg-slate-800 text-slate-350 text-xs font-mono font-bold px-2 py-1 rounded">
                        {l.category}
                      </span>
                      {isHighApr && (
                        <span className="bg-amber-500/10 border border-amber-550/20 text-amber-400 text-[10px] font-mono px-2 py-0.5 rounded flex items-center gap-1">
                          <ShieldAlert className="w-3 h-3" /> HIGH APR
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => onDeleteLiability(l.id)}
                      className="text-slate-500 hover:text-rose-455 p-1 rounded-lg transition-colors cursor-pointer"
                      title="Remove Liability"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="text-white font-bold text-base mt-4">{l.name}</h3>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-8 border-t border-white/[0.05] pt-4">
                  <div>
                    <span className="text-[10px] font-mono text-slate-450 block uppercase">Outstanding</span>
                    <span className="text-white font-extrabold text-sm sm:text-base mt-0.5 block">₹{l.outstandingAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-450 block uppercase">EMI Amount</span>
                    <span className="text-slate-300 font-semibold text-xs sm:text-sm mt-1 block">₹{l.emi.toLocaleString('en-IN')}/mo</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-450 block uppercase">Interests</span>
                    <span className="text-brand-accent font-mono font-bold text-xs sm:text-sm mt-1 block flex items-center gap-0.5">
                      <Percent className="w-3.5 h-3.5 text-brand-accent" /> {l.interestRate}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Liability Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-[#060c16]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel bg-[#0B192C] w-full max-w-md p-8 rounded-3xl border border-white/10 relative">
            <h3 className="font-display font-bold text-xl text-white mb-6">Register Outstanding Debt</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-mono uppercase font-semibold">Debt Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full glass-input p-3 rounded-xl text-xs"
                >
                  {categories.map((catString) => (
                    <option key={catString} value={catString}>{catString}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-mono uppercase font-semibold">Creditor / Loan Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. HDFC Home Loan, AMEX Credit Balance"
                  className="w-full glass-input p-3 rounded-xl text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-mono uppercase font-semibold">Outstanding Balance (₹)</label>
                <input
                  type="number"
                  value={outstandingAmount}
                  onChange={(e) => setOutstandingAmount(e.target.value)}
                  placeholder="e.g. 2400000"
                  className="w-full glass-input p-3 rounded-xl text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-mono uppercase font-semibold">Monthly EMI (₹)</label>
                  <input
                    type="number"
                    value={emi}
                    onChange={(e) => setEmi(e.target.value)}
                    placeholder="e.g. 25000"
                    className="w-full glass-input p-3 rounded-xl text-xs"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-mono uppercase font-semibold">Interest Rate (APR %)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    placeholder="e.g. 8.4"
                    className="w-full glass-input p-3 rounded-xl text-xs"
                    required
                  />
                </div>
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
                  Confirm Debt Registry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
