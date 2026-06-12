/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Shield, ChevronRight, Users, Key, FileLock, PieChart, Activity, AlertTriangle, ArrowRight, Lock, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div
      id="landing-container"
      className="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat"
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
      {/* Navbar overlay */}
      <header id="landing-header" className="sticky top-0 z-50 glass-panel border-b border-green-500/10 backdrop-blur-xl py-4 px-6 md:px-12 flex justify-between items-center">
        <div id="landing-logo" className="flex items-center gap-2">
          <div className="bg-brand-accent p-2 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-brand-dark" />
          </div>
          <span className="font-display font-bold text-xl tracking-wide bg-gradient-to-r from-white via-green-100 to-green-400 bg-clip-text text-transparent">FinGuardian</span>
        </div>
        <nav id="landing-nav" className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#features" className="hover:text-brand-accent transition-colors">Features</a>
          <a href="#stats" className="hover:text-brand-accent transition-colors">Legacy Crisis</a>
          <a href="#security" className="hover:text-brand-accent transition-colors font-mono flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-brand-accent" /> Secure Vault
          </a>
        </nav>
        <button
          id="landing-btn-top-cta"
          onClick={onGetStarted}
          className="bg-brand-accent hover:bg-emerald-400 text-brand-dark text-sm font-semibold py-2 px-5 rounded-lg flex items-center gap-1.5 transition-all duration-300"
        >
          Access Portal <ArrowRight className="w-4 h-4" />
        </button>
      </header>

      {/* Hero Section */}
      <section id="landing-hero" className="relative flex-1 flex flex-col items-center justify-center px-6 md:px-12 py-20 text-center overflow-hidden">
        {/* Glow Spheres */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-green-500/20 rounded-full blur-[150px] -z-10 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-green-500/10 rounded-full blur-[150px] -z-10" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-accent/10 border border-brand-accent/20 mb-6">
            <span className="w-2 h-2 rounded-full bg-brand-accent animate-ping" />
            <span className="text-xs font-semibold text-brand-accent tracking-wider uppercase font-mono">Next-Gen Legacy & Recovery Protocol</span>
          </div>

          <h1 className="font-display font-extrabold text-4xl sm:text-6xl md:text-7xl text-white tracking-tight leading-[1.1] mb-6">
            Protect Your <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-white via-green-100 to-green-400 bg-clip-text text-transparent">Financial Legacy</span>
          </h1>

          <p className="text-slate-300 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-sans">
            Secure your financial assets, document lockers, liabilities, and digital will. Set up fail-safe family nominees with intelligent 30-day emergency switchboards.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              id="landing-hero-cta-get"
              onClick={onGetStarted}
              className="w-full sm:w-auto bg-[#22C55E] hover:bg-[#4ADE80] text-brand-dark text-base font-bold py-3.5 px-8 rounded-xl shadow-lg shadow-brand-accent/20 flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer"
            >
              Get Started <ChevronRight className="w-5 h-5" />
            </button>
            <a
              id="landing-hero-cta-learn"
              href="#features"
              className="w-full sm:w-auto bg-black/40 hover:border-green-500/20 text-white text-base py-3.5 px-8 rounded-xl border border-white/10 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              Learn More
            </a>
          </div>
        </motion.div>
      </section>

      {/* Stats Section with ₹2.2 Lakh Crore Unclaimed Assets */}
      <section id="stats" className="py-16 bg-[#050505] border-y border-white/[0.05] relative px-6">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="max-w-lg">
            <div className="flex items-center gap-2 text-rose-500 font-semibold text-sm uppercase tracking-wider mb-2 font-mono">
              <AlertTriangle className="w-4 h-4" /> Systemic Wealth Crisis
            </div>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-white leading-tight">
              Why FinGuardian? The Silent Loss of Family Assets
            </h2>
            <p className="text-slate-400 mt-4 text-base leading-relaxed">
              Every year, thousands of bank accounts, mutual funds, insurance policies, and digital crypto keys are lost forever because family members do not know they exist, or lack access during emergencies.
            </p>
          </div>

          <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="glass-panel p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between border-rose-500/20">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl" />
              <div>
                <span className="text-slate-400 text-xs font-mono tracking-wider uppercase block mb-1">Unclaimed India Assets</span>
                <span className="text-4xl sm:text-5xl font-display font-extrabold text-rose-500 block tracking-tight">₹2.2 Lakh Cr</span>
              </div>
              <p className="text-slate-300 text-xs mt-4 leading-relaxed font-sans">
                unclaimed term insurance payouts, forgotten deposits, and frozen share baskets sitting idle with banks and regulators.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between border-brand-accent/20">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/5 rounded-full blur-2xl" />
              <div>
                <span className="text-slate-400 text-xs font-mono tracking-wider uppercase block mb-1">FinGuardian Safe Gap</span>
                <span className="text-4xl sm:text-5xl font-display font-extrabold text-brand-accent block tracking-tight">0% Gaps</span>
              </div>
              <p className="text-slate-300 text-xs mt-4 leading-relaxed font-sans">
                Our active dead-man switch automation guarantees zero lost asset pools to government, notifying beneficiaries securely.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section id="features" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-brand-accent text-sm font-semibold tracking-wider uppercase font-mono block mb-2">Platform Capabilities</span>
          <h2 className="font-display font-extrabold text-3xl md:text-5xl text-white">
            Comprehensive Asset Shield
          </h2>
          <p className="text-slate-400 mt-4 text-base">
            Everything your legacy planner needs. Seamless, secure, automated.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="glass-panel p-8 rounded-2xl bg-black/60 backdrop-blur-xl border border-green-500/10 relative group overflow-hidden transition-all duration-300 hover:border-brand-accent/30">
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-brand-accent/10 rounded-full blur-xl group-hover:scale-150 transition-all duration-500" />
            <div className="bg-green-500/10 p-4 rounded-xl inline-flex mb-6 text-brand-accent">
              <PieChart className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-xl text-white mb-3">Portfolio Cohesion</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Consolidate liquid accounts, mutual funds, gold metrics, property deeds, and startup equities in a centralized asset registry.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-panel p-8 rounded-2xl bg-black/60 backdrop-blur-xl border border-green-500/10 relative group overflow-hidden transition-all duration-300 hover:border-brand-accent/30">
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-brand-accent/10 rounded-full blur-xl group-hover:scale-150 transition-all duration-500" />
            <div className="bg-green-500/10 p-4 rounded-xl inline-flex mb-6 text-brand-accent">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-xl text-white mb-3">Nominee Assignee Center</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Map and split distinct assets directly to family members (Mother, Brother, Partner) with modular permission controls and relationship node visuals.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-panel p-8 rounded-2xl bg-black/60 backdrop-blur-xl border border-green-500/10 relative group overflow-hidden transition-all duration-300 hover:border-brand-accent/30">
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-brand-accent/10 rounded-full blur-xl group-hover:scale-150 transition-all duration-500" />
            <div className="bg-green-500/10 p-4 rounded-xl inline-flex mb-6 text-brand-accent">
              <FileLock className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-xl text-white mb-3">Secure Document Vault</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Encrypt Aadhaar, PAN, Digital Wills, and Insurance PDF sheets. Built-in OCR processes details for automatic family-recovery.
            </p>
          </div>

          {/* Card 4 */}
          <div className="glass-panel p-8 rounded-2xl bg-black/60 backdrop-blur-xl border border-green-500/10 relative group overflow-hidden transition-all duration-300 hover:border-brand-accent/30">
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-brand-accent/10 rounded-full blur-xl group-hover:scale-150 transition-all duration-500" />
            <div className="bg-green-500/10 p-4 rounded-xl inline-flex mb-6 text-brand-accent">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-xl text-white mb-3">Dead Man\'s Switch</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              A responsive inactivity protocol that triggers notification checks via email/SMS. If unresponsive, a secure transfer workflow begins.
            </p>
          </div>

          {/* Card 5 */}
          <div className="glass-panel p-8 rounded-2xl bg-black/60 backdrop-blur-xl border border-green-500/10 relative group overflow-hidden transition-all duration-300 hover:border-brand-accent/30">
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-brand-accent/10 rounded-full blur-xl group-hover:scale-150 transition-all duration-500" />
            <div className="bg-green-500/10 p-4 rounded-xl inline-flex mb-6 text-brand-accent">
              <Key className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-xl text-white mb-3">30-Day Cooldown</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Family members requesting emergency access must pass dual multi-factor checks, locked behind a mandatory security cooling window and logging protocol.
            </p>
          </div>

          {/* Card 6 */}
          <div className="glass-panel p-8 rounded-2xl bg-black/60 backdrop-blur-xl border border-green-500/10 relative group overflow-hidden transition-all duration-300 hover:border-brand-accent/30">
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-brand-accent/10 rounded-full blur-xl group-hover:scale-150 transition-all duration-500" />
            <div className="bg-green-500/10 p-4 rounded-xl inline-flex mb-6 text-brand-accent">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-xl text-white mb-3">AI Financial Insights</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Our secure server-side AI model audits your entire ledger, calculating liability coverage, insurance ratios, and your custom financial security index.
            </p>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-20 bg-[#050505] border-t border-white/[0.05]">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-brand-accent text-sm font-semibold tracking-wider uppercase font-mono block mb-2">Zero-Trust Security</span>
            <h2 className="font-display font-bold text-3xl md:text-5xl text-white leading-tight">
              Investor-Grade Privacy and Bank-Level Shielding
            </h2>
            <p className="text-slate-400 mt-6 leading-relaxed">
              FinGuardian compiles your sensitive asset matrices under cutting-edge zero-knowledge encryption patterns. Data transmitted is parsed only server-side under securely masked sandbox configurations.
            </p>
            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-brand-accent shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-medium">AES-256 Document Lockers</h4>
                  <p className="text-slate-400 text-sm">All identity and tax documents uploaded are isolated with individual key salts.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-brand-accent shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-medium">MFA Dual-Keys</h4>
                  <p className="text-slate-400 text-sm">Nominees cannot bypass emergency cooldown locks without cryptographically verified identity scans.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative p-8 glass-panel rounded-3xl border-brand-accent/20">
            <div className="absolute top-0 right-0 w-48 h-48 bg-brand-accent/5 rounded-full blur-3xl" />
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between border-b border-white/[0.05] pb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-brand-accent p-2 rounded-lg text-brand-dark">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-white font-semibold text-sm">Security Matrix Audit</span>
                    <span className="text-slate-400 text-xs block">FinGuardian v1.4.2</span>
                  </div>
                </div>
                <span className="bg-brand-accent/10 border border-brand-accent/30 text-brand-accent text-xs font-mono font-bold px-2.5 py-1 rounded">A+ RATED</span>
              </div>
              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>SSL & TLS Transport</span>
                  <span className="text-brand-accent">ACTIVE</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Server-Side Sandboxing</span>
                  <span className="text-brand-accent">ACTIVE</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Nominee Integrity Pin</span>
                  <span className="text-brand-accent">COMPLIANT</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Digital Notary Seal</span>
                  <span className="text-brand-accent">VERIFIED</span>
                </div>
              </div>
              <button
                id="landing-security-cta"
                onClick={onGetStarted}
                className="w-full bg-brand-accent hover:bg-emerald-400 text-brand-dark font-semibold py-3 rounded-xl transition-all duration-300 mt-4 text-sm"
              >
                Access Secure Gateway
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="landing-footer" className="mt-auto border-t border-white/[0.05] py-12 px-6 md:px-12 bg-black text-sm text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="bg-brand-accent p-1.5 rounded text-brand-dark">
              <Shield className="w-4 h-4" />
            </div>
            <span className="font-display font-medium text-white tracking-wide">FinGuardian</span>
          </div>
          <div className="flex gap-8 text-xs font-mono">
            <span>© 2026 FinGuardian Inc.</span>
            <a href="#features" className="hover:text-white transition-colors">Emergency Protocol</a>
            <a href="#security" className="hover:text-white transition-colors">Privacy Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
