/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, AlertTriangle, ShieldCheck, CheckSquare, Square, RefreshCcw, Activity } from 'lucide-react';
import { Asset, Liability } from '../types';

interface FinancialInsightsProps {
  assets: Asset[];
  liabilities: Liability[];
}

interface InsightsData {
  netWorthTrendAdvice: string;
  assetAllocationCommentary: string;
  liabilityExposureWarning: string;
  insuranceGapAnalysis: string;
  financialHealthScore: number;
  actionableSteps: string[];
}

export default function FinancialInsights({ assets, liabilities }: FinancialInsightsProps) {
  const [insights, setInsights] = useState<InsightsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assets, liabilities }),
      });
      const data = await response.json();
      setInsights(data);
    } catch (err) {
      console.error("Failed to fetch AI insights:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, [assets, liabilities]);

  const toggleStep = (index: number) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  if (loading) {
    return (
      <div id="insights-loader" className="glass-panel p-16 rounded-3xl text-center space-y-4 max-w-xl mx-auto mt-12 border-brand-accent/20">
        <div className="relative inline-flex mb-2">
          <Sparkles className="w-10 h-10 text-brand-accent animate-pulse shrink-0" />
          <RefreshCcw className="w-10 h-10 text-emerald-300 animate-spin absolute inset-0 opacity-40" />
        </div>
        <h3 className="text-white text-lg font-bold">Assembling Artificial Financial Auditor</h3>
        <p className="text-slate-400 text-xs leading-relaxed max-w-sm mx-auto font-sans">
          FinGuardian is securely packing your accounts ledger, debt sheets, and document vault metadata to parse an offline-grounded security audit...
        </p>
      </div>
    );
  }

  // Calculate adjusted score depending on box selections (fun interaction!)
  const computedScore = insights
    ? Math.min(
        insights.financialHealthScore + Object.values(completedSteps).filter(Boolean).length * 4,
        100
      )
    : 80;

  return (
    <div id="insights-root" className="space-y-8">
      {/* Target Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-display font-bold text-2xl text-white">Dynamic AI Financial Audit</h2>
          <p className="text-slate-400 text-sm">Server-side AI models review your estate risk index, protection margins, and debt weight in real-time.</p>
        </div>
        <button
          onClick={fetchInsights}
          className="bg-white/5 hover:bg-white/10 text-white text-xs font-mono font-bold px-4 py-2.5 rounded-xl border border-white/10 flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <RefreshCcw className="w-3.5 h-3.5" /> Re-Evaluate Estate
        </button>
      </div>

      {insights && (
        <div className="space-y-8">
          {/* Main Scoring Card */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border-brand-accent/20 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* Score Ring indicator */}
            <div className="flex flex-col items-center justify-center">
              <span className="text-xs font-mono font-bold text-slate-450 uppercase mb-4 block">HEALTH COEFFICIENT</span>
              <div className="relative w-36 h-36 flex items-center justify-center">
                {/* SVG Ring Background */}
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="72"
                    cy="72"
                    r="60"
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  <circle
                    cx="72"
                    cy="72"
                    r="60"
                    stroke="#10B981"
                    strokeWidth="10"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 60}
                    strokeDashoffset={2 * Math.PI * 60 * (1 - computedScore / 100)}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-3xl font-display font-black text-white">{computedScore}%</span>
                  <span className="text-[10px] text-brand-accent font-mono block font-bold">RATED SAFE</span>
                </div>
              </div>
            </div>

            {/* Critique Overview (Takes 2 Columns) */}
            <div className="md:col-span-2 space-y-4">
              <h3 className="font-display font-extrabold text-xl text-white">Advisory Overview</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Your portfolio holds substantial value with excellent asset coverage. However, your estate protection is currently exposed to two distinct risk fields: **Liability Coverage Underwriting** (term ratio is low) and static non-liquid real estate deeds (missing document duplicates).
              </p>
              <div className="flex items-center gap-1.5 font-mono text-[10px] text-brand-accent bg-[#10B981]/10 px-3 py-1.5 rounded-lg border border-[#10B981]/20 w-fit">
                <ShieldCheck className="w-4 h-4 text-brand-accent" /> TRUST GRADE: FIRST CLASS SOVEREIGN
              </div>
            </div>
          </div>

          {/* Core Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* A: Asset allocation advice */}
            <div className="glass-panel p-6 rounded-2xl border-white/[0.04] space-y-3">
              <span className="bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-[10px] font-mono font-bold px-2.5 py-1 rounded inline-block uppercase">
                Asset Allocation Commentary
              </span>
              <p className="text-slate-200 text-sm leading-relaxed font-sans mt-3">
                {insights.assetAllocationCommentary}
              </p>
            </div>

            {/* B: Debt warning advice */}
            <div className="glass-panel p-6 rounded-2xl border-white/[0.04] space-y-3">
              <span className="bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-mono font-bold px-2.5 py-1 rounded inline-block uppercase flex items-center gap-1 w-fit">
                <AlertTriangle className="w-4 h-4 text-amber-400" /> Liability Exposure Warning
              </span>
              <p className="text-slate-200 text-sm leading-relaxed font-sans mt-3">
                {insights.liabilityExposureWarning}
              </p>
            </div>

            {/* C: Net worth trend advice */}
            <div className="glass-panel p-6 rounded-2xl border-white/[0.04] space-y-3">
              <span className="bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-mono font-bold px-2.5 py-1 rounded inline-block uppercase flex items-center gap-1 w-fit">
                <TrendingUp className="w-4 h-4 text-blue-400" strokeWidth={2.5} /> Net Worth Velocity
              </span>
              <p className="text-slate-200 text-sm leading-relaxed font-sans mt-3">
                {insights.netWorthTrendAdvice}
              </p>
            </div>

            {/* D: Insurance Gap */}
            <div className="glass-panel p-6 rounded-2xl border-white/[0.04] space-y-3">
              <span className="bg-[#10B981]/15 border border-brand-accent/25 text-[#10B981] text-[10px] font-mono font-bold px-2.5 py-1 rounded inline-block uppercase flex items-center gap-1 w-fit">
                <ShieldCheck className="w-4 h-4 text-brand-accent" /> Estate Insurance Coverage GAP
              </span>
              <p className="text-slate-200 text-sm leading-relaxed font-sans mt-3">
                {insights.insuranceGapAnalysis}
              </p>
            </div>
          </div>

          {/* Action plan roadmap */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border-white/[0.04] space-y-6">
            <h3 className="font-display font-bold text-lg text-white">Dynamic AI Action Plan For You</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Based on your asset data, complete these security milestones to maximize protection index:
            </p>

            <div className="space-y-4">
              {insights.actionableSteps.map((step, idx) => {
                const isCompleted = !!completedSteps[idx];
                return (
                  <div
                    key={idx}
                    onClick={() => toggleStep(idx)}
                    className={`p-4 rounded-xl border flex items-start gap-4 transition-all cursor-pointer ${
                      isCompleted
                        ? 'bg-brand-accent/5 border-brand-accent/20 text-slate-400'
                        : 'bg-[#060c12] border-white/5 hover:border-white/10 text-white'
                    }`}
                  >
                    <button className="shrink-0 mt-0.5" title="Toggle action item">
                      {isCompleted ? (
                        <CheckSquare className="w-5 h-5 text-brand-accent" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-500" />
                      )}
                    </button>
                    <div className="space-y-1">
                      <p className={`text-xs font-bold leading-relaxed ${isCompleted ? 'line-through text-slate-500' : ''}`}>
                        {step}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
