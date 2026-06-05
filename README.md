# Finapple 🍎

> A full-stack personal finance platform with AI-powered document analysis, budget tracking, savings goals, and real-time spending analytics.

---

## The Problem It Solves

Most people struggle with three things when managing personal finances:

1. **No visibility** — they don't know where their money is going month to month
2. **Unread documents** — bank statements, invoices, and contracts pile up unanalyzed
3. **No accountability** — setting a budget mentally never sticks without a system

Finapple solves all three. It gives you a live wallet with categorized spending, a budget manager that tracks itself from your transactions, and an AI that reads your financial documents so you don't have to.

---

## Live Demo

| Service | URL |
|---|---|
| Frontend | https://finapple.netlify.app |
| Backend API | https://finapple-0517.onrender.com |

---

## Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **NestJS** | Modular Node.js framework for the REST API |
| **Drizzle ORM** | Type-safe SQL query builder |
| **PostgreSQL (Neon)** | Serverless cloud database |
| **Cloudinary** | File upload and storage (PDFs, images) |
| **Mistral AI** | AI document analysis (two models) |
| **JWT + bcrypt** | Authentication and password security |
| **Passport.js** | JWT strategy middleware |

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | UI framework |
| **TypeScript** | Type safety across the entire codebase |
| **Zustand** | Lightweight global state management |
| **Recharts** | Data visualization (area, bar, pie charts) |
| **Tailwind CSS v4** | Utility-first styling |
| **shadcn/ui** | Component library (sidebar, toasts) |
| **Axios** | HTTP client with interceptors |
| **React Router v7** | Client-side routing with protected routes |
| **Vite** | Build tool |

---

## Features

### 🔐 Authentication
- Register and login with email + password
- Passwords hashed with bcrypt (10 salt rounds)
- JWT tokens stored in localStorage via Zustand persist
- Auto token attachment via Axios request interceptor
- Auto logout + redirect on 401 response
- Profile name update and password change from Settings

---

### 💳 Wallet
- **Deposit** money into your account
- **Withdraw** with expense category tagging (Food, Rent, Transport, etc.)
- **Transfer** money to other users by email
- Full transaction history with running balance after each transaction
- Category badges on each transaction row
- Total money-in / money-out summary cards

---

### 📊 Budget Manager
- Set monthly spending limits per expense category
- Budget spending is **tracked automatically** — when you make a withdrawal with category "Food", the Food budget progress updates in real time
- Visual progress bars per category:
  - 🟢 Green — on track (< 80%)
  - 🟡 Yellow — near limit (≥ 80%)
  - 🔴 Red — over budget (≥ 100%)
- Summary cards: total budgeted, total spent, remaining
- Month picker to view past months
- Auto-refresh on window focus + manual refresh button

---

### 🎯 Savings Goals
- Create goals with a name, target amount, and optional deadline
- Fund goals incrementally — add any amount at any time
- Progress bar shows percentage complete
- Auto-marks goal as completed when target is reached 🎉
- Separate sections for active and completed goals

---

### 📈 Analytics
- **Daily Cash Flow** — area chart showing income vs expense by day
- **Spending by Category** — pie chart with color-coded segments
- **Category Breakdown** — sorted list with percentage bars
- **6-Month Overview** — grouped bar chart (income, expense, savings per month)
- Month picker to explore any past period
- All charts built with Recharts

---

### 🗄️ Vault
- Upload PDFs and images securely to Cloudinary
- View all uploaded files with type badges
- Delete files (removes from both DB and Cloudinary)
- Each file can be sent to AI for analysis

---

### 🤖 AI Document Analysis

The most distinctive feature. Built on **Mistral AI** with two different models depending on file type.

#### How it works

```
User clicks "Analyze" on a Vault file
        ↓
Backend checks if result is cached in DB
        ↓ (cache miss)
File type check:
  image → pixtral-12b-2409 (vision model)
  PDF   → mistral-small-latest (text model)
        ↓
Structured JSON extracted from document
        ↓
Result saved to analysis_results table
        ↓
Returned to frontend (future calls use cache)
```

#### Two models, one reason

| File Type | Model | Why |
|---|---|---|
| Images (receipts, scans) | `pixtral-12b-2409` | Multimodal vision — actually *sees* the image |
| PDFs, other docs | `mistral-small-latest` | Text-based, faster and more cost-efficient |

#### What the AI extracts

```json
{
  "documentType": "Invoice",
  "summary": "Invoice from ABC Corp for ₹45,000 due on 15 June 2025...",
  "entities": ["ABC Corp", "HDFC Bank", "ACC-001234"],
  "dates": ["15 June 2025", "1 May 2025"],
  "amounts": ["₹45,000", "₹4,050 GST"],
  "keyTerms": ["Net 30", "Late payment penalty 2%"],
  "riskFlags": ["Overdue by 10 days"],
  "confidence": 0.91
}
```

#### Smart caching
Results are persisted in PostgreSQL. If the same file is analyzed again, the cached result is returned instantly — Mistral is never called twice for the same document. This saves API cost and eliminates wait time on repeat views.

#### Prompt engineering
A custom system prompt enforces strict JSON output with no markdown or extra text. The response parser strips any code blocks if the model wraps the output anyway, then falls back to raw text if JSON parsing fails entirely — so the feature never crashes.

---

## Project Structure

```
Finapple/
├── finabackend/                  # NestJS backend
│   ├── src/
│   │   ├── auth/                 # Register, login, JWT, profile
│   │   ├── wallet/               # Deposit, withdraw, transfer, stats
│   │   ├── budget/               # Monthly budget limits + spending calc
│   │   ├── savings/              # Savings goals CRUD
│   │   ├── vault/                # File upload/delete via Cloudinary
│   │   ├── analysis/             # Mistral AI document analysis
│   │   ├── cloudinary/           # Cloudinary provider + service
│   │   ├── db/                   # Drizzle DB module + schema
│   │   └── stratgies/            # JWT Passport strategy
│   └── drizzle/                  # SQL migration files
│
└── frontend/                     # React + Vite frontend
    └── src/
        ├── pages/
        │   ├── Dashboard.tsx     # Overview with live stats
        │   ├── Wallet.tsx        # Wallet with deposit/withdraw/transfer
        │   ├── Analytics.tsx     # Charts and spending insights
        │   ├── Budget.tsx        # Budget manager
        │   ├── Savings.tsx       # Savings goals
        │   ├── Vault.tsx         # File manager + AI analysis
        │   └── Settings.tsx      # Profile + password
        ├── Store/
        │   ├── authStore.ts      # Auth state (Zustand + persist)
        │   ├── walletStore.ts    # Balance + transactions
        │   ├── budgetStore.ts    # Budgets (refreshes after withdrawals)
        │   ├── savingsStore.ts   # Goals state
        │   ├── analyticsStore.ts # Monthly stats + trend
        │   └── FilesDataStore.ts # Vault files
        ├── constants/
        │   └── categories.ts     # Single source of truth for all categories
        └── api/
            └── api.ts            # Axios instance + interceptors
```

---

## Database Schema

```
users            → id, fullName, email, password, balance
transactions     → id, userId, type, amount, balanceAfter, category, description
files            → id, userId, publicId, url, resource_type
analysis_results → id, fileId, userId, documentType, summary, entities...
budgets          → id, userId, category, limitAmount, month
savings_goals    → id, userId, name, targetAmount, savedAmount, deadline
```

---

## Key Design Decisions

**Why Drizzle over Prisma?**
Drizzle is lighter, has no code generation step, and gives full SQL control while keeping TypeScript type safety. Better fit for a project that needs fine-grained date range queries.

**Why Zustand over Redux?**
Zero boilerplate, no Provider wrapping, and direct `getState()` access between stores. The wallet store calls `budgetStore.getState().fetchBudgets()` after a withdrawal — this cross-store communication is trivial in Zustand.

**Why two AI models?**
A vision model on a PDF is wasteful — it adds latency and cost for no gain. `pixtral-12b` is used only when the file is actually an image. PDFs get `mistral-small` which is 5x faster.

**Why cache AI results in the DB?**
Mistral calls can take 3-8 seconds. Showing a cached result instantly on re-visit is a much better UX, and it keeps API costs under control.

**Category system as a shared constant**
Both Wallet withdrawals and Budget Manager use `EXPENSE_CATEGORIES` from a single `src/constants/categories.ts` file. This is the only way to guarantee they always match — the budget spending calculation on the backend matches exactly because the same string values are sent.

---

## Environment Variables

### Backend (`.env`)
```env
DATABASE_URL=postgresql://...
JWT_SECRET=your_secret
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
MISTRAL_API_KEY=...
CORS_ORIGIN=https://your-frontend.netlify.app
```

### Frontend (Netlify env vars)
```env
VITE_API_URL=https://your-backend.onrender.com
```

---

## Running Locally

```bash
# Backend
cd Finapple/finabackend
npm install
npm run start:dev

# Frontend
cd Finapple/frontend
npm install
npm run dev
```

---

## Deployment

| Service | Platform | Config |
|---|---|---|
| Backend | Render | `render.yaml` in repo root |
| Frontend | Netlify | `netlify.toml` in frontend folder |

**Render settings:**
- Root Directory: `Finapple/finabackend`
- Build: `npm install && npm run build`
- Start: `npm run start:prod`

---

*Built with NestJS · Drizzle · Neon · Cloudinary · Mistral AI · React · Zustand · Recharts*
