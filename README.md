# KIA 180 — Personal Growth & Execution OS

> **A luxury, dark-mode executive operating system designed for high-performance execution, strategic intelligence, and venture acceleration across 180-day cycles.**

---

## 🌟 Core Pillars

1. **Today Command Center (`/today`)**
   - North Star focus for the cycle & day
   - The Daily Three commitment protocol
   - Start Now (5-minute launch rule)
   - Real-time Resistance Decomposition

2. **Execution & Accountability Core (`/plan`, `/progress`, `/reviews`)**
   - 4-level strategic goal hierarchy (180-day → Monthly → Weekly → Daily)
   - Real-time commitment velocity and execution analytics
   - Daily Executive Debrief & Weekly CEO Review with AI strategic directives

3. **Money & Venture Acceleration (`/finance`, `/business`, `/business/pipeline`)**
   - Personal runway, cash reserves, income, and debt obligation ledger
   - 3 Venture workspaces: **KIA-Start Up Consult** (Cash Engine), **Civitas** (Validation), and **Agrivora** (Growth Engine)
   - Full 9-Stage Sales Pipeline Kanban with weighted probability forecasting

4. **Strategic Intelligence & AI (`/coach`, `/decisions`, `/risks`, `/ideas`)**
   - **KIA AI Coach**: Real-time context-aware sparring partner
   - **Decision Engine**: 8-factor composite scoring with AI trade-off analysis
   - **Risk Radar**: Real-time early warning triggers & mitigation playbooks
   - **Idea Vault**: Strict anti-auto-promote quarantine lifecycle

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router, Server Components)
- **Language**: TypeScript (Strict mode)
- **Styling**: Tailwind CSS with custom KIA dark luxury tokens
- **Database**: PostgreSQL / Supabase with Row Level Security (RLS)
- **AI Intelligence**: Provider-agnostic engine (Google Gemini, OpenAI, Groq)

---

## 🚀 Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/IsaacKIA/kia180.git
   cd kia180
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment**:
   Copy `.env.example` to `.env.local` and add your Supabase credentials and Gemini/OpenAI API key:
   ```bash
   cp .env.example .env.local
   ```

4. **Database Setup**:
   Run `supabase/supabase_setup.sql` in your Supabase SQL Editor, followed by `supabase/seed.sql`.

5. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

---

## 🔒 Security
- All sensitive variables (`.env*`) are excluded via `.gitignore`.
- Row-Level Security (RLS) is applied across all database tables to protect personal financial and strategic data.
