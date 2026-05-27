"use client";

import { useState, useMemo } from "react";
import { 
  DollarSign, 
  TrendingUp, 
  Clock, 
  Users, 
  Activity, 
  ShieldAlert 
} from "lucide-react";

export default function RevOpsDashboard() {
  // --- STATE MANAGEMENT CONTROLS ---
  const [clientCount, setClientCount] = useState<number>(5);
  const [volumeDiscountEnabled, setVolumeDiscountEnabled] = useState<boolean>(false);
  const [subPrice, setSubPrice] = useState<number>(750000);
  const [overagePrice, setOveragePrice] = useState<number>(250000);
  const [implFee, setImplFee] = useState<number>(50000);
  
  // Resell Matrix State
  const [resellPool, setResellPool] = useState<number>(1000000);
  const [splitPercent, setSplitPercent] = useState<number>(50);
  
  // Timeline Advantage State (Now fully dynamic)
  const [lagMonths, setLagMonths] = useState<number>(3);
  const [platformLaunchBase, setPlatformLaunchBase] = useState<number>(6);
  const [diyBuildBase, setDiyBuildBase] = useState<number>(18);

  // --- REVOPS MATHEMATICAL ENGINE ---
  const metrics = useMemo(() => {
    // 1. Calculate Tiered Discounting Factor
    let appliedDiscountFactor = 0;
    let tierLabel = "Core Standard";
    let tierClass = "bg-slate-900 text-slate-400 border-slate-800";

    if (volumeDiscountEnabled) {
      if (clientCount >= 25) {
        appliedDiscountFactor = 0.20;
        tierLabel = "Enterprise (-20%)";
        tierClass = "bg-emerald-950/60 text-emerald-400 border-emerald-900/50";
      } else if (clientCount >= 10) {
        appliedDiscountFactor = 0.10;
        tierLabel = "Mid-Market (-10%)";
        tierClass = "bg-amber-950/60 text-amber-400 border-amber-900/50";
      } else {
        tierLabel = "Standard Active";
        tierClass = "bg-cyan-950 text-cyan-400 border-cyan-900/50";
      }
    }

    const actualSubPerClient = subPrice * (1 - appliedDiscountFactor);

    // 2. Core Operational Metrics Pools
    const cumulativeBaseARR = actualSubPerClient * clientCount;
    const cumulativeOverages = overagePrice * clientCount;
    const cumulativeImplementation = implFee * clientCount;
    
    const grossResellGenerated = resellPool * clientCount;
    const parentSplitFactor = splitPercent / 100;
    const parentCompanyResellShare = grossResellGenerated * parentSplitFactor; 
    const clientRetainedResellShare = grossResellGenerated * (1 - parentSplitFactor);

    // 3. Dynamic Timeline Progress & Drag Pro-Ration
    const platformTotalTime = platformLaunchBase + lagMonths;
    const timeDragProRationFactor = lagMonths / 12;
    const revenueLostToTimeLag = cumulativeBaseARR * timeDragProRationFactor;
    const recognizedRealizedARR = Math.max(0, cumulativeBaseARR - revenueLostToTimeLag);

    const aggregateAnnualGrossYield = cumulativeBaseARR + cumulativeOverages + parentCompanyResellShare;
    const parentCoShareOfTotalPool = aggregateAnnualGrossYield > 0 ? (parentCompanyResellShare / aggregateAnnualGrossYield) * 100 : 0;
    const totalACVRunRate = cumulativeBaseARR + cumulativeOverages + (cumulativeImplementation / 3);

    // Dynamic Opportunity Cost Optimization Math
    const monthsSaved = Math.max(0, diyBuildBase - platformTotalTime);
    const monthlyPipelineVelocity = grossResellGenerated / 12;
    const enterpriseOpportunityCostSaved = monthsSaved * monthlyPipelineVelocity;

    // 4. Relative Bar Chart Graph Scales (Capped peak at 90%)
    const maxBarVal = Math.max(cumulativeBaseARR, cumulativeOverages, parentCompanyResellShare, 1);
    const barBaseHeight = `${(cumulativeBaseARR / maxBarVal) * 90}%`;
    const barOverageHeight = `${(cumulativeOverages / maxBarVal) * 90}%`;
    const barResellHeight = `${(parentCompanyResellShare / maxBarVal) * 90}%`;

    return {
      tierLabel,
      tierClass,
      actualSubPerClient,
      cumulativeBaseARR,
      cumulativeOverages,
      cumulativeImplementation,
      grossResellGenerated,
      parentCompanyResellShare,
      clientRetainedResellShare,
      platformTotalTime,
      revenueLostToTimeLag,
      recognizedRealizedARR,
      aggregateAnnualGrossYield,
      parentCoShareOfTotalPool,
      totalACVRunRate,
      monthsSaved,
      enterpriseOpportunityCostSaved,
      barBaseHeight,
      barOverageHeight,
      barResellHeight
    };
  }, [clientCount, volumeDiscountEnabled, subPrice, overagePrice, implFee, resellPool, splitPercent, lagMonths, platformLaunchBase, diyBuildBase]);

  // --- CURRENCY UTILITIES ---
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  
  const formatCompact = (val: number) => {
    if (val >= 1000000) return '$' + (val / 1000000).toFixed(2) + 'M';
    if (val >= 1000) return '$' + (val / 1000).toFixed(0) + 'K';
    return '$' + val;
  };

  return (
    <div class="bg-[#0b0f19] text-slate-300 min-h-screen p-8 antialiased selection:bg-cyan-500/30">
      
      <header class="max-w-[1550px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-5 border-b border-slate-800/60 gap-4">
        <div>
          <h1 class="text-lg font-bold tracking-tight text-white flex items-center gap-2">
            <span class="bg-gradient-to-r from-cyan-400 to-emerald-400 text-transparent bg-clip-text font-black tracking-wider">PTW</span>
            RevOps Command Center
          </h1>
          <p class="text-xs text-slate-500 mt-0.5">Commercial Strategy & Operational Drag Simulator</p>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-[11px] font-medium px-2.5 py-1 bg-slate-900 border border-slate-800 text-emerald-400 rounded-lg flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Live Model Active
          </span>
          <span class="text-xs font-mono text-slate-600">v4.2.0</span>
        </div>
      </header>

      <main class="max-w-[1550px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div class="lg:col-span-4 flex flex-col gap-6">
          <div class="bg-[#111827]/40 border border-slate-800/70 rounded-xl p-6 backdrop-blur-sm space-y-6">
            
            <div class="flex justify-between items-center pb-3 border-b border-slate-800/60">
              <h2 class="text-xs font-bold text-slate-400 uppercase tracking-wider">Deal Architecture</h2>
              <span class={`text-[10px] font-semibold px-2 py-0.5 border rounded uppercase tracking-wider transition-all duration-200 ${metrics.tierClass}`}>
                {metrics.tierLabel}
              </span>
            </div>
            
            <div class="space-y-5">
              <div>
                <div class="flex justify-between text-xs font-medium text-slate-400 mb-2">
                  <span>Scale Multiplier (Active Clients)</span>
                  <span class="font-bold text-emerald-400 font-mono">{clientCount}</span>
                </div>
                <input 
                  type="range" min="1" max="50" step="1" value={clientCount} 
                  onChange={(e) => setClientCount(parseInt(e.target.value, 10))}
                  class="w-full accent-cyan-500"
                />
              </div>

              <div class="bg-slate-900/50 border border-slate-800/80 rounded-lg p-2 grid grid-cols-2 gap-2">
                <button 
                  onClick={() => setVolumeDiscountEnabled(false)}
                  class={`py-1 px-2 rounded text-xs font-semibold transition-all ${!volumeDiscountEnabled ? 'bg-cyan-600 text-white shadow' : 'bg-transparent text-slate-400 hover:text-slate-200'}`}
                >
                  Standard Rate
                </button>
                <button 
                  onClick={() => setVolumeDiscountEnabled(true)}
                  class={`py-1 px-2 rounded text-xs font-semibold transition-all ${volumeDiscountEnabled ? 'bg-cyan-600 text-white shadow' : 'bg-transparent text-slate-400 hover:text-slate-200'}`}
                >
                  Automated Tiering
                </button>
              </div>

              <div>
                <div class="flex justify-between text-xs font-medium text-slate-400 mb-2">
                  <span>Base Annual Subscription</span>
                  <span class="font-bold text-white font-mono">{formatCurrency(subPrice)}</span>
                </div>
                <input 
                  type="range" min="500000" max="2000000" step="25000" value={subPrice}
                  onChange={(e) => setSubPrice(parseInt(e.target.value, 10))}
                  class="w-full accent-cyan-500"
                />
              </div>

              <div>
                <div class="flex justify-between text-xs font-medium text-slate-400 mb-2">
                  <span>Variable Overages Pool</span>
                  <span class="font-bold text-amber-400 font-mono">{formatCurrency(overagePrice)}</span>
                </div>
                <input 
                  type="range" min="0" max="1000000" step="25000" value={overagePrice}
                  onChange={(e) => setOveragePrice(parseInt(e.target.value, 10))}
                  class="w-full accent-cyan-500"
                />
              </div>

              <div>
                <div class="flex justify-between text-xs font-medium text-slate-400 mb-2">
                  <span>Implementation Fee</span>
                  <span class="font-bold text-white font-mono">{formatCurrency(implFee)}</span>
                </div>
                <input 
                  type="range" min="25000" max="150000" step="5000" value={implFee}
                  onChange={(e) => setImplFee(parseInt(e.target.value, 10))}
                  class="w-full accent-cyan-500"
                />
              </div>
            </div>

            <div class="pt-5 border-t border-slate-800/60 space-y-5">
              <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider">Resell Matrix</h3>
              <div>
                <div class="flex justify-between text-xs font-medium text-slate-400 mb-2">
                  <span>Resell Value (Per Client)</span>
                  <span class="font-bold text-cyan-400 font-mono">{formatCurrency(resellPool)}</span>
                </div>
                <input 
                  type="range" min="0" max="10000000" step="100000" value={resellPool}
                  onChange={(e) => setResellPool(parseInt(e.target.value, 10))}
                  class="w-full accent-cyan-500"
                />
              </div>
              <div>
                <div class="flex justify-between text-xs font-medium text-slate-400 mb-2">
                  <span>Parent Co. Capture Split</span>
                  <span class="font-bold text-indigo-400 font-mono">{splitPercent}%</span>
                </div>
                <input 
                  type="range" min="0" max="100" step="5" value={splitPercent}
                  onChange={(e) => setSplitPercent(parseInt(e.target.value, 10))}
                  class="w-full accent-cyan-500"
                />
              </div>
            </div>

            <div class="pt-5 border-t border-slate-800/60 space-y-5">
              <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider">Timeline Frictions</h3>
              
              <div>
                <div class="flex justify-between text-xs font-medium text-slate-400 mb-2">
                  <span>Onboarding & Deployment Delay</span>
                  <span class="font-bold text-rose-400 font-mono">{lagMonths} Months</span>
                </div>
                <input 
                  type="range" min="0" max="12" step="1" value={lagMonths}
                  onChange={(e) => setLagMonths(parseInt(e.target.value, 10))}
                  class="w-full accent-cyan-500"
                />
              </div>

              <div>
                <div class="flex justify-between text-xs font-medium text-slate-400 mb-2">
                  <span>Platform Launch Baseline</span>
                  <span class="font-bold text-cyan-400 font-mono">{platformLaunchBase} Months</span>
                </div>
                <input 
                  type="range" min="1" max="12" step="1" value={platformLaunchBase}
                  onChange={(e) => setPlatformLaunchBase(parseInt(e.target.value, 10))}
                  class="w-full accent-cyan-500"
                />
              </div>

              <div>
                <div class="flex justify-between text-xs font-medium text-slate-400 mb-2">
                  <span>DIY Internal Build Alternative</span>
                  <span class="font-bold text-amber-500 font-mono">{diyBuildBase} Months</span>
                </div>
                <input 
                  type="range" min="6" max="36" step="1" value={diyBuildBase}
                  onChange={(e) => setDiyBuildBase(parseInt(e.target.value, 10))}
                  class="w-full accent-cyan-500"
                />
              </div>

              <div class="space-y-3 pt-2 text-[11px]">
                <div>
                  <div class="flex justify-between text-slate-400 mb-1">
                    <span>Platform Total Velocity (Launch + Lag)</span>
                    <span class="text-white font-mono font-bold">{metrics.platformTotalTime} mo.</span>
                  </div>
                  <div class="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                    <div class="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full transition-all duration-300" style={{ width: `${(metrics.platformTotalTime / 36) * 100}%` }}></div>
                  </div>
                </div>
                <div>
                  <div class="flex justify-between text-slate-400 mb-1">
                    <span>Internal DIY Alternative Timeline</span>
                    <span class="text-white font-mono font-bold">{diyBuildBase} mo.</span>
                  </div>
                  <div class="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                    <div class="bg-amber-500 h-full rounded-full transition-all duration-300" style={{ width: `${(diyBuildBase / 36) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div class="lg:col-span-8 flex flex-col gap-6">
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-[#111827]/30 border border-slate-800/50 rounded-xl p-5 shadow-sm relative overflow-hidden">
              <div class="flex items-center gap-2 text-slate-500 mb-1">
                <Users class="w-3.5 h-3.5 text-cyan-400" />
                <p class="text-[10px] font-semibold uppercase tracking-wider">Parent Co. Capture Yield</p>
              </div>
              <p class="text-2xl font-bold text-cyan-400 font-mono tracking-tight my-0.5">{formatCurrency(metrics.parentCompanyResellShare)}</p>
              <p class="text-[10px] text-slate-500 truncate">Capturing {metrics.parentCoShareOfTotalPool.toFixed(1)}% of pool</p>
            </div>

            <div class="bg-[#111827]/30 border border-slate-800/50 rounded-xl p-5 shadow-sm relative overflow-hidden">
              <div class="flex items-center gap-2 text-slate-500 mb-1">
                <Activity class="w-3.5 h-3.5 text-white" />
                <p class="text-[10px] font-semibold uppercase tracking-wider">Recognized Realized ARR</p>
              </div>
              <p class="text-2xl font-bold text-white font-mono tracking-tight my-0.5">{formatCurrency(metrics.recognizedRealizedARR)}</p>
              <p class="text-[10px] text-rose-400 font-medium truncate">
                {lagMonths > 0 ? `-${formatCurrency(metrics.revenueLostToTimeLag)} onboarding friction` : "Optimal onboarding velocity"}
              </p>
            </div>

            <div class="bg-[#111827]/30 border border-slate-800/50 rounded-xl p-5 shadow-sm relative overflow-hidden">
              <div class="flex items-center gap-2 text-slate-500 mb-1">
                <TrendingUp class="w-3.5 h-3.5 text-emerald-400" />
                <p class="text-[10px] font-semibold uppercase tracking-wider">Aggregate Portfolio Yield</p>
              </div>
              <p class="text-2xl font-bold text-emerald-400 font-mono tracking-tight my-0.5">{formatCurrency(metrics.aggregateAnnualGrossYield)}</p>
              <p class="text-[10px] text-slate-500">Subs + Overages + Splits</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-[#111827]/15 border border-slate-900 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p class="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Ecosystem ACV Run-rate</p>
                <p class="text-base font-bold text-slate-200 font-mono mt-0.5">{formatCurrency(metrics.totalACVRunRate)}</p>
              </div>
            </div>
            <div class="bg-[#111827]/15 border border-slate-900 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p class="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Core Account Base ARR</p>
                <p class="text-base font-bold text-slate-200 font-mono mt-0.5">{formatCurrency(metrics.cumulativeBaseARR)}</p>
              </div>
            </div>
            <div class="bg-[#111827]/15 border border-slate-900 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p class="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Total Portfolio Overages</p>
                <p class="text-base font-bold text-amber-500/90 font-mono mt-0.5">{formatCurrency(metrics.cumulativeOverages)}</p>
              </div>
            </div>
          </div>

          <div class="bg-gradient-to-r from-emerald-950/30 via-slate-900/50 to-transparent border border-emerald-500/10 rounded-xl p-4 flex items-center gap-4">
            <div class="p-3 bg-emerald-950/60 border border-emerald-800/40 rounded-lg text-emerald-400">
              <Clock class="w-5 h-5" />
            </div>
            <div>
              <p class="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Consultative Launch Value</p>
              <h4 class="text-white font-semibold text-sm mt-0.5">
                Bypassing internal build structures saves <span class="text-emerald-400 font-bold">{metrics.monthsSaved} operational months</span>
              </h4>
              <p class="text-xs text-slate-400 mt-0.5">
                Calculates to roughly <span class="text-white font-mono font-medium">{formatCurrency(metrics.enterpriseOpportunityCostSaved)}</span> in protected deployment launch value pipeline.
              </p>
            </div>
          </div>

          <div class="bg-[#111827]/40 border border-slate-800/70 rounded-xl p-6 space-y-6">
            <div>
              <h2 class="text-xs font-bold text-slate-400 uppercase tracking-wider">Annual Stream Allocation Breakdown</h2>
              <p class="text-[11px] text-slate-500 mt-0.5">Real-time portfolio stream allocation calculations</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              
              <div class="md:col-span-5 flex justify-around items-end h-48 bg-slate-950/40 p-4 border border-slate-900 rounded-xl relative shadow-inner">
                
                <div class="flex flex-col items-center gap-1.5 w-1/4 relative h-full justify-end">
                  <span class="text-[10px] font-mono font-semibold text-blue-400">{formatCompact(metrics.cumulativeBaseARR)}</span>
                  <div class="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-sm transition-all duration-300 min-h-[4px]" style={{ height: metrics.barBaseHeight }}></div>
                  <span class="text-[9px] font-medium text-slate-500 uppercase mt-1">Base</span>
                </div>

                <div class="flex flex-col items-center gap-1.5 w-1/4 relative h-full justify-end">
                  <span class="text-[10px] font-mono font-semibold text-amber-400">{formatCompact(metrics.cumulativeOverages)}</span>
                  <div class="w-full bg-gradient-to-t from-amber-600 to-amber-400 rounded-t-sm transition-all duration-300 min-h-[4px]" style={{ height: metrics.barOverageHeight }}></div>
                  <span class="text-[9px] font-medium text-slate-500 uppercase mt-1">Overage</span>
                </div>

                <div class="flex flex-col items-center gap-1.5 w-1/4 relative h-full justify-end">
                  <span class="text-[10px] font-mono font-semibold text-cyan-400">{formatCompact(metrics.parentCompanyResellShare)}</span>
                  <div class="w-full bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-t-sm transition-all duration-300 min-h-[4px]" style={{ height: metrics.barResellHeight }}></div>
                  <span class="text-[9px] font-medium text-slate-500 uppercase mt-1">Resell</span>
                </div>
              </div>

              <div class="md:col-span-7 overflow-x-auto text-xs">
                <table class="w-full text-left">
                  <thead>
                    <tr class="border-b border-slate-800 text-slate-500 uppercase tracking-wider text-[10px]">
                      <th class="pb-2 font-semibold">Stream Detail</th>
                      <th class="pb-2 text-right font-semibold">Allocation</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-900 font-mono text-slate-300">
                    <tr>
                      <td class="py-2 text-slate-400 font-sans">Portfolio Cumulative Base Sub</td>
                      <td class="py-2 text-right text-white font-medium">{formatCurrency(metrics.cumulativeBaseARR)}</td>
                    </tr>
                    <tr>
                      <td class="py-2 text-slate-400 font-sans">Portfolio Annual Overages</td>
                      <td class="py-2 text-right text-amber-400 font-medium">{formatCurrency(metrics.cumulativeOverages)}</td>
                    </tr>
                    <tr>
                      <td class="py-2 text-slate-400 font-sans">One-Time Implementation Pool</td>
                      <td class="py-2 text-right text-white font-medium">{formatCurrency(metrics.cumulativeImplementation)}</td>
                    </tr>
                    <tr>
                      <td class="py-2 text-slate-400 font-sans">Gross Resell Volume Generated</td>
                      <td class="py-2 text-right text-slate-500">{formatCurrency(metrics.grossResellGenerated)}</td>
                    </tr>
                    <tr class="bg-cyan-950/10">
                      <td class="py-2 text-slate-300 font-sans font-medium pl-1">↳ Parent Company Capture</td>
                      <td class="py-2 text-right text-cyan-400 font-bold">{formatCurrency(metrics.parentCompanyResellShare)}</td>
                    </tr>
                    <tr>
                      <td class="py-2 text-slate-400 font-sans pl-1">↳ Partner Retained Share</td>
                      <td class="py-2 text-right text-slate-400">{formatCurrency(metrics.clientRetainedResellShare)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div class="bg-slate-900/40 border border-slate-800/60 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
              <div>
                <p class="font-bold text-white font-sans text-sm">
                  Tracking {formatCompact(metrics.aggregateAnnualGrossYield)} in gross annual value streams
                </p>
                <p class="text-slate-400 mt-0.5">
                  {volumeDiscountEnabled && metrics.actualSubPerClient < subPrice 
                    ? `Volume pricing rules active: average per-account target scale base reduced to ${formatCurrency(metrics.actualSubPerClient)}.`
                    : "Maintaining standardized flat-rate operational baseline pricing rule arrays."}
                </p>
              </div>
              <span class="text-xs font-mono font-bold text-emerald-400 bg-slate-900/80 border border-slate-800 px-3 py-1 rounded-lg shadow-sm whitespace-nowrap">
                {clientCount} Accounts Live
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}