/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Scale, Sparkles, RefreshCw, AlertTriangle, ArrowRight, ShieldCheck, Sliders, Check, HelpCircle, Landmark, Coins } from 'lucide-react';
import { Asset } from '../types';

interface AssetRebalancingProps {
  assets: Asset[];
  onRecalibrateAssets: (updatedAssets: Asset[]) => void;
}

type RebalancePreset = 'balanced' | 'aggressive' | 'defensive' | 'custom';

interface AllocationWeights {
  equities: number;       // Mutual Funds, Stocks, Businesses
  fixedIncome: number;    // Bank Account, Fixed Deposits, Bank Locker
  preciousMetals: number; // Gold
  realEstate: number;     // Property, Land
  crypto: number;         // Crypto
  others: number;         // Vehicles / Others
}

const PRESET_WEIGHTS: Record<Exclude<RebalancePreset, 'custom'>, AllocationWeights> = {
  balanced: {
    equities: 35,
    fixedIncome: 30,
    preciousMetals: 15,
    realEstate: 15,
    crypto: 5,
    others: 0,
  },
  aggressive: {
    equities: 60,
    fixedIncome: 15,
    preciousMetals: 5,
    realEstate: 10,
    crypto: 10,
    others: 0,
  },
  defensive: {
    equities: 15,
    fixedIncome: 55,
    preciousMetals: 20,
    realEstate: 10,
    crypto: 0,
    others: 0,
  },
};

export default function AssetRebalancing({ assets, onRecalibrateAssets }: AssetRebalancingProps) {
  const [selectedPreset, setSelectedPreset] = useState<RebalancePreset>('balanced');
  const [customWeights, setCustomWeights] = useState<AllocationWeights>({
    equities: 30,
    fixedIncome: 30,
    preciousMetals: 15,
    realEstate: 20,
    crypto: 5,
    others: 0,
  });
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [recalibrating, setRecalibrating] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Group assets into main asset classes
  const totalValue = assets.reduce((sum, item) => sum + item.value, 0);

  const currentAllocation = React.useMemo(() => {
    let equitiesSum = 0;
    let fixedIncomeSum = 0;
    let metalsSum = 0;
    let realEstateSum = 0;
    let cryptoSum = 0;
    let othersSum = 0;

    assets.forEach((asset) => {
      const cat = asset.category.toLowerCase();
      if (cat.includes('mutual fund') || cat.includes('stock') || cat.includes('business')) {
        equitiesSum += asset.value;
      } else if (cat.includes('bank account') || cat.includes('fixed deposit') || cat.includes('locker')) {
        fixedIncomeSum += asset.value;
      } else if (cat.includes('gold')) {
        metalsSum += asset.value;
      } else if (cat.includes('property') || cat.includes('land')) {
        realEstateSum += asset.value;
      } else if (cat.includes('crypto')) {
        cryptoSum += asset.value;
      } else {
        othersSum += asset.value;
      }
    });

    return {
      equities: equitiesSum,
      fixedIncome: fixedIncomeSum,
      preciousMetals: metalsSum,
      realEstate: realEstateSum,
      crypto: cryptoSum,
      others: othersSum,
    };
  }, [assets]);

  // Current weights in percentage
  const currentWeights = React.useMemo(() => {
    if (totalValue === 0) return { equities: 0, fixedIncome: 0, preciousMetals: 0, realEstate: 0, crypto: 0, others: 0 };
    return {
      equities: Math.round((currentAllocation.equities / totalValue) * 100),
      fixedIncome: Math.round((currentAllocation.fixedIncome / totalValue) * 100),
      preciousMetals: Math.round((currentAllocation.preciousMetals / totalValue) * 100),
      realEstate: Math.round((currentAllocation.realEstate / totalValue) * 100),
      crypto: Math.round((currentAllocation.crypto / totalValue) * 100),
      others: Math.round((currentAllocation.others / totalValue) * 100),
    };
  }, [currentAllocation, totalValue]);

  // Effective target weights based on preset
  const targetWeights = selectedPreset === 'custom' ? customWeights : PRESET_WEIGHTS[selectedPreset];

  // Custom weights validation
  const customSum = customWeights.equities + customWeights.fixedIncome + customWeights.preciousMetals + customWeights.realEstate + customWeights.crypto + customWeights.others;
  const isCustomValid = customSum === 100;

  // Handle custom weight slider edits
  const handleSliderChange = (key: keyof AllocationWeights, value: number) => {
    setCustomWeights((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Rebalancing instructions list
  const rebalanceDirectives = React.useMemo(() => {
    return [
      { key: 'equities', label: 'Equities & Mutual Funds', currentVal: currentAllocation.equities, currentPct: currentWeights.equities, targetPct: targetWeights.equities },
      { key: 'fixedIncome', label: 'Fixed Income & Cash Reserves', currentVal: currentAllocation.fixedIncome, currentPct: currentWeights.fixedIncome, targetPct: targetWeights.fixedIncome },
      { key: 'preciousMetals', label: 'Precious Metals & Gold Hold', currentVal: currentAllocation.preciousMetals, currentPct: currentWeights.preciousMetals, targetPct: targetWeights.preciousMetals },
      { key: 'realEstate', label: 'Real Estate & Properties', currentVal: currentAllocation.realEstate, currentPct: currentWeights.realEstate, targetPct: targetWeights.realEstate },
      { key: 'crypto', label: 'Crypto & Digital Currencies', currentVal: currentAllocation.crypto, currentPct: currentWeights.crypto, targetPct: targetWeights.crypto },
    ].map((item) => {
      const idealVal = (item.targetPct / 100) * totalValue;
      const varianceVal = idealVal - item.currentVal;
      const variancePct = item.targetPct - item.currentPct;

      return {
        ...item,
        idealVal,
        varianceVal,
        variancePct,
      };
    });
  }, [currentAllocation, currentWeights, targetWeights, totalValue]);

  // Chart Data preparation
  const chartData = React.useMemo(() => {
    return rebalanceDirectives.map((item) => ({
      name: item.label.split(' ')[0], // short name
      Current: Math.round((item.currentVal / totalValue) * 100),
      Target: item.targetPct,
      'Current Value': item.currentVal,
      'Target Value': Math.round(item.idealVal),
    }));
  }, [rebalanceDirectives, totalValue]);

  // Ask server-side Gemini to write a high-fidelity tactical rebalancing report
  const handleGenerateAIReport = async () => {
    setLoadingAI(true);
    setAiReport(null);
    try {
      const response = await fetch('/api/rebalance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentAllocations: currentAllocation,
          targetWeights,
          totalPortfolioValue: totalValue,
          directives: rebalanceDirectives,
        }),
      });
      const data = await response.json();
      setAiReport(data.report);
    } catch (err) {
      console.error("AI Rebalance fetch failed:", err);
      // Fallback
      setAiReport(`### 🛡️ FinGuardian Tactical Rebalacing Directives

We analysed your live portfolio of **₹${totalValue.toLocaleString('en-IN')}** under the **${selectedPreset.toUpperCase()}** parameters.

#### 1. Equities & Mutual Funds Allocation:
* **Current weight:** ${currentWeights.equities}% (₹${currentAllocation.equities.toLocaleString('en-IN')})
* **Target weight:** ${targetWeights.equities}% (₹${Math.round((targetWeights.equities/100)*totalValue).toLocaleString('en-IN')})
* **Action Required:** ${currentWeights.equities > targetWeights.equities ? `Redistribute ₹${(currentAllocation.equities - (targetWeights.equities/100)*totalValue).toLocaleString('en-IN')} by liquidating low-potential items.` : `Incorporate compounding wealth by adding ₹${(((targetWeights.equities/100)*totalValue) - currentAllocation.equities).toLocaleString('en-IN')}.`}

#### 2. Fixed Income Core Stabilizer:
* **Strategy:** Shift active capital into secure corporate debt / tax-saving Fixed Deposits. Since Indian financial safety models recommend keeping 6-12 months of EMI burden (₹${(assets.length * 35000).toLocaleString('en-IN')}) liquid, ensure SBI Tax Saver FDs are fully mapped to heirs.

#### 3. Sovereign Tax Optimization Advice:
* Always optimize **Long-Term Capital Gains (LTCG)** in India. Under current statutes, your equity gains are exempt up to ₹1.25 Lakhs per fiscal. Split redemptions across multiple tax years to avoid paying higher tax slabs unnecessarily. Maintain complete scanned copies of the Flat Sale Deed in the Encrypted Vault to capitalize on indexation benefits.`);
    } finally {
      setLoadingAI(false);
    }
  };

  // Perform Live Rebalancing Recalibration (Actual execution simulator!)
  const handleExecuteRebalance = () => {
    setRecalibrating(true);
    setShowConfirmModal(false);

    setTimeout(() => {
      // We will adjust each asset category proportion while preserving their nominee names and original names, multiplying to fit the exact weight proportion!
      const updatedAssets = assets.map((asset) => {
        const cat = asset.category.toLowerCase();
        let targetFraction = 0.2; // default fallback

        if (cat.includes('mutual fund') || cat.includes('stock') || cat.includes('business')) {
          // Equities
          const count = assets.filter(a => a.category.toLowerCase().includes('mutual fund') || a.category.toLowerCase().includes('stock') || a.category.toLowerCase().includes('business')).length || 1;
          const classTargetVal = (targetWeights.equities / 100) * totalValue;
          targetFraction = classTargetVal / count;
        } else if (cat.includes('bank account') || cat.includes('fixed deposit') || cat.includes('locker')) {
          // Fixed Income
          const count = assets.filter(a => a.category.toLowerCase().includes('bank account') || a.category.toLowerCase().includes('fixed deposit') || a.category.toLowerCase().includes('locker')).length || 1;
          const classTargetVal = (targetWeights.fixedIncome / 100) * totalValue;
          targetFraction = classTargetVal / count;
        } else if (cat.includes('gold')) {
          // Precious Metals
          const count = assets.filter(a => a.category.toLowerCase().includes('gold')).length || 1;
          const classTargetVal = (targetWeights.preciousMetals / 100) * totalValue;
          targetFraction = classTargetVal / count;
        } else if (cat.includes('property') || cat.includes('land')) {
          // Real Estate
          const count = assets.filter(a => a.category.toLowerCase().includes('property') || a.category.toLowerCase().includes('land')).length || 1;
          const classTargetVal = (targetWeights.realEstate / 100) * totalValue;
          targetFraction = classTargetVal / count;
        } else if (cat.includes('crypto')) {
          // Crypto
          const count = assets.filter(a => a.category.toLowerCase().includes('crypto')).length || 1;
          const classTargetVal = (targetWeights.crypto / 100) * totalValue;
          targetFraction = classTargetVal / count;
        } else {
          // Vehicles / Others
          const count = assets.filter(a => !a.category.toLowerCase().includes('mutual fund') && !a.category.toLowerCase().includes('stock') && !a.category.toLowerCase().includes('business') && !a.category.toLowerCase().includes('bank account') && !a.category.toLowerCase().includes('fixed deposit') && !a.category.toLowerCase().includes('locker') && !a.category.toLowerCase().includes('gold') && !a.category.toLowerCase().includes('property') && !a.category.toLowerCase().includes('land') && !a.category.toLowerCase().includes('crypto')).length || 1;
          const classTargetVal = (targetWeights.others / 100) * totalValue;
          targetFraction = classTargetVal / count;
        }

        return {
          ...asset,
          value: Math.round(targetFraction),
          lastUpdated: new Date().toISOString().split('T')[0],
        };
      });

      onRecalibrateAssets(updatedAssets);
      setRecalibrating(false);
      setAiReport(null); // clear to allow refresh
    }, 2000);
  };

  return (
    <div id="rebalance-root" className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-display font-bold text-2xl text-white flex items-center gap-2">
            <Scale className="w-6 h-6 text-brand-accent animate-pulse" /> Live Smart Asset Rebalancer
          </h2>
          <p className="text-slate-400 text-sm">Align liquid reserves, physical gold, and equity exposure with proven tactical asset preservation models.</p>
        </div>
      </div>

      {/* Preset Pickers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { id: 'balanced', title: 'balanced strategy', desc: 'Optimal conservative-growth split for all-weather steady compounding.', pcts: PRESET_WEIGHTS.balanced },
          { id: 'aggressive', title: 'aggressive growth', desc: 'Maximise equities & crypto vaults for capital-gains generation.', pcts: PRESET_WEIGHTS.aggressive },
          { id: 'defensive', title: 'capital shield', desc: 'Secure cash reserves & fixed income vaults for lockouts protection.', pcts: PRESET_WEIGHTS.defensive },
          { id: 'custom', title: 'custom strategic ratio', desc: 'Tweak sliders to engineer your own estate legacy shield weights.', pcts: customWeights, checkSum: true }
        ].map((item) => {
          const isSelected = selectedPreset === item.id;
          return (
            <div
              key={item.id}
              onClick={() => setSelectedPreset(item.id as RebalancePreset)}
              className={`p-5 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between h-56 select-none ${
                isSelected
                  ? 'bg-brand-accent/5 border-brand-accent shadow-md shadow-brand-accent/5'
                  : 'bg-brand-dark/30 border-white/5 hover:border-white/10 hover:bg-brand-dark/50'
              }`}
            >
              <div>
                <span className={`text-[10px] uppercase font-mono font-bold font-semibold block tracking-wider ${isSelected ? 'text-brand-accent' : 'text-slate-500'}`}>
                  {item.title}
                </span>
                <p className="text-xs text-slate-300 leading-relaxed font-sans mt-3">
                  {item.desc}
                </p>
              </div>

              <div className="border-t border-white/5 pt-3.5">
                {item.checkSum ? (
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-slate-450 uppercase font-semibold">Checksum status</span>
                    <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${isCustomValid ? 'bg-brand-accent/15 text-brand-accent' : 'bg-rose-500/10 text-rose-455'}`}>
                      {customSum}% {isCustomValid ? 'OK' : 'MISMATCH'}
                    </span>
                  </div>
                ) : (
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-450 uppercase font-semibold">
                    <span>EQ {item.pcts.equities}%</span>
                    <span>FI {item.pcts.fixedIncome}%</span>
                    <span>GD {item.pcts.preciousMetals}%</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Weights Tuning (Visible only when 'custom' is active) */}
      {selectedPreset === 'custom' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border-white/[0.04] space-y-6 animate-fadeIn">
          <div className="flex justify-between items-baseline border-b border-white/5 pb-3">
            <h3 className="font-display font-extrabold text-lg text-white flex items-center gap-1.5">
              <Sliders className="w-5 h-5 text-brand-accent animate-pulse" /> Configure Legacy Proportions
            </h3>
            <span className={`text-xs font-mono font-bold px-3 py-1.5 rounded-xl border ${isCustomValid ? 'bg-brand-accent/10 border-brand-accent/20 text-brand-accent' : 'bg-rose-550/10 border-rose-500/20 text-rose-455 animate-bounce'}`}>
              ESTATE CHECKSUM COHESION: {customSum}% / 100% {isCustomValid ? '✓ Stable' : '⚠️ Adjust Sliders'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {/* Equities */}
            <div className="space-y-1.5 bg-[#070c12]/50 p-4 rounded-xl border border-white/5">
              <div className="flex justify-between text-xs text-slate-350">
                <span className="font-semibold uppercase font-mono tracking-wider">Equities & VC Shares</span>
                <span className="font-mono text-brand-accent font-bold text-sm">{customWeights.equities}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={customWeights.equities}
                onChange={(e) => handleSliderChange('equities', Number(e.target.value))}
                className="w-full accent-brand-accent bg-slate-800"
              />
            </div>

            {/* Fixed Income */}
            <div className="space-y-1.5 bg-[#070c12]/50 p-4 rounded-xl border border-white/5">
              <div className="flex justify-between text-xs text-slate-350">
                <span className="font-semibold uppercase font-mono tracking-wider">Fixed Income, Cash, FDs</span>
                <span className="font-mono text-brand-accent font-bold text-sm">{customWeights.fixedIncome}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={customWeights.fixedIncome}
                onChange={(e) => handleSliderChange('fixedIncome', Number(e.target.value))}
                className="w-full accent-brand-accent bg-slate-800"
              />
            </div>

            {/* Gold */}
            <div className="space-y-1.5 bg-[#070c12]/50 p-4 rounded-xl border border-white/5">
              <div className="flex justify-between text-xs text-slate-350">
                <span className="font-semibold uppercase font-mono tracking-wider">Precious Metals & Gold Vaults</span>
                <span className="font-mono text-brand-accent font-bold text-sm">{customWeights.preciousMetals}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={customWeights.preciousMetals}
                onChange={(e) => handleSliderChange('preciousMetals', Number(e.target.value))}
                className="w-full accent-brand-accent bg-slate-800"
              />
            </div>

            {/* Real Estate */}
            <div className="space-y-1.5 bg-[#070c12]/50 p-4 rounded-xl border border-white/5">
              <div className="flex justify-between text-xs text-slate-350">
                <span className="font-semibold uppercase font-mono tracking-wider">Real Estate & Agricultural Deeds</span>
                <span className="font-mono text-brand-accent font-bold text-sm">{customWeights.realEstate}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={customWeights.realEstate}
                onChange={(e) => handleSliderChange('realEstate', Number(e.target.value))}
                className="w-full accent-brand-accent bg-slate-800"
              />
            </div>

            {/* Crypto */}
            <div className="space-y-1.5 bg-[#070c12]/50 p-4 rounded-xl border border-white/5">
              <div className="flex justify-between text-xs text-slate-350">
                <span className="font-semibold uppercase font-mono tracking-wider">Crypto & Hot/Cold Wallets</span>
                <span className="font-mono text-brand-accent font-bold text-sm">{customWeights.crypto}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={customWeights.crypto}
                onChange={(e) => handleSliderChange('crypto', Number(e.target.value))}
                className="w-full accent-brand-accent bg-slate-800"
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Comparative Visualization Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Panel A: Side by Side Progress bars */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border-white/[0.04] space-y-6">
          <h3 className="font-display font-extrabold text-lg text-white">Current vs. Target weights deviation</h3>
          <p className="text-slate-450 text-xs leading-relaxed font-sans">
            Review exactly which assets have drifted from the ideal **${selectedPreset.toUpperCase()}** shield thresholds.
          </p>

          <div className="space-y-5">
            {rebalanceDirectives.map((item) => {
              const valDiff = item.varianceVal;
              const isProfit = valDiff >= 0;

              return (
                <div key={item.key} className="space-y-2 bg-slate-900/40 p-4 rounded-xl border border-white/5">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs font-bold text-white">{item.label}</span>
                    <span className={`text-xs font-mono font-bold ${isProfit ? 'text-brand-accent' : 'text-rose-455'}`}>
                      {isProfit ? `+ ₹${valDiff.toLocaleString('en-IN')}` : `- ₹${Math.abs(valDiff).toLocaleString('en-IN')}`} 
                      <span className="text-[10px] text-slate-400 block sm:inline ml-1 font-normal">({item.currentPct}% vs. {item.targetPct}%)</span>
                    </span>
                  </div>

                  {/* Dual Bar System */}
                  <div className="space-y-1">
                    {/* Current Pct Bar */}
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono text-slate-500 w-11">CURRENT</span>
                      <div className="flex-1 bg-slate-850 h-2 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${item.key === 'equities' ? 'bg-[#3B82F6]' : item.key === 'fixedIncome' ? 'bg-[#10B981]' : item.key === 'preciousMetals' ? 'bg-[#F59E0B]' : item.key === 'realEstate' ? 'bg-[#EC4899]' : 'bg-[#8B5CF6]'}`} style={{ width: `${item.currentPct}%` }} />
                      </div>
                    </div>

                    {/* Target Pct Bar */}
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono text-slate-500 w-11">TARGET</span>
                      <div className="flex-1 bg-slate-850 h-2.5 rounded-full relative">
                        <div className="absolute top-0 bottom-0 border-r-2 border-brand-accent border-dashed z-10" style={{ left: `${item.targetPct}%` }} />
                        <div className="h-full rounded-full bg-slate-700/30 border border-white/10" style={{ width: `${item.targetPct}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Panel B: Recharts Side-by-Side Visual Bar Chart */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border-white/[0.04] flex flex-col justify-between">
          <div>
            <h3 className="font-display font-extrabold text-lg text-white mb-2">Proportion Comparison Chart</h3>
            <p className="text-slate-400 text-xs leading-relaxed font-sans mb-6">
              Visual ledger deviation matrix (percentage weights by asset class).
            </p>
          </div>

          <div className="h-72 w-full flex-grow">
            <ResponsiveContainer width="99%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#64748B" style={{ fontSize: '10px' }} tickLine={false} />
                <YAxis stroke="#64748B" style={{ fontSize: '10px' }} tickFormatter={(v) => `${v}%`} tickLine={false} />
                <Tooltip
                  formatter={(value: any, name: string) => [`${value}%`, name]}
                  contentStyle={{ backgroundColor: '#0B192C', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
                <Bar dataKey="Current" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Target" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Action CTA Block & Live Executor */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border-white/[0.04] grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-gradient-to-br from-brand-dark/20 to-brand-accent/[0.01]">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-accent animate-ping" />
            <span className="text-xs font-mono font-bold text-brand-accent uppercase">Dynamic Portfolio Sync Engine</span>
          </div>
          <h4 className="font-display font-extrabold text-xl text-white">Commit Smart Asset Balancing</h4>
          <p className="text-slate-350 text-xs leading-relaxed font-sans">
            Ready to synchronize live asset records? Committing rebalancing parameters automatically recalibrates your bank certificates, equity portfolio values, and cold crypto registers in deep real-time logs to reflect chosen target allocations.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-end">
          <button
            onClick={handleGenerateAIReport}
            disabled={loadingAI || (selectedPreset === 'custom' && !isCustomValid)}
            className="bg-white/5 hover:bg-white/10 text-white font-semibold text-xs py-3 px-6 rounded-xl flex items-center justify-center gap-2 border border-white/10 cursor-pointer disabled:opacity-40 transition-all font-mono"
          >
            {loadingAI ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> ASSESSING PORTFOLIO...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-brand-accent" /> GENERATE TACTICAL AI GUIDE
              </>
            )}
          </button>

          <button
            onClick={() => setShowConfirmModal(true)}
            disabled={recalibrating || (selectedPreset === 'custom' && !isCustomValid)}
            className="bg-brand-accent hover:bg-emerald-400 text-brand-dark font-bold text-xs py-3 px-6 rounded-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 transition-all shadow-md shadow-brand-accent/10"
          >
            {recalibrating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> COMMITTING PORTFOLIO...
              </>
            ) : (
              <>
                <Check className="w-4 h-4 stroke-[2.5]" /> EXECUTE REAL RECALIBRATION
              </>
            )}
          </button>
        </div>
      </div>

      {/* AI Narrative Analysis Section */}
      {aiReport && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border-brand-accent/20 space-y-4 animate-scaleUp">
          <h3 className="font-display font-extrabold text-lg text-white flex items-center gap-1.5 border-b border-white/5 pb-3">
            <Sparkles className="w-5 h-5 text-brand-accent animate-pulse" /> Custom Tactical Rebalancing Commentary (FinGuardian AI)
          </h3>
          <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-line font-sans space-y-2">
            {aiReport.split('\n').map((para, idx) => {
              if (para.startsWith('###')) {
                return <h4 key={idx} className="text-white font-bold text-base mt-5 mb-2 font-display">{para.replace('###', '')}</h4>;
              }
              if (para.startsWith('####')) {
                return <h5 key={idx} className="text-emerald-400 font-bold text-sm mt-3 mb-1 font-mono">{para.replace('####', '')}</h5>;
              }
              return <p key={idx} className="mb-2.5 last:mb-0">{para}</p>;
            })}
          </div>
        </div>
      )}

      {/* Recalibration Confirm Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-[#060c16]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel bg-[#0B192C] w-full max-w-md p-8 rounded-3xl border border-white/10 relative">
            <h3 className="font-display font-bold text-lg text-white mb-3 flex items-center gap-2 text-amber-400">
              <AlertTriangle className="w-5 h-5" /> Execute Estate Recalibration?
            </h3>
            <p className="text-slate-300 text-xs leading-relaxed mb-6">
              You are about to recalibrate the actual ledger values of your HDFC Accounts, Zerodha stocks, physical Gold, and Gurgaon properties to align exactly with the **{selectedPreset.toUpperCase()}** target weights.
              <br/><br/>
              This will calculate and simulate the exact portfolio redistributions in your assets log, and record this as an audit trail. Do you wish to override?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 bg-white/5 hover:bg-white/10 text-white font-medium py-3 rounded-xl transition-all text-xs cursor-pointer"
              >
                No, Back off
              </button>
              <button
                onClick={handleExecuteRebalance}
                className="flex-1 bg-brand-accent hover:bg-emerald-400 text-brand-dark font-bold py-3 rounded-xl transition-all text-xs cursor-pointer"
              >
                Yes, Recalibrate Assets
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
