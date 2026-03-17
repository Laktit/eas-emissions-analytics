# EAS — Emissions Analytics Solution

> **KR Energy Portfolio · O&G Emissions Monitoring Platform · Angular 17**

A full-stack Angular 17 single-page application for real-time oil & gas emissions monitoring, compliance tracking (OGMP 2.0, SEC, CSRD, ISO 50001), AI-powered analysis, and net-zero forecasting.

---

## 🚀 Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Set your Anthropic API key (for the AI Assistant)

```bash
export ANTHROPIC_API_KEY=sk-ant-...
```

> **Windows (PowerShell):** `$env:ANTHROPIC_API_KEY = "sk-ant-..."`

### 3. Run the app with AI assistant enabled

```bash
npm run dev
```

This starts **two processes concurrently**:
- `http://localhost:4200` — Angular dev server (the app)
- `http://localhost:3001` — Node.js proxy server (routes AI calls with your API key)

### 4. Or run without the AI assistant

```bash
npm start
```

The app works fully — only the AI assistant chat will show a connection error (because there's no API key proxy running).

---

## 📁 Project Structure

```
eas-angular/
├── server.js                   # Node.js proxy — adds Anthropic API key server-side
├── package.json
├── angular.json
├── tsconfig.json
└── src/
    ├── index.html
    ├── main.ts
    ├── styles.scss               # Global design system (dark/light mode, all tokens)
    └── app/
        ├── app.component.ts      # Root shell: nav, sidebar, filter bar, theme toggle
        ├── app.config.ts         # Angular providers + view transitions
        ├── app.routes.ts         # Lazy-loaded routes for all 16 pages
        ├── core/
        │   ├── models/
        │   │   └── eas.models.ts          # Shared TypeScript interfaces
        │   └── services/
        │       ├── eas-data.service.ts    # Cascading filter engine (Angular signals)
        │       ├── theme.service.ts       # Dark/light mode (signals + localStorage)
        │       └── ai.service.ts          # Claude API wrapper with FAQ + history
        ├── shared/
        │   └── components/
        │       ├── kpi-card.component.ts       # Reusable KPI metric card
        │       └── compliance-bar.component.ts # Reusable progress bar
        └── features/
            ├── operations/
            │   ├── real-time-monitor/     # Live KPIs, chart, asset table
            │   ├── asset-inventory/       # Full asset register with filters
            │   ├── iot-feed/              # Live sensor stream + map (simulated)
            │   └── hotspot/               # Alerts + heatmap + C-07 detail
            ├── analytics/
            │   ├── forecasting/           # 2-year AI forecast + trajectory chart
            │   ├── whatif/                # Interactive sliders + impact model
            │   ├── benchmarking/          # 14-peer comparison
            │   └── sankey/                # Emission flow SVG diagram
            ├── compliance/
            │   ├── ogmp/                  # OGMP 2.0 Level 4 readiness
            │   ├── sec-csrd/              # SEC + CSRD + TCFD
            │   ├── iso/                   # ISO 50001 energy management
            │   └── report-builder/        # Automated report generation wizard
            └── platform/
                ├── ai-assistant/          # "Talk to Your Data" — Claude AI chat
                ├── knowledge-hub/         # Document library
                ├── integrations/          # SAP, LEUCIPA, GHGSat, EPA etc.
                └── settings/              # Theme, thresholds, portfolio config
```

---

## 🧠 AI Assistant — How It Works

The AI assistant on the **Talk to Your Data** page uses the Anthropic Claude API with a rich system prompt containing the full KR Energy data snapshot (KPIs, alerts, forecasts, compliance scores).

### Why a proxy?

Browsers block direct `fetch` calls to `api.anthropic.com` due to **CORS policy** — you cannot safely embed an API key in frontend JavaScript anyway. The `server.js` proxy:

1. Receives requests from the Angular app at `http://localhost:3001/api/chat`
2. Adds your `ANTHROPIC_API_KEY` from the environment
3. Forwards to `https://api.anthropic.com/v1/messages`
4. Returns the response to the Angular app

In production, deploy the proxy as a lightweight backend (e.g. Cloud Run, Railway, Vercel Edge Function) and update `ai.service.ts` to point to your deployed URL.

---

## 🌗 Dark / Light Mode

- Toggle via the pill button in the top navigation bar
- Preference persisted to `localStorage` as `eas-theme`
- Implemented with Angular signals in `ThemeService`
- Full CSS custom property override in `styles.scss`

---

## ⚡ Key Technical Details

| Feature | Implementation |
|---------|---------------|
| Framework | Angular 17 — standalone components throughout |
| State | Angular `signal()` and `computed()` — no RxJS observables |
| Routing | Lazy-loaded routes with `withViewTransitions()` |
| Styling | SCSS with CSS custom properties (full dark/light theming) |
| AI | Anthropic Claude API via Node.js proxy |
| Filters | `EasDataService` cascading signal engine — all KPIs re-derive |
| Live Feed | `setInterval` simulation in `IotFeedComponent` |

---

## 🏗 Production Build

```bash
npm run build:prod
```

Output goes to `dist/eas-emissions-analytics/`. Deploy the `browser/` folder to any static host (Netlify, GitHub Pages, Vercel, S3).

**For AI to work in production:** deploy `server.js` as a backend service and update the API URL in `src/app/core/services/ai.service.ts`:

```typescript
const apiUrl = 'https://your-proxy.yourdomain.com/api/chat';
```

---

## 🔧 GitHub Pages Deployment

```bash
# Install gh-pages helper
npm install -g angular-cli-ghpages

# Build and deploy
npm run build:prod
npx angular-cli-ghpages --dir=dist/eas-emissions-analytics/browser
```

Add `"baseHref": "/eas-emissions-analytics/"` to the production build options in `angular.json` if deploying to a subdirectory.

---

## 📊 Demo Persona: KR Energy

| Detail | Value |
|--------|-------|
| Operator | KR Energy (Karl Ronson, CEO) |
| Portfolio | 31 assets, 847 IoT sensors |
| Scope 1 YTD | 1.24 MtCO₂e (▼7.3% YoY) |
| Critical alert | C-07-PB Permian — 340% above OGMP L4 |
| SEC deadline | April 1, 2026 (34 days) |
| Net zero target | 2041 |
| Industry rank | #2 of 14 peers (carbon intensity) |

---

## 📦 Dependencies

```
@angular/core         17.x    Framework
@angular/router       17.x    Lazy routing + view transitions
@angular/forms        17.x    FormsModule (sliders, inputs)
zone.js               0.14.x  Angular change detection
```

**Dev-only:**
```
concurrently          Run proxy + Angular together
```

Install concurrently separately if needed:
```bash
npm install --save-dev concurrently
```

---

## 🔑 Environment Variables

| Variable | Description |
|----------|-------------|
| `ANTHROPIC_API_KEY` | Your Anthropic API key — required for AI assistant |

Never commit your API key. The `.gitignore` already excludes `.env` files.

---

*EAS v2.4.1 · Built for KR Energy · Anthropic Claude integration*
