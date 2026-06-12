/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Shield, TrendingUp, TrendingDown, Landmark, ReceiptText, Users, Lock, ChevronRight, AlertCircle, FileText, Scale } from 'lucide-react';
import { Asset, Liability, Nominee, Document } from '../types';

interface DashboardProps {
  assets: Asset[];
  liabilities: Liability[];
  nominees: Nominee[];
  documents: Document[];
  onNavigate: (tab: string) => void;
}

const COLORS = ['#10B981', '#3B82F6', '#6366F1', '#F59E0B', '#EC4899', '#8B5CF6'];
const DEBT_COLORS = ['#EF4444', '#F59E0B', '#6366F1', '#EC4899'];

export default function Dashboard({ assets, liabilities, nominees, documents, onNavigate }: DashboardProps) {
  // Calculations
  const totalAssets = assets.reduce((sum, item) => sum + item.value, 0);
  const totalLiabilities = liabilities.reduce((sum, item) => sum + item.outstandingAmount, 0);
  const netWorth = totalAssets - totalLiabilities;

  // Pie chart: asset allocation categories
  const assetAllocationData = React.useMemo(() => {
    const grouped: Record<string, number> = {};
    assets.forEach((asset) => {
      grouped[asset.category] = (grouped[asset.category] || 0) + asset.value;
    });
    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }, [assets]);

  // Bar chart: liability breakdown
  const liabilityData = React.useMemo(() => {
    return liabilities.map((l) => ({
      name: l.name,
      Outstanding: l.outstandingAmount,
      EMI: l.emi,
    }));
  }, [liabilities]);

  // Compute security score dynamically
  const securityScore = React.useMemo(() => {
    let score = 55; // Base score
    if (documents.length >= 5) score += 15;
    if (nominees.length >= 3) score += 15;
    // Check if assets without nominee mapping exist
    const hasUnallocated = assets.some((a) => !a.nomineeName || a.nomineeName === 'None');
    if (!hasUnallocated) score += 15;
    return Math.min(score, 100);
  }, [documents, nominees, assets]);

  const savedUser = JSON.parse(
    localStorage.getItem("finguardianUser") || "{}"
  );

  const loggedInUserName = savedUser.fullName || "User";

  return (
    <div id="dashboard-root" className="space-y-8">
      {/* Welcome Banner */}
      <div id="dash-banner" className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-brand-dark/80 to-[#10B981]/10 p-6 md:p-8 rounded-3xl border border-[#10B981]/20">
        <div>
          <h2 className="font-display font-extrabold text-2xl md:text-3xl text-white tracking-tight">Welcome Back, {loggedInUserName}</h2>
          <p className="text-slate-300 text-sm mt-1">Your estate shield is actively synchronized. No emergency events logged today.</p>
        </div>
        <div className="flex items-center gap-3 bg-[#060c12]/80 border border-white/10 px-4 py-2.5 rounded-xl text-xs font-mono">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-accent animate-pulse" />
          <span className="text-slate-300">Guardian Protocol: Online</span>
        </div>
      </div>

      {/* Main KPI Grid */}
      <div id="dash-kpi-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1: Net Worth */}
        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between border-brand-accent/20">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/5 rounded-full blur-2xl" />
          <div className="flex justify-between items-start">
            <span className="text-slate-400 text-xs font-semibold tracking-wider font-mono">NET WORTH STATEMENT</span>
            <div className="bg-brand-accent/10 p-2.5 rounded-xl text-brand-accent">
              <Shield className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl sm:text-4xl font-display font-extrabold text-white">₹{netWorth.toLocaleString('en-IN')}</span>
            <span className="text-xs text-brand-accent flex items-center gap-1 mt-1 font-mono">
              <TrendingUp className="w-3.5 h-3.5" /> High Liquid Liquidity Index
            </span>
          </div>
        </div>

        {/* Card 2: Assets Ledger */}
        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between border-blue-550/20">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-550/5 rounded-full blur-2xl" />
          <div className="flex justify-between items-start">
            <span className="text-slate-400 text-xs font-semibold tracking-wider font-mono">GROSS REGISTERED ASSETS</span>
            <div className="bg-blue-500/10 p-2.5 rounded-xl text-blue-400">
              <Landmark className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl sm:text-4xl font-display font-extrabold text-[#3B82F6]">₹{totalAssets.toLocaleString('en-IN')}</span>
            <span className="text-slate-400 text-xs mt-1 block font-mono">
              {assets.length} Active Ledger Registries
            </span>
          </div>
        </div>

        {/* Card 3: Liabilities Ledger */}
        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between border-rose-500/20">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl" />
          <div className="flex justify-between items-start">
            <span className="text-slate-400 text-xs font-semibold tracking-wider font-mono">TOTAL OUTSTANDING DEBT</span>
            <div className="bg-rose-500/10 p-2.5 rounded-xl text-rose-400">
              <ReceiptText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl sm:text-4xl font-display font-extrabold text-rose-500">₹{totalLiabilities.toLocaleString('en-IN')}</span>
            <span className="text-slate-400 text-xs mt-1 block font-mono">
              {liabilities.length} Debt Instruments Scheduled
            </span>
          </div>
        </div>
      </div>

      {/* Smart Rebalancing Shortcut Banner */}
      <div className="glass-panel p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-brand-accent/25 bg-brand-accent/[0.02]">
        <div className="flex gap-3 items-start animate-fadeIn">
          <div className="bg-brand-accent/15 text-brand-accent p-2.5 rounded-xl shrink-0">
            <Scale className="w-5 h-5 text-brand-accent animate-pulse" />
          </div>
          <div>
            <h4 className="text-white text-sm font-bold flex items-center gap-1.5 font-display">
              Smart Asset Portfolio Rebalancing Active <span className="bg-brand-accent/20 text-brand-accent text-[9px] font-mono px-2 py-0.5 rounded uppercase font-extrabold">TACTICAL ENGINE</span>
            </h4>
            <p className="text-slate-300 text-xs mt-1 font-sans">
              Your assets have minor drift from chosen structural shield targets. Run rebalancing models to optimize tax-efficient exits.
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('rebalance')}
          className="bg-brand-accent hover:bg-emerald-400 text-brand-dark font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap self-end sm:self-auto flex items-center gap-1"
        >
          Align Portfolio <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Extra counts & Security Scores */}
      <div id="dash-counts-sec" className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Mini KPI Nominee */}
        <div onClick={() => onNavigate('nominees')} className="glass-panel p-5 rounded-2xl flex items-center justify-between cursor-pointer hover:border-brand-accent/25 transition-all">
          <div>
            <span className="text-slate-450 text-xs font-semibold font-mono block">BENEFICIARIES</span>
            <span className="text-2xl font-bold text-white mt-1 block">{nominees.length} Assigned</span>
          </div>
          <div className="bg-indigo-505/10 text-indigo-400 p-3 rounded-xl bg-slate-800">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Mini KPI Docs */}
        <div onClick={() => onNavigate('documents')} className="glass-panel p-5 rounded-2xl flex items-center justify-between cursor-pointer hover:border-brand-accent/25 transition-all">
          <div>
            <span className="text-slate-450 text-xs font-semibold font-mono block">SECURE VAULT DOCS</span>
            <span className="text-2xl font-bold text-white mt-1 block">{documents.length} Encrypted</span>
          </div>
          <div className="bg-blue-505/10 text-blue-400 p-3 rounded-xl bg-slate-800">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        {/* Security Score Widget (Takes 2 Columns) */}
        <div className="md:col-span-2 glass-panel p-5 rounded-2xl flex items-center justify-between border-brand-accent/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-accent/5 rounded-full blur-xl" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-brand-accent" />
              <span className="text-xs font-mono font-bold text-slate-350">FINANCIAL INTEGRITY INDEX</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-display font-extrabold text-brand-accent">{securityScore}%</span>
              <span className="text-xs text-slate-405">Outstanding Shield</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-teal-400 to-brand-accent h-full" style={{ width: `${securityScore}%` }} />
            </div>
          </div>
          <div
            onClick={() => onNavigate('insights')}
            className="ml-6 flex items-center gap-1 text-slate-400 hover:text-brand-accent font-semibold text-xs cursor-pointer select-none font-mono"
          >
            Audit <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Recharts Panels Grid */}
      <div id="dash-charts-grid" className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Panel A: Asset Allocation Pie */}
        <div className="glass-panel p-6 rounded-3xl border-white/[0.03]">
          <h3 className="font-display font-bold text-lg text-white mb-6">Asset Allocation Distribution</h3>
          <div className="h-80 w-full flex items-center justify-center">
            <ResponsiveContainer width="99%" height="100%">
              <PieChart>
                <Pie
                  data={assetAllocationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {assetAllocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => `₹${Number(value).toLocaleString('en-IN')}`}
                  contentStyle={{ backgroundColor: '#0B192C', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', color: '#94A3B8' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Panel B: Liability Outstanding and EMI Burden */}
        <div className="glass-panel p-6 rounded-3xl border-white/[0.03]">
          <h3 className="font-display font-bold text-lg text-white mb-6">Outstanding Debt Instruments & EMI Scale</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="99%" height="100%">
              <BarChart data={liabilityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#64748B" style={{ fontSize: '10px' }} tickLine={false} />
                <YAxis stroke="#64748B" style={{ fontSize: '10px' }} tickFormatter={(val) => `₹${val / 100000}L`} tickLine={false} />
                <Tooltip
                  formatter={(value: any) => `₹${Number(value).toLocaleString('en-IN')}`}
                  contentStyle={{ backgroundColor: '#0B192C', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="Outstanding" name="Outstanding Balance" fill="#EF4444" radius={[6, 6, 0, 0]} />
                <Bar dataKey="EMI" name="Monthly EMI Amount" fill="#F59E0B" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Critical Security Task reminder */}
      <div id="dash-advisory-reminder" className="p-5 rounded-2xl bg-[#a91a1a] border border-red-500/20 flex items-start gap-4">
        <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-white text-sm font-bold">Unsecured Asset Warning</h4>
          <p className="text-slate-300 text-xs">
            We discovered high APR **AMEX Debt (36.0%)** outstanding at ₹2,50,000. Under our secure recovery protocol recommendation, you should optimize savings deposits to immediately extinguish this liability cluster before monthly compounding.
          </p>
        </div>
      </div>
    </div>
  );
}
