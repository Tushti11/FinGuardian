/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Landmark, Plus, ArrowUpRight, Coins, Calendar, Trash2, Edit2, Check, UserCheck, ShieldCheck } from 'lucide-react';
import { Asset, AssetType, Nominee } from '../types';

interface AssetManagementProps {
  assets: Asset[];
  nominees: Nominee[];
  onAddAsset: (asset: Omit<Asset, 'id'>) => void;
  onDeleteAsset: (id: string) => void;
}

export default function AssetManagement({ assets, nominees, onAddAsset, onDeleteAsset }: AssetManagementProps) {
  const [activeTab, setActiveTab] = useState<AssetType>('liquid');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [category, setCategory] = useState('Bank Account');
  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const [nomineeName, setNomineeName] = useState(nominees[0]?.name || 'Savitri Devi');

  const filteredAssets = assets.filter((a) => a.type === activeTab);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !value) return;

    onAddAsset({
      type: activeTab,
      category,
      name,
      value: Number(value),
      nomineeName,
      lastUpdated: new Date().toISOString().split('T')[0],
    });

    // Reset Form
    setName('');
    setValue('');
    setShowAddModal(false);
  };

  // Categories based on active Tab
  const categories = activeTab === 'liquid' 
    ? ['Bank Account', 'Mutual Funds', 'Stocks', 'Fixed Deposits', 'Crypto'] 
    : ['Property', 'Land', 'Gold', 'Vehicles', 'Businesses', 'Bank Locker'];

  // Handle Tab switch
  const handleTabChange = (tab: AssetType) => {
    setActiveTab(tab);
    setCategory(tab === 'liquid' ? 'Bank Account' : 'Property');
  };

  return (
    <div id="asset-root" className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-display font-bold text-2xl text-white">Central Assets Register</h2>
          <p className="text-slate-400 text-sm">Organize and map nominees across both liquid and non-liquid estate instruments.</p>
        </div>
        <button
          id="btn-add-asset-trigger"
          onClick={() => setShowAddModal(true)}
          className="bg-brand-accent hover:bg-emerald-400 text-brand-dark font-bold text-sm px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <Plus className="w-4.5 h-4.5 stroke-[2.5]" /> Register Asset
        </button>
      </div>

      {/* Tab Selectors */}
      <div className="flex border-b border-white/10">
        <button
          onClick={() => handleTabChange('liquid')}
          className={`pb-3.5 px-6 font-display font-semibold text-sm relative transition-colors cursor-pointer ${
            activeTab === 'liquid' ? 'text-brand-accent' : 'text-slate-400 hover:text-white'
          }`}
        >
          ⚡ Liquid Assets
          {activeTab === 'liquid' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-accent" />
          )}
        </button>
        <button
          onClick={() => handleTabChange('non-liquid')}
          className={`pb-3.5 px-6 font-display font-semibold text-sm relative transition-colors cursor-pointer ${
            activeTab === 'non-liquid' ? 'text-brand-accent' : 'text-slate-400 hover:text-white'
          }`}
        >
          🏔️ Non-Liquid Assets
          {activeTab === 'non-liquid' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-accent" />
          )}
        </button>
      </div>

      {/* Grid of Assets */}
      {filteredAssets.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-2xl">
          <Coins className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <h3 className="text-white font-semibold text-lg">No Assets Registered</h3>
          <p className="text-slate-400 text-sm mt-1 max-w-sm mx-auto">There are no {activeTab} assets tracked in this security folder. Tap Register Asset to log one.</p>
        </div>
      ) : (
        <div id="assets-grid-display" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssets.map((asset) => (
            <div
              key={asset.id}
              className="glass-panel glass-panel-hover p-6 rounded-2xl flex flex-col justify-between relative"
            >
              <div className="flex justify-between items-start gap-2">
                <span className="bg-slate-800 text-slate-300 text-xs font-mono font-bold px-2 py-1 rounded">
                  {asset.category}
                </span>
                <button
                  onClick={() => onDeleteAsset(asset.id)}
                  className="text-slate-500 hover:text-rose-400 p-1 rounded-lg transition-colors cursor-pointer"
                  title="Remove Asset"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="my-5">
                <h4 className="text-white font-bold text-base line-clamp-1">{asset.name}</h4>
                <p className="text-2xl font-display font-black text-brand-accent mt-1.5">
                  ₹{asset.value.toLocaleString('en-IN')}
                </p>
              </div>

              <div className="border-t border-white/[0.05] pt-4 mt-auto flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-450 font-mono">NOMINEE DESIGNATED</span>
                  <span className="text-white font-semibold flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-brand-accent" /> {asset.nomineeName}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-550">
                  <span className="font-mono">LAST SYNCHRONIZED</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {asset.lastUpdated}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Asset Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-[#060c16]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel bg-[#0B192C] w-full max-w-md p-8 rounded-3xl border border-white/10 relative">
            <h3 className="font-display font-bold text-xl text-white mb-6">Register {activeTab === 'liquid' ? 'Liquid' : 'Non-Liquid'} Asset</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-mono uppercase font-semibold">Instrument Category</label>
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
                <label className="text-xs text-slate-400 font-mono uppercase font-semibold">Asset Name / Custodian</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. ICICI Savings (***1234), Zerodha, Safe Lockers"
                  className="w-full glass-input p-3 rounded-xl text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-mono uppercase font-semibold">Est. Valuation (INR ₹)</label>
                <input
                  type="number"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="e.g. 500000"
                  className="w-full glass-input p-3 rounded-xl text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-mono uppercase font-semibold">Designated Family Nominee</label>
                <select
                  value={nomineeName}
                  onChange={(e) => setNomineeName(e.target.value)}
                  className="w-full glass-input p-3 rounded-xl text-xs"
                >
                  {nominees.map((nom) => (
                    <option key={nom.id} value={nom.name}>{nom.name} ({nom.relationship})</option>
                  ))}
                  <option value="None">None (Hold Legacy)</option>
                </select>
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
                  Confirm Registry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
