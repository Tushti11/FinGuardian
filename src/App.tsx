/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  LayoutDashboard,
  Landmark,
  ReceiptText,
  FileText,
  Sparkles,
  Users,
  Activity,
  TrendingUp,
  LogOut,
  Menu,
  X,
  Lock,
  ChevronRight,
  Scale
} from 'lucide-react';
import LandingPage from './components/LandingPage';
import LoginSignup from './components/LoginSignup';
import Dashboard from './components/Dashboard';
import AssetManagement from './components/AssetManagement';
import LiabilityManagement from './components/LiabilityManagement';
import DocumentsVault from './components/DocumentsVault';
import AIChatbot from './components/AIChatbot';
import NomineeCenter from './components/NomineeCenter';
import EmergencyAccess from './components/EmergencyAccess';
import FinancialInsights from './components/FinancialInsights';
import AssetRebalancing from './components/AssetRebalancing';
import Profile from './components/Profile';


import {
  INITIAL_NOMINEES,
  INITIAL_ASSETS,
  INITIAL_LIABILITIES,
  INITIAL_DOCUMENTS,
  INITIAL_ACTION_LOGS
} from './data/mockData';
import { Asset, Liability, Nominee, Document, EmergencyActionLog } from './types';

export default function App() {
  const user = JSON.parse(
    localStorage.getItem("finguardianUser") || "{}"
  );
  // Global States
  const [currentPage, setCurrentPage] =
    useState<'landing' | 'auth' | 'profile' | 'app'>('landing');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Core Ledgers
  const [assets, setAssets] = useState<Asset[]>(INITIAL_ASSETS);
  const [liabilities, setLiabilities] = useState<Liability[]>(INITIAL_LIABILITIES);
  const [nominees, setNominees] = useState<Nominee[]>(() => {
    const savedNominees = localStorage.getItem('nominees');

    return savedNominees
      ? JSON.parse(savedNominees).map((n: any) => ({
        ...n,
        assignedAssetIds: n.assignedAssetIds || [],
      }))
      : [];
  });
  const [documents, setDocuments] = useState<Document[]>(() => {
    const savedDocs = localStorage.getItem('documents');
    return savedDocs ? JSON.parse(savedDocs) : [];
  });
  const [logs, setLogs] = useState<EmergencyActionLog[]>(INITIAL_ACTION_LOGS);

  useEffect(() => {
    localStorage.setItem('nominees', JSON.stringify(nominees));
  }, [nominees]);

  useEffect(() => {
    localStorage.setItem(
      'documents',
      JSON.stringify(documents)
    );
  }, [documents]);

  // Handlers for interactive mutations
  const handleAddAsset = (newAsset: Omit<Asset, 'id'>) => {
    const id = `asset_${Date.now()}`;
    setAssets((prev) => [...prev, { ...newAsset, id }]);
    handleAddLog(`Registered ${newAsset.category}: "${newAsset.name}" valued at ₹${newAsset.value.toLocaleString('en-IN')}.`, 'info');
  };

  const handleDeleteAsset = (id: string) => {
    const asset = assets.find((a) => a.id === id);
    if (!asset) return;
    setAssets((prev) => prev.filter((a) => a.id !== id));
    handleAddLog(`Removed ${asset.category}: "${asset.name}" from active ledger.`, 'alert');
  };

  const handleAddLiability = (newL: Omit<Liability, 'id'>) => {
    const id = `liability_${Date.now()}`;
    setLiabilities((prev) => [...prev, { ...newL, id }]);
    handleAddLog(`Registered outstanding ${newL.category}: "${newL.name}" totaling ₹${newL.outstandingAmount.toLocaleString('en-IN')}.`, 'info');
  };

  const handleDeleteLiability = (id: string) => {
    const l = liabilities.find((item) => item.id === id);
    if (!l) return;
    setLiabilities((prev) => prev.filter((item) => item.id !== id));
    handleAddLog(`Settled ${l.category}: "${l.name}" liability portfolio.`, 'success');
  };

  const handleAddDocument = (newDoc: Document) => {
    // If scanning finished, replace document, else add
    setDocuments((prev) => {
      const exists = prev.some((d) => d.id === newDoc.id);
      if (exists) {
        return prev.map((d) => (d.id === newDoc.id ? newDoc : d));
      }
      return [...prev, newDoc];
    });

    if (newDoc.ocrStatus === 'completed') {
      handleAddLog(`OCR read completed for "${newDoc.name}". AI summaries synced.`, 'success');
    } else {
      handleAddLog(`Document "${newDoc.name}" uploaded to secure vaults. Access flags: ENCRYPTED.`, 'info');
    }
  };

  const handleDeleteDocument = (id: string) => {
    const doc = documents.find((d) => d.id === id);
    if (!doc) return;
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    handleAddLog(`Document "${doc.name}" permanently shredded from digital vaults.`, 'alert');
  };

  const handleAddNominee = (newNominee: Nominee) => {
    setNominees((prev) => [...prev, newNominee]);
    handleAddLog(`Nomined "${newNominee.name}" (${newNominee.relationship}) added to recovery tree.`, 'info');
  };

  const handleToggleNomineePermission = (id: string) => {
    setNominees((prev) =>
      prev.map((n) => {
        if (n.id === id) {
          const nextVal = !n.accessPermission;
          handleAddLog(
            `Emergency verification credentials for "${n.name}" ${nextVal ? 'GRANTED' : 'REVOKED'}.`,
            nextVal ? 'success' : 'alert'
          );
          return { ...n, accessPermission: nextVal };
        }
        return n;
      })
    );
  };

  const handleAddLog = (actionText: string, status: 'alert' | 'info' | 'success') => {
    const newLog: EmergencyActionLog = {
      id: `log_${Date.now()}`,
      action: actionText,
      dateTime: new Date().toISOString().replace('T', ' ').split('.')[0],
      ipAddress: '103.44.112.98',
      status,
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  const handleRecalibrateAssets = (updatedAssets: Asset[]) => {
    setAssets(updatedAssets);
    handleAddLog(`COMPLETED: Mapped asset categories recalibrated with live rebalancer.`, 'success');
  };

  // Navigations mapping
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            assets={assets}
            liabilities={liabilities}
            nominees={nominees}
            documents={documents}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        );
      case 'rebalance':
        return (
          <AssetRebalancing
            assets={assets}
            onRecalibrateAssets={handleRecalibrateAssets}
          />
        );
      case 'assets':
        return (
          <AssetManagement
            assets={assets}
            nominees={nominees}
            onAddAsset={handleAddAsset}
            onDeleteAsset={handleDeleteAsset}
          />
        );
      case 'liabilities':
        return (
          <LiabilityManagement
            liabilities={liabilities}
            onAddLiability={handleAddLiability}
            onDeleteLiability={handleDeleteLiability}
          />
        );
      case 'documents':
        return (
          <DocumentsVault
            documents={documents}
            onAddDocument={handleAddDocument}
            onDeleteDocument={handleDeleteDocument}
          />
        );
      case 'assistant':
        return (
          <AIChatbot
            assets={assets}
            liabilities={liabilities}
            nominees={nominees}
            documents={documents}
          />
        );
      case 'nominees':
        return (
          <NomineeCenter
            nominees={nominees}
            assets={assets}
            onTogglePermission={handleToggleNomineePermission}
            onAddNominee={handleAddNominee}
          />
        );
      case 'emergency':
        return (
          <EmergencyAccess
            logs={logs}
            onAddLog={handleAddLog}
          />
        );
      case 'insights':
        return (
          <FinancialInsights
            assets={assets}
            liabilities={liabilities}
          />
        );
      case 'profile':
        return (
          <Profile onLogout={() => setCurrentPage('landing')} />
        );
      default:
        return <Dashboard assets={assets} liabilities={liabilities} nominees={nominees} documents={documents} onNavigate={setActiveTab} />;
    }
  };

  // Auth/View triggers
  if (currentPage === 'landing') {
    return <LandingPage onGetStarted={() => setCurrentPage('auth')} />;
  }

  if (currentPage === 'auth') {
    return (
      <LoginSignup
        onLoginSuccess={() => setCurrentPage('profile')}
      />
    );
  }

  const NAV_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'assets', label: 'Assets', icon: Landmark },
    { id: 'liabilities', label: 'Liabilities', icon: ReceiptText },
    { id: 'documents', label: 'Vault Locker', icon: FileText },
    { id: 'nominees', label: 'Nominee Center', icon: Users },
    { id: 'insights', label: 'Financial Insights', icon: TrendingUp },
    { id: 'rebalance', label: 'Smart Rebalancer', icon: Scale, badge: 'NEW' },
    { id: 'assistant', label: 'AI Guardian', icon: Sparkles, badge: 'GENAI' },
    { id: 'emergency', label: 'Emergency Center', icon: Activity },
    { id: 'profile', label: 'Profile', icon: Users },
  ];

  return (
    <div className="flex min-h-screen w-full bg-[#050505] text-white overflow-hidden m-0 p-0">

      {/* Sidebar Rail (Desktop) */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#080808] text-white border-r border-[#1B1B1B] min-h-full shrink-0">
        {/* Sidebar Brand header */}
        <div className="p-6 border-b border-[#1B1B1B] flex items-center gap-2">
          <div className="bg-brand-accent p-2 rounded-xl text-brand-dark flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-brand-dark" />
          </div>
          <span className="font-display font-extrabold text-lg text-white tracking-wide">FinGuardian</span>
        </div>

        {/* Navigation tabs */}
        <nav className="flex-grow p-4 space-y-1.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-sans text-xs font-semibold cursor-pointer ${isActive
                  ? 'bg-[#111111] text-brand-accent border border-[#22C55E]/20 shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-[#111111] border border-transparent'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-brand-accent' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="bg-brand-accent/15 text-brand-accent text-[9px] font-mono px-1.5 py-0.5 rounded font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer Profiles */}
        <div className="p-4 border-t border-[#1B1B1B] gap-4 flex flex-col">
          <div className="flex items-center gap-3 bg-[#0D0D0D] p-2.5 rounded-xl border border-slate-800">
            <div className="bg-brand-accent/10 p-2 rounded-lg text-brand-accent text-[10px] font-mono font-bold">
              AS
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-semibold text-white">
                {user.fullName || "User"}
              </h4>

              <p className="text-xs text-slate-400">
                {user.email || "user@gmail.com"}
              </p>
            </div>
          </div>
          <button
            onClick={() => setCurrentPage('landing')}
            className="w-full bg-[#0D0D0D] hover:bg-rose-600 hover:text-white border border-slate-850 text-slate-300 font-medium py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" /> Close Portal
          </button>
        </div>
      </aside>

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Navbar overlay */}
        <header className="lg:hidden bg-[#080808] text-white border-b border-slate-800 px-6 py-4 flex justify-between items-center z-10 shrink-0">
          <div className="flex items-center gap-2">
            <div className="bg-brand-accent p-1.5 rounded-lg text-brand-dark">
              <ShieldCheck className="w-4 h-4 text-brand-dark" />
            </div>
            <span className="font-display font-bold text-base tracking-wide text-white">FinGuardian</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="bg-white/5 p-2 rounded-lg text-slate-350 hover:text-white"
              title="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </header>

        {/* Content Wrapper */}
        <main className="flex-grow overflow-y-auto p-8 md:p-12 lg:p-14 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.08),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(34,197,94,0.05),transparent_35%)]">
          {renderTabContent()}
        </main>
      </div>

      {/* Mobile Drawer Navigation overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-[#050505]/95 backdrop-blur-md pt-20 px-6 flex flex-col justify-between pb-8">
          <div className="space-y-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-5 py-3.5 rounded-xl transition-all font-sans text-sm font-semibold cursor-pointer ${isActive
                    ? 'bg-brand-accent/10 border border-brand-accent/25 text-brand-accent'
                    : 'text-slate-405 hover:bg-white/5 text-white'
                    }`}
                >
                  <div className="flex items-center gap-3.5">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-brand-accent' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-brand-accent/15 text-brand-accent text-[9px] font-mono px-1.5 py-0.5 rounded font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 bg-brand-dark/30 p-3.5 rounded-xl border border-white/5">
              <div className="bg-brand-accent/10 p-2 rounded-lg text-brand-accent text-xs font-mono font-bold">
                AS
              </div>
              <div className="min-w-0">
                <span className="text-white text-xs font-bold block truncate">Aditya Sharma</span>
                <span className="text-slate-455 text-[10px] block truncate font-mono">tushtigupta2006@gmail.com</span>
              </div>
            </div>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setCurrentPage('landing');
              }}
              className="w-full bg-[#EF4444]/15 border border-EF4444/20 text-[#EF4444] font-semibold py-3.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" /> Close Portal Session
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
