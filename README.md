# OBSESSION — 90-Day Personal Transformation Workspace

> **"Take on Action. 3 Months."**  
> *"Become the person your goals demand."*

A personal productivity web application combining the simplicity of Notion, the visual polish of Linear, and the progress-tracking experience of a personal operating system.

---

## 🎯 The Three Core Pillars

1. **LEARN (Technical Mastery)**
   - **Daily Focus:** 3 hours of dedicated coding deep work every day
   - **Weekends Only:**
     - CS Fundamentals & Operating Systems (memory, CPU architecture, processes, networks)
     - Data Structures & Relational Databases (DS algorithms, SQL, indexing, normalization)
     - System Design (scalability, caching, microservices, load balancing, trade-offs)
     - Build & Practical Project Implementation

2. **COMMUNICATE (Communication & Confidence)**
   - Vocal English Speaking practice
   - Sentence Shadowing for cadence and accent rhythm
   - High-impact vocabulary builder (with definitions and illustrative sentences)
   - Real-World public speaking attempts
   - Daily out-of-comfort-zone Confidence Challenges

3. **TRAIN (Athletic Physique)**
   - Athletic resistance training and conditioning
   - Clean whole-foods nutrition & avoiding junk food
   - Daily hydration tracking (ml / L)
   - Deep sleep & neural recovery tracking (8 hours)
   - Weekly fitness, weight, and energy reviews

---

## ✨ Features & Architecture

### 1. Dashboard
- **Dynamic Welcome & rotating motivational statements**: Real-time quotes focused on discipline and execution.
- **90-Day Challenge Timeline**: Displays challenge start, target end date, current day, days completed/remaining, and progress bar. Handles start and completed states.
- **Today's Execution Card**: Live completion ratio, percentage, and circular progress indicator.
- **Today's Priority Cards**: Instant habit check-off, progress meters, and numerical logging.
- **Consistency Statistics**: Current streak, all-time best streak, habits completed this week, and overall completion rate derived from saved data.
- **Recent Activity Log & Quick Actions**: Fast actions with confirmation dialogs.

### 2. Daily Habits Database
- Date navigator with prev/next controls, calendar date picker, and quick return to today.
- Notion-style database layout grouped by the 3 core transformation pillars.
- Category filters, completion status filters (All / Pending / Done), and live text search.
- Habit ordering (move up/down within category).
- Habit creation, editing, archiving, and deletion with confirmation modals.
- Comprehensive logging modal for tracking durations, vocabulary words, numbers, and notes.

### 3. 90-Day Visual Journey
- **90-Day Grid Matrix**: Interactive status view for all 90 days (Completed, Partial, Missed, Today, Future).
- **Day Detail Modal**: Click any day to inspect completed habits, notes, and reflection journals.
- **13 Weekly Sprints**: Weekly completion rates, top anchor habits, and editable weekly reflection reviews.
- **Progressive Milestones**: Unlocks at Day 7, 14, 30, 45, 60, 75, and 90 based on elapsed challenge days.
- **CSV Export**: One-click download of the complete 90-day progress spreadsheet.

### 4. Pillar Goals
- Detailed transformation cards with objectives, associated habits, today's rate, 30-day consistency, success criteria, and editable notes.

### 5. Performance Analytics
- **Recharts Line Chart**: Daily completion trends over 7 days, 30 days, or all 90 days.
- **Recharts Bar Chart**: Weekly consistency comparison across weeks 1 to 13.
- **Pillar Performance Bars**: Relative consistency breakdown across Technical, Communication, and Athletic pillars.
- **GitHub-Style Heatmap**: 90-day matrix with 5 intensity levels and hover tooltips.
- **Personal Insights**: Dynamic, rule-based observations generated directly from your saved data without external AI APIs.

### 6. Daily Journal
- Notion-inspired distraction-free editor.
- 5 guided daily reflection prompts for self-review.
- Debounced autosave with real-time saving/saved indicator.
- Live character count, word count, and reflection completion badge.
- Hashtag tagging and historical search modal.
- Export single entry or full journal archive as Markdown.

### 7. Settings & Data Portability
- Configurable challenge start date and duration.
- Theme switching: **Light**, **Dark**, and **System** mode with custom Notion-inspired color tokens.
- Complete JSON backup export and import with schema validation.
- Sample demonstration data generator for immediate testing.
- Danger zone challenge and data resets with confirmation dialogs.

---

## 🛠️ Technology Stack

- **Frontend**: React 19 + Vite 8
- **Language**: JavaScript (ES modules)
- **Styling**: Tailwind CSS with custom CSS variables
- **Icons**: Lucide React
- **Charts**: Recharts
- **Date Handling**: date-fns
- **Persistence**: LocalStorage with schema versioning (`v1`)

---

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed (v18 or higher recommended).

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/karthikeya1498/Habit-Tracker.git
   cd Habit-Tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5173/
   ```

### Building for Production

To create an optimized production build:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

---

## 🔒 Privacy & Data Storage

All transformation data is stored purely within the browser's `localStorage`. No external tracking, paid APIs, or third-party servers are involved. To backup or transfer your progress to another machine, use the **Export JSON Backup** feature in Settings.
