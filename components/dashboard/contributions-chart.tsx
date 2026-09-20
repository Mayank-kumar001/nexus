"use client";

type Progress = {
  verifiedTotal: number;
  pendingTotal: number;
  departmentRows: {
    department: string;
    verifiedCount: number;
    rank: number;
    progress: number;
  }[];
};

export function ContributionsChart({ data }: { data: Progress }) {
  // Use mock data for detailed bars, mapped with actual data if needed
  const totalPoints = data.verifiedTotal * 10 + 200; // Mock calculation
  
  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-start">
      {/* LEFT SECTION: Journey Module & Department Contributions (7 Cols) */}
      <div className="xl:col-span-7 space-y-space-lg">
        
        {/* MODULE 4: Journey Velocity & Key Metrics */}
        <div className="glass-panel-l1 rounded-xl p-space-lg space-y-space-md">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-container text-[20px]">speed</span>
                <h3 className="font-headline-sm text-title-lg font-bold text-on-surface">Journey Velocity</h3>
              </div>
              <p className="font-body-sm text-body-sm text-outline">Verification status and telemetry audit</p>
            </div>
            <button className="font-label-caps text-label-caps text-primary-container hover:text-primary flex items-center gap-1 transition-colors">
              <span>View Audit Log</span>
              <span className="material-symbols-outlined text-[14px]">open_in_new</span>
            </button>
          </div>
          
          {/* 2 Key Metric Blocks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
            {/* Verified Block */}
            <div className="rounded-lg bg-surface-container/60 border border-primary-container/20 p-space-md relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="font-label-caps text-label-caps text-outline uppercase tracking-wider">Total Verified</span>
                <div className="w-7 h-7 rounded-full bg-primary-container/15 text-primary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-space-sm">
                <span className="font-data-mono-lg text-[36px] font-bold text-primary-container cyan-glow-text">{data.verifiedTotal}</span>
                <span className="font-body-sm text-body-sm text-primary font-medium flex items-center">
                  <span className="material-symbols-outlined text-[16px]">trending_up</span> +18% this week
                </span>
              </div>
              <div className="mt-3 w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                <div className="h-full bg-primary-container rounded-full shadow-[0_0_8px_#00f0ff]" style={{ width: "88.8%" }}></div>
              </div>
            </div>
            
            {/* Pending Review Block */}
            <div className="rounded-lg bg-surface-container/60 border border-secondary-container/20 p-space-md relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="font-label-caps text-label-caps text-outline uppercase tracking-wider">Pending Review</span>
                <div className="w-7 h-7 rounded-full bg-secondary-container/15 text-secondary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-[16px]">schedule</span>
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-space-sm">
                <span className="font-data-mono-lg text-[36px] font-bold text-secondary magenta-glow-text">{data.pendingTotal}</span>
                <span className="font-body-sm text-body-sm text-secondary-fixed-dim font-medium flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-secondary-container animate-ping"></span> Next sync in 42m
                </span>
              </div>
              <div className="mt-3 w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-secondary-container to-secondary rounded-full shadow-[0_0_8px_#e545ff]" style={{ width: "24%" }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* MODULE 5: Department Contributions Section */}
        <div className="glass-panel-l1 rounded-xl p-space-lg space-y-space-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary-container text-[20px]">account_tree</span>
              <h3 className="font-headline-sm text-title-lg font-bold text-on-surface">Department Contributions</h3>
            </div>
            <span className="font-label-caps text-[10px] text-outline px-2 py-0.5 rounded bg-surface-container border border-white/5">CYCLE VELOCITY TRACKER</span>
          </div>
          
          <div className="space-y-space-md">
            {/* Strip 1: Frontend / Web */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary-container shadow-[0_0_6px_#00f0ff]"></span>
                  <span className="font-title-md text-body-md font-semibold text-on-surface">Frontend / Web</span>
                  <span className="text-[11px] px-1.5 py-0.5 rounded bg-surface-container text-outline font-label-caps">150 pts logged</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-data-mono-sm text-data-mono-sm text-outline">Target: 190</span>
                  <span className="font-data-mono-sm text-title-md font-bold text-primary-container">78%</span>
                </div>
              </div>
              <div className="w-full bg-surface-container-high h-2.5 rounded-full p-0.5 overflow-hidden border border-white/5">
                <div className="h-full rounded-full bg-gradient-to-r from-primary-container to-blue-500 shadow-[0_0_12px_rgba(0,240,255,0.6)]" style={{ width: "78%" }}></div>
              </div>
            </div>
            
            {/* Strip 2: AI & Machine Learning */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-secondary-container shadow-[0_0_6px_#e545ff]"></span>
                  <span className="font-title-md text-body-md font-semibold text-on-surface">AI &amp; Machine Learning</span>
                  <span className="text-[11px] px-1.5 py-0.5 rounded bg-surface-container text-secondary-fixed-dim font-label-caps">195 pts logged</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-data-mono-sm text-data-mono-sm text-outline">Target: 210</span>
                  <span className="font-data-mono-sm text-title-md font-bold text-secondary">92%</span>
                </div>
              </div>
              <div className="w-full bg-surface-container-high h-2.5 rounded-full p-0.5 overflow-hidden border border-white/5">
                <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-secondary-container to-secondary shadow-[0_0_12px_rgba(229,69,255,0.6)]" style={{ width: "92%" }}></div>
              </div>
            </div>

            {/* Strip 3: Distributed Infrastructure */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]"></span>
                  <span className="font-title-md text-body-md font-semibold text-on-surface">Distributed Infrastructure</span>
                  <span className="text-[11px] px-1.5 py-0.5 rounded bg-surface-container text-outline font-label-caps">110 pts logged</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-data-mono-sm text-data-mono-sm text-outline">Target: 170</span>
                  <span className="font-data-mono-sm text-title-md font-bold text-emerald-300">64%</span>
                </div>
              </div>
              <div className="w-full bg-surface-container-high h-2.5 rounded-full p-0.5 overflow-hidden border border-white/5">
                <div className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]" style={{ width: "64%" }}></div>
              </div>
            </div>
            
            {/* Strip 4: Security & Cryptography */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_#fbbf24]"></span>
                  <span className="font-title-md text-body-md font-semibold text-on-surface">Security &amp; Cryptography</span>
                  <span className="text-[11px] px-1.5 py-0.5 rounded bg-surface-container text-outline font-label-caps">140 pts logged</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-data-mono-sm text-data-mono-sm text-outline">Target: 165</span>
                  <span className="font-data-mono-sm text-title-md font-bold text-amber-300">85%</span>
                </div>
              </div>
              <div className="w-full bg-surface-container-high h-2.5 rounded-full p-0.5 overflow-hidden border border-white/5">
                <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-rose-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]" style={{ width: "85%" }}></div>
              </div>
            </div>
          </div>
          
          <div className="pt-space-sm border-t border-white/5 flex items-center justify-between">
            <span className="font-label-caps text-[11px] text-outline">RECENT COMMITS (PAST 24H)</span>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-primary-container/10 text-primary-container font-label-caps text-[10px] border border-primary-container/20">78 merged</span>
              <span className="px-2 py-0.5 rounded bg-secondary-container/10 text-secondary font-label-caps text-[10px] border border-secondary-container/20">14 awaiting audit</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SECTION: Integrated Floating Contribution Pie Chart Modal Card (5 Cols) */}
      <div className="xl:col-span-5">
        <div className="rounded-xl glass-card-interactive p-space-lg relative overflow-hidden border border-primary-container/40 shadow-[0_20px_48px_rgba(0,0,0,0.85),0_0_30px_rgba(0,240,255,0.18)]">
          <div className="flex items-center justify-between pb-space-sm border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">donut_large</span>
              <h4 className="font-title-lg text-body-md font-bold text-primary">Node Analysis</h4>
            </div>
            <div className="flex gap-1 text-outline">
              <button className="p-1 hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[16px]">fullscreen</span>
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between py-space-sm border-b border-white/10 mb-4">
            <div className="flex items-center gap-2">
              <span className="font-label-caps text-label-caps text-outline">TEAM OVERVIEW</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-primary-container/20 text-primary-container font-label-caps text-[10px] border border-primary-container/30">
              AGGREGATED
            </span>
          </div>

          <div className="relative py-space-md flex items-center justify-center">
            <div className="absolute w-44 h-44 rounded-full bg-primary-container/10 blur-2xl pointer-events-none"></div>
            <div className="absolute w-44 h-44 rounded-full bg-secondary-container/10 blur-2xl pointer-events-none"></div>
            
            <div className="relative w-64 h-64 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                <circle cx="100" cy="100" fill="transparent" r="74" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="22"></circle>
                <circle className="drop-shadow-[0_0_12px_rgba(229,69,255,0.7)] hover:opacity-90 transition-all cursor-pointer" cx="100" cy="100" fill="transparent" r="74" stroke="#e545ff" strokeDasharray="262.7 465" strokeDashoffset="0" strokeLinecap="round" strokeWidth="20"></circle>
                <circle className="drop-shadow-[0_0_14px_rgba(0,240,255,0.75)] hover:opacity-90 transition-all cursor-pointer" cx="100" cy="100" fill="transparent" r="74" stroke="#00f0ff" strokeDasharray="202.2 465" strokeDashoffset="-262.7" strokeLinecap="round" strokeWidth="20"></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="font-label-caps text-[10px] text-outline tracking-widest uppercase">Combined</span>
                <span className="font-data-mono-lg text-[38px] font-extrabold text-primary-container cyan-glow-text leading-none mt-0.5">345</span>
                <span className="font-label-caps text-[10px] text-outline mt-0.5">TOTAL PTS</span>
                <div className="mt-1 px-2 py-0.5 rounded-full bg-secondary-container/20 border border-secondary-container/40 text-secondary font-label-caps text-[9px] tracking-wider">
                  LEVEL 09
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-space-sm pt-space-xs">
            <div className="flex items-center justify-between p-space-sm rounded-lg bg-surface-container/60 border border-secondary-container/20">
              <div className="flex items-center gap-space-sm">
                <div className="w-3.5 h-3.5 rounded-sm bg-secondary-container shadow-[0_0_8px_#e545ff]"></div>
                <div>
                  <div className="font-title-md text-body-md font-bold text-on-surface">AI &amp; Machine Learning</div>
                  <div className="font-label-caps text-[10px] text-secondary">56.5% share · Primary focus</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-data-mono-lg text-title-md font-bold text-secondary">195 pts</div>
                <div className="font-label-caps text-[10px] text-outline">Target: 200</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-space-sm rounded-lg bg-surface-container/60 border border-primary-container/20">
              <div className="flex items-center gap-space-sm">
                <div className="w-3.5 h-3.5 rounded-sm bg-primary-container shadow-[0_0_8px_#00f0ff]"></div>
                <div>
                  <div className="font-title-md text-body-md font-bold text-on-surface">Frontend / Web</div>
                  <div className="font-label-caps text-[10px] text-primary-container">43.5% share · Secondary</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-data-mono-lg text-title-md font-bold text-primary-container">150 pts</div>
                <div className="font-label-caps text-[10px] text-outline">Target: 180</div>
              </div>
            </div>
          </div>
          
          <button className="w-full mt-space-md py-2.5 rounded bg-surface-container-high border border-outline-variant/50 hover:bg-surface-container hover:border-primary-container/50 text-on-surface font-title-md text-body-md font-semibold transition-all">
            Export Report
          </button>
        </div>
      </div>
    </div>
  );
}
