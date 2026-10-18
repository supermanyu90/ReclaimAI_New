# ReclaimAI — Financial Legacy & Handover Platform

> Conversation-first financial legacy platform across JAPAC: **Prepare**, **Handover**, and **Recover** — with Family Asset Passports and multi-party review governance.

**Live demo:** https://reclaimai-795857022881.asia-southeast1.run.app/

---

## The problem

When a person dies, their family often doesn't know what they owned, where the papers are, or who the nominee is. Deposits go dormant, claims stall over a misspelled name on a certificate, and money eventually drifts into unclaimed-deposit registries. Each country has its own claim rules, thresholds and paperwork.

ReclaimAI is a prototype of a single place to:

1. **Prepare** — catalogue every asset while you're alive, by talking to it.
2. **Handover** — let a family member claim assets through a governed, multi-reviewer release.
3. **Recover** — help heirs find dormant or unclaimed balances.

---

## Features

| Module | What it does |
|---|---|
| **Workspace** | Asset ledger: fixed deposits, savings, mutual funds, insurance, CPF/EPF, real estate, equities, gold lockers. Tracks nomination status, verification state, document location and per-field evidence with confidence scores. |
| **Voice Concierge** | Real-time voice conversation via the **Gemini Live API**. Describe an asset aloud and it is captured as a structured record through tool calling. Supports English, Hindi, Japanese, Chinese (Simplified & Traditional), Korean, Indonesian, Thai and Vietnamese. |
| **Legacy Chat** | Text-based guided asset capture with document attachment previews. |
| **Relationship Graph** | Visual map linking owner, assets, institutions, people and documents. |
| **Family Asset Passport** | Printable summary in three audiences: owner master, family-scoped and reviewer audit. |
| **Digital Asset QR** | Printable QR tags for passbooks, deposit folders, lockers and deeds. |
| **Reviewer Console** | Dual-authorization handover review: approve, hold, resume or reject, with an audit log. Demo includes a death-certificate name mismatch to exercise the hold flow. |
| **Claims Guides** | Per-institution claim steps (with and without nominee), each citing its legal basis — India, Singapore, Japan and South Korea. |
| **Recovery** | Search a registry of dormant/unclaimed balances with match confidence scores. |
| **Analytics** | Nomination gaps, unknown nominees and stale documents. |
| **Personas** | Switch between Owner, Family and Reviewer to experience each role. |

---

## Architecture

```
Browser (React 19 + Vite + Tailwind)
   │
   ├── Firebase Auth (Google sign-in)
   ├── Firestore  ── users/, assets/, handoverCases/
   │
   └── WebSocket /live
          │
       Express server (server.ts)
          │
       Gemini Live API  ── audio in/out + createAssetRecord tool
```

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Motion, lucide-react, qrcode.react
- **Backend:** Express + `ws` WebSocket relay (`server.ts`), serving the Vite app in dev and `dist/` in production
- **AI:** `@google/genai` — Gemini Live with audio responses and function calling
- **Data:** Firebase Auth + Cloud Firestore with default-deny, owner-scoped security rules (`firestore.rules`)
- **Hosting:** Google Cloud Run (asia-southeast1); scaffolded in Google AI Studio

### Project structure

```
├── server.ts                  # Express + WebSocket relay to Gemini Live
├── firestore.rules            # Firestore security rules
├── firebase-blueprint.json    # Data model (User, Asset, HandoverCase)
├── firebase-applet-config.json
└── src/
    ├── App.tsx                # Shell, tabs, personas, auth
    ├── components/            # One view per module (Workspace, Reviewer, Claims, ...)
    ├── data/demoData.ts       # Demo assets, personas, claim guides, registry
    ├── i18n/translations.ts   # JAPAC translations
    ├── lib/                   # Firebase init + Firestore service
    ├── types/index.ts         # Domain types
    └── utils/formatters.ts    # Currency formatting, hashing, confetti
```

---

## Getting started

### Prerequisites

- Node.js 20+ (or Bun)
- A **Gemini API key** — https://aistudio.google.com/apikey
- A Firebase project with **Authentication (Google provider)** and **Cloud Firestore** enabled

### Setup

```bash
git clone https://github.com/supermanyu90/ReclaimAI_New.git
cd ReclaimAI_New
npm install
cp .env.example .env
```

Edit `.env`:

```env
GEMINI_API_KEY="your-gemini-api-key"
APP_URL="http://localhost:3000"
```

Replace the values in `firebase-applet-config.json` with your own Firebase web app config, then deploy the rules:

```bash
firebase deploy --only firestore:rules
```

### Run

```bash
npm run dev        # http://localhost:3000
```

### Production

```bash
npm run build
NODE_ENV=production npm start
```

Health check: `GET /api/health` reports whether the Gemini key is configured.

---

## Prototype status

ReclaimAI is a **demonstration prototype**. Be clear about what is live and what is simulated before showing it to stakeholders:

| Component | Status |
|---|---|
| Voice Concierge (Gemini Live + tool calling) | ✅ Live |
| Google sign-in and asset sync to Firestore | ✅ Live |
| Text Legacy Chat | 🟡 Scripted responses for demo prompts |
| Passport SHA-256 seal | 🟡 Placeholder value (hash helper exists, not yet wired) |
| QR payload | 🟡 Base64-encoded JSON — **not encrypted** |
| Recovery match scores | 🟡 Pre-set demo values |
| Handover / reviewer workflow | 🟡 In-memory only; not persisted |
| Institutions, people, registry records | 🟡 Fictional demo data |

**Do not enter real account numbers or personal data** into the demo.

---

## Roadmap

- [ ] Real SHA-256 passport seal over canonical asset JSON
- [ ] QR tags carrying only an opaque token; details revealed after authentication
- [ ] Confirm voice-created assets to Gemini only after the Firestore write succeeds
- [ ] Persist handover cases with reviewer-scoped Firestore rules (server-enforced dual approval)
- [ ] Align the Firestore schema (`amountMinor`) with frontend types (`amounts.balance`)
- [ ] Real recovery matching: fuzzy name match, PIN code, date of birth and dormancy weighting
- [ ] LLM-backed text chat with document extraction
- [ ] Legacy-readiness score from nomination gaps and document freshness

---

## Disclaimer

ReclaimAI does not provide legal, financial or estate-planning advice. Claim rules and legal citations are illustrative and may be incomplete or out of date — always confirm with the institution or a qualified professional.

---

## License

No license specified yet. All rights reserved by the author until one is added.
