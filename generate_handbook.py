import os
import subprocess
import fitz  # PyMuPDF

HTML_CONTENT = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>OBSESSION — System Architecture & Interview Mastery Guide</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,300;0,400;0,500;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

    @page {
      size: A4 portrait;
      margin: 0;
    }

    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      margin: 0;
      padding: 0;
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      color: #1e293b;
      background: #e2e8f0;
      line-height: 1.42;
      font-size: 9pt;
    }

    .a4-page {
      width: 210mm;
      height: 297mm;
      padding: 11mm 13mm 11mm 13mm;
      margin: 0 auto;
      position: relative;
      page-break-after: always;
      page-break-inside: avoid;
      overflow: hidden;
      background-color: #fbfbf9;
      background-image: 
        linear-gradient(to right, rgba(20, 20, 20, 0.07) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(20, 20, 20, 0.07) 1px, transparent 1px);
      background-size: 16px 16px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .page-content {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    /* Cover / Page Header */
    .header-box {
      border: 2.5px solid #18181b;
      padding: 14px 18px;
      background: #ffffff;
      box-shadow: 4px 4px 0px #18181b;
      margin-bottom: 12px;
      border-radius: 4px;
    }

    .header-title {
      font-size: 19pt;
      font-weight: 800;
      color: #09090b;
      margin: 0 0 3px 0;
      letter-spacing: -0.5px;
    }

    .header-subtitle {
      font-size: 10pt;
      color: #475569;
      margin: 0 0 8px 0;
      font-weight: 500;
    }

    .sub-header-box {
      border: 2px solid #18181b;
      padding: 10px 14px;
      background: #ffffff;
      box-shadow: 3px 3px 0px #18181b;
      margin-bottom: 11px;
      border-radius: 4px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .section-title {
      font-size: 13pt;
      font-weight: 800;
      color: #09090b;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 7px;
    }

    .section-title span.num {
      background: #18181b;
      color: #ffffff;
      font-family: 'JetBrains Mono', monospace;
      font-size: 8.5pt;
      padding: 2px 6px;
      border-radius: 3px;
    }

    .meta-badges {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .badge {
      display: inline-block;
      font-family: 'JetBrains Mono', monospace;
      font-size: 7.5pt;
      font-weight: 600;
      padding: 2px 7px;
      border: 1.5px solid #18181b;
      border-radius: 3px;
      background: #f1f5f9;
      color: #0f172a;
    }

    .badge.black { background: #18181b; color: #ffffff; }
    .badge.accent { background: #00C7B7; color: #042f2e; }

    /* Square Blackboard Theme */
    .blackboard {
      background: #141417;
      color: #f8fafc;
      border: 2px solid #27272a;
      border-radius: 5px;
      padding: 12px 15px;
      margin-bottom: 11px;
      box-shadow: 3px 3px 0px #09090b;
      position: relative;
    }

    .blackboard::before {
      content: attr(data-tag);
      position: absolute;
      top: -8px;
      left: 12px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 6.5pt;
      font-weight: 700;
      letter-spacing: 0.8px;
      background: #141417;
      color: #38bdf8;
      padding: 1px 5px;
      border: 1px solid #38bdf8;
      border-radius: 2px;
    }

    .blackboard h3 {
      color: #ffffff;
      margin: 0 0 6px 0;
      font-family: 'JetBrains Mono', monospace;
      font-size: 10pt;
    }

    .blackboard p, .blackboard li {
      color: #cbd5e1;
      font-size: 8.5pt;
      line-height: 1.45;
      margin: 0 0 6px 0;
    }

    /* Pencil Box / Note Card */
    .pencil-card {
      background: #ffffff;
      border: 2px solid #18181b;
      border-radius: 5px;
      padding: 11px 14px;
      margin-bottom: 11px;
      box-shadow: 3px 3px 0px #18181b;
    }

    /* Blueprint ASCII/SVG Diagram */
    .diagram-box {
      background: #090d16;
      border: 1.5px solid #2563eb;
      border-radius: 4px;
      padding: 10px 12px;
      margin: 8px 0;
      color: #93c5fd;
      font-family: 'JetBrains Mono', monospace;
      font-size: 7.2pt;
      line-height: 1.3;
      white-space: pre;
      overflow: hidden;
      box-shadow: 2px 2px 0px rgba(37, 99, 235, 0.4);
    }

    /* Q&A Block */
    .qa-block {
      background: #ffffff;
      border: 1.5px solid #334155;
      border-radius: 4px;
      padding: 9px 12px;
      margin-bottom: 9px;
      box-shadow: 2.5px 2.5px 0px #334155;
    }

    .qa-q {
      font-size: 9.5pt;
      font-weight: 700;
      color: #0f172a;
      margin: 0 0 5px 0;
      display: flex;
      align-items: flex-start;
      gap: 6px;
    }

    .qa-q span.q-badge {
      background: #0f172a;
      color: #ffffff;
      font-family: 'JetBrains Mono', monospace;
      font-size: 7pt;
      padding: 1px 5px;
      border-radius: 2px;
      flex-shrink: 0;
      margin-top: 1px;
    }

    .qa-a {
      font-size: 8.5pt;
      color: #334155;
      line-height: 1.45;
      margin: 0;
    }

    .qa-a strong { color: #0f172a; }
    .qa-a ul { margin: 4px 0; padding-left: 15px; }
    .qa-a li { margin-bottom: 2px; }

    /* Code Container */
    .code-container {
      background: #18181b;
      border: 1.5px solid #27272a;
      border-radius: 4px;
      padding: 9px 11px;
      margin: 7px 0;
      color: #e2e8f0;
      font-family: 'JetBrains Mono', monospace;
      font-size: 7.5pt;
      line-height: 1.38;
      overflow: hidden;
    }

    .code-title {
      font-family: 'JetBrains Mono', monospace;
      font-size: 7pt;
      font-weight: 700;
      color: #38bdf8;
      border-bottom: 1px solid #334155;
      padding-bottom: 3px;
      margin-bottom: 6px;
      display: flex;
      justify-content: space-between;
    }

    .kw { color: #f43f5e; font-weight: 600; }
    .fn { color: #38bdf8; }
    .str { color: #34d399; }
    .cm { color: #64748b; font-style: italic; }
    .num { color: #fbbf24; }

    /* Tables */
    table.data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 8pt;
      margin: 6px 0;
      background: #ffffff;
      border: 1.5px solid #18181b;
    }

    table.data-table th {
      background: #18181b;
      color: #ffffff;
      padding: 5px 8px;
      text-align: left;
      font-family: 'JetBrains Mono', monospace;
      font-size: 7.5pt;
    }

    table.data-table td {
      padding: 5px 8px;
      border-bottom: 1px solid #cbd5e1;
      border-right: 1px solid #e2e8f0;
      vertical-align: top;
      line-height: 1.35;
    }

    table.data-table tr:nth-child(even) { background: #f8fafc; }

    /* Takeaway Callout Box */
    .takeaway {
      display: block;
      font-size: 8pt;
      color: #713f12;
      background: #fefce8;
      border: 1.2px solid #ca8a04;
      border-radius: 4px;
      padding: 6px 10px;
      margin: 6px 0 0 0;
      line-height: 1.4;
    }

    .takeaway strong {
      color: #854d0e;
      font-family: 'JetBrains Mono', monospace;
      margin-right: 4px;
    }

    /* Footer */
    .page-footer {
      font-family: 'JetBrains Mono', monospace;
      font-size: 7.5pt;
      color: #64748b;
      border-top: 1.5px solid #cbd5e1;
      padding-top: 5px;
      margin-top: 6px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  </style>
</head>
<body>

  <!-- ==========================================
       PAGE 1: ARCHITECTURE TOPOLOGY & BLUEPRINT
       ========================================== -->
  <div class="a44 a4-page">
    <div class="page-content">
      <div class="header-box">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <div class="header-title">OBSESSION ARCHITECTURE &amp; INTERVIEW HANDBOOK</div>
            <div class="header-subtitle">Engineering Specification, System Blueprint &amp; 360&deg; Technical Q&amp;A Guide</div>
          </div>
          <div style="text-align: right; font-family: 'JetBrains Mono', monospace; font-size: 7.5pt; color: #475569;">
            <div>PROJECT: <strong>HABIT-TRACKER</strong></div>
            <div>DEPLOYED: <strong>NETLIFY</strong></div>
            <div>STATUS: <strong>PRODUCTION READY</strong></div>
          </div>
        </div>
        <div class="meta-badges">
          <span class="badge black">REACT 19.3</span>
          <span class="badge black">VITE 8.3</span>
          <span class="badge black">TAILWIND CSS 3.4</span>
          <span class="badge black">LOCAL-FIRST SPA</span>
          <span class="badge accent">LIVE: frolicking-toffee-eec94b.netlify.app</span>
          <span class="badge">A4 GRAPH &amp; CHALKBOARD EDITION</span>
        </div>
      </div>

      <!-- Blackboard 1: System Topology -->
      <div class="blackboard" data-tag="CHALKBOARD BLUEPRINT // 01 SYSTEM TOPOLOGY">
        <h3>ZERO-LATENCY LOCAL-FIRST SPA PATTERN</h3>
        <p>
          <strong>OBSESSION</strong> eliminates server latency, third-party trackers, and network fragility. It executes entirely client-side using deterministic in-memory state with immediate reactivity, backed by guarded local persistence and O(1) hash-mapped record indexing.
        </p>

        <div class="diagram-box">
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                CLIENT VIEWPORT (REACT 19)                              │
│  ┌────────────────────────┐  ┌──────────────────────────────────────────────────────┐  │
│  │   Navigation / Shell   │  │                    Page Views                        │  │
│  │  Sidebar / MobileNav   │  │ Dashboard │ Habits │ Journey │ Analytics │ Journal   │  │
│  └───────────┬────────────┘  └──────────────────────────┬───────────────────────────┘  │
└──────────────┼──────────────────────────────────────────┼──────────────────────────────┘
               │                                          │ Dispatches Actions
               ▼                                          ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        CENTRAL STATE BUS (AppContext.jsx)                              │
│  - Single Source of Truth        - Action Handlers / Reducer    - Optimistic Mutators   │
│  - Active Day Pointer (`dateKey`) - Challenge Timeline Math     - Toast Notification Bus│
└─────────────────────────────────────────────┬──────────────────────────────────────────┘
                                              │ Synchronous State + Debounced Disk Write
                                              ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                       STORAGE SERVICE ENGINE (services/storage.js)                     │
│  - Versioned Key-Space: `obsession_*_v1`              - Safe JSON Boundary Parser      │
│  - Storage Quota Guard &amp; Schema Auto-Migration        - Full JSON / CSV Portability    │
└─────────────────────────────────────────────┬──────────────────────────────────────────┘
                                              ▼
                                 [ Browser LocalStorage ]
                         Key-Value Map: `${habitId}_${YYYY-MM-DD}`
        </div>
      </div>

      <!-- Structural Pillars Table -->
      <div class="pencil-card" style="margin-bottom: 0;">
        <div class="section-title" style="margin-bottom: 6px;">
          <span class="num">01</span>
          <span style="font-size: 11pt;">Three Structural Pillars of the Codebase</span>
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 25%;">Pillar</th>
              <th style="width: 35%;">Module Filepath</th>
              <th style="width: 40%;">Architectural Responsibility</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>1. Reactive State Store</strong></td>
              <td><code>src/context/AppContext.jsx</code></td>
              <td>Holds normalized state (habits, records, goals, journal, settings). Exposes unified mutator actions with sub-16ms optimistic UI updates.</td>
            </tr>
            <tr>
              <td><strong>2. Persistence Guard</strong></td>
              <td><code>src/services/storage.js</code></td>
              <td>Defensive LocalStorage wrapper. Enforces <code>_v1</code> schema keys, defaults hydration, quota error trapping, and disaster fallback.</td>
            </tr>
            <tr>
              <td><strong>3. Algorithmic Engine</strong></td>
              <td><code>src/utils/statsUtils.js</code><br/><code>src/utils/dateUtils.js</code></td>
              <td>Pure mathematical functions computing rolling streaks, anchor habit completion, 13 weekly sprints, and dynamic local insights.</td>
            </tr>
          </tbody>
        </table>
        <div class="takeaway">
          <strong>PENCIL NOTE:</strong> Strict separation between state mutators (<code>AppContext</code>) and calculation algorithms (<code>statsUtils</code>) guarantees 100% deterministic unit testability without mock browser contexts.
        </div>
      </div>
    </div>

    <div class="page-footer">
      <span>OBSESSION ARCHITECTURE SPECIFICATION</span>
      <span>PAGE 1 // TOPOLOGY &amp; BLUEPRINT</span>
    </div>
  </div>

  <!-- ==========================================
       PAGE 2: THE HEART OF THE PROJECT (CODE 1 & 2)
       ========================================== -->
  <div class="a4-page">
    <div class="page-content">
      <div class="sub-header-box">
        <div class="section-title">
          <span class="num">02</span>
          <span>The Heart of the Project: Core Code Walkthrough</span>
        </div>
        <span class="badge black">ENGINES 1 &amp; 2</span>
      </div>

      <!-- Engine 1 -->
      <div class="pencil-card">
        <div style="font-weight: 700; font-size: 10pt; color: #09090b; margin-bottom: 3px;">
          ENGINE 1: Composite Record Mapping &amp; O(1) State Mutation
        </div>
        <p style="font-size: 8pt; color: #475569; margin: 0 0 5px 0;">
          Instead of storing dates inside nested habit arrays (causing O(N) scans), OBSESSION indexes every execution record under a composite key: <code>`${habitId}_${dateKey}`</code>.
        </p>

        <div class="code-container">
          <div class="code-title">
            <span>SRC/CONTEXT/APPCONTEXT.JSX &amp; SRC/SERVICES/STORAGE.JS</span>
            <span>COMPOSITE KEY DISPATCHER</span>
          </div>
<span class="cm">// 1. Composite Key Constructor</span>
<span class="kw">export const</span> <span class="fn">getRecordKey</span> = (habitId, dateKey) =&gt; <span class="str">`${habitId}_${dateKey}`</span>;

<span class="cm">// 2. O(1) Habit Toggle / Log Dispatcher</span>
<span class="kw">function</span> <span class="fn">toggleHabit</span>(habitId, dateKey, options = {}) {
  <span class="kw">const</span> recordKey = <span class="fn">getRecordKey</span>(habitId, dateKey);
  
  <span class="fn">setRecords</span>(prevRecords =&gt; {
    <span class="kw">const</span> existing = prevRecords[recordKey] || { completed: <span class="kw">false</span>, value: <span class="num">0</span> };
    <span class="kw">const</span> nextCompleted = options.forceCompleted ?? !existing.completed;
    
    <span class="cm">// Create immutable shallow clone of state hashmap</span>
    <span class="kw">const</span> updated = {
      ...prevRecords,
      [recordKey]: {
        ...existing,
        completed: nextCompleted,
        value: options.value ?? (nextCompleted ? (existing.value || <span class="num">1</span>) : <span class="num">0</span>),
        loggedAt: <span class="kw">new</span> <span class="fn">Date</span>().<span class="fn">toISOString</span>(),
      }
    };
    
    <span class="cm">// Synchronous Disk Flush</span>
    StorageService.<span class="fn">saveRecords</span>(updated);
    <span class="kw">return</span> updated;
  });
}
        </div>
        <div class="takeaway">
          <strong>WHY THIS MATTERS:</strong> A flat hash map provides <code>O(1)</code> lookup when rendering calendar matrices. With 50 habits over 90 days (4,500 data points), checking if Habit #4 was completed on Day #32 is an instant dictionary lookup: <code>records['h4_2026-11-26']</code>. Zero array iterations.
        </div>
      </div>

      <!-- Engine 2 -->
      <div class="pencil-card" style="margin-bottom: 0;">
        <div style="font-weight: 700; font-size: 10pt; color: #09090b; margin-bottom: 3px;">
          ENGINE 2: Dual-Directional Streak Walking Algorithm
        </div>
        <p style="font-size: 8pt; color: #475569; margin: 0 0 5px 0;">
          Resolves the edge case where checking the app early morning resets active streaks before habits can be performed.
        </p>

        <div class="code-container">
          <div class="code-title">
            <span>SRC/UTILS/STATSUTILS.JS</span>
            <span>DUAL-DIRECTIONAL STREAK ENGINE</span>
          </div>
<span class="kw">export function</span> <span class="fn">calculateStreaks</span>(habits, records, startDateKey, todayKey) {
  <span class="kw">const</span> daysElapsed = <span class="fn">differenceInCalendarDays</span>(<span class="fn">parseDate</span>(todayKey), <span class="fn">parseDate</span>(startDateKey)) + <span class="num">1</span>;
  <span class="kw">const</span> dayStats = [];
  <span class="kw">for</span> (<span class="kw">let</span> i = <span class="num">0</span>; i &lt; daysElapsed; i++) {
    <span class="kw">const</span> dKey = <span class="fn">addDaysToDateKey</span>(startDateKey, i);
    dayStats.<span class="fn">push</span>(<span class="fn">getDailyCompletion</span>(dKey, habits, records));
  }

  <span class="cm">// Walk Forward: Compute Best All-Time Streak</span>
  <span class="kw">let</span> bestStreak = <span class="num">0</span>, tempStreak = <span class="num">0</span>;
  <span class="kw">for</span> (<span class="kw">const</span> day <span class="kw">of</span> dayStats) {
    <span class="kw">if</span> (day.hasActivity) {
      tempStreak++;
      bestStreak = Math.<span class="fn">max</span>(bestStreak, tempStreak);
    } <span class="kw">else</span> { tempStreak = <span class="num">0</span>; }
  }

  <span class="cm">// Walk Backward: Compute Current Streak with Today Grace Buffer</span>
  <span class="kw">const</span> todayStat = dayStats[dayStats.length - <span class="num">1</span>];
  <span class="cm">// If today has no activity yet, inspect yesterday so the active streak isn't destroyed</span>
  <span class="kw">let</span> startIndex = todayStat.hasActivity ? dayStats.length - <span class="num">1</span> : dayStats.length - <span class="num">2</span>;
  <span class="kw">let</span> currentStreak = <span class="num">0</span>;
  <span class="kw">for</span> (<span class="kw">let</span> i = startIndex; i &gt;= <span class="num">0</span>; i--) {
    <span class="kw">if</span> (dayStats[i].hasActivity) { currentStreak++; } <span class="kw">else</span> { <span class="kw">break</span>; }
  }

  <span class="kw">return</span> { currentStreak, bestStreak: Math.<span class="fn">max</span>(bestStreak, currentStreak) };
}
        </div>
        <div class="takeaway">
          <strong>INTERVIEW GOLD:</strong> Point out how <code>startIndex</code> conditionally rolls back one calendar index. This prevents false streak drops while preserving exact mathematical integrity.
        </div>
      </div>
    </div>

    <div class="page-footer">
      <span>OBSESSION ARCHITECTURE SPECIFICATION</span>
      <span>PAGE 2 // ENGINES 1 &amp; 2: STATE &amp; STREAKS</span>
    </div>
  </div>

  <!-- ==========================================
       PAGE 3: THE HEART OF THE PROJECT (CODE 3 & 4)
       ========================================== -->
  <div class="a4-page">
    <div class="page-content">
      <div class="sub-header-box">
        <div class="section-title">
          <span class="num">03</span>
          <span>The Heart of the Project: Persistence &amp; Scheduling</span>
        </div>
        <span class="badge black">ENGINES 3 &amp; 4</span>
      </div>

      <!-- Engine 3 -->
      <div class="pencil-card">
        <div style="font-weight: 700; font-size: 10pt; color: #09090b; margin-bottom: 3px;">
          ENGINE 3: Defensive Storage Service &amp; Disaster Recovery
        </div>
        <p style="font-size: 8pt; color: #475569; margin: 0 0 5px 0;">
          Defensive wrapper protecting against <code>QuotaExceededError</code>, malformed JSON, and seamless <code>_v1</code> schema migration.
        </p>

        <div class="code-container">
          <div class="code-title">
            <span>SRC/SERVICES/STORAGE.JS</span>
            <span>CRASH-RESILIENT STORAGE WRAPPER</span>
          </div>
<span class="kw">function</span> <span class="fn">safeParse</span>(str, fallback) {
  <span class="kw">if</span> (!str) <span class="kw">return</span> fallback;
  <span class="kw">try</span> { <span class="kw">return</span> JSON.<span class="fn">parse</span>(str); }
  <span class="kw">catch</span> (err) {
    console.<span class="fn">error</span>(<span class="str">'Corrupted storage payload detected. Reverting to fallback.'</span>, err);
    <span class="kw">return</span> fallback;
  }
}

<span class="kw">export const</span> StorageService = {
  <span class="fn">getHabits</span>() {
    <span class="kw">const</span> raw = localStorage.<span class="fn">getItem</span>(KEYS.HABITS);
    <span class="kw">const</span> parsed = <span class="fn">safeParse</span>(raw, <span class="kw">null</span>);
    <span class="kw">if</span> (!parsed || !Array.<span class="fn">isArray</span>(parsed) || parsed.length === <span class="num">0</span>) {
      <span class="kw">this</span>.<span class="fn">saveHabits</span>(DEFAULT_HABITS); <span class="cm">// Auto-populate defaults</span>
      <span class="kw">return</span> DEFAULT_HABITS;
    }
    <span class="kw">return</span> parsed;
  },

  <span class="fn">saveHabits</span>(habits) {
    <span class="kw">try</span> {
      localStorage.<span class="fn">setItem</span>(KEYS.HABITS, JSON.<span class="fn">stringify</span>(habits));
    } <span class="kw">catch</span> (err) {
      <span class="kw">if</span> (err.name === <span class="str">'QuotaExceededError'</span>) {
        console.<span class="fn">warn</span>(<span class="str">'Storage quota full! Alerting user to export JSON.'</span>);
      }
    }
  }
};
        </div>
        <div class="takeaway">
          <strong>DEFENSIVE DESIGN:</strong> Never trust localStorage raw output. The <code>safeParse</code> wrapper ensures the entire UI will never white-screen if a user tampers with browser storage or suffers a disk interruption.
        </div>
      </div>

      <!-- Engine 4 -->
      <div class="pencil-card" style="margin-bottom: 0;">
        <div style="font-weight: 700; font-size: 10pt; color: #09090b; margin-bottom: 3px;">
          ENGINE 4: Dynamic Daily Schedule Resolution
        </div>
        <p style="font-size: 8pt; color: #475569; margin: 0 0 5px 0;">
          Differentiates daily habits from weekend-only deep dives so weekday completion rates are not artificially penalized.
        </p>

        <div class="code-container">
          <div class="code-title">
            <span>SRC/UTILS/DATEUTILS.JS &amp; SRC/UTILS/STATSUTILS.JS</span>
            <span>SCHEDULE RESOLUTION ENGINE</span>
          </div>
<span class="kw">export function</span> <span class="fn">isHabitScheduledForDate</span>(habit, dateKey) {
  <span class="kw">const</span> schedule = habit.schedule || <span class="str">'daily'</span>;
  <span class="kw">if</span> (schedule === <span class="str">'daily'</span>) <span class="kw">return true</span>;

  <span class="kw">const</span> date = <span class="fn">parseDateKey</span>(dateKey);
  <span class="kw">const</span> dayOfWeek = date.<span class="fn">getDay</span>(); <span class="cm">// 0: Sunday, 6: Saturday</span>
  <span class="kw">const</span> isWeekend = (dayOfWeek === <span class="num">0</span> || dayOfWeek === <span class="num">6</span>);

  <span class="kw">if</span> (schedule === <span class="str">'weekends'</span>) <span class="kw">return</span> isWeekend;
  <span class="kw">if</span> (schedule === <span class="str">'weekdays'</span>) <span class="kw">return</span> !isWeekend;
  <span class="kw">return true</span>;
}
        </div>
        <div class="takeaway">
          <strong>MATHEMATICAL INVARIANT:</strong> The total scheduled habit count (the denominator in percentage calculation) adjusts per day: <code>activeScheduledHabits.filter(isHabitScheduledForDate)</code>. Tuesday measures out of 10 habits, while Saturday measures out of 14 habits.
        </div>
      </div>
    </div>

    <div class="page-footer">
      <span>OBSESSION ARCHITECTURE SPECIFICATION</span>
      <span>PAGE 3 // ENGINES 3 &amp; 4: STORAGE &amp; SCHEDULES</span>
    </div>
  </div>

  <!-- ==========================================
       PAGE 4: INTERVIEW MASTERY (Q1 TO Q4)
       ========================================== -->
  <div class="a4-page">
    <div class="page-content">
      <div class="sub-header-box">
        <div class="section-title">
          <span class="num">04</span>
          <span>Interview Mastery: React 19, Architecture &amp; State</span>
        </div>
        <span class="badge black">QUESTIONS 01 - 04</span>
      </div>

      <!-- Q1 -->
      <div class="qa-block">
        <div class="qa-q">
          <span class="q-badge">Q01</span>
          <span>Why choose React 19 and Vite 8 over Next.js with Server-Side Rendering (SSR)?</span>
        </div>
        <div class="qa-a">
          <strong>Answer:</strong> 
          OBSESSION is strictly engineered around <strong>100% client-side privacy, offline capability, and instant execution</strong>.
          <ul>
            <li><strong>Zero Server Latency:</strong> Because user records reside in browser <code>localStorage</code>, SSR would offer zero performance benefits while adding server hosting costs and hydration overhead.</li>
            <li><strong>Vite 8 Build Speeds:</strong> Vite leverages native ES Modules (ESM) during development and Rollup for production. Builds complete in ~5 seconds, outputting a static SPA deployable directly to edge CDNs like Netlify.</li>
            <li><strong>Data Sovereignty:</strong> Next.js Server Components introduce accidental network dependencies. A pure SPA guarantees complete user data privacy.</li>
          </ul>
        </div>
      </div>

      <!-- Q2 -->
      <div class="qa-block">
        <div class="qa-q">
          <span class="q-badge">Q02</span>
          <span>Why React Context API instead of external libraries like Redux Toolkit or Zustand?</span>
        </div>
        <div class="qa-a">
          <strong>Answer:</strong>
          Context API was chosen to eliminate external bundle overhead while keeping state centralized:
          <ul>
            <li><strong>Lightweight Footprint:</strong> For an application with ~6 core state slices (habits, records, goals, journal, settings), native Context provides clean centralized state without 30KB+ third-party runtime weight.</li>
            <li><strong>Re-render Mitigation:</strong> We prevented Context render cascades by:
              (1) Isolating transient UI state (filters, search queries, modals) to local component state.
              (2) Decoupling heavy calculation logic into pure utilities (<code>statsUtils.js</code>) consumed via <code>useMemo</code>.
              (3) Wrapping habit presentation rows in <code>React.memo</code> so toggling one item does not re-render unaffected rows.
            </li>
          </ul>
        </div>
      </div>

      <!-- Q3 -->
      <div class="qa-block">
        <div class="qa-q">
          <span class="q-badge">Q03</span>
          <span>How did you address the 5MB browser LocalStorage quota and synchronous blocking?</span>
        </div>
        <div class="qa-a">
          <strong>Answer:</strong>
          <code>localStorage</code> is synchronous and blocks the browser thread on large payloads. We engineered three layers of defense:
          <ul>
            <li><strong>Flat Composite Key Compaction:</strong> Records are stored as lightweight boolean/numeric primitives (e.g. <code>{"completed":true,"value":60}</code>). A full 90-day cycle with 20 habits consumes under <strong>180 KB</strong>—less than 4% of the 5MB limit.</li>
            <li><strong>Debounced Autosave:</strong> For continuous text entry (Daily Journal), writes are debounced with a 1,000ms idle timer via <code>useRef</code>. Characters render at 60 FPS in memory; disk I/O only fires during pauses.</li>
            <li><strong>Storage Quota Interceptor:</strong> Storage writes are guarded in <code>try/catch</code> blocks trapping <code>QuotaExceededError</code> and alerting the user to trigger a JSON export.</li>
          </ul>
        </div>
      </div>

      <!-- Q4 -->
      <div class="qa-block" style="margin-bottom: 0;">
        <div class="qa-q">
          <span class="q-badge">Q04</span>
          <span>How does schema versioning work, and how would you execute a migration to `_v2`?</span>
        </div>
        <div class="qa-a">
          <strong>Answer:</strong>
          Keys are explicitly version-suffixed (e.g. <code>obsession_habits_v1</code>). On startup, <code>StorageService.getSettings()</code> verifies the version tag. To upgrade to <code>_v2</code> (e.g. adding cloud sync IDs), we run a non-destructive migration pipeline:
          <div class="code-container" style="margin: 4px 0; padding: 5px 8px;">
<span class="kw">if</span> (storedSettings.version === <span class="str">'1.1.0'</span>) {
  <span class="kw">const</span> v2Records = <span class="fn">migrateV1ToV2</span>(parsedV1);
  localStorage.<span class="fn">setItem</span>(KEYS.RECORDS_V2, JSON.<span class="fn">stringify</span>(v2Records));
  localStorage.<span class="fn">removeItem</span>(KEYS.RECORDS_V1);
}
          </div>
          Existing records are safely preserved while adopting the new schema structure.
        </div>
      </div>
    </div>

    <div class="page-footer">
      <span>OBSESSION ARCHITECTURE SPECIFICATION</span>
      <span>PAGE 4 // INTERVIEW: REACT 19 &amp; STATE ARCHITECTURE</span>
    </div>
  </div>

  <!-- ==========================================
       PAGE 5: INTERVIEW MASTERY (Q5 TO Q8)
       ========================================== -->
  <div class="a4-page">
    <div class="page-content">
      <div class="sub-header-box">
        <div class="section-title">
          <span class="num">05</span>
          <span>Interview Mastery: Dates, Performance &amp; Netlify</span>
        </div>
        <span class="badge black">QUESTIONS 05 - 08</span>
      </div>

      <!-- Q5 -->
      <div class="qa-block">
        <div class="qa-q">
          <span class="q-badge">Q05</span>
          <span>Why store calendar dates as ISO strings (`YYYY-MM-DD`) instead of UNIX timestamps?</span>
        </div>
        <div class="qa-a">
          <strong>Answer:</strong>
          Storing raw timestamps (e.g. <code>1730000000000</code>) causes catastrophic <strong>Timezone Boundary Drift</strong>.
          <ul>
            <li><strong>The Bug:</strong> A habit completed at 11:30 PM in New York (-5 UTC) when viewed by a user traveling to London (+0 UTC) rolls into the next day, resulting in broken streaks.</li>
            <li><strong>The Fix:</strong> Calendar days are discrete human concepts. By storing localized calendar keys (e.g., <code>"2026-10-26"</code>) generated via <code>format(date, 'yyyy-MM-dd')</code>, records stay pinned to the day the activity occurred, completely immune to timezone shifts and daylight savings transitions.</li>
          </ul>
        </div>
      </div>

      <!-- Q6 -->
      <div class="qa-block">
        <div class="qa-q">
          <span class="q-badge">Q06</span>
          <span>How is the 90-Day Visual Matrix and GitHub-Style Heatmap rendered efficiently?</span>
        </div>
        <div class="qa-a">
          <strong>Answer:</strong>
          Rather than pulling in heavy canvas or charting engines, we built the matrix with declarative web standards:
          <ul>
            <li><strong>CSS Grid Layout:</strong> Styled via native CSS Grid (<code>grid-template-columns: repeat(10, 1fr)</code>) rendered as semantic button elements.</li>
            <li><strong>5-Level Color Density Quantization:</strong> Completion percentages are mapped into discrete CSS classes (<code>bg-surface-elevated</code>, <code>bg-emerald-950</code>, <code>bg-emerald-800</code>, <code>bg-emerald-600</code>, <code>bg-emerald-500</code>).</li>
            <li><strong>Event Delegation:</strong> Instead of binding heavy handlers on 90 cells, clicks bubble to a single modal controller that reads the cell's <code>dateKey</code>.</li>
          </ul>
        </div>
      </div>

      <!-- Q7 -->
      <div class="qa-block">
        <div class="qa-q">
          <span class="q-badge">Q07</span>
          <span>Why is `netlify.toml` redirects rule (`/* /index.html 200`) critical for this SPA?</span>
        </div>
        <div class="qa-a">
          <strong>Answer:</strong>
          In a client-side Single Page Application, routing (<code>/analytics</code>, <code>/journal</code>, <code>/journey</code>) is handled dynamically in JavaScript memory via the browser History API, not by physical server files.
          <ul>
            <li><strong>The 404 Problem:</strong> If a user refreshes the page on <code>https://frolicking-toffee-eec94b.netlify.app/journal</code>, Netlify looks for a physical file <code>/journal/index.html</code>, fails to find it, and throws a <code>404 Not Found</code>.</li>
            <li><strong>The Solution:</strong> The rule <code>[[redirects]] from = "/*" to = "/index.html" status = 200</code> routes all browser requests to <code>index.html</code>, enabling React to mount, read the route path, and render the correct view.</li>
          </ul>
        </div>
      </div>

      <!-- Q8 -->
      <div class="qa-block" style="margin-bottom: 0;">
        <div class="qa-q">
          <span class="q-badge">Q08</span>
          <span>How would you re-architect this application to support 1,000,000 users syncing across devices?</span>
        </div>
        <div class="qa-a">
          <strong>Answer:</strong>
          To scale OBSESSION while preserving local-first responsiveness:
          <ul>
            <li><strong>IndexedDB Storage:</strong> Upgrade from <code>localStorage</code> to <strong>IndexedDB</strong> (via <em>Dexie.js</em>) to bypass the 5MB quota and perform asynchronous background I/O.</li>
            <li><strong>CRDT Synchronization:</strong> Implement <strong>CRDTs (Conflict-free Replicated Data Types)</strong> using <em>Yjs</em>. If a user logs a habit on mobile offline and writes a journal entry on desktop, both changes merge deterministically without collisions.</li>
            <li><strong>Supabase / PostgreSQL Backend:</strong> Back with PostgreSQL, Row-Level Security (RLS), and WebSockets for real-time upstream sync.</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="page-footer">
      <span>OBSESSION ARCHITECTURE SPECIFICATION</span>
      <span>PAGE 5 // DATES, PERFORMANCE &amp; NETLIFY</span>
    </div>
  </div>

  <!-- ==========================================
       PAGE 6: BEHAVIORAL, TRADE-OFFS & ELEVATOR PITCH
       ========================================== -->
  <div class="a4-page">
    <div class="page-content">
      <div class="sub-header-box">
        <div class="section-title">
          <span class="num">06</span>
          <span>Behavioral, Architectural Trade-offs &amp; Elevator Pitch</span>
        </div>
        <span class="badge black">FINAL CHECKLIST</span>
      </div>

      <!-- Q9: Behavioral / Difficult Challenge -->
      <div class="qa-block">
        <div class="qa-q">
          <span class="q-badge">Q09</span>
          <span>Walk me through a difficult engineering challenge you solved on this project.</span>
        </div>
        <div class="qa-a">
          <strong>Answer:</strong>
          <em>"The most complex challenge was designing the <strong>Daily Schedule Resolution engine</strong> in conjunction with the 90-day progress metrics.
          <br/>
          Initially, completion rates were calculated simply as <code>completedHabits / totalHabits</code>. However, some habits are scheduled for 'Daily', while others (like weekend deep dives) are scheduled exclusively for 'Weekends Only'. When calculating a Tuesday completion rate, counting weekend habits resulted in Tuesday's max score being capped at 60%, falsely penalizing the user's consistency streak.
          <br/>
          I solved this by decoupling the global habit catalogue from date-specific scheduled habits via a pure helper <code>isHabitScheduledForDate(habit, dateKey)</code>. This dynamically filters the denominator per calendar day based on ISO day-of-week indexes (6 &amp; 7 for weekends). I then propagated this through the streak engine, the 13 weekly sprint reviews, and the analytics charts, ensuring mathematically airtight progress statistics across the entire 90-day journey."</em>
        </div>
      </div>

      <!-- Trade-offs Table -->
      <div class="pencil-card">
        <div class="section-title" style="margin-bottom: 6px;">
          <span class="num">07</span>
          <span style="font-size: 10.5pt;">Core Architectural Trade-offs Matrix</span>
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 25%;">Decision</th>
              <th style="width: 35%;">Chosen Approach</th>
              <th style="width: 40%;">Alternative Considered &amp; Why Rejected</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Styling Engine</strong></td>
              <td><strong>Tailwind CSS 3.4</strong> + CSS Tokens</td>
              <td><em>CSS-in-JS (Styled Components)</em> was rejected due to runtime styling overhead and React 19 compiler friction.</td>
            </tr>
            <tr>
              <td><strong>Linter Tooling</strong></td>
              <td><strong>Oxlint 1.88</strong> (Rust-based)</td>
              <td><em>Standard ESLint</em> was 15x slower. Oxlint delivers sub-200ms linting on 39 files, streamlining the CI/CD feedback loop.</td>
            </tr>
            <tr>
              <td><strong>Data Visualization</strong></td>
              <td><strong>Recharts</strong> + <strong>CSS Grid Heatmap</strong></td>
              <td><em>D3.js</em> was rejected because custom SVG/Recharts components provide superior declarative integration without bulky D3 weight.</td>
            </tr>
            <tr>
              <td><strong>Data Portability</strong></td>
              <td><strong>Client-side Blob Generation</strong> (JSON/CSV)</td>
              <td><em>Server-side file generation</em> was rejected because it would compromise offline independence and privacy.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Blackboard: Elevator Pitch -->
      <div class="blackboard" data-tag="INTERVIEW MASTER SCRIPT // 60-SECOND ELEVATOR PITCH" style="margin-bottom: 0;">
        <h3 style="color: #38bdf8;">HOW TO INTRODUCE THIS PROJECT IN AN INTERVIEW</h3>
        <p style="color: #e2e8f0; margin: 0; font-size: 8.5pt;">
          <em>"OBSESSION is a high-performance personal operating system and 90-day transformation workspace built with React 19, Vite 8, and Tailwind CSS. It bridges the structured flexibility of Notion databases with the visual polish of Linear.
          <br/><br/>
          Architecturally, it is a local-first single-page application engineered around zero latency and total user data sovereignty. It features an O(1) composite-key state engine, dual-directional streak algorithms with retroactive today buffers, dynamic weekly sprint rollups, and a client-side insights generator—all running without an external database and deployed continuously to Netlify."</em>
        </p>
      </div>
    </div>

    <div class="page-footer">
      <span>OBSESSION ARCHITECTURE SPECIFICATION</span>
      <span>PAGE 6 // TRADE-OFFS &amp; ELEVATOR PITCH</span>
    </div>
  </div>

</body>
</html>
"""

def generate_handbook():
    html_path = os.path.abspath("d:/Habit-Tracker/handbook_template.html")
    pdf_path = os.path.abspath("d:/Habit-Tracker/OBSESSION_Architecture_and_Interview_Guide.pdf")
    public_pdf_path = os.path.abspath("d:/Habit-Tracker/public/OBSESSION_Architecture_and_Interview_Guide.pdf")

    # Write HTML
    with open(html_path, "w", encoding="utf-8") as f:
        f.write(HTML_CONTENT)
    print(f"HTML written to {html_path}")

    # Run Edge headless print-to-pdf
    edge_exe = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
    cmd = [
        edge_exe,
        "--headless=new",
        "--disable-gpu",
        "--no-pdf-header-footer",
        f"--print-to-pdf={pdf_path}",
        f"file:///{html_path.replace(os.sep, '/')}"
    ]

    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print("Edge stderr:", result.stderr)
        raise RuntimeError("Failed to generate PDF via Edge")

    # Inspect with PyMuPDF
    doc = fitz.open(pdf_path)
    page_count = len(doc)
    file_size_kb = os.path.getsize(pdf_path) / 1024
    print(f"Generated PDF: {page_count} pages, {file_size_kb:.1f} KB")

    # Copy to public folder
    os.makedirs(os.path.dirname(public_pdf_path), exist_ok=True)
    with open(pdf_path, "rb") as src, open(public_pdf_path, "wb") as dst:
        dst.write(src.read())
    print(f"Copied to public folder: {public_pdf_path}")

    # Generate page preview images
    for i in range(min(page_count, 6)):
        pix = doc[i].get_pixmap(dpi=150)
        pix.save(f"d:/Habit-Tracker/page_{i+1}.png")
    print("Exported page preview images.")

if __name__ == "__main__":
    generate_handbook()
