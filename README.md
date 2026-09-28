# DocuMind — Autonomous AI Document Intelligence & Operations Platform

> **Client Showcase Prototype for QuolyTech**  
> *Industry: AI / Finance and Legal Operations*  
> *Designed with Poppins Typography and Brand Color Palette: Pure Black (`#000000`), Violet (`#7D39EB`), Lime (`#C6FF33`), and White (`#FFFFFF`).*

---

## 🌟 Executive Overview
**DocuMind** is an enterprise AI document-processing system engineered for accounting teams, corporate legal departments, and finance leaders. It reads incoming invoices, contracts (MSAs), and expense receipts, extracts structured financial and legal entities, cross-checks against fraud & rate anomaly rules, and orchestrates multi-stage human-in-the-loop approvals.

### ⏱️ Measurable Value & "Before vs. After" Impact
* **Time Saved:** Saves **19.2 hours per week** (from 22.4 hrs down to 3.2 hrs of oversight).
* **Speedup:** **87% faster turnaround** (from 6.2 business days down to 4.1 hours).
* **Straight-Through Processing (STP):** **84.6%** zero-touch automation rate.
* **Extraction Accuracy:** **99.88%** multimodal layout accuracy (0.12% error rate vs 4.8% manual typing).
* **Fraud Prevention:** **$84,200** in suspicious bank changes and rate spikes intercepted this quarter.

---

## 🚀 Key Interactive Features

### 1. Document Queue & Processing Pipeline
* Real-time KPI Ribbon: Weekly hours saved, active queue count, items requiring human review, fraud anomaly alerts.
* Instant multi-attribute search and filtering by document type (*Invoices*, *Contracts*, *Receipts*) and approval status.
* Quick batch CSV ledger export.

### 2. Interactive Document Studio (Split Screen)
* **High-Fidelity Document Canvas:**
  * Authentic physical paper rendering with vendor branding, line item breakdown, statutory tax rates, and remittance notes.
  * **Interactive Bounding Box Overlays:** Color-coded bounding boxes mapped to OCR coordinates (`Violet` for verified, `Lime` for 99%+ AI match, `Red/Dashed` for anomalies).
  * **Bi-directional Hover & Focus Sync:** Hovering or clicking a bounding box highlights the input field on the right, and vice versa!
  * **Laser OCR Scan Beam:** Toggle real-time animated scanner beam across the canvas.
  * Zoom controls (In, Out, Reset to 100%).
* **Human-in-the-Loop Review Screen:**
  * **Structured Extraction Tab:** Field-by-field confidence pills (`99.4% Match`, `84.1% Review`). In-line editing of values updates totals in real-time and logs audit records.
  * **Anomalies & Fraud Tab:** Live anomaly cards with severity ratings (`CRITICAL`, `HIGH`, `MEDIUM`), explanation of fraud vectors (e.g. remittance bank mismatch vs ERP master file, +38.4% freight rate surge), and resolution actions.
  * **Approval Routing Tab:** Visual 5-stage stepper (Ingestion -> AI Parsing -> Reviewer -> Controller -> ERP).
  * **Immutable Audit Trail:** Cryptographic chronological event log recording every automated and human touch.

### 3. Neural Search & Q&A (RAG Engine)
* Natural language vector search across the entire document repository.
* Prompt chips:
  * *"What are our total cloud and infrastructure expenses across Q3?"*
  * *"Show all invoices with flagged bank account anomalies or rate surges"*
  * *"Which contracts have auto-renewal or indemnification clauses over $100k?"*
  * *"What is the breakdown of executive travel expenses this month?"*
* Synthesized AI answers with key metric tiles and clickable source citations that take you straight to the document!

### 4. Approval Workflows Matrix (Kanban)
* 5-column governance matrix showing documents flowing from Ingestion to Sentinel Risk Check, AP Review, Controller Sign-off, and NetSuite sync.

### 5. Interactive ROI & Cost Savings Calculator
* Real-time sliders for **Monthly Ingestion Volume (300 to 15,000 docs)**, **AP Hourly Wage ($25 to $100/hr)**, and **Manual Minutes per Doc (10 to 50 mins)**.
* Dynamically calculates **Annual Cost Savings in Dollars ($)**, **Hours Reclaimed Monthly**, and **Payback Period**.

### 6. Accounting & ERP Integration Hub
* One-click export to:
  * **Standard CSV / Excel Spreadsheet** (Generates real downloadable `.csv` file).
  * **REST API / JSON** (Generates real downloadable `.json` file).
  * **Oracle NetSuite** (SuiteTalk bill creation payload).
  * **QuickBooks Online** (OAuth 2.0 bill creation payload).

### 7. Inbound Email Simulator
* Click the **"📥 Inbound Email"** button in the header to simulate receiving a new invoice from `billing@cloudscale.io` with instant toast notification and automatic queue routing.

---

## 💻 Tech Stack & Design System
* **Architecture:** Zero-dependency modern ES Modules + Vanilla CSS for ultimate speed and reliability.
* **Palette:**
  * Pitch Black: `#000000` (Obsidian surfaces `#0E1017`, `#151824`)
  * Primary Violet: `#7D39EB` (RGB 125, 57, 235)
  * Accent Lime: `#C6FF33` (RGB 198, 255, 51)
  * Pure White: `#FFFFFF`
* **Typography:** `Poppins` (Google Fonts weights 300, 400, 500, 600, 700, 800) + `JetBrains Mono` for code and numbers.

---

## 🛠️ How to Run Locally

### Location on your Mac:
The complete codebase is stored in your Desktop folder at:
```bash
/Users/apple/Desktop/documind
```

### Running the Dev Server:
```bash
cd /Users/apple/Desktop/documind
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser (Safari, Chrome, Arc, etc.).

### Opening directly without Vite:
You can also open `/Users/apple/Desktop/documind/dist/index.html` or run:
```bash
npx serve dist
# or
python3 -m http.server 3000
```
