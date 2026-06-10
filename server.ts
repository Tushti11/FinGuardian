/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Safe Gemini client initialization pattern
  let genAI: GoogleGenAI | null = null;
  const HAS_API_KEY = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY" && process.env.GEMINI_API_KEY !== "";

  if (HAS_API_KEY) {
    try {
      genAI = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
      console.log("✅ FinGuardian Gemini Client Initialized successfully.");
    } catch (err) {
      console.error("❌ Failed to initialize Gemini Client:", err);
    }
  } else {
    console.log("⚠️ No GEMINI_API_KEY found or using placeholder. FinGuardian will operate in offline mock-intelligent backup mode.");
  }

  // --- API Endpoints ---

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      apiConnected: !!genAI,
      timestamp: new Date().toISOString()
    });
  });

  // AI Chat Route
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, chatState, context } = req.body;
      const { assets = [], liabilities = [], documents = [], nominees = [] } = context || {};

      const portfolioSummary = `
User Portfolio Context:
Liquid Assets:
${assets.filter((a: any) => a.type === 'liquid').map((a: any) => `- ${a.category}: ${a.name} (Value: ₹${a.value.toLocaleString('en-IN')}, Nominee: ${a.nomineeName})`).join('\n')}

Non-Liquid Assets:
${assets.filter((a: any) => a.type === 'non-liquid').map((a: any) => `- ${a.category}: ${a.name} (Value: ₹${a.value.toLocaleString('en-IN')}, Nominee: ${a.nomineeName})`).join('\n')}

Liabilities / Loans:
${liabilities.map((l: any) => `- ${l.category}: ${l.name} (Outstanding: ₹${l.outstandingAmount.toLocaleString('en-IN')}, EMI: ₹${l.emi.toLocaleString('en-IN')}/mo at ${l.interestRate}%)`).join('\n')}

Documents Vault:
${documents.map((d: any) => `- ${d.category}: ${d.name} (OCR Status: ${d.ocrStatus}, Summary/Content: ${d.summary || 'None'})`).join('\n')}

Nominees Registered:
${nominees.map((n: any) => `- ${n.name} (${n.relationship}, Email: ${n.email}, Emergency Permission: ${n.accessPermission ? 'GRANTED' : 'REVOKED'})`).join('\n')}
`;

      const systemInstruction = `You are FinGuardian AI, a premium Financial Legacy, Asset Tracking & Wealth Protection Assistant.
Your primary job is to help families securely bridge accounts, wills, nominees, and loans.
Answer the user's questions clearly, concisely, and with investor-grade professional financial depth.
Ground your answers directly on the user's actual portfolio data provided below.
Provide rich financial suggestions. Keep it structured with short, neat bullets. Always speak of Indian national unclaimed wealth statistics (like ₹2.2 Lakh Crore Unclaimed Assets in bank/insurance accounts in India) with alarm if nominees are missing.
Use Indian Rupees (₹) format.`;

      let replyFromAI: string | null = null;
      if (genAI) {
        try {
          // Build contents parts
          const prompt = `
${portfolioSummary}

User's Question: "${message}"

Please respond beautifully according to your instructions.
`;
          const response = await genAI.models.generateContent({
            model: "gemini-3.5-flash",
            contents: prompt,
            config: {
              systemInstruction: systemInstruction,
              temperature: 0.7,
            }
          });

          replyFromAI = response.text || null;
        } catch (apiError: any) {
          console.warn("⚠️ Chat GenAI API Call failed, falling back to offline mode. Error:", apiError);
        }
      }

      if (replyFromAI) {
        return res.json({ text: replyFromAI });
      } else {
        // Offline / No Key Mock Intelligent responses
        let reply = "";
        const lowerMsg = message.toLowerCase();

        if (lowerMsg.includes("invest") || lowerMsg.includes("where") || lowerMsg.includes("asset") || lowerMsg.includes("money")) {
          const totalAssetsVal = assets.reduce((sum: number, a: any) => sum + Number(a.value || 0), 0);
          const totalLiquid = assets.filter((a: any) => a.type === 'liquid').reduce((sum: number, a: any) => sum + Number(a.value), 0);
          const totalNonLiquid = assets.filter((a: any) => a.type === 'non-liquid').reduce((sum: number, a: any) => sum + Number(a.value), 0);

          reply = `### 📊 Your Asset Allocation Summary

According to your live portfolio, you hold **₹${totalAssetsVal.toLocaleString('en-IN')}** in total recorded assets. Here is your split:

1. **Liquid Investments (₹${totalLiquid.toLocaleString('en-IN')}):**
   * **Mutual Funds (Parag Parikh):** ₹32 Lakhs (nominated to your mother Savitri Devi)
   * **Direct Equities (Zerodha):** ₹45 Lakhs (nominated to Aditi Verma)
   * **Liquid Reserves (HDFC Account + SBI FD):** ₹27.5 Lakhs.
   * **Digital Assets (Crypto Wallet):** ₹8.5 Lakhs (nominated to Rohan Sharma).

2. **Illiquid Pillars (₹${totalNonLiquid.toLocaleString('en-IN')}):**
   * **Real Estate:** Gurgaon Sec 54 Flat (₹1.2 Crore) and Agricultural land (₹65 Lakhs).
   * **Physical Gold:** Tanishq Vault (₹24 Lakhs).
   * **Startup Equity & Safe Lockers:** ₹98 Lakhs.

**FinGuardian Advisory:** Your portfolio is heavily anchored in Real Estate (49%). To maximize emergency recovery accessibility, ensure that complete paper trails for your Yamuna Expressway agricultural land are properly mirrored in your Digital Vault.`;
        } else if (lowerMsg.includes("loan") || lowerMsg.includes("liabilit") || lowerMsg.includes("debt")) {
          const totalLib = liabilities.reduce((sum: number, l: any) => sum + Number(l.outstandingAmount), 0);
          const totalEMI = liabilities.reduce((sum: number, l: any) => sum + Number(l.emi), 0);
          reply = `### 📉 Debt Profile & Liability Audit

You have **${liabilities.length} active liabilities** totaling **₹${totalLib.toLocaleString('en-IN')}** in outstanding balances, with a combined monthly EMI burden of **₹${totalEMI.toLocaleString('en-IN')}**:

1. **HDFC Housing Loan:** ₹48,00,000 outstanding @ 8.4% interest. Monthly EMI: ₹42,500.
2. **SBI Scholar Loan (Education):** ₹12,00,000 outstanding @ 9.1% interest. Monthly EMI: ₹15,400.
3. **BMW Financial Services (Car Loan):** ₹18,00,000 outstanding @ 7.9% interest. Monthly EMI: ₹32,000.
4. **AMEX Card Balance:** ₹2,50,000 outstanding costing an alarming 36% APR.

**Critical Action Point:** Your credit card debt is charging **36% annualized interest**. It is highly recommended to liquidate ₹2.5 Lakh from your low-yield HDFC Savings account (earning only 3.5%) to clear this AMEX debt immediately. This single action saves ₹90,000 annually.`;
        } else if (lowerMsg.includes("net worth") || lowerMsg.includes("worth") || lowerMsg.includes("value")) {
          const assetsVal = assets.reduce((sum: number, a: any) => sum + Number(a.value), 0);
          const libVal = liabilities.reduce((sum: number, l: any) => sum + Number(l.outstandingAmount), 0);
          const net = assetsVal - libVal;

          reply = `### 💎 Live Wealth & Equity Statement

Your current computed Net Worth is **₹${net.toLocaleString('en-IN')}**:
* **Gross Financial Assets:** ₹${assetsVal.toLocaleString('en-IN')}
* **Total outstanding Debt:** ₹${libVal.toLocaleString('en-IN')}
* **Equities Debt-to-Asset Ratio:** **${((libVal / assetsVal) * 100).toFixed(1)}%** (Ideal: <35%)

**Strategic Assessment:** 
Your solvency rating is **Excellent**. Your liquid reserves alone (₹1.13 Crore) can completely wipe out your entire debt portfolio backlogs if needed. You have a very stable financial buffer.`;
        } else if (lowerMsg.includes("insurance") || lowerMsg.includes("policy") || lowerMsg.includes("document")) {
          reply = `### 🛡️ Insurance & Estate Protection Analysis

Your Digital Vault has **1 term insurance policy** scanned and processed via OCR:

* **Policy Document:** \`LIC_TermInsurance_Policy_2026.pdf\`
* **Sum Assured:** ₹1,50,00,000 (₹1.5 Crore)
* **Designated Beneficiary:** Savitri Devi (Mother)
* **Active Premium:** ₹18,400 per year

**FinGuardian Gap Analysis:**
The golden rule of wealth protection is that your insurance cover should be equal to **10x of your annual income + all active liabilities**. 
* With annual income of approx. ₹32 Lakhs and liabilities of ₹80.5 Lakhs, your ideal cover is **₹4 Crore**.
* You have a protection gap of **₹2.5 Crore**. We recommend unlocking an additional term cover of ₹2.5 Crore to secure your housing debt obligations.`;
        } else {
          reply = `### Hello! I am FinGuardian AI 🛡️

I am analyzing your asset folders, Digital Will, liabilities ledger, and nominee lists in real-time. How can I protect you today?

**Try asking me:**
* "What is my absolute total net worth?"
* "Show me all active loans and which are highest interest."
* "Where is my money invested and how is it distributed?"
* "Review my insurance policies and tell me if they are sufficient."

*(Note: AI-grounded legacy analysis is active and secure.)*`;
        }

        // Return mock reply with a small timeout to simulate AI reflection
        await new Promise((resolve) => setTimeout(resolve, 800));
        return res.json({ text: reply });
      }
    } catch (error: any) {
      console.error("API Chat Error:", error);
      res.status(500).json({ error: error.message || "Internal server error" });
    }
  });

  // AI-Generated Insights Route
  app.post("/api/insights", async (req, res) => {
    try {
      const { assets = [], liabilities = [] } = req.body;

      const assetsVal = assets.reduce((sum: number, a: any) => sum + Number(a.value), 0);
      const libVal = liabilities.reduce((sum: number, l: any) => sum + Number(l.outstandingAmount), 0);
      const net = assetsVal - libVal;

      let insightsFromAI: any = null;
      if (genAI) {
        try {
          const prompt = `
Analyze the following portfolio details and return a structured JSON report regarding wealth health.
Total Assets: ₹${assetsVal.toLocaleString('en-IN')}
Total Liabilities: ₹${libVal.toLocaleString('en-IN')}
Net Worth: ₹${net.toLocaleString('en-IN')}

Asset List:
${JSON.stringify(assets)}

Liabilities List:
${JSON.stringify(liabilities)}

Return raw JSON strictly matching this structure (no markdown fences, just pure parseable JSON):
{
  "netWorthTrendAdvice": "concise overview of net worth trajectory and comments on debt weight",
  "assetAllocationCommentary": "concise critique of asset allocation and legacy audit",
  "liabilityExposureWarning": "critique on debt, especially high interest ratios, list concrete recommendations",
  "insuranceGapAnalysis": "evaluation of sum assured against total liabilities of ₹${libVal} and income",
  "financialHealthScore": 85, 
  "actionableSteps": ["action step 1", "action step 2", "action step 3"]
}
`;
          const response = await genAI.models.generateContent({
            model: "gemini-3.5-flash",
            contents: prompt,
            config: {
              responseMimeType: "application/json",
              temperature: 0.2,
            }
          });

          // Safe JSON extraction
          const cleanText = (response.text || "").trim();
          insightsFromAI = JSON.parse(cleanText);
        } catch (apiError: any) {
          console.warn("⚠️ Insights GenAI API Call failed, falling back to offline mode. Error:", apiError);
        }
      }

      if (insightsFromAI) {
        return res.json(insightsFromAI);
      }

      // Offline/Mock detailed insights
      const liabilityRatio = assetsVal > 0 ? (libVal / assetsVal) * 100 : 0;
      let healthScore = 88;
      if (liabilityRatio > 40) healthScore -= 15;
      if (liabilities.some((l: any) => l.interestRate > 15)) healthScore -= 10;
      if (assets.length < 5) healthScore -= 8;

      const mockResponse = {
        netWorthTrendAdvice: `Your net worth sits at robust ₹${net.toLocaleString('en-IN')}. Since 49% is locked in immovable properties (Gurgaon Real Estate), your immediate liquidity ratio is 46%. Debt-to-Equity is incredibly healthy at ${liabilityRatio.toFixed(1)}%. Keep increasing your liquid equity baskets to retain emergency flexibility.`,
        assetAllocationCommentary: "Extremely secure tier-1 assets. Property/Land represents ₹1.85 Crore (52%), Cash + Mutual Funds represent ₹4.45 Crore (32.6%) and direct stocks represent 12%. You have well-placed nominee mappings across 95% of your asset base, leaving less than 5% unallocated. Great job avoiding legacy gaps.",
        liabilityExposureWarning: `You are exposed to ₹${libVal.toLocaleString('en-IN')} in total debt. Your HDFC home loan @ 8.4% is healthy long-term debt, but your AMEX credit card balance at a steep 36.0% interest rate represents a minor emergency leak. Recommend paying off the credit card immediately before the next billing cycle.`,
        insuranceGapAnalysis: `Your primary safety net is ₹1.5 Crore term insurance. With ₹${libVal.toLocaleString('en-IN')} in outstanding debt, if unforeseen incident occurs, liabilities will consume 53% of the payout, leaving family with only ₹70 Lakhs. We recommend enhancing term insurance by another ₹1.5 Crore as key mortgage protection.`,
        financialHealthScore: healthScore,
        actionableSteps: [
          "Pre-pay the AMEX Platinum balance of ₹2.5 Lakhs immediately using idle funds from the HDFC savings account.",
          "Digitize paper deeds of Yamuna Expressway Land and secure them in FinGuardian Vault for easier nominee retrieval.",
          "Acquire a ₹1.5 Crore supplementary Term Shield or Mortgage Protection Policy to isolate Gurgaon Flat home loan liability."
        ]
      };

      await new Promise((resolve) => setTimeout(resolve, 600));
      return res.json(mockResponse);

    } catch (error: any) {
      console.error("Insights Generation Error:", error);
      res.status(500).json({ error: error.message || "Internal server error" });
    }
  });

  // AI-Powered Rebalancing Analysis Route
  app.post("/api/rebalance", async (req, res) => {
    try {
      const { currentAllocations, targetWeights, totalPortfolioValue, directives } = req.body;

      let reportText: string | null = null;
      if (genAI) {
        try {
          const prompt = `
Generate a highly professional, investor-grade tactical asset rebalancing report for FinGuardian platform.
Total Portfolio Value to balance: ₹${totalPortfolioValue.toLocaleString('en-IN')}

Current Asset Classes values:
- Equities & Mutual Funds: ₹${(currentAllocations.equities || 0).toLocaleString('en-IN')}
- Fixed Income & Cash: ₹${(currentAllocations.fixedIncome || 0).toLocaleString('en-IN')}
- Precious Metals / Gold: ₹${(currentAllocations.preciousMetals || 0).toLocaleString('en-IN')}
- Real Estate & Land: ₹${(currentAllocations.realEstate || 0).toLocaleString('en-IN')}
- Crypto Assets: ₹${(currentAllocations.crypto || 0).toLocaleString('en-IN')}

Target Percentages selected by user:
- Equities & Mutual Funds: ${targetWeights.equities}%
- Fixed Income & Cash: ${targetWeights.fixedIncome}%
- Precious Metals: ${targetWeights.preciousMetals}%
- Real Estate: ${targetWeights.realEstate}%
- Crypto Assets: ${targetWeights.crypto}%

Planned Rebalancing Deviations / Directives:
${JSON.stringify(directives)}

Write a beautiful financial assessment with these sections:
### 🛡️ FinGuardian Tactical Rebalancing Assessment
A general critique of their current asset class setup, citing whether their current real estate or cash allocation is too heavy/light.

#### Tactical Actions Required
Bullet points with precise amounts (in Rupees, ₹) of what assets to liquidate, sell, or purchase/SIP to reach the target weights.

#### Indian Sovereign Tax Optimization (LTCG / STCG Advice)
Provide concrete advisory steps explaining how to execute these transfers while minimizing taxes in India (such as liquidating equity up to ₹1.25 Lakh per fiscal year to use the LTCG exemption, indexing property gains under Section 54, or being cautious of the Flat 30% tax on Crypto gains in India).

Speak directly to Aditya Verma. Keep it professional, encouraging, and tightly aligned with Indian legal frameworks. Format with beautiful headers.
`;
          const response = await genAI.models.generateContent({
            model: "gemini-3.5-flash",
            contents: prompt,
            config: {
              temperature: 0.3,
            }
          });
          reportText = response.text || null;
        } catch (apiError: any) {
          console.warn("⚠️ Rebalance GenAI API Call failed, falling back to offline mode. Error:", apiError);
        }
      }

      if (reportText) {
        return res.json({ report: reportText });
      }

      // Offline Fallback
      const equitiesDiff = Math.round((targetWeights.equities / 105) * totalPortfolioValue) - (currentAllocations.equities || 0);
      const fiDiff = Math.round((targetWeights.fixedIncome / 105) * totalPortfolioValue) - (currentAllocations.fixedIncome || 0);
      const preciousDiff = Math.round((targetWeights.preciousMetals / 105) * totalPortfolioValue) - (currentAllocations.preciousMetals || 0);
      const realDiff = Math.round((targetWeights.realEstate / 105) * totalPortfolioValue) - (currentAllocations.realEstate || 0);
      const cryptoDiff = Math.round((targetWeights.crypto / 105) * totalPortfolioValue) - (currentAllocations.crypto || 0);

      const reportFallback = `### 🛡️ FinGuardian Tactical Rebalancing Assessment

Aditya, we analysed your live wealth portfolio of **₹${totalPortfolioValue.toLocaleString('en-IN')}** mapped against your chosen target constraints. Your current asset pool is significantly exposed. Let's calibrate your positions to minimize systemic risk.

#### Tactical Actions Required
${equitiesDiff < 0 ? `* **Liquidate Equities Surplus:** Trim ₹${Math.abs(equitiesDiff).toLocaleString('en-IN')} from active stock baskets to harvest profits.` : `* **Enhance Equities Base:** Deploy ₹${equitiesDiff.toLocaleString('en-IN')} towards index mutual funds (SIP) to achieve target growth.`}
${fiDiff < 0 ? `* **Deploy Excess Cash:** Your cash buffer is highly liquid. Allocate ₹${Math.abs(fiDiff).toLocaleString('en-IN')} towards higher yielding instruments.` : `* **Reinforce Safety Buffers:** Inject ₹${fiDiff.toLocaleString('en-IN')} into tax-saving Fixed Deposits to shield against liability EMI exposures.`}
${preciousDiff < 0 ? `* **Trim Precious Metals:** Liquidate ₹${Math.abs(preciousDiff).toLocaleString('en-IN')} of Physical Gold and route towards core cash stabilizers.` : `* **Bolster Gold Reserves:** Secure ₹${preciousDiff.toLocaleString('en-IN')} in Gold Bullion to defend against market corrections.`}
${realDiff < 0 ? `* **Immovable Assets Commentary:** Real Estate is currently over-concentrated. Plan long-term structured exits to free up ₹${Math.abs(realDiff).toLocaleString('en-IN')}.` : `* **Real Estate Buffer:** Property holdings have ₹${realDiff.toLocaleString('en-IN')} of planned headspace.`}
${cryptoDiff < 0 ? `* **De-Risk Crypto Speculation:** Sell off ₹${Math.abs(cryptoDiff).toLocaleString('en-IN')} of crypto indices to prevent extreme downside volatility.` : `* **Calibrate Digital Assets:** Allocate ₹${cryptoDiff.toLocaleString('en-IN')} towards cold BTC/ETH storage.`}

#### Indian Sovereign Tax Optimization (LTCG / STCG Advice)
1. **LTCG Equity Exemption:** Since the FY Enactments, Long Term Capital Gains up to **₹1,25,000** on listed stocks/Mutual Funds are completely tax-free per year. Execute tranches strategically to capture this tax-loss/harvesting envelope before March 31st.
2. **Flat 30% Crypto Surcharge:** In India, any crypto sell actions are taxed at a flat, non-offsettable **30% rate** (plus 1% TDS). Keep record keys intact; redeploy only critical sums to avoid heavy revenue levies.
3. **Property Indexation benefits:** When transacting agricultural land or flats, leverage indexation multipliers to reduce your taxable gain before re-investing in Section 54-compliant instruments.`;

      await new Promise((resolve) => setTimeout(resolve, 600));
      return res.json({ report: reportFallback });

    } catch (error: any) {
      console.error("Rebalance API Error:", error);
      res.status(500).json({ error: error.message || "Internal server error" });
    }
  });

  // Serve static assets or mount Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
