# OBSESSION — Personal Habit & Challenge Tracking Workspace

[![Deployed on Netlify](https://img.shields.io/badge/Deployed%20on-Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://frolicking-toffee-eec94b.netlify.app)

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Privacy First](https://img.shields.io/badge/Data-100%25_Local_Storage-8B5CF6?style=for-the-badge)](https://frolicking-toffee-eec94b.netlify.app)
[![Architecture PDF](https://img.shields.io/badge/Architecture_PDF-Download_Guide-18181b?style=for-the-badge&logo=adobeacrobatreader&logoColor=red)](https://frolicking-toffee-eec94b.netlify.app/OBSESSION_Architecture_and_Interview_Guide.pdf)

---

## 📖 About the Project

**OBSESSION** is a modern, responsive Single Page Application (SPA) designed to help individuals execute focused personal transformation sprints (such as 90-day challenges) and cultivate lasting daily habits. 

Rather than relying on generic to-do lists or rigid habit apps, OBSESSION acts as a personal productivity dashboard that unifies **custom multi-category habit management**, **multi-modal progress tracking**, **a visual 90-day journey matrix**, **guided daily journaling**, and **deep performance analytics**—all running completely client-side with 100% user data privacy.

### Why OBSESSION?
- **All-in-One Transformation OS:** Replaces fragmented spreadsheets, journals, and habit apps with a unified, cohesive workspace.
- **Customizable Pillars:** Organize habits around your own life pillars (e.g., Technical Mastery, Health & Fitness, Communication, Mindset, Creative Projects).
- **Multi-Modal Tracking:** Supports simple boolean completions (checkmarks), timed duration habits (in minutes/hours), and quantitative numerical metrics (pages, milliliters, repetitions).
- **Visual Accountability:** Features an interactive 90-day matrix grid, 13 weekly sprint retrospectives, unlockable progressive milestones, and GitHub-style consistency heatmaps.
- **100% Private & Offline-Capable:** No servers, no tracking, and no account creation. All data is saved directly in browser `localStorage` with full JSON and CSV export/import capabilities.

---



---

## 💻 Languages & Technologies Used

### Core Languages
| Technology | Description |
| :--- | :--- |
| **JavaScript (ES6+)** | Core application logic, modular ES modules, custom hooks, and algorithmic statistics processing |
| **HTML5** | Semantic structure, accessible landmarks, and responsive viewport meta configurations |
| **CSS3** | Modern layouts with Flexbox and CSS Grid, responsive design, custom variables, and keyframe animations |

### Frameworks & Libraries
| Technology | Version | Purpose |
| :--- | :--- | :--- |
| **[React](https://react.dev/)** | `^19.3.1` | Declarative component-driven UI architecture, Context API, and state hooks |
| **[Vite](https://vitejs.dev/)** | `^8.3.4` | Ultra-fast development server with Hot Module Replacement (HMR) and optimized Rollup production builds |
| **[Tailwind CSS](https://tailwindcss.com/)** | `^3.4.17` | Utility-first styling engine with custom theme tokens (Light, Dark, and System modes) |
| **[Recharts](https://recharts.org/)** | `^3.10.1` | Composable charting library for daily trends, weekly sprint comparisons, and consistency analytics |
| **[Lucide React](https://lucide.dev/)** | `^1.61.0` | Crisp, modern iconography across all navigation and feature cards |
| **[date-fns](https://date-fns.org/)** | `^4.4.0` | Comprehensive date manipulation, ISO date keys, leap year handling, and calendar math |
| **[clsx](https://github.com/lukeed/clsx) & [tailwind-merge](https://github.com/dcastil/tailwind-merge)** | `^2.1.1` / `^3.7.0` | Dynamic conditional class merging without Tailwind utility conflicts |
| **[Oxlint](https://oxc.rs/)** | `^1.88.0` | Ultra-fast Rust-based linter ensuring clean, maintainable code quality |

---

## ⚙️ Technical Architecture & Key Features

### 1. Centralized State Management (`React Context API`)
- **Single Source of Truth:** Managed through `AppContext.jsx` using React Context to provide reactive access to habits, categories, daily execution logs, challenge settings, journal entries, and weekly reflections.
- **Optimistic Updates & Toast Notifications:** Interactive checks, habit edits, and logging triggers execute instantaneously with feedback toasts.

### 2. Robust Local Persistence & Data Portability (`storage.js`)
- **Versioned Schema (`STORAGE_VERSION = 'v1'`):** Automatically checks schema compatibility, populates defaults upon initial load, and defends against corrupt states.
- **Debounced Writes:** Journal autosave and frequent habit toggle events are debounced to ensure fluid rendering without UI frame drops.
- **JSON Backup & Restore:** Complete export of user data into a JSON file, paired with an import parser that validates data integrity before restoring.
- **CSV Data Export:** One-click spreadsheet export generating detailed logs across all challenge days for spreadsheet analysis.

### 3. Multi-Modal Daily Habits Database (`HabitsPage.jsx`)
- **Category Grouping:** Group habits by customizable life pillars with priority badges and icons.
- **Flexible Scheduling:** Define habits as **Daily**, **Weekdays Only**, **Weekends Only**, or custom frequencies.
- **Tracking Types:**
  - **Boolean Checkbox:** Simple one-click completion.
  - **Duration:** Track time spent (e.g. 30 min, 60 min, 180 min) with target values and custom units.
  - **Numeric Quantity:** Track quantitative metrics (e.g. 3000 ml water, 20 pages read, 50 pushups).
- **Organization Tools:** Reorder habits within categories, filter by status (`All`, `Pending`, `Done`), and live text search across titles and descriptions.

### 4. Interactive 90-Day Visual Journey (`JourneyPage.jsx`)
- **90-Day Grid Matrix:** Visual grid mapping all 90 days with status coloring: *Completed*, *Partial*, *Missed*, *Today*, and *Future*.
- **Day Detail Modal:** Click any day on the grid to inspect the exact completed habits, numerical metrics logged, and associated journal reflections.
- **13 Weekly Sprints:** Aggregates weekly completion percentages, highlights anchor habits, and provides an editable sprint reflection review modal.
- **Milestone Progression:** Milestone badges unlocking at Days 7, 14, 30, 45, 60, 75, and 90 as you progress through the timeline.

### 5. Performance Analytics & Insights (`AnalyticsPage.jsx`)
- **Line Trends:** Interactive Recharts line chart illustrating daily completion rates across 7-day, 30-day, or full 90-day timelines.
- **Weekly Bar Chart:** Consistency comparison across all 13 challenge weeks.
- **Pillar Breakdown:** Horizontal progress comparison bars measuring consistency across each life category.
- **GitHub-Style Heatmap:** 90-day activity matrix with 5 intensity gradients reflecting daily completion density.
- **Rule-Based Insights Engine:** Algorithmic observations computed purely on local device data, highlighting best days, streak patterns, and habit consistency without external AI or backend dependencies.

### 6. Distraction-Free Daily Journal (`JournalPage.jsx`)
- **Notion-Inspired Editor:** Minimalist, clean writing environment with real-time character and word counters.
- **5 Guided Reflection Prompts:** Built-in prompts for daily review, gratitude, lessons learned, and tomorrow's focus.
- **Hashtag System & Search:** Automatic tag detection with a searchable archive modal to quickly find historical reflections by tag or keyword.
- **Markdown Export:** Download individual daily entries or full journal archives as `.md` files.

### 7. Custom Design System & Theme Engine
- **Dark, Light, and System Modes:** Instant theme switching adhering to user OS preferences or explicit choice.
- **Linear-Inspired Typography & Glassmorphism:** Styled with Google Fonts (`Plus Jakarta Sans` and `JetBrains Mono`), sleek border contrasts, and smooth micro-interactions.

---

## 📁 Project Directory Structure

```text
Habit-Tracker/
├── index.html                   # HTML5 entry template with font links & metadata
├── netlify.toml                 # Netlify deployment configuration & SPA rewrite rules
├── package.json                 # Project dependencies, scripts, and metadata
├── postcss.config.js            # PostCSS plugin configuration
├── tailwind.config.js           # Tailwind design tokens, typography, and theme setup
├── vite.config.js               # Vite bundler configuration with React plugin
├── public/                      # Static web assets
└── src/
    ├── main.jsx                 # Application entry mount point
    ├── App.jsx                  # Main routing and layout orchestration
    ├── index.css                # Global design system tokens and Tailwind directives
    ├── components/
    │   ├── common/              # Modal, ConfirmationDialog, Toast, and shared UI elements
    │   ├── dashboard/           # Welcome banner, Challenge card, Priority cards, Stats
    │   ├── goals/               # Pillar goal management and editing modals
    │   ├── habits/              # Date navigator, Habit rows, Creation & Log modals
    │   ├── journey/             # 90-day grid matrix, Day detail & Weekly reflection modals
    │   └── layout/              # Responsive Sidebar, Mobile navigation, App layout
    ├── context/
    │   └── AppContext.jsx       # Central state store, custom reducer, and action dispatchers
    ├── pages/
    │   ├── DashboardPage.jsx    # Primary overview and daily execution summary
    │   ├── HabitsPage.jsx       # Daily habits database with category filters
    │   ├── JourneyPage.jsx      # 90-day matrix, milestones, and 13 weekly sprints
    │   ├── GoalsPage.jsx        # Pillar goals and category management
    │   ├── AnalyticsPage.jsx    # Recharts trends, GitHub-style heatmap, and insights
    │   ├── JournalPage.jsx      # Daily reflection editor with prompts & tag search
    │   └── SettingsPage.jsx     # Challenge configuration, theme toggle, and JSON backup
    ├── services/
    │   └── storage.js           # LocalStorage wrapper, schema versioning, and JSON export/import
    └── utils/
        ├── csvExport.js         # CSV spreadsheet generation utility
        ├── dateUtils.js         # Date formatting, comparison, and challenge day math
        ├── defaultData.js       # Out-of-the-box categories, sample habits, and quotes
        └── statsUtils.js        # Streak calculations, completion rates, and insights engine
```

---

## 🚀 Getting Started Locally

### Prerequisites

Make sure you have **Node.js** installed on your machine (version 18 or higher is recommended):
```bash
node -v
npm -v
```

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/karthikeya1498/Habit-Tracker.git
   cd Habit-Tracker
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser and navigate to:**
   ```text
   http://localhost:5173/
   ```

### Building for Production

To produce an optimized production bundle in the `dist` folder:
```bash
npm run build
```

To preview the built production bundle locally:
```bash
npm run preview
```

### Linting

Run Oxlint to check code quality:
```bash
npm run lint
```

---

## 🌐 Netlify Deployment

This repository includes a pre-configured `netlify.toml` file for automatic continuous deployment.

### `netlify.toml` Configuration:
```toml
[build]
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```
This ensures that all Single Page Application client-side routes redirect seamlessly to `/index.html` without 404 errors.

---

## 🔒 Privacy & Data Sovereignty

OBSESSION is built with privacy as a foundational principle:
- **Zero Third-Party Trackers:** No analytics trackers, no telemetry, and no cookies.
- **Client-Side Only:** Your data never leaves your device or browser unless you explicitly choose to export it.
- **Full Portability:** You can export your entire history as a JSON backup at any time from **Settings**, and restore it on any device.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
