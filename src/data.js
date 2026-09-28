// DocuMind - Rich Enterprise Demo Dataset
// Curated for Finance & Legal Operations Demo (QuolyTech)

export const SAMPLE_DOCUMENTS = [
  {
    id: "DOC-2024-0891",
    title: "CloudScale Technologies - Q3 Cloud Infrastructure Invoice",
    fileName: "CloudScale_INV_88921.pdf",
    type: "invoice",
    vendor: {
      name: "CloudScale Technologies Inc.",
      address: "548 Market St, Suite 7200, San Francisco, CA 94104",
      taxId: "US-884102931",
      email: "billing@cloudscale.io",
      bankAccount: "JPMorgan Chase •••• 9924",
      routingNumber: "121000248",
      vendorId: "VEND-0042"
    },
    meta: {
      invoiceNumber: "INV-2024-88921",
      poNumber: "PO-77302-ENG",
      invoiceDate: "2024-10-15",
      dueDate: "2024-11-14",
      currency: "USD",
      paymentTerms: "Net 30",
      receivedAt: "2024-10-15 09:24 AM",
      receivedVia: "invoices-apac@quolytech-documind.ai"
    },
    financials: {
      subtotal: 13500.00,
      taxRate: 10.0,
      taxAmount: 1350.00,
      total: 14850.00,
      discount: 0.00
    },
    lineItems: [
      {
        id: "LI-1",
        description: "High-Performance GPU Clusters (NVIDIA A100-80GB) - 320 Instance Hrs",
        glCode: "6140 - Cloud Compute",
        quantity: 320,
        unitPrice: 28.75,
        total: 9200.00,
        confidence: 0.99
      },
      {
        id: "LI-2",
        description: "Distributed NVMe Object Storage Tier-1 (140 TB/mo)",
        glCode: "6142 - Cloud Storage",
        quantity: 140,
        unitPrice: 17.50,
        total: 2450.00,
        confidence: 0.98
      },
      {
        id: "LI-3",
        description: "Enterprise Production SLA & Dedicated Technical Account Mgr (TAM)",
        glCode: "6145 - Infrastructure Support",
        quantity: 1,
        unitPrice: 1850.00,
        total: 1850.00,
        confidence: 0.96
      }
    ],
    status: "needs_review", // needs_review | anomaly_flagged | ready_approval | approved | exported
    overallConfidence: 0.962,
    fieldConfidence: {
      vendorName: 0.994,
      taxId: 0.841, // lower confidence field needing human review!
      invoiceNumber: 0.998,
      poNumber: 0.987,
      invoiceDate: 0.992,
      dueDate: 0.989,
      lineItems: 0.985,
      subtotal: 0.997,
      taxAmount: 0.991,
      total: 0.999
    },
    reviewNotes: "Tax ID format flagged for second verification: extracted as 'US-884102931'. Please confirm against IRS W-9 database.",
    anomalies: [
      {
        id: "ANOM-101",
        severity: "medium", // low | medium | high | critical
        type: "tax_id_verification",
        title: "Tax ID OCR Confidence Under Threshold (84.1%)",
        description: "Optical character distortion detected in vendor TIN footer. System recommends confirming match with W-9 on file.",
        resolved: false
      }
    ],
    workflow: {
      currentStage: "specialist_review",
      stages: [
        { name: "Ingestion & Multi-page OCR", status: "completed", timestamp: "2024-10-15 09:24:12", actor: "DocuMind Vision Engine v4.2" },
        { name: "Schema Extraction & PO Match", status: "completed", timestamp: "2024-10-15 09:24:15", actor: "DocuMind LLM-Parser" },
        { name: "AP Human Reviewer", status: "in_progress", timestamp: "2024-10-15 09:25:00", actor: "Assigned: Sarah Chen (AP Lead)" },
        { name: "Finance Controller Sign-off", status: "pending", timestamp: null, actor: "David Kim (Controller)" },
        { name: "ERP Synced (NetSuite)", status: "pending", timestamp: null, actor: "NetSuite REST Connector" }
      ]
    },
    auditTrail: [
      { timestamp: "2024-10-15 09:24:10", user: "Inbound Email Ingestion", action: "Document received from billing@cloudscale.io", type: "system" },
      { timestamp: "2024-10-15 09:24:13", user: "DocuMind OCR v4.2", action: "Extracted 18 layout tokens with 96.2% avg confidence", type: "ai" },
      { timestamp: "2024-10-15 09:24:15", user: "PO Matching Rule", action: "Matched to Active Purchase Order #PO-77302-ENG (Variance: 0.0%)", type: "rule" },
      { timestamp: "2024-10-15 09:25:00", user: "System Router", action: "Queued for AP Review due to Tax ID confidence (84.1%)", type: "workflow" }
    ],
    // Bounding boxes in percentage of document canvas (top, left, width, height)
    boundingBoxes: {
      vendorName: { top: 7.5, left: 6.5, width: 36, height: 4.5, label: "Vendor Name", field: "vendorName", confidence: 0.994 },
      taxId: { top: 12.2, left: 6.5, width: 24, height: 2.8, label: "Tax ID (TIN)", field: "taxId", confidence: 0.841, isFlagged: true },
      invoiceNumber: { top: 7.5, left: 65, width: 28, height: 4.5, label: "Invoice #", field: "invoiceNumber", confidence: 0.998 },
      invoiceDate: { top: 12.5, left: 65, width: 28, height: 2.8, label: "Invoice Date", field: "invoiceDate", confidence: 0.992 },
      dueDate: { top: 15.5, left: 65, width: 28, height: 2.8, label: "Due Date", field: "dueDate", confidence: 0.989 },
      poNumber: { top: 18.5, left: 65, width: 28, height: 2.8, label: "PO Number", field: "poNumber", confidence: 0.987 },
      lineItemsTable: { top: 38.0, left: 6.0, width: 88, height: 26.0, label: "Line Items (3)", field: "lineItems", confidence: 0.985 },
      subtotal: { top: 66.5, left: 62.0, width: 32, height: 3.2, label: "Subtotal", field: "subtotal", confidence: 0.997 },
      taxAmount: { top: 70.0, left: 62.0, width: 32, height: 3.2, label: "Tax (10%)", field: "taxAmount", confidence: 0.991 },
      total: { top: 74.0, left: 62.0, width: 32, height: 5.0, label: "Grand Total", field: "total", confidence: 0.999 }
    }
  },
  {
    id: "DOC-2024-0892",
    title: "Horizon Global Logistics - Container Freight & Drayage Bill",
    fileName: "Horizon_Freight_Oct24.pdf",
    type: "invoice",
    vendor: {
      name: "Horizon Global Logistics Ltd.",
      address: "100 Pier B Street, Terminal Island, Long Beach, CA 90802",
      taxId: "US-951239840",
      email: "dispatch@horizonlogistics.com",
      bankAccount: "Wells Fargo •••• 1109 (NEW)",
      routingNumber: "121000024",
      vendorId: "VEND-0118"
    },
    meta: {
      invoiceNumber: "HZ-8921-OCT",
      poNumber: "PO-66109-LOG",
      invoiceDate: "2024-10-18",
      dueDate: "2024-10-28",
      currency: "USD",
      paymentTerms: "Net 10",
      receivedAt: "2024-10-18 11:05 AM",
      receivedVia: "Web Portal Upload"
    },
    financials: {
      subtotal: 39500.00,
      taxRate: 7.09,
      taxAmount: 2800.00,
      total: 42300.00,
      discount: 0.00
    },
    lineItems: [
      {
        id: "LI-201",
        description: "Ocean Intermodal Drayage - 40ft High Cube Containers (Port of Long Beach to Ontario DC) x 12",
        glCode: "5200 - Inbound Freight",
        quantity: 12,
        unitPrice: 2250.00,
        total: 27000.00,
        confidence: 0.99
      },
      {
        id: "LI-202",
        description: "Congestion Fuel Surcharge Index (Variable Oct Spike +38%)",
        glCode: "5210 - Freight Fuel Surcharge",
        quantity: 12,
        unitPrice: 650.00,
        total: 7800.00,
        confidence: 0.95
      },
      {
        id: "LI-203",
        description: "Demurrage & Extended Gate Storage Protection (48 hr reserve)",
        glCode: "5220 - Storage & Demurrage",
        quantity: 1,
        unitPrice: 4700.00,
        total: 4700.00,
        confidence: 0.94
      }
    ],
    status: "anomaly_flagged",
    overallConfidence: 0.948,
    fieldConfidence: {
      vendorName: 0.991,
      taxId: 0.985,
      invoiceNumber: 0.994,
      poNumber: 0.975,
      invoiceDate: 0.988,
      dueDate: 0.981,
      lineItems: 0.96,
      subtotal: 0.985,
      taxAmount: 0.98,
      total: 0.995
    },
    reviewNotes: "CRITICAL ALERT: Vendor bank account number changed from historical master file. Also, price per container reflects +38.4% surge over contracted standard rate.",
    anomalies: [
      {
        id: "ANOM-201",
        severity: "critical",
        type: "bank_change_fraud_risk",
        title: "Bank Account Mismatch Detected (High Fraud Risk)",
        description: "Remittance details list Wells Fargo #••••1109. Vendor Master in ERP shows Citibank #••••4491. Possible Business Email Compromise (BEC) attempt.",
        resolved: false
      },
      {
        id: "ANOM-202",
        severity: "high",
        type: "price_surge",
        title: "Rate Surge +38.4% Over Rolling Contract Average",
        description: "Drayage unit price ($2,250/unit) exceeds baseline contract rate ($1,625/unit). Surcharge of $7,500 requires VP Operations sign-off.",
        resolved: false
      },
      {
        id: "ANOM-203",
        severity: "medium",
        type: "duplicate_suspected",
        title: "Potential Duplicate Batch Detected",
        description: "Container reference numbers match a pending draft submitted on Oct 6. Ensure double-billing is excluded.",
        resolved: false
      }
    ],
    workflow: {
      currentStage: "anomaly_investigation",
      stages: [
        { name: "Ingestion & Multi-page OCR", status: "completed", timestamp: "2024-10-18 11:05:01", actor: "DocuMind Vision Engine v4.2" },
        { name: "Fraud & Anomaly Sentinel", status: "flagged", timestamp: "2024-10-18 11:05:04", actor: "Sentinel AI Anti-Fraud Engine" },
        { name: "Security & Bank Verification", status: "in_progress", timestamp: "2024-10-18 11:06:00", actor: "Assigned: Marcus Vance (Treasury Sec)" },
        { name: "VP Logistics Approval", status: "blocked", timestamp: null, actor: "Elena Rostova (VP Supply Chain)" },
        { name: "ERP Synced (NetSuite)", status: "pending", timestamp: null, actor: "NetSuite REST Connector" }
      ]
    },
    auditTrail: [
      { timestamp: "2024-10-18 11:05:00", user: "Web Ingestion Portal", action: "PDF uploaded by logistics team", type: "system" },
      { timestamp: "2024-10-18 11:05:03", user: "DocuMind OCR v4.2", action: "Extracted bill of lading, container identifiers, and charges", type: "ai" },
      { timestamp: "2024-10-18 11:05:04", user: "Sentinel Fraud Rule #104", action: "FLAGGED: Remittance routing does not match Vendor Master", type: "security" },
      { timestamp: "2024-10-18 11:05:04", user: "Pricing Anomaly Rule #208", action: "FLAGGED: Drayage rate 38.4% above 90-day contract average", type: "security" },
      { timestamp: "2024-10-18 11:06:12", user: "Marcus Vance", action: "Initiated out-of-band phone callback verification with vendor CFO", type: "human" }
    ],
    boundingBoxes: {
      vendorName: { top: 6.8, left: 6.0, width: 44, height: 4.8, label: "Vendor", field: "vendorName", confidence: 0.991 },
      taxId: { top: 11.8, left: 6.0, width: 26, height: 2.8, label: "Tax ID", field: "taxId", confidence: 0.985 },
      invoiceNumber: { top: 6.8, left: 62, width: 32, height: 4.8, label: "Invoice #", field: "invoiceNumber", confidence: 0.994 },
      invoiceDate: { top: 11.8, left: 62, width: 32, height: 2.8, label: "Date", field: "invoiceDate", confidence: 0.988 },
      poNumber: { top: 15.0, left: 62, width: 32, height: 2.8, label: "PO #", field: "poNumber", confidence: 0.975 },
      bankAccount: { top: 22.0, left: 6.0, width: 48, height: 4.0, label: "Remit Bank [MISMATCH]", field: "bankAccount", confidence: 0.982, isCritical: true },
      lineItemsTable: { top: 34.0, left: 5.5, width: 89, height: 28.0, label: "Line Items [SURGE FLAGGED]", field: "lineItems", confidence: 0.96, isCritical: true },
      subtotal: { top: 65.5, left: 60.0, width: 34, height: 3.2, label: "Subtotal", field: "subtotal", confidence: 0.985 },
      taxAmount: { top: 69.0, left: 60.0, width: 34, height: 3.2, label: "Tax / Fees", field: "taxAmount", confidence: 0.98 },
      total: { top: 73.0, left: 60.0, width: 34, height: 5.2, label: "Total $42,300.00", field: "total", confidence: 0.995, isCritical: true }
    }
  },
  {
    id: "DOC-2024-0893",
    title: "Apex Dynamics & Legal Partners - Master Services Agreement (MSA)",
    fileName: "Apex_Dynamics_Legal_MSA_2024.pdf",
    type: "contract",
    vendor: {
      name: "Apex Dynamics Legal & Advisory LLC",
      address: "1250 Avenue of the Americas, 34th Floor, New York, NY 10020",
      taxId: "US-134902811",
      email: "counsel@apexdynamics.law",
      bankAccount: "Bank of America •••• 8820",
      routingNumber: "026009593",
      vendorId: "VEND-0205"
    },
    meta: {
      contractId: "MSA-2024-NYC-09",
      effectiveDate: "2024-11-01",
      expirationDate: "2026-10-31",
      contractTerm: "24 Months",
      autoRenewal: "Yes (60 days prior written notice)",
      governingLaw: "State of Delaware",
      indemnityCap: "$500,000.00 USD",
      annualContractValue: "$120,000.00",
      paymentTerms: "Net 45 on quarterly retainers",
      receivedAt: "2024-10-17 04:15 PM",
      receivedVia: "legal-review@quolytech-documind.ai"
    },
    financials: {
      subtotal: 120000.00,
      taxRate: 0.0,
      taxAmount: 0.00,
      total: 120000.00,
      discount: 0.00
    },
    lineItems: [
      {
        id: "LI-301",
        description: "Quarterly Corporate Legal Retainer - SEC Compliance & Governance",
        glCode: "6210 - Legal Advisory",
        quantity: 4,
        unitPrice: 22500.00,
        total: 90000.00,
        confidence: 0.99
      },
      {
        id: "LI-302",
        description: "IP Patent Portfolio Filing & International Trademark Advisory Reserve",
        glCode: "6215 - Intellectual Property",
        quantity: 1,
        unitPrice: 30000.00,
        total: 30000.00,
        confidence: 0.97
      }
    ],
    status: "ready_approval",
    overallConfidence: 0.979,
    fieldConfidence: {
      vendorName: 0.996,
      governingLaw: 0.992,
      indemnityCap: 0.984,
      autoRenewal: 0.978,
      contractTerm: 0.985,
      annualContractValue: 0.991,
      paymentTerms: 0.982
    },
    reviewNotes: "All legal covenants extracted automatically. Indemnity cap ($500k) complies with QuolyTech standard risk guidelines. Ready for General Counsel digital sign-off.",
    anomalies: [],
    workflow: {
      currentStage: "executive_approval",
      stages: [
        { name: "Legal NLP Clause Extraction", status: "completed", timestamp: "2024-10-17 16:15:22", actor: "DocuMind Legal LLM" },
        { name: "Risk & Covenant Benchmarking", status: "completed", timestamp: "2024-10-17 16:15:30", actor: "QuolyTech Policy Guardrail" },
        { name: "Paralegal Review", status: "completed", timestamp: "2024-10-17 16:40:00", actor: "Approved by Jordan Croft" },
        { name: "General Counsel Sign-off", status: "in_progress", timestamp: "2024-10-17 16:41:00", actor: "Assigned: Victoria Sterling (GC)" },
        { name: "Contract Vault Archival", status: "pending", timestamp: null, actor: "Ironclad / DocuVault Connector" }
      ]
    },
    auditTrail: [
      { timestamp: "2024-10-17 16:15:20", user: "Inbound Email Ingestion", action: "MSA Contract received from counsel@apexdynamics.law", type: "system" },
      { timestamp: "2024-10-17 16:15:24", user: "DocuMind Legal Engine", action: "Parsed 32 clauses, extracted Delaware jurisdiction & indemnity caps", type: "ai" },
      { timestamp: "2024-10-17 16:40:12", user: "Jordan Croft (Paralegal)", action: "Verified termination clause #14.2 against corporate playbook", type: "human" }
    ],
    boundingBoxes: {
      vendorName: { top: 8.0, left: 6.0, width: 50, height: 4.5, label: "Parties (Apex Dynamics)", field: "vendorName", confidence: 0.996 },
      effectiveDate: { top: 13.5, left: 6.0, width: 38, height: 3.0, label: "Term: 24 Months", field: "contractTerm", confidence: 0.985 },
      governingLaw: { top: 32.0, left: 6.0, width: 88, height: 6.0, label: "Jurisdiction: Delaware", field: "governingLaw", confidence: 0.992 },
      indemnityCap: { top: 44.0, left: 6.0, width: 88, height: 7.0, label: "Indemnity: $500,000", field: "indemnityCap", confidence: 0.984 },
      autoRenewal: { top: 56.0, left: 6.0, width: 88, height: 6.5, label: "Auto-Renewal: 60-day notice", field: "autoRenewal", confidence: 0.978 },
      total: { top: 72.0, left: 55.0, width: 39, height: 5.5, label: "Annual Value: $120,000", field: "annualContractValue", confidence: 0.991 }
    }
  },
  {
    id: "DOC-2024-0894",
    title: "Delta Airlines & Hyatt Regency - Executive Travel Expense Receipt",
    fileName: "Executive_Travel_Q3_Rec882.pdf",
    type: "receipt",
    vendor: {
      name: "Delta Air Lines Inc.",
      address: "1030 Delta Blvd, Atlanta, GA 30354",
      taxId: "US-580218548",
      email: "receipts@delta.com",
      bankAccount: "Corporate Amex •••• 9002",
      routingNumber: "N/A",
      vendorId: "VEND-0008"
    },
    meta: {
      receiptNumber: "DL-99418290",
      poNumber: "EXP-CFO-2024-10",
      receiptDate: "2024-10-12",
      category: "Executive Travel & Lodging",
      currency: "USD",
      paymentMethod: "Corporate Platinum Card",
      receivedAt: "2024-10-14 08:30 AM",
      receivedVia: "Mobile App Scan (iOS)"
    },
    financials: {
      subtotal: 1145.00,
      taxRate: 11.83,
      taxAmount: 135.50,
      total: 1280.50,
      discount: 0.00
    },
    lineItems: [
      {
        id: "LI-401",
        description: "Flight Roundtrip SFO -> JFK (Business First Class)",
        glCode: "6510 - Executive Airfare",
        quantity: 1,
        unitPrice: 890.00,
        total: 890.00,
        confidence: 0.99
      },
      {
        id: "LI-402",
        description: "Hyatt Regency Wall Street - 1 Night Corporate Rate",
        glCode: "6520 - Lodging",
        quantity: 1,
        unitPrice: 255.00,
        total: 255.00,
        confidence: 0.98
      },
      {
        id: "LI-403",
        description: "Airport Ground Transportation & Port Authority Tax",
        glCode: "6530 - Ground Transit",
        quantity: 1,
        unitPrice: 135.50,
        total: 135.50,
        confidence: 0.97
      }
    ],
    status: "approved",
    overallConfidence: 0.992,
    fieldConfidence: {
      vendorName: 0.998,
      taxId: 0.991,
      receiptNumber: 0.995,
      receiptDate: 0.993,
      lineItems: 0.989,
      total: 0.999
    },
    reviewNotes: "Automated expense policy match verified. Travel pre-approved under CFO travel code #EXP-CFO-2024-10. Direct sync completed.",
    anomalies: [],
    workflow: {
      currentStage: "synced_erp",
      stages: [
        { name: "Mobile Scan & Image Enhancement", status: "completed", timestamp: "2024-10-14 08:30:05", actor: "DocuMind Mobile Engine" },
        { name: "Receipt OCR & Policy Match", status: "completed", timestamp: "2024-10-14 08:30:08", actor: "DocuMind Auto-Matcher" },
        { name: "Expense Compliance Check", status: "completed", timestamp: "2024-10-14 08:30:10", actor: "QuolyTech Travel Guard" },
        { name: "Manager Approval", status: "completed", timestamp: "2024-10-14 09:12:00", actor: "Auto-approved via Threshold Rule (<$2,500)" },
        { name: "QuickBooks Online Export", status: "completed", timestamp: "2024-10-14 09:12:15", actor: "QBO Sync Service" }
      ]
    },
    auditTrail: [
      { timestamp: "2024-10-14 08:30:00", user: "Mobile Upload", action: "Receipt image uploaded by CFO assistant", type: "system" },
      { timestamp: "2024-10-14 08:30:08", user: "DocuMind OCR v4.2", action: "Classified as Executive Travel, extracted $1,280.50 total", type: "ai" },
      { timestamp: "2024-10-14 09:12:00", user: "Auto-Approval Bot", action: "Matched corporate card transaction #9002; auto-approved", type: "workflow" },
      { timestamp: "2024-10-14 09:12:15", user: "QuickBooks Connector", action: "Exported journal entry #JE-44919 with attached PDF", type: "integration" }
    ],
    boundingBoxes: {
      vendorName: { top: 9.0, left: 8.0, width: 42, height: 4.5, label: "Merchant: Delta", field: "vendorName", confidence: 0.998 },
      receiptNumber: { top: 9.0, left: 62, width: 30, height: 4.5, label: "Ticket #DL-994", field: "receiptNumber", confidence: 0.995 },
      receiptDate: { top: 14.5, left: 8.0, width: 34, height: 3.0, label: "Date: Oct 12", field: "receiptDate", confidence: 0.993 },
      lineItemsTable: { top: 32.0, left: 7.0, width: 86, height: 26.0, label: "Travel Expenses (3)", field: "lineItems", confidence: 0.989 },
      total: { top: 68.0, left: 55.0, width: 38, height: 6.0, label: "Total: $1,280.50", field: "total", confidence: 0.999 }
    }
  }
];

// RAG / Neural Q&A Knowledge Base for document intelligence search
export const RAG_KNOWLEDGE_BASE = [
  {
    queryKeywords: ["cloud", "cloudscale", "gpu", "infrastructure", "aws", "compute", "q3"],
    question: "What are our total cloud and infrastructure expenses across Q3?",
    answer: "Based on indexed records for Q3 2024, total cloud infrastructure expense is **$14,850.00 USD** billed by **CloudScale Technologies Inc.** under PO #`PO-77302-ENG`. The largest cost driver is 320 GPU cluster instance-hours ($9,200.00), followed by distributed NVMe storage ($2,450.00) and Enterprise SLA support ($1,850.00).",
    citations: [
      { docId: "DOC-2024-0891", title: "CloudScale Technologies - Q3 Invoice", snippet: "High-Performance GPU Clusters (320 Instance Hrs) @ $28.75 = $9,200.00", confidence: 0.994 }
    ],
    keyMetrics: [
      { label: "Vendor", value: "CloudScale Technologies" },
      { label: "Total Amount", value: "$14,850.00" },
      { label: "PO Match", value: "PO-77302-ENG (100% Match)" },
      { label: "Payment Status", value: "Pending AP Tax ID Verification" }
    ]
  },
  {
    queryKeywords: ["anomaly", "fraud", "bank", "mismatch", "warning", "horizon", "freight", "rate surge"],
    question: "Show all invoices with flagged bank account anomalies or rate surges",
    answer: "**Critical Anomaly Detected** in document `DOC-2024-0892` (**Horizon Global Logistics Ltd.**):\n\n1. **Bank Account Fraud Risk**: Remittance account lists *Wells Fargo #••••1109*, which does **not match** the established Vendor Master account (*Citibank #••••4491*). Potential Business Email Compromise (BEC).\n2. **Rate Surge**: Container Drayage unit rate is **$2,250/unit**, representing a **+38.4% surge** above the contracted rolling baseline ($1,625/unit), generating an unbudgeted surcharge of $7,500.00.",
    citations: [
      { docId: "DOC-2024-0892", title: "Horizon Global Logistics Bill", snippet: "Remit to: Wells Fargo Acct #••••1109 | Total: $42,300.00 (Flagged)", confidence: 0.948 }
    ],
    keyMetrics: [
      { label: "High Risk Flags", value: "2 Active" },
      { label: "Flagged Amount", value: "$42,300.00" },
      { label: "Action Required", value: "Voice Confirmation with Vendor CFO" }
    ]
  },
  {
    queryKeywords: ["contract", "renewal", "auto-renewal", "indemnification", "apex", "law", "msa", "delaware"],
    question: "Which contracts have auto-renewal or indemnification clauses over $100k?",
    answer: "Found **1 Active Master Services Agreement** with auto-renewal and high indemnification:\n\n• **Vendor**: Apex Dynamics Legal & Advisory LLC (`MSA-2024-NYC-09`)\n• **Term**: 24 Months (Effective Nov 1, 2024 through Oct 31, 2026)\n• **Indemnity Cap**: Capped at **$500,000.00 USD** (within QuolyTech corporate guidelines)\n• **Auto-Renewal Clause**: Renews automatically for consecutive 12-month periods unless written notice is served **60 days prior** to expiration (deadline: Sept 1, 2026)\n• **Annual Value**: $120,000.00 ($30,000 quarterly retainer).",
    citations: [
      { docId: "DOC-2024-0893", title: "Apex Dynamics - MSA Contract", snippet: "Clause 14.2: Agreement shall automatically renew for 1-year terms unless either party gives 60 days notice.", confidence: 0.984 }
    ],
    keyMetrics: [
      { label: "Annual Contract Value", value: "$120,000.00" },
      { label: "Indemnity Cap", value: "$500,000.00" },
      { label: "Governing Law", value: "Delaware" }
    ]
  },
  {
    queryKeywords: ["travel", "flight", "cfo", "delta", "hotel", "receipt", "hyatt"],
    question: "What is the breakdown of executive travel expenses this month?",
    answer: "Executive travel expenses totaled **$1,280.50 USD** submitted via receipt `DL-99418290` (Delta Air Lines & Hyatt Regency):\n\n• **Airfare**: Business First Class SFO -> JFK: $890.00\n• **Lodging**: Hyatt Regency Wall Street (1 Night): $255.00\n• **Ground Transport & Taxes**: $135.50\n• **Status**: Automatically reconciled against Corporate Platinum Card #9002 and synced to QuickBooks Online.",
    citations: [
      { docId: "DOC-2024-0894", title: "Delta & Hyatt Executive Receipt", snippet: "Total: $1,280.50 | Pre-approved under code EXP-CFO-2024-10", confidence: 0.992 }
    ],
    keyMetrics: [
      { label: "Total Reimbursed", value: "$1,280.50" },
      { label: "Policy Compliance", value: "100% (Pre-approved)" },
      { label: "ERP Export", value: "QuickBooks Online #JE-44919" }
    ]
  }
];

// Live Platform Executive Metrics
export const PLATFORM_METRICS = {
  timeSavedPerWeekHours: 19.2, // "Saves 19.2 hours a week"
  beforeManualHoursPerWeek: 22.4,
  afterDocuMindHoursPerWeek: 3.2,
  timeReductionPercent: 85.7,
  totalProcessedMonth: 1429,
  straightThroughProcessingRate: 84.6, // 84.6% auto-processed without human edits
  humanTouchRate: 15.4,
  avgProcessingSeconds: 18.4,
  manualProcessingMinutes: 45.0,
  errorRateAIPercent: 0.12,
  errorRateManualPercent: 4.8,
  anomaliesPreventedCount: 14,
  anomaliesPreventedDollars: 84200.00,
  activeQueueCount: 4,
  modelsStatus: "Operational (LayoutLMv3 + GPT-4o-Vision + Sentinel)"
};
