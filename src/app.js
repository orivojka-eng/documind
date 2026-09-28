// DocuMind - Autonomous AI Document Processing Engine
// Senior Product Designer & Full-Stack Implementation for QuolyTech
// Features: Kyma-style Intro Landing, Zero-Data Live Mode, Vector SVG Icons, Responsive Navigation

import { SAMPLE_DOCUMENTS, RAG_KNOWLEDGE_BASE, PLATFORM_METRICS } from './data.js';
import { exportDocumentToCSV, exportBatchDocumentsToCSV, exportDocumentToJSON } from './export.js';
import { icons } from './icons.js';

// Application State - Starts with ZERO DATA for live entry
const state = {
  documents: [], // Zero data initial state as requested!
  activeDocId: null,
  currentView: "intro", // Default view is the Kyma-inspired Intro Landing Page!
  activeSubtab: "fields", // fields | anomalies | workflow | audit
  heroSelectedDocIdx: 0,
  activeCurrency: "USD",
  currencyMultiplier: 1.0,
  currencySymbol: "$",
  filters: {
    type: "all",
    status: "all",
    search: ""
  },
  zoomLevel: 1.0,
  showBBoxes: true,
  laserScanning: false,
  exportTarget: "csv"
};

// DOM References Cache
let elements = {};

document.addEventListener("DOMContentLoaded", () => {
  initDOMElements();
  renderSVGIcons();
  initNavigation();
  initMobileDrawer();
  initIntroPage();
  initQueueTable();
  initStudio();
  initRAGSearch();
  initWorkflows();
  initROICalculator();
  initModals();
  initInboundEmailSimulation();
  
  updateKPICounters();
  renderQueueTable();

  // Welcome Toast
  showToast(
    "DocuMind Neural Core Ready",
    "Zero-Data standby mode active. Ingest live documents or stream demo batch.",
    "lime"
  );
});

function initDOMElements() {
  elements = {
    // Navigation
    navTabs: document.querySelectorAll("#main-nav-tabs .nav-tab-btn"),
    viewSections: document.querySelectorAll(".view-section"),
    queueBadgeCount: document.getElementById("queue-badge-count"),
    brandHomeBtn: document.getElementById("brand-home-btn"),

    // Mobile Navigation
    btnMobileMenu: document.getElementById("btn-mobile-menu"),
    mobileDrawer: document.getElementById("mobile-drawer"),
    mobileDrawerLinks: document.querySelectorAll(".mobile-drawer-link"),
    mobileDrawerQueueBadge: document.getElementById("mobile-drawer-queue-badge"),
    mobileBottomNavItems: document.querySelectorAll(".mobile-nav-item"),
    btnMobileDrawerLiveEntry: document.getElementById("btn-mobile-drawer-live-entry"),
    btnMobileDrawerStreamDemo: document.getElementById("btn-mobile-drawer-stream-demo"),
    
    // KPI Cards
    kpiQueueCount: document.getElementById("kpi-queue-count"),
    kpiQueueSubtext: document.getElementById("kpi-queue-subtext"),
    kpiNeedsReviewCount: document.getElementById("kpi-needs-review-count"),
    kpiAnomaliesCount: document.getElementById("kpi-anomalies-count"),
    kpiHoursSaved: document.getElementById("kpi-hours-saved"),

    // Header Action Buttons
    btnHeaderStreamDemo: document.getElementById("btn-header-stream-demo"),

    // Intro Page Elements
    heroLaserLine: document.getElementById("hero-laser-line"),
    btnHeroLaunchApp: document.getElementById("btn-hero-launch-app"),
    btnHeroLiveEntry: document.getElementById("btn-hero-live-entry"),
    btnHeroTestScan: document.getElementById("btn-hero-test-scan"),
    btnHeroInspectStudio: document.getElementById("btn-hero-inspect-studio"),
    btnHeroLoadDemoStream: document.getElementById("btn-hero-load-demo-stream"),
    btnHeroQuickApprove: document.getElementById("btn-hero-quick-approve"),
    heroPreviewVendor: document.getElementById("hero-preview-vendor"),
    heroPreviewRef: document.getElementById("hero-preview-ref"),
    heroPreviewTotal: document.getElementById("hero-preview-total"),
    heroFieldVendorCard: document.getElementById("hero-field-vendor-card"),
    heroFieldRefCard: document.getElementById("hero-field-ref-card"),
    heroFieldTotalCard: document.getElementById("hero-field-total-card"),
    heroBadgeConf: document.getElementById("hero-badge-conf"),
    heroBadgePo: document.getElementById("hero-badge-po"),
    heroBadgeCalc: document.getElementById("hero-badge-calc"),
    heroStatusPill: document.getElementById("hero-status-pill"),
    heroLatencyBadge: document.getElementById("hero-latency-badge"),
    heroJsonStream: document.getElementById("hero-json-stream"),
    heroDocChips: document.querySelectorAll(".hero-doc-chip"),
    btnBottomEnterLive: document.getElementById("btn-bottom-enter-live"),
    btnBottomStreamDemo: document.getElementById("btn-bottom-stream-demo"),

    // Interactive Document Sheet Elements
    docSheetCard: document.getElementById("doc-sheet-card"),
    docSheetLogoLetter: document.getElementById("doc-sheet-logo-letter"),
    docSheetVendorName: document.getElementById("doc-sheet-vendor-name"),
    docSheetDocType: document.getElementById("doc-sheet-doc-type"),
    docSheetRef: document.getElementById("doc-sheet-ref"),
    docSheetDate: document.getElementById("doc-sheet-date"),
    docSheetDesc1: document.getElementById("doc-sheet-desc-1"),
    docSheetAmt1: document.getElementById("doc-sheet-amt-1"),
    docSheetDesc2: document.getElementById("doc-sheet-desc-2"),
    docSheetAmt2: document.getElementById("doc-sheet-amt-2"),
    docSheetBankBar: document.getElementById("doc-sheet-bank-bar"),
    docSheetBankText: document.getElementById("doc-sheet-bank-text"),
    docSheetBankBadge: document.getElementById("doc-sheet-bank-badge"),
    docBankDot: document.getElementById("doc-bank-dot"),

    // Console Tabs & Panes
    tabHeroSmartExtract: document.getElementById("tab-hero-smart-extract"),
    tabHeroJsonStream: document.getElementById("tab-hero-json-stream"),
    paneHeroSmartExtract: document.getElementById("pane-hero-smart-extract"),
    paneHeroJsonStream: document.getElementById("pane-hero-json-stream"),
    heroSentinelBox: document.getElementById("hero-sentinel-box"),
    heroSentinelTitle: document.getElementById("hero-sentinel-title"),
    heroSentinelDesc: document.getElementById("hero-sentinel-desc"),
    heroSentinelIcon: document.getElementById("hero-sentinel-icon"),

    // Front-Page Neural Q&A Sandbox
    frontRagInput: document.getElementById("front-rag-input"),
    btnFrontRagSubmit: document.getElementById("btn-front-rag-submit"),
    frontPromptChips: document.querySelectorAll(".front-chip"),
    frontRagResultCard: document.getElementById("front-rag-result-card"),
    btnFrontOpenFullRag: document.getElementById("btn-front-open-full-rag"),

    // Front-Page Mini ROI Calculator
    miniCalcSlider: document.getElementById("mini-calc-slider"),
    miniCalcDisplay: document.getElementById("mini-calc-display"),
    miniCalcDollars: document.getElementById("mini-calc-dollars"),
    miniCalcHours: document.getElementById("mini-calc-hours"),
    currencyChips: document.querySelectorAll(".currency-chip"),

    // Feature Pillars & Pipeline Steps
    featurePillarCards: document.querySelectorAll("[data-launch-feature]"),
    flowStepBoxes: document.querySelectorAll("[data-flow-step]"),

    // Queue Table
    documentsTableBody: document.getElementById("documents-table-body"),
    queueSearchInput: document.getElementById("queue-search-input"),
    typeFilterBtns: document.querySelectorAll("#type-filter-group .filter-pill-btn"),
    statusFilterBtns: document.querySelectorAll("#status-filter-group .filter-pill-btn"),
    btnQueueStreamDemo: document.getElementById("btn-queue-stream-demo"),
    btnQueueAddLive: document.getElementById("btn-queue-add-live"),

    // Studio View
    studioDocSelector: document.getElementById("studio-doc-selector"),
    studioDocTitle: document.getElementById("studio-doc-title"),
    studioDocMetaInfo: document.getElementById("studio-doc-meta-info"),
    studioStatusBadge: document.getElementById("studio-status-badge"),
    studioConfidenceBar: document.getElementById("studio-confidence-bar"),
    studioConfidenceScore: document.getElementById("studio-confidence-score"),
    studioAnomaliesBadge: document.getElementById("studio-anomalies-badge"),
    documentSheetWrapper: document.getElementById("document-sheet-wrapper"),
    renderedDocumentSheet: document.getElementById("rendered-document-sheet"),
    boundingBoxesLayer: document.getElementById("bounding-boxes-layer"),
    ocrLaserBeam: document.getElementById("ocr-laser-beam"),
    btnToggleBBoxes: document.getElementById("btn-toggle-bboxes"),
    btnToggleLaser: document.getElementById("btn-toggle-laser"),
    btnZoomIn: document.getElementById("btn-zoom-in"),
    btnZoomOut: document.getElementById("btn-zoom-out"),
    btnZoomReset: document.getElementById("btn-zoom-reset"),
    reviewSubtabs: document.querySelectorAll(".review-subtab"),
    reviewTabContents: document.querySelectorAll(".review-tab-content"),
    studioLineItemsBody: document.getElementById("studio-line-items-body"),
    anomaliesListContainer: document.getElementById("anomalies-list-container"),
    studioWorkflowStepper: document.getElementById("studio-workflow-stepper"),
    studioAuditList: document.getElementById("studio-audit-list"),
    btnRejectDoc: document.getElementById("btn-reject-doc"),
    btnFlagDoc: document.getElementById("btn-flag-doc"),
    btnExportSingleCSV: document.getElementById("btn-export-single-csv"),
    btnApproveRoute: document.getElementById("btn-approve-route"),

    // Studio Input Fields
    inputVendorName: document.getElementById("input-vendorName"),
    inputTaxId: document.getElementById("input-taxId"),
    inputInvoiceNumber: document.getElementById("input-invoiceNumber"),
    inputPoNumber: document.getElementById("input-poNumber"),
    inputInvoiceDate: document.getElementById("input-invoiceDate"),
    inputDueDate: document.getElementById("input-dueDate"),
    inputSubtotal: document.getElementById("input-subtotal"),
    inputTaxAmount: document.getElementById("input-taxAmount"),
    inputTotal: document.getElementById("input-total"),
    lblDocNumber: document.getElementById("lbl-doc-number"),
    lblDocDate: document.getElementById("lbl-doc-date"),
    lblDueDate: document.getElementById("lbl-due-date"),

    // RAG Search
    ragSearchInput: document.getElementById("rag-search-input"),
    btnExecuteRAG: document.getElementById("btn-execute-rag"),
    promptChips: document.querySelectorAll(".prompt-chip"),
    ragResultsContainer: document.getElementById("rag-results-container"),

    // Workflows Kanban
    workflowsKanbanBoard: document.getElementById("workflows-kanban-board"),

    // ROI Calculator
    calcVolumeSlider: document.getElementById("calc-volume-slider"),
    calcVolumeDisplay: document.getElementById("calc-volume-display"),
    calcRateSlider: document.getElementById("calc-rate-slider"),
    calcRateDisplay: document.getElementById("calc-rate-display"),
    calcTimeSlider: document.getElementById("calc-time-slider"),
    calcTimeDisplay: document.getElementById("calc-time-display"),
    roiAnnualDollars: document.getElementById("roi-annual-dollars"),
    roiHoursSaved: document.getElementById("roi-hours-saved"),
    roiPayback: document.getElementById("roi-payback"),

    // Live Data Entry Modal
    liveEntryModal: document.getElementById("live-entry-modal"),
    btnOpenLiveEntryModal: document.getElementById("btn-open-live-entry-modal"),
    liveEntryForm: document.getElementById("live-entry-form"),
    entryDocType: document.getElementById("entry-doc-type"),
    entryVendorName: document.getElementById("entry-vendor-name"),
    entryInvoiceNumber: document.getElementById("entry-invoice-number"),
    entryTaxId: document.getElementById("entry-tax-id"),
    entryDocDate: document.getElementById("entry-doc-date"),
    entryDueDate: document.getElementById("entry-due-date"),
    entryLineDesc: document.getElementById("entry-line-desc"),
    entryTotalAmount: document.getElementById("entry-total-amount"),
    liveEntryProgress: document.getElementById("live-entry-progress"),
    liveStepText: document.getElementById("live-step-text"),
    livePctText: document.getElementById("live-pct-text"),
    liveProgressFill: document.getElementById("live-progress-fill"),
    quickFillBtns: document.querySelectorAll("[data-fill-preset]"),

    // Upload & Export Modals
    btnSimulateEmail: document.getElementById("btn-simulate-email"),
    btnOpenExportModal: document.getElementById("btn-open-export-modal"),
    uploadModal: document.getElementById("upload-modal"),
    exportModal: document.getElementById("export-modal"),
    closeModalBtns: document.querySelectorAll("[data-close-modal]"),
    sampleDocsQuickLoad: document.getElementById("sample-docs-quick-load"),
    btnStartOCRScan: document.getElementById("btn-start-ocr-scan"),
    uploadProgressContainer: document.getElementById("upload-progress-container"),
    uploadProgressFill: document.getElementById("upload-progress-fill"),
    uploadStatusStep: document.getElementById("upload-status-step"),
    uploadPercentText: document.getElementById("upload-percent-text"),
    exportTargetCards: document.querySelectorAll(".export-target-card"),
    exportPreviewBox: document.getElementById("export-preview-box"),
    btnTriggerDownloadExport: document.getElementById("btn-trigger-download-export"),
    toastContainer: document.getElementById("toast-container")
  };
}

// Inject vector SVG icons into placeholders
function renderSVGIcons(container = document) {
  container.querySelectorAll("[data-icon]").forEach(el => {
    const iconName = el.getAttribute("data-icon");
    if (icons[iconName]) {
      el.innerHTML = icons[iconName]();
    }
  });
}

/* ==========================================================================
   Navigation & View Routing
   ========================================================================== */
function initNavigation() {
  elements.navTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const view = tab.getAttribute("data-view");
      switchView(view);
    });
  });

  if (elements.brandHomeBtn) {
    elements.brandHomeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      switchView("intro");
    });
  }

  // Enterprise footer view links
  document.querySelectorAll("[data-footer-view]").forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const view = link.getAttribute("data-footer-view");
      if (view) {
        switchView(view);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  });
}

function initMobileDrawer() {
  // Mobile Hamburger Toggle
  if (elements.btnMobileMenu) {
    elements.btnMobileMenu.addEventListener("click", () => {
      elements.mobileDrawer.classList.toggle("open");
    });
  }

  // Mobile Drawer Links
  elements.mobileDrawerLinks.forEach(link => {
    link.addEventListener("click", () => {
      const view = link.getAttribute("data-drawer-view");
      if (view) {
        switchView(view);
        elements.mobileDrawer.classList.remove("open");
      }
    });
  });

  // Mobile Drawer CTA buttons
  if (elements.btnMobileDrawerLiveEntry) {
    elements.btnMobileDrawerLiveEntry.addEventListener("click", () => {
      elements.mobileDrawer.classList.remove("open");
      openModal("live-entry-modal");
    });
  }

  if (elements.btnMobileDrawerStreamDemo) {
    elements.btnMobileDrawerStreamDemo.addEventListener("click", () => {
      elements.mobileDrawer.classList.remove("open");
      loadEnterpriseDemoBatch();
    });
  }

  // Mobile Bottom Navigation Bar Items
  elements.mobileBottomNavItems.forEach(item => {
    item.addEventListener("click", () => {
      const view = item.getAttribute("data-mobile-view");
      if (view) {
        switchView(view);
      }
    });
  });
}

function switchView(viewName) {
  state.currentView = viewName;

  // Update desktop nav buttons
  elements.navTabs.forEach(tab => {
    tab.classList.toggle("active", tab.getAttribute("data-view") === viewName);
  });

  // Update mobile bottom nav items
  elements.mobileBottomNavItems.forEach(item => {
    item.classList.toggle("active", item.getAttribute("data-mobile-view") === viewName);
  });

  // Update mobile drawer links
  elements.mobileDrawerLinks.forEach(link => {
    link.classList.toggle("active", link.getAttribute("data-drawer-view") === viewName);
  });

  // Close mobile drawer if open
  if (elements.mobileDrawer) {
    elements.mobileDrawer.classList.remove("open");
  }

  // Update view sections
  elements.viewSections.forEach(section => {
    section.classList.toggle("active", section.id === `view-${viewName}`);
  });

  if (viewName === "queue") {
    renderQueueTable();
  } else if (viewName === "studio") {
    if (!state.activeDocId && state.documents.length > 0) {
      state.activeDocId = state.documents[0].id;
    }
    renderActiveDocumentStudio();
  } else if (viewName === "workflows") {
    renderWorkflowsKanban();
  } else if (viewName === "rag") {
    if (!elements.ragResultsContainer.hasChildNodes()) {
      executeRAGQuery(RAG_KNOWLEDGE_BASE[0].question);
    }
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ==========================================================================
   Intro Page Interactions & Hero Console
   ========================================================================== */
function initIntroPage() {
  // Header Action Buttons
  if (elements.btnHeaderStreamDemo) {
    elements.btnHeaderStreamDemo.addEventListener("click", loadEnterpriseDemoBatch);
  }

  // Launch workspace buttons
  if (elements.btnHeroLaunchApp) {
    elements.btnHeroLaunchApp.addEventListener("click", () => {
      if (elements.heroLaserLine) {
        elements.heroLaserLine.classList.add("scanning");
        setTimeout(() => {
          if (elements.heroLaserLine) elements.heroLaserLine.classList.remove("scanning");
        }, 700);
      }
      loadEnterpriseDemoBatch();
    });
  }

  if (elements.btnHeroLiveEntry) {
    elements.btnHeroLiveEntry.addEventListener("click", () => openModal("live-entry-modal"));
  }

  if (elements.btnBottomEnterLive) {
    elements.btnBottomEnterLive.addEventListener("click", () => openModal("live-entry-modal"));
  }

  // Stream demo batch buttons
  if (elements.btnHeroLoadDemoStream) {
    elements.btnHeroLoadDemoStream.addEventListener("click", loadEnterpriseDemoBatch);
  }
  if (elements.btnBottomStreamDemo) {
    elements.btnBottomStreamDemo.addEventListener("click", loadEnterpriseDemoBatch);
  }

  // Hero Document Chips Selector
  elements.heroDocChips.forEach(chip => {
    chip.addEventListener("click", () => {
      elements.heroDocChips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      const idx = parseInt(chip.getAttribute("data-hero-doc"), 10);
      updateHeroConsoleDoc(idx);
    });
  });

  // Hero "1-Click Approve" in console
  if (elements.btnHeroQuickApprove) {
    elements.btnHeroQuickApprove.addEventListener("click", () => {
      const doc = SAMPLE_DOCUMENTS[state.heroSelectedDocIdx];
      let existing = state.documents.find(d => d.id === doc.id);
      if (!existing) {
        existing = JSON.parse(JSON.stringify(doc));
        state.documents.unshift(existing);
      }
      existing.status = "approved";
      updateKPICounters();
      populateDocSelector();
      renderQueueTable();
      renderWorkflowsKanban();

      if (elements.heroStatusPill) {
        elements.heroStatusPill.className = "badge badge-lime";
        elements.heroStatusPill.textContent = "● 1-Click Approved & Synced";
      }

      showToast(
        "Document Approved & Routed",
        `${existing.vendor.name} (${existing.financials.total.toLocaleString("en-US", { style: "currency", currency: existing.meta.currency || "USD" })}) verified and dispatched to General Ledger.`,
        "lime"
      );
    });
  }

  // Console Right Tabs (Smart Extraction vs JSON Schema)
  if (elements.tabHeroSmartExtract && elements.tabHeroJsonStream) {
    elements.tabHeroSmartExtract.addEventListener("click", () => {
      elements.tabHeroSmartExtract.classList.add("active");
      elements.tabHeroJsonStream.classList.remove("active");
      if (elements.paneHeroSmartExtract) elements.paneHeroSmartExtract.style.display = "flex";
      if (elements.paneHeroJsonStream) elements.paneHeroJsonStream.style.display = "none";
    });

    elements.tabHeroJsonStream.addEventListener("click", () => {
      elements.tabHeroJsonStream.classList.add("active");
      elements.tabHeroSmartExtract.classList.remove("active");
      if (elements.paneHeroSmartExtract) elements.paneHeroSmartExtract.style.display = "none";
      if (elements.paneHeroJsonStream) elements.paneHeroJsonStream.style.display = "block";
    });
  }

  // Hero "Inspect in Studio"
  if (elements.btnHeroInspectStudio) {
    elements.btnHeroInspectStudio.addEventListener("click", () => {
      const doc = SAMPLE_DOCUMENTS[state.heroSelectedDocIdx];
      if (!state.documents.find(d => d.id === doc.id)) {
        state.documents.unshift(JSON.parse(JSON.stringify(doc)));
        updateKPICounters();
        populateDocSelector();
        renderQueueTable();
        renderWorkflowsKanban();
      }
      selectDocument(doc.id);
      switchView("studio");
      showToast("Opened in Studio", `Reviewing ${doc.id} (${doc.vendor.name})`, "lime");
    });
  }

  // Interactive Live OCR Scan in Hero Console with Laser Beam animation
  if (elements.btnHeroTestScan) {
    elements.btnHeroTestScan.addEventListener("click", () => {
      const doc = SAMPLE_DOCUMENTS[state.heroSelectedDocIdx];
      
      if (elements.heroLaserLine) {
        elements.heroLaserLine.classList.add("scanning");
      }

      elements.heroPreviewVendor.textContent = "Binarizing multimodal tokens...";
      elements.heroPreviewRef.textContent = "Extracting layout geometry (LayoutLMv3)...";
      elements.heroPreviewTotal.textContent = "Computing GL...";
      elements.heroStatusPill.className = "badge badge-warning";
      elements.heroStatusPill.textContent = "● OCR Scanning Active...";

      setTimeout(() => {
        elements.heroStatusPill.className = "badge badge-violet";
        elements.heroStatusPill.textContent = "● Validating Sentinel Rules...";
      }, 300);

      setTimeout(() => {
        if (elements.heroLaserLine) {
          elements.heroLaserLine.classList.remove("scanning");
        }
        updateHeroConsoleDoc(state.heroSelectedDocIdx);
        elements.heroStatusPill.className = "badge badge-lime";
        elements.heroStatusPill.textContent = "● Extraction Verified";
        showToast("Live OCR Simulation Completed", `Extracted ${doc.vendor.name} with 99.4% confidence.`, "lime");
      }, 650);
    });
  }

  // Interactive In-Console Field Editing
  if (elements.heroFieldVendorCard) {
    elements.heroFieldVendorCard.addEventListener("click", () => {
      const customVendors = [
        "CloudScale Technologies Inc.",
        "DeepMind Global Labs Inc.",
        "Anthropic PBC Solutions",
        "Stripe Payments Enterprise",
        "Apex Dynamics Law Corp"
      ];
      const nextIdx = (customVendors.indexOf(elements.heroPreviewVendor.textContent) + 1) % customVendors.length;
      elements.heroPreviewVendor.textContent = customVendors[nextIdx >= 0 ? nextIdx : 0];
      
      updateHeroJsonCustom({ vendorName: elements.heroPreviewVendor.textContent });
      showToast("Vendor Entity Updated", `Modified to: ${elements.heroPreviewVendor.textContent}`, "lime");
    });
  }

  if (elements.heroFieldTotalCard) {
    elements.heroFieldTotalCard.addEventListener("click", () => {
      const sampleTotals = ["$14,850.00 USD", "$24,500.00 USD", "$8,320.00 USD", "$49,000.00 USD"];
      const nextIdx = (sampleTotals.indexOf(elements.heroPreviewTotal.textContent) + 1) % sampleTotals.length;
      elements.heroPreviewTotal.textContent = sampleTotals[nextIdx >= 0 ? nextIdx : 0];
      
      const numTotal = parseFloat(elements.heroPreviewTotal.textContent.replace(/[^0-9.]/g, ''));
      updateHeroJsonCustom({ total: numTotal });
      showToast("Statutory Total Updated", `Calculated total: ${elements.heroPreviewTotal.textContent}`, "lime");
    });
  }

  // Front-Page Neural Q&A Sandbox
  initFrontRAGSandbox();

  // Front-Page Mini ROI Calculator
  initMiniROICalculator();

  // Feature Pillars Click-to-Launch
  elements.featurePillarCards.forEach(card => {
    card.addEventListener("click", () => {
      const feature = card.getAttribute("data-launch-feature");
      launchFeatureFromPillar(feature);
    });
  });

  // Pipeline Flow Steps Click-to-Test
  elements.flowStepBoxes.forEach(stepBox => {
    stepBox.addEventListener("click", () => {
      const step = stepBox.getAttribute("data-flow-step");
      simulatePipelineStep(step);
    });
  });

  // Populate hero console initial document state
  updateHeroConsoleDoc(0);
}

function updateHeroJsonCustom(overrides = {}) {
  const doc = SAMPLE_DOCUMENTS[state.heroSelectedDocIdx];
  if (!doc || !elements.heroJsonStream) return;

  const vendorName = overrides.vendorName || elements.heroPreviewVendor.textContent || doc.vendor.name;
  const total = overrides.total || doc.financials.total;

  elements.heroJsonStream.textContent = JSON.stringify({
    documentId: doc.id,
    type: doc.type.toUpperCase(),
    status: doc.status.toUpperCase(),
    vendor: {
      name: vendorName,
      taxId: doc.vendor.taxId,
      verifiedInMaster: doc.status !== "anomaly_flagged"
    },
    financials: {
      subtotal: Math.round(total * 0.9),
      tax: Math.round(total * 0.1),
      total: total,
      currency: state.activeCurrency || "USD"
    },
    sentinelCheck: {
      passed: doc.status !== "anomaly_flagged",
      anomaliesCount: doc.anomalies.length,
      fraudRisk: doc.status === "anomaly_flagged" ? "HIGH" : "NONE"
    }
  }, null, 2);
}

// Front-Page Neural Q&A Sandbox
function initFrontRAGSandbox() {
  if (!elements.frontRagResultCard) return;

  // Render initial default question
  renderFrontRAGResult("Which vendor had an unapproved bank account change?");

  // Preset chips click
  elements.frontPromptChips.forEach(chip => {
    chip.addEventListener("click", () => {
      elements.frontPromptChips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      const prompt = chip.getAttribute("data-front-prompt");
      if (elements.frontRagInput) elements.frontRagInput.value = prompt;
      renderFrontRAGResult(prompt);
    });
  });

  // Submit button
  if (elements.btnFrontRagSubmit) {
    elements.btnFrontRagSubmit.addEventListener("click", () => {
      const q = elements.frontRagInput ? elements.frontRagInput.value.trim() : "";
      if (q) renderFrontRAGResult(q);
    });
  }

  // Enter key on input
  if (elements.frontRagInput) {
    elements.frontRagInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const q = elements.frontRagInput.value.trim();
        if (q) renderFrontRAGResult(q);
      }
    });
  }

  // Open Full RAG Workspace button
  if (elements.btnFrontOpenFullRag) {
    elements.btnFrontOpenFullRag.addEventListener("click", () => {
      const q = elements.frontRagInput ? elements.frontRagInput.value.trim() : "";
      switchView("rag");
      if (q && elements.ragSearchInput) {
        elements.ragSearchInput.value = q;
        executeRAGQuery(q);
      }
    });
  }
}

function renderFrontRAGResult(query) {
  if (!elements.frontRagResultCard) return;

  // Match against knowledge base
  const qLower = query.toLowerCase();
  let match = RAG_KNOWLEDGE_BASE.find(item => {
    return item.queryKeywords.some(kw => qLower.includes(kw)) ||
           item.question.toLowerCase().includes(qLower);
  });

  if (!match) {
    match = RAG_KNOWLEDGE_BASE[0];
  }

  const citation = match.citations[0];
  const metricsHtml = match.keyMetrics.map(m => `
    <div style="background:var(--bg-surface-elevated); border:1px solid var(--border-subtle); border-radius:var(--radius-sm); padding:6px 12px;">
      <div style="font-size:0.68rem; color:var(--text-muted); text-transform:uppercase;">${m.label}</div>
      <div style="font-size:0.8rem; font-weight:700; color:var(--color-lime); font-family:var(--font-mono);">${m.value}</div>
    </div>
  `).join("");

  elements.frontRagResultCard.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
      <div style="display:flex; align-items:center; gap:8px;">
        <span class="badge badge-lime">● Multi-Doc Synthesized</span>
        <span style="font-size:0.75rem; color:var(--text-muted); font-family:var(--font-mono);">Confidence: 99.4%</span>
      </div>
      <div style="font-size:0.72rem; color:var(--text-violet); font-weight:600;">
        Source: ${citation.title}
      </div>
    </div>

    <div style="font-size:0.88rem; color:var(--text-primary); line-height:1.6; background:rgba(255,255,255,0.02); padding:14px; border-radius:var(--radius-md); border-left:3px solid var(--color-lime);">
      ${match.answer.replace(/\\n\\n/g, '<br><br>').replace(/\\*\\*(.*?)\\*\\*/g, '<strong style="color:var(--color-white);">$1</strong>')}
    </div>

    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); gap:10px;">
      ${metricsHtml}
    </div>

    <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid rgba(255,255,255,0.08); padding-top:10px; flex-wrap:wrap; gap:10px;">
      <div style="font-size:0.72rem; color:var(--text-muted);">
        Snippet: "<em>${citation.snippet}</em>"
      </div>
      <button class="btn btn-outline-violet btn-sm" id="btn-front-jump-studio" data-doc-id="${citation.docId}">
        <span>Inspect Source in Studio</span>
        <span>&rarr;</span>
      </button>
    </div>
  `;

  // Attach jump to studio button
  const jumpBtn = document.getElementById("btn-front-jump-studio");
  if (jumpBtn) {
    jumpBtn.addEventListener("click", () => {
      const docId = jumpBtn.getAttribute("data-doc-id");
      const sampleDoc = SAMPLE_DOCUMENTS.find(d => d.id === docId);
      if (sampleDoc && !state.documents.find(d => d.id === docId)) {
        state.documents.unshift(JSON.parse(JSON.stringify(sampleDoc)));
        updateKPICounters();
        populateDocSelector();
        renderQueueTable();
        renderWorkflowsKanban();
      }
      selectDocument(docId);
      switchView("studio");
      showToast("Loaded Source Document", `Inspecting ${citation.title} in Studio`, "lime");
    });
  }
}

// Mini ROI Calculator & Currency Switcher
function initMiniROICalculator() {
  if (elements.miniCalcSlider) {
    elements.miniCalcSlider.addEventListener("input", updateMiniROICalculator);
  }

  elements.currencyChips.forEach(chip => {
    chip.addEventListener("click", () => {
      elements.currencyChips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      const curr = chip.getAttribute("data-currency");
      state.activeCurrency = curr;
      if (curr === "EUR") {
        state.currencyMultiplier = 0.92;
        state.currencySymbol = "€";
      } else if (curr === "GBP") {
        state.currencyMultiplier = 0.78;
        state.currencySymbol = "£";
      } else {
        state.currencyMultiplier = 1.0;
        state.currencySymbol = "$";
      }
      updateMiniROICalculator();
      showToast("Currency Updated", `Calculation localized to ${curr} (${state.currencySymbol})`, "lime");
    });
  });

  updateMiniROICalculator();
}

function updateMiniROICalculator() {
  if (!elements.miniCalcSlider || !elements.miniCalcDisplay) return;

  const volume = parseInt(elements.miniCalcSlider.value, 10);
  elements.miniCalcDisplay.textContent = `${volume.toLocaleString()} docs/mo`;

  // 25 mins manual typing -> 2 mins oversight = 23 mins saved/doc
  const hoursSavedMonthly = volume * (23 / 60);
  const annualLaborSavings = hoursSavedMonthly * 42.0 * 12 * state.currencyMultiplier;
  const annualErrorSavings = volume * 12 * 0.048 * 85 * state.currencyMultiplier;
  const totalSavings = Math.round(annualLaborSavings + annualErrorSavings);

  elements.miniCalcDollars.textContent = `${state.currencySymbol}${totalSavings.toLocaleString()}`;
  elements.miniCalcHours.textContent = `${Math.round(hoursSavedMonthly).toLocaleString()} Hours Reclaimed Monthly`;
}

function launchFeatureFromPillar(feature) {
  if (feature === "ocr") {
    ensureDefaultDocLoaded();
    switchView("studio");
    setTimeout(() => {
      if (elements.btnToggleLaser) elements.btnToggleLaser.click();
    }, 200);
    showToast("Multimodal Vision OCR", "Split Studio opened with active token bounding boxes.", "lime");
  } else if (feature === "fraud" || feature === "sentinel") {
    const horizonDoc = SAMPLE_DOCUMENTS[1];
    if (!state.documents.find(d => d.id === horizonDoc.id)) {
      state.documents.unshift(JSON.parse(JSON.stringify(horizonDoc)));
      updateKPICounters();
      populateDocSelector();
      renderQueueTable();
      renderWorkflowsKanban();
    }
    selectDocument(horizonDoc.id);
    switchView("studio");
    switchReviewSubtab("anomalies");
    showToast("Sentinel Fraud Interception", "Horizon Logistics remittance mismatch highlighted.", "lime");
  } else if (feature === "studio" || feature === "review") {
    ensureDefaultDocLoaded();
    switchView("studio");
    showToast("Document Studio", "Split human-in-the-loop review interface ready.", "lime");
  } else if (feature === "erp" || feature === "workflow") {
    openModal("export-modal");
    showToast("Autonomous ERP Sync", "Choose CSV, NetSuite, or QuickBooks payload.", "lime");
  }
}

function simulatePipelineStep(step) {
  if (step === "1") {
    openModal("live-entry-modal");
    showToast("Pipeline Step 1: Ingestion", "Enter live document or select preset.", "lime");
  } else if (step === "2") {
    ensureDefaultDocLoaded();
    switchView("studio");
    setTimeout(() => {
      if (elements.btnToggleLaser && !state.laserScanning) elements.btnToggleLaser.click();
    }, 200);
    showToast("Pipeline Step 2: Visual OCR", "Running multimodal laser scan on document.", "lime");
  } else if (step === "3" || step === "4") {
    openModal("export-modal");
    showToast("Pipeline Step 3: GL Export", "NetSuite, QuickBooks & CSV export ready.", "lime");
  }
}

function ensureDefaultDocLoaded() {
  if (state.documents.length === 0) {
    state.documents.push(JSON.parse(JSON.stringify(SAMPLE_DOCUMENTS[0])));
    updateKPICounters();
    populateDocSelector();
    renderQueueTable();
    renderWorkflowsKanban();
  }
  if (!state.activeDocId) {
    state.activeDocId = state.documents[0].id;
  }
}

function updateHeroConsoleDoc(idx) {
  state.heroSelectedDocIdx = idx;
  const doc = SAMPLE_DOCUMENTS[idx];
  if (!doc) return;

  const isAnomaly = doc.status === "anomaly_flagged";
  const ref = doc.meta.invoiceNumber || doc.meta.contractId || doc.meta.receiptNumber;
  const total = doc.financials.total.toLocaleString("en-US", { style: "currency", currency: doc.meta.currency || "USD" });

  // 1. Update Left-Side Live Document Sheet Simulator
  if (elements.docSheetVendorName) elements.docSheetVendorName.textContent = doc.vendor.name;
  if (elements.docSheetLogoLetter) elements.docSheetLogoLetter.textContent = doc.vendor.name.charAt(0);
  if (elements.docSheetDocType) {
    elements.docSheetDocType.textContent = doc.type === 'invoice' 
      ? 'Commercial Services • Accounts Payable' 
      : (doc.type === 'contract' ? 'Master Services Agreement (MSA)' : 'Executive Travel Expense');
  }
  if (elements.docSheetRef) elements.docSheetRef.textContent = ref;
  if (elements.docSheetDate) elements.docSheetDate.textContent = 'Date: ' + (doc.meta.invoiceDate || '2024-10-15');

  // Update line items on sheet
  if (elements.docSheetDesc1 && elements.docSheetAmt1 && doc.lineItems && doc.lineItems.length > 0) {
    elements.docSheetDesc1.textContent = doc.lineItems[0].description;
    elements.docSheetAmt1.textContent = doc.lineItems[0].total.toLocaleString("en-US", { style: "currency", currency: doc.meta.currency || "USD" });
  }
  if (elements.docSheetDesc2 && elements.docSheetAmt2) {
    if (doc.lineItems && doc.lineItems.length > 1) {
      elements.docSheetDesc2.textContent = doc.lineItems[1].description;
      elements.docSheetAmt2.textContent = doc.lineItems[1].total.toLocaleString("en-US", { style: "currency", currency: doc.meta.currency || "USD" });
    } else {
      elements.docSheetDesc2.textContent = "Applicable Sales Tax & Processing";
      elements.docSheetAmt2.textContent = (doc.financials.taxAmount || 0).toLocaleString("en-US", { style: "currency", currency: doc.meta.currency || "USD" });
    }
  }

  // Update Bank Remittance Bar on Document Sheet
  if (elements.docSheetBankText && elements.docSheetBankBadge && elements.docBankDot) {
    if (isAnomaly) {
      elements.docSheetBankText.textContent = `${doc.vendor.bankAccount} • UNAPPROVED IBAN MODIFICATION`;
      elements.docSheetBankBadge.className = "badge badge-danger";
      elements.docSheetBankBadge.textContent = "Bank Mismatch Alert";
      elements.docBankDot.className = "bank-dot alert";
    } else {
      elements.docSheetBankText.textContent = `${doc.vendor.bankAccount} • Verified via Master Profile`;
      elements.docSheetBankBadge.className = "badge badge-lime";
      elements.docSheetBankBadge.textContent = "Verified Match";
      elements.docBankDot.className = "bank-dot";
    }
  }

  // 2. Update Right-Side Fields
  elements.heroPreviewVendor.textContent = doc.vendor.name;
  elements.heroPreviewRef.textContent = `${ref} • ${doc.meta.poNumber || 'No PO'}`;
  elements.heroPreviewTotal.textContent = total;

  if (isAnomaly) {
    elements.heroFieldVendorCard.className = "hero-live-field active-alert";
    elements.heroBadgeConf.className = "badge badge-danger";
    elements.heroBadgeConf.textContent = "Bank Mismatch Alert";
    elements.heroBadgePo.className = "badge badge-warning";
    elements.heroBadgePo.textContent = "Surge Flagged";

    if (elements.heroSentinelBox) {
      elements.heroSentinelBox.className = "hero-sentinel-box alert";
      if (elements.heroSentinelTitle) {
        elements.heroSentinelTitle.textContent = "Sentinel Fraud Interceptor: BLOCKED";
        elements.heroSentinelTitle.style.color = "#FF4757";
      }
      if (elements.heroSentinelDesc) {
        elements.heroSentinelDesc.textContent = "Unapproved bank remittance IBAN change detected. Wire dispatch held pending approval.";
      }
      if (elements.heroSentinelIcon) {
        elements.heroSentinelIcon.innerHTML = icons.alertTriangle ? icons.alertTriangle("", 18) : "";
      }
    }
  } else {
    elements.heroFieldVendorCard.className = "hero-live-field active-lime";
    elements.heroBadgeConf.className = "badge badge-lime";
    elements.heroBadgeConf.textContent = `${Math.round(doc.overallConfidence * 100)}% Match`;
    elements.heroBadgePo.className = "badge badge-violet";
    elements.heroBadgePo.textContent = "Verified";

    if (elements.heroSentinelBox) {
      elements.heroSentinelBox.className = "hero-sentinel-box";
      if (elements.heroSentinelTitle) {
        elements.heroSentinelTitle.textContent = "Sentinel Fraud Interceptor: Passed";
        elements.heroSentinelTitle.style.color = "var(--color-white)";
      }
      if (elements.heroSentinelDesc) {
        elements.heroSentinelDesc.textContent = "Bank remittance details match ERP Master Record. 0 anomalies detected.";
      }
      if (elements.heroSentinelIcon) {
        elements.heroSentinelIcon.innerHTML = icons.shieldCheck ? icons.shieldCheck("", 18) : "";
      }
    }
  }

  // 3. Update JSON Stream terminal
  elements.heroJsonStream.textContent = JSON.stringify({
    documentId: doc.id,
    type: doc.type.toUpperCase(),
    status: doc.status.toUpperCase(),
    vendor: {
      name: doc.vendor.name,
      taxId: doc.vendor.taxId,
      verifiedInMaster: !isAnomaly
    },
    financials: {
      subtotal: doc.financials.subtotal,
      tax: doc.financials.taxAmount,
      total: doc.financials.total,
      currency: doc.meta.currency || "USD"
    },
    sentinelCheck: {
      passed: !isAnomaly,
      anomaliesCount: doc.anomalies.length,
      fraudRisk: isAnomaly ? "HIGH" : "NONE"
    }
  }, null, 2);

  // Subtle Scan Laser Beam sweep on document switch
  if (elements.heroLaserLine) {
    elements.heroLaserLine.classList.add("scanning");
    setTimeout(() => {
      if (elements.heroLaserLine) elements.heroLaserLine.classList.remove("scanning");
    }, 400);
  }
}

function loadEnterpriseDemoBatch() {
  state.documents = JSON.parse(JSON.stringify(SAMPLE_DOCUMENTS));
  state.activeDocId = state.documents[0].id;

  updateKPICounters();
  populateDocSelector();
  renderQueueTable();
  renderWorkflowsKanban();

  showToast(
    "Enterprise Demo Stream Ingested",
    `Loaded 4 real-world documents (Invoices, MSA Contract, Travel Receipt).`,
    "lime"
  );

  switchView("queue");
}

/* ==========================================================================
   Queue View & Zero-Data Mode
   ========================================================================== */
function initQueueTable() {
  populateDocSelector();

  // Search input
  elements.queueSearchInput.addEventListener("input", (e) => {
    state.filters.search = e.target.value.toLowerCase().trim();
    renderQueueTable();
  });

  // Type filter pills
  elements.typeFilterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      elements.typeFilterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      state.filters.type = btn.getAttribute("data-filter-type");
      renderQueueTable();
    });
  });

  // Status filter pills
  elements.statusFilterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      elements.statusFilterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      state.filters.status = btn.getAttribute("data-filter-status");
      renderQueueTable();
    });
  });

  // Queue buttons
  if (elements.btnQueueStreamDemo) {
    elements.btnQueueStreamDemo.addEventListener("click", loadEnterpriseDemoBatch);
  }
  if (elements.btnQueueAddLive) {
    elements.btnQueueAddLive.addEventListener("click", () => {
      openModal("live-entry-modal");
    });
  }

  renderQueueTable();
}

function renderQueueTable() {
  // ZERO DATA EMPTY STATE
  if (state.documents.length === 0) {
    elements.documentsTableBody.innerHTML = `
      <tr>
        <td colspan="9" style="text-align:center; padding: 48px 16px;">
          <div class="zero-data-hero">
            <div class="zero-data-badge">
              ${icons.zap("", 14)}
              <span>Zero-Data Standby Active</span>
            </div>
            <div style="font-size:1.35rem; font-weight:800; color:var(--color-white); margin-bottom:6px;">
              No Documents in Ingestion Queue
            </div>
            <div style="font-size:0.85rem; color:var(--text-secondary); max-width:540px; margin:0 auto 24px;">
              DocuMind is awaiting incoming documents. You can enter a custom invoice or contract live, or stream the pre-configured enterprise demonstration batch.
            </div>
            <div style="display:flex; justify-content:center; gap:12px; flex-wrap:wrap;">
              <button class="btn btn-lime" onclick="document.getElementById('btn-open-live-entry-modal').click()">
                ${icons.plus("", 16)}
                <span>Enter Live Document (0-Data Mode)</span>
              </button>
              <button class="btn btn-secondary" id="btn-empty-load-stream">
                ${icons.play("", 16)}
                <span>Stream Enterprise Demo Batch (4 Docs)</span>
              </button>
            </div>
          </div>
        </td>
      </tr>
    `;

    const emptyStreamBtn = document.getElementById("btn-empty-load-stream");
    if (emptyStreamBtn) {
      emptyStreamBtn.addEventListener("click", loadEnterpriseDemoBatch);
    }
    return;
  }

  const filteredDocs = state.documents.filter(doc => {
    // Type filter
    if (state.filters.type !== "all" && doc.type !== state.filters.type) {
      return false;
    }
    // Status filter
    if (state.filters.status !== "all" && doc.status !== state.filters.status) {
      return false;
    }
    // Search query
    if (state.filters.search) {
      const q = state.filters.search;
      const matchTitle = doc.title.toLowerCase().includes(q);
      const matchVendor = doc.vendor.name.toLowerCase().includes(q);
      const matchId = doc.id.toLowerCase().includes(q);
      const matchDocNo = (doc.meta.invoiceNumber || doc.meta.contractId || doc.meta.receiptNumber || "").toLowerCase().includes(q);
      const matchPO = (doc.meta.poNumber || "").toLowerCase().includes(q);
      if (!matchTitle && !matchVendor && !matchId && !matchDocNo && !matchPO) {
        return false;
      }
    }
    return true;
  });

  if (filteredDocs.length === 0) {
    elements.documentsTableBody.innerHTML = `
      <tr>
        <td colspan="9" style="text-align:center; padding: 48px; color:var(--text-muted);">
          <div style="color:var(--text-muted); margin-bottom:8px;">${icons.search("", 32)}</div>
          <div style="font-size:0.95rem; font-weight:600; color:var(--text-secondary);">No documents match your filter criteria</div>
          <div style="font-size:0.75rem; margin-top:4px;">Try clearing filters or search keywords.</div>
        </td>
      </tr>
    `;
    return;
  }

  elements.documentsTableBody.innerHTML = filteredDocs.map(doc => {
    const isAnomaly = doc.status === "anomaly_flagged";
    const statusBadge = getStatusBadgeHTML(doc.status);
    const confidencePercent = Math.round(doc.overallConfidence * 100);
    const docRef = doc.meta.invoiceNumber || doc.meta.contractId || doc.meta.receiptNumber || "N/A";
    const docDate = doc.meta.invoiceDate || doc.meta.effectiveDate || doc.meta.receiptDate || "N/A";
    const dueDate = doc.meta.dueDate || doc.meta.expirationDate || "-";
    const formattedTotal = doc.financials.total.toLocaleString("en-US", { style: "currency", currency: doc.meta.currency || "USD" });
    const currentStageName = doc.workflow.stages.find(s => s.status === "in_progress")?.name || doc.workflow.stages[doc.workflow.stages.length - 1].name;

    let typeIcon = icons.fileText("", 16);
    if (doc.type === "contract") typeIcon = icons.layers("", 16);
    if (doc.type === "receipt") typeIcon = icons.dollarSign("", 16);

    return `
      <tr data-doc-id="${doc.id}">
        <td>
          <div class="doc-name-cell">
            <div class="doc-type-icon ${doc.type}">
              ${typeIcon}
            </div>
            <div>
              <div class="doc-meta-title">${escapeHTML(doc.title)}</div>
              <div class="doc-meta-sub">Ref: <strong>${escapeHTML(docRef)}</strong> &bull; ${doc.id}</div>
            </div>
          </div>
        </td>
        <td>
          <div style="font-weight:600; color:var(--color-white);">${escapeHTML(doc.vendor.name)}</div>
          <div style="font-size:0.72rem; color:var(--text-muted); font-family:var(--font-mono);">${doc.vendor.taxId || 'No Tax ID'}</div>
        </td>
        <td>
          <span style="font-size:0.75rem; text-transform:uppercase; font-weight:600; color:var(--text-secondary);">${doc.type}</span>
        </td>
        <td>
          <div style="font-size:0.78rem; color:var(--color-white);">${docDate}</div>
          <div style="font-size:0.7rem; color:var(--text-muted);">Due: ${dueDate}</div>
        </td>
        <td>
          <div style="display:flex; align-items:center; gap:8px;">
            <div style="width:48px; height:5px; background:rgba(255,255,255,0.1); border-radius:10px; overflow:hidden;">
              <div style="width:${confidencePercent}%; height:100%; background:${confidencePercent > 95 ? 'var(--color-lime)' : 'var(--status-warning)'};"></div>
            </div>
            <span style="font-size:0.75rem; font-weight:700; font-family:var(--font-mono); color:${confidencePercent > 95 ? 'var(--color-lime)' : 'var(--status-warning)'};">${confidencePercent}%</span>
          </div>
        </td>
        <td>
          ${statusBadge}
          ${isAnomaly ? `<div style="font-size:0.68rem; color:#FF6B81; margin-top:3px; font-weight:600;">Sentinel Alert</div>` : ''}
        </td>
        <td>
          <span class="amount-text">${formattedTotal}</span>
        </td>
        <td>
          <span style="font-size:0.75rem; color:var(--text-secondary);">${escapeHTML(currentStageName)}</span>
        </td>
        <td style="text-align: right;">
          <button class="btn btn-outline-violet btn-sm btn-open-studio" data-doc-id="${doc.id}">
            <span>Open Studio</span>
            ${icons.arrowRight("", 13)}
          </button>
        </td>
      </tr>
    `;
  }).join("");

  elements.documentsTableBody.querySelectorAll("tr[data-doc-id]").forEach(tr => {
    tr.addEventListener("click", () => {
      const docId = tr.getAttribute("data-doc-id");
      if (docId) {
        selectDocument(docId);
        switchView("studio");
      }
    });
  });
}

function getStatusBadgeHTML(status) {
  switch (status) {
    case "needs_review":
      return `<span class="badge badge-warning">Needs Review</span>`;
    case "anomaly_flagged":
      return `<span class="badge badge-danger">Anomaly Flagged</span>`;
    case "ready_approval":
      return `<span class="badge badge-violet">Ready for Sign-off</span>`;
    case "approved":
      return `<span class="badge badge-lime">Approved</span>`;
    case "exported":
      return `<span class="badge badge-neutral">Exported</span>`;
    default:
      return `<span class="badge badge-neutral">${status}</span>`;
  }
}

function updateKPICounters() {
  const total = state.documents.length;
  const needsReview = state.documents.filter(d => d.status === "needs_review").length;
  const anomalies = state.documents.filter(d => d.status === "anomaly_flagged").length;

  if (elements.queueBadgeCount) elements.queueBadgeCount.textContent = total;
  if (elements.mobileDrawerQueueBadge) elements.mobileDrawerQueueBadge.textContent = total;
  if (elements.kpiQueueCount) elements.kpiQueueCount.textContent = total;
  if (elements.kpiNeedsReviewCount) elements.kpiNeedsReviewCount.textContent = needsReview;
  if (elements.kpiAnomaliesCount) elements.kpiAnomaliesCount.textContent = anomalies;

  if (elements.kpiQueueSubtext) {
    elements.kpiQueueSubtext.textContent = total > 0 ? "Live active documents" : "Standby (0-Data Mode)";
  }
}

function populateDocSelector() {
  if (!elements.studioDocSelector) return;
  if (state.documents.length === 0) {
    elements.studioDocSelector.innerHTML = `<option value="">No documents loaded</option>`;
    return;
  }

  elements.studioDocSelector.innerHTML = state.documents.map(doc => `
    <option value="${doc.id}" ${doc.id === state.activeDocId ? 'selected' : ''}>
      ${doc.id} - ${doc.vendor.name} (${doc.type.toUpperCase()})
    </option>
  `).join("");

  elements.studioDocSelector.addEventListener("change", (e) => {
    if (e.target.value) {
      selectDocument(e.target.value);
    }
  });
}

/* ==========================================================================
   Document Studio & Bounding Box Engine
   ========================================================================== */
function initStudio() {
  elements.btnZoomIn.addEventListener("click", () => {
    if (state.zoomLevel < 1.6) {
      state.zoomLevel += 0.15;
      applyZoom();
    }
  });

  elements.btnZoomOut.addEventListener("click", () => {
    if (state.zoomLevel > 0.6) {
      state.zoomLevel -= 0.15;
      applyZoom();
    }
  });

  elements.btnZoomReset.addEventListener("click", () => {
    state.zoomLevel = 1.0;
    applyZoom();
  });

  elements.btnToggleBBoxes.addEventListener("click", () => {
    state.showBBoxes = !state.showBBoxes;
    elements.btnToggleBBoxes.classList.toggle("active", state.showBBoxes);
    elements.boundingBoxesLayer.style.display = state.showBBoxes ? "block" : "none";
    showToast(
      state.showBBoxes ? "Bounding Boxes Visible" : "Bounding Boxes Hidden",
      state.showBBoxes ? "Visual OCR coordinate mapping enabled." : "Showing raw document sheet only.",
      "violet"
    );
  });

  elements.btnToggleLaser.addEventListener("click", () => {
    state.laserScanning = !state.laserScanning;
    elements.btnToggleLaser.classList.toggle("active-lime", state.laserScanning);
    elements.ocrLaserBeam.classList.toggle("scanning", state.laserScanning);
    if (state.laserScanning) {
      showToast("Live Laser OCR Active", "Scanning layout geometry and extracting token features.", "lime");
    }
  });

  elements.reviewSubtabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const subtab = tab.getAttribute("data-subtab");
      switchReviewSubtab(subtab);
    });
  });

  elements.btnApproveRoute.addEventListener("click", handleApproveDocument);
  elements.btnFlagDoc.addEventListener("click", handleFlagDocument);
  elements.btnRejectDoc.addEventListener("click", handleRejectDocument);
  elements.btnExportSingleCSV.addEventListener("click", () => {
    const doc = getActiveDoc();
    if (doc) {
      exportDocumentToCSV(doc);
      showToast("Document Exported", `Downloaded ${doc.id} as structured CSV.`, "lime");
    }
  });

  attachInputListeners();
}

function switchReviewSubtab(subtab) {
  state.activeSubtab = subtab;
  elements.reviewSubtabs.forEach(t => t.classList.toggle("active", t.getAttribute("data-subtab") === subtab));
  elements.reviewTabContents.forEach(c => c.classList.toggle("active", c.id === `subtab-${subtab}`));
}

function applyZoom() {
  if (elements.documentSheetWrapper) {
    elements.documentSheetWrapper.style.transform = `scale(${state.zoomLevel})`;
    elements.btnZoomReset.textContent = `${Math.round(state.zoomLevel * 100)}%`;
  }
}

function selectDocument(docId) {
  state.activeDocId = docId;
  if (elements.studioDocSelector) {
    elements.studioDocSelector.value = docId;
  }
  renderActiveDocumentStudio();
}

function getActiveDoc() {
  if (!state.activeDocId && state.documents.length > 0) {
    state.activeDocId = state.documents[0].id;
  }
  return state.documents.find(d => d.id === state.activeDocId);
}

function renderActiveDocumentStudio() {
  const doc = getActiveDoc();
  if (!doc) {
    elements.renderedDocumentSheet.innerHTML = `
      <div style="text-align:center; padding: 100px 16px;">
        <div style="color:var(--color-lime); margin-bottom:12px;">${icons.zap("", 44)}</div>
        <h2 style="font-size:1.4rem; font-weight:800; color:#11141D; margin-bottom:8px;">
          Document Studio in Standby
        </h2>
        <p style="font-size:0.85rem; color:#666; max-width:400px; margin:0 auto 20px;">
          Enter custom data live or stream the enterprise demo batch to begin interactive split-screen review.
        </p>
        <button class="btn btn-lime" onclick="document.getElementById('btn-open-live-entry-modal').click()">
          ${icons.plus("", 16)} Enter Live Document
        </button>
      </div>
    `;
    elements.studioDocTitle.textContent = "Standby (No Document Selected)";
    elements.studioDocMetaInfo.textContent = "Please ingest a document to begin.";
    elements.studioStatusBadge.innerHTML = `<span class="badge badge-neutral">Standby</span>`;
    return;
  }

  elements.studioDocTitle.textContent = doc.title;
  elements.studioDocMetaInfo.innerHTML = `
    ID: <strong>${doc.id}</strong> &bull; Received via: <strong>${escapeHTML(doc.meta.receivedVia)}</strong> &bull; ${doc.meta.receivedAt}
  `;
  elements.studioStatusBadge.innerHTML = getStatusBadgeHTML(doc.status);

  const confPercent = Math.round(doc.overallConfidence * 100);
  elements.studioConfidenceBar.style.width = `${confPercent}%`;
  elements.studioConfidenceScore.textContent = `${(doc.overallConfidence * 100).toFixed(1)}%`;

  if (doc.anomalies && doc.anomalies.length > 0) {
    elements.studioAnomaliesBadge.style.display = "inline-block";
    elements.studioAnomaliesBadge.textContent = doc.anomalies.length;
  } else {
    elements.studioAnomaliesBadge.style.display = "none";
  }

  populateFormFields(doc);
  renderRealisticPaper(doc);
  renderBoundingBoxes(doc);
  renderAnomaliesTab(doc);
  renderWorkflowStepper(doc);
  renderAuditTrail(doc);
  setupHoverSync();
}

function populateFormFields(doc) {
  elements.inputVendorName.value = doc.vendor.name || "";
  elements.inputTaxId.value = doc.vendor.taxId || "";

  const docNumber = doc.meta.invoiceNumber || doc.meta.contractId || doc.meta.receiptNumber || "";
  elements.inputInvoiceNumber.value = docNumber;
  elements.inputPoNumber.value = doc.meta.poNumber || "N/A";

  if (doc.type === "contract") {
    elements.lblDocNumber.textContent = "Contract ID";
    elements.lblDocDate.textContent = "Effective Date";
    elements.lblDueDate.textContent = "Expiration Date";
  } else if (doc.type === "receipt") {
    elements.lblDocNumber.textContent = "Receipt Ticket #";
    elements.lblDocDate.textContent = "Receipt Date";
    elements.lblDueDate.textContent = "Reconciliation Due";
  } else {
    elements.lblDocNumber.textContent = "Invoice Number";
    elements.lblDocDate.textContent = "Issue Date";
    elements.lblDueDate.textContent = "Payment Due Date";
  }

  elements.inputInvoiceDate.value = doc.meta.invoiceDate || doc.meta.effectiveDate || doc.meta.receiptDate || "";
  elements.inputDueDate.value = doc.meta.dueDate || doc.meta.expirationDate || "";

  elements.inputSubtotal.value = (doc.financials.subtotal || 0).toFixed(2);
  elements.inputTaxAmount.value = (doc.financials.taxAmount || 0).toFixed(2);
  elements.inputTotal.value = (doc.financials.total || 0).toFixed(2);

  renderLineItemsTable(doc);
}

function renderLineItemsTable(doc) {
  if (!doc.lineItems || doc.lineItems.length === 0) {
    elements.studioLineItemsBody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center; color:var(--text-muted); padding:16px;">
          No itemized rows in this document. Summary record only.
        </td>
      </tr>
    `;
    return;
  }

  elements.studioLineItemsBody.innerHTML = doc.lineItems.map((item, idx) => `
    <tr data-line-id="${item.id}">
      <td>
        <input type="text" class="line-desc-input" data-index="${idx}" value="${escapeHTML(item.description)}">
      </td>
      <td>
        <input type="text" class="line-gl-input" data-index="${idx}" value="${escapeHTML(item.glCode || 'General')}">
      </td>
      <td>
        <input type="number" class="line-qty-input" data-index="${idx}" style="text-align:center;" value="${item.quantity}">
      </td>
      <td>
        <input type="number" step="0.01" class="line-price-input" data-index="${idx}" style="text-align:right;" value="${item.unitPrice.toFixed(2)}">
      </td>
      <td style="text-align:right; font-family:var(--font-mono); font-weight:700; color:var(--color-lime);">
        $${(item.total).toFixed(2)}
      </td>
    </tr>
  `).join("");

  elements.studioLineItemsBody.querySelectorAll("input").forEach(input => {
    input.addEventListener("input", () => {
      const idx = parseInt(input.getAttribute("data-index"), 10);
      const row = input.closest("tr");
      const qty = parseFloat(row.querySelector(".line-qty-input").value) || 0;
      const price = parseFloat(row.querySelector(".line-price-input").value) || 0;
      const desc = row.querySelector(".line-desc-input").value;
      const gl = row.querySelector(".line-gl-input").value;

      doc.lineItems[idx].quantity = qty;
      doc.lineItems[idx].unitPrice = price;
      doc.lineItems[idx].total = qty * price;
      doc.lineItems[idx].description = desc;
      doc.lineItems[idx].glCode = gl;

      const newSubtotal = doc.lineItems.reduce((acc, cur) => acc + cur.total, 0);
      doc.financials.subtotal = newSubtotal;
      doc.financials.total = newSubtotal + (doc.financials.taxAmount || 0);

      elements.inputSubtotal.value = doc.financials.subtotal.toFixed(2);
      elements.inputTotal.value = doc.financials.total.toFixed(2);

      renderRealisticPaper(doc);
    });
  });
}

function renderRealisticPaper(doc) {
  const isInvoice = doc.type === "invoice";
  const isContract = doc.type === "contract";
  const isReceipt = doc.type === "receipt";

  let paperContentHTML = "";

  if (isInvoice) {
    const isAnomalyDoc = doc.id === "DOC-2024-0892";
    paperContentHTML = `
      <div class="paper-header">
        <div>
          <div class="paper-vendor-title">${escapeHTML(doc.vendor.name)}</div>
          <div class="paper-vendor-meta">
            ${escapeHTML(doc.vendor.address || 'Enterprise Vendor Master')}<br>
            TIN/EIN: <strong>${escapeHTML(doc.vendor.taxId || 'N/A')}</strong> &bull; ${escapeHTML(doc.vendor.email || 'billing@vendor.io')}
          </div>
        </div>
        <div>
          <div class="paper-invoice-title">INVOICE</div>
          <div class="paper-invoice-meta">
            Invoice #: <strong>${escapeHTML(doc.meta.invoiceNumber)}</strong><br>
            PO Reference: <strong>${escapeHTML(doc.meta.poNumber || 'None')}</strong><br>
            Date: <strong>${doc.meta.invoiceDate || '2024-10-24'}</strong> &bull; Due: <strong>${doc.meta.dueDate || '2024-11-23'}</strong>
          </div>
        </div>
      </div>

      <div class="paper-details-grid">
        <div class="paper-detail-box">
          <h4>Billed To (Client):</h4>
          <p>QuolyTech Enterprise Systems Inc.<br>
          Attn: Finance &amp; Accounts Payable<br>
          100 Montgomery St, San Francisco, CA 94104</p>
        </div>
        <div class="paper-detail-box">
          <h4>Remittance Instructions:</h4>
          <p style="${isAnomalyDoc ? 'color:#FF3838; font-weight:700;' : ''}">
            Bank: ${escapeHTML(doc.vendor.bankAccount || 'JPMorgan Chase •••• 9924')}<br>
            Routing/ABA: ${escapeHTML(doc.vendor.routingNumber || '121000248')}<br>
            Terms: ${escapeHTML(doc.meta.paymentTerms || 'Net 30')}
          </p>
          ${isAnomalyDoc ? `<div style="font-size:0.68rem; color:#FF3838; font-weight:700; margin-top:2px;">[SENTINEL ALERT: Bank details do not match vendor master file!]</div>` : ''}
        </div>
      </div>

      <table class="paper-table">
        <thead>
          <tr>
            <th>Description &amp; Service Items</th>
            <th class="text-right" style="width:70px;">Qty/Hrs</th>
            <th class="text-right" style="width:90px;">Rate</th>
            <th class="text-right" style="width:100px;">Amount ($)</th>
          </tr>
        </thead>
        <tbody>
          ${doc.lineItems.map(item => `
            <tr>
              <td>
                <strong>${escapeHTML(item.description)}</strong>
                <div style="font-size:0.7rem; color:#70768A;">GL: ${escapeHTML(item.glCode || 'General')}</div>
              </td>
              <td class="text-right">${item.quantity}</td>
              <td class="text-right">$${item.unitPrice.toFixed(2)}</td>
              <td class="text-right" style="font-weight:700;">$${item.total.toFixed(2)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>

      <div class="paper-totals-wrapper">
        <table class="paper-totals-table">
          <tr>
            <td>Subtotal:</td>
            <td class="amount">$${doc.financials.subtotal.toFixed(2)}</td>
          </tr>
          <tr>
            <td>Taxes &amp; Statutory Fees:</td>
            <td class="amount">$${doc.financials.taxAmount.toFixed(2)}</td>
          </tr>
          <tr class="grand-total">
            <td>Total Due:</td>
            <td class="amount">$${doc.financials.total.toFixed(2)}</td>
          </tr>
        </table>
      </div>

      <div class="paper-footer-notes">
        <strong>Payment Terms:</strong> Payment is due according to agreed terms. Citations verified via DocuMind Multimodal Engine.
      </div>
    `;
  } else if (isContract) {
    paperContentHTML = `
      <div style="text-align:center; border-bottom:2px solid #11141D; padding-bottom:16px; margin-bottom:24px;">
        <div style="font-size:1.6rem; font-weight:900; letter-spacing:0.02em;">MASTER SERVICES AGREEMENT</div>
        <div style="font-size:0.75rem; color:#555A6B; margin-top:4px;">Document Reference: <strong>${escapeHTML(doc.meta.contractId)}</strong> &bull; Effective: <strong>${doc.meta.effectiveDate}</strong></div>
      </div>

      <div style="font-size:0.8rem; line-height:1.6; margin-bottom:20px;">
        This Master Services Agreement ("Agreement") is made between <strong>${escapeHTML(doc.vendor.name)}</strong> ("Counsel / Contractor") and <strong>QuolyTech Enterprise Systems Inc.</strong> ("Client").
      </div>

      <div style="background:#F7F8FA; border-left:4px solid var(--color-violet); padding:12px 16px; margin-bottom:20px; font-size:0.8rem;">
        <strong style="color:var(--color-violet-dark);">Section 4.1 — Governing Jurisdiction &amp; Venue:</strong><br>
        This Agreement shall be interpreted and governed in accordance with the laws of the <strong>${escapeHTML(doc.meta.governingLaw || 'Delaware')}</strong>.
      </div>

      <div style="background:#F7F8FA; border-left:4px solid var(--color-lime-dark); padding:12px 16px; margin-bottom:20px; font-size:0.8rem;">
        <strong style="color:#3B7000;">Section 9.3 — Limitation of Liability &amp; Indemnification Cap:</strong><br>
        Neither party's aggregate liability under this agreement shall exceed <strong>${escapeHTML(doc.meta.indemnityCap || '$500,000.00')}</strong>.
      </div>

      <div style="border-top:1px solid #DDD; padding-top:16px; display:flex; justify-content:space-between; font-size:0.8rem;">
        <div>
          <strong>Annual Consideration:</strong> ${escapeHTML(doc.meta.annualContractValue || '$120,000.00')}<br>
          <strong>Payment Terms:</strong> ${escapeHTML(doc.meta.paymentTerms || 'Net 45')}
        </div>
        <div style="text-align:right;">
          <div style="font-family:serif; font-style:italic; font-size:1.1rem; color:#0A3A82;">Victoria Sterling (General Counsel)</div>
          <div style="font-size:0.7rem; color:#888;">Cryptographically Verified</div>
        </div>
      </div>
    `;
  } else if (isReceipt) {
    paperContentHTML = `
      <div style="border:1px dashed #B0B5C4; padding:24px; border-radius:4px;">
        <div style="text-align:center; margin-bottom:20px;">
          <div style="font-size:1.4rem; font-weight:800; letter-spacing:-0.02em;">${escapeHTML(doc.vendor.name)}</div>
          <div style="font-size:0.75rem; color:#555A6B;">Merchant TIN: ${escapeHTML(doc.vendor.taxId || 'N/A')}</div>
          <div style="font-size:0.78rem; font-weight:700; margin-top:4px;">EXPENSE RECEIPT</div>
        </div>

        <table class="paper-table">
          <thead>
            <tr>
              <th>Expense Item</th>
              <th class="text-right">Amount ($)</th>
            </tr>
          </thead>
          <tbody>
            ${doc.lineItems.map(li => `
              <tr>
                <td>${escapeHTML(li.description)}</td>
                <td class="text-right" style="font-weight:600;">$${li.total.toFixed(2)}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>

        <div class="paper-totals-wrapper">
          <table class="paper-totals-table">
            <tr class="grand-total">
              <td>Total Reimbursed:</td>
              <td class="amount">$${doc.financials.total.toFixed(2)}</td>
            </tr>
          </table>
        </div>
      </div>
    `;
  }

  elements.renderedDocumentSheet.innerHTML = paperContentHTML;
}

function renderBoundingBoxes(doc) {
  elements.boundingBoxesLayer.innerHTML = "";
  if (!doc.boundingBoxes) return;

  Object.entries(doc.boundingBoxes).forEach(([fieldKey, box]) => {
    const isCritical = box.isCritical || false;
    const isFlagged = box.isFlagged || false;
    const confPercent = Math.round(box.confidence * 100);

    const boxEl = document.createElement("div");
    boxEl.className = `bbox-item ${isCritical || isFlagged ? 'flagged' : ''}`;
    boxEl.setAttribute("data-bbox-field", box.field || fieldKey);
    boxEl.style.top = `${box.top}%`;
    boxEl.style.left = `${box.left}%`;
    boxEl.style.width = `${box.width}%`;
    boxEl.style.height = `${box.height}%`;

    boxEl.innerHTML = `
      <div class="bbox-tag">
        ${escapeHTML(box.label)} (${confPercent}%)
      </div>
    `;

    boxEl.addEventListener("click", () => {
      focusFieldInput(box.field || fieldKey);
    });

    elements.boundingBoxesLayer.appendChild(boxEl);
  });
}

function setupHoverSync() {
  const bboxElements = elements.boundingBoxesLayer.querySelectorAll(".bbox-item");
  bboxElements.forEach(bbox => {
    const fieldKey = bbox.getAttribute("data-bbox-field");

    bbox.addEventListener("mouseenter", () => {
      highlightFieldCard(fieldKey, true);
    });

    bbox.addEventListener("mouseleave", () => {
      highlightFieldCard(fieldKey, false);
    });
  });

  const fieldCards = document.querySelectorAll(".field-card[data-bbox-target], .studio-line-items[data-bbox-target]");
  fieldCards.forEach(card => {
    const targetKey = card.getAttribute("data-bbox-target");
    const correspondingBBox = elements.boundingBoxesLayer.querySelector(`[data-bbox-field="${targetKey}"]`);

    card.addEventListener("mouseenter", () => {
      if (correspondingBBox) correspondingBBox.classList.add("active");
    });

    card.addEventListener("mouseleave", () => {
      if (correspondingBBox) correspondingBBox.classList.remove("active");
    });

    card.addEventListener("focusin", () => {
      if (correspondingBBox) {
        correspondingBBox.classList.add("active");
        correspondingBBox.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });

    card.addEventListener("focusout", () => {
      if (correspondingBBox) correspondingBBox.classList.remove("active");
    });
  });
}

function highlightFieldCard(fieldKey, isActive) {
  const card = document.querySelector(`.field-card[data-bbox-target="${fieldKey}"], .studio-line-items[data-bbox-target="${fieldKey}"]`);
  if (card) {
    card.classList.toggle("highlighted", isActive);
    if (isActive) {
      card.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }
}

function focusFieldInput(fieldKey) {
  const card = document.querySelector(`.field-card[data-bbox-target="${fieldKey}"] input, .studio-line-items[data-bbox-target="${fieldKey}"]`);
  if (card) {
    if (state.activeSubtab !== "fields") {
      const fieldTab = document.querySelector('.review-subtab[data-subtab="fields"]');
      if (fieldTab) fieldTab.click();
    }
    card.focus();
    showToast("Field Mapped", `Focused extracted field: ${fieldKey}`, "violet");
  }
}

function attachInputListeners() {
  const handleInputChange = (field, value) => {
    const doc = getActiveDoc();
    if (!doc) return;

    if (field === "vendorName") doc.vendor.name = value;
    if (field === "taxId") doc.vendor.taxId = value;
    if (field === "invoiceNumber") doc.meta.invoiceNumber = value;
    if (field === "poNumber") doc.meta.poNumber = value;
    if (field === "subtotal") doc.financials.subtotal = parseFloat(value) || 0;
    if (field === "taxAmount") doc.financials.taxAmount = parseFloat(value) || 0;
    if (field === "total") doc.financials.total = parseFloat(value) || 0;

    doc.auditTrail.unshift({
      timestamp: new Date().toLocaleTimeString(),
      user: "Human Reviewer (Sarah Chen)",
      action: `Modified ${field} to "${value}"`,
      type: "human"
    });

    renderRealisticPaper(doc);
    renderAuditTrail(doc);
  };

  elements.inputVendorName.addEventListener("change", (e) => handleInputChange("vendorName", e.target.value));
  elements.inputTaxId.addEventListener("change", (e) => handleInputChange("taxId", e.target.value));
  elements.inputInvoiceNumber.addEventListener("change", (e) => handleInputChange("invoiceNumber", e.target.value));
  elements.inputPoNumber.addEventListener("change", (e) => handleInputChange("poNumber", e.target.value));
  elements.inputSubtotal.addEventListener("change", (e) => handleInputChange("subtotal", e.target.value));
  elements.inputTaxAmount.addEventListener("change", (e) => handleInputChange("taxAmount", e.target.value));
  elements.inputTotal.addEventListener("change", (e) => handleInputChange("total", e.target.value));
}

function renderAnomaliesTab(doc) {
  if (!doc.anomalies || doc.anomalies.length === 0) {
    elements.anomaliesListContainer.innerHTML = `
      <div style="text-align:center; padding:32px 16px; color:var(--text-muted);">
        <div style="color:var(--color-lime); margin-bottom:8px;">${icons.shieldCheck("", 32)}</div>
        <div style="font-weight:700; color:var(--color-lime); font-size:0.95rem;">No Active Anomalies Detected</div>
        <div style="font-size:0.75rem; margin-top:4px;">Vendor master IBAN, rate bounds, and mathematical calculations all passed Sentinel rules.</div>
      </div>
    `;
    return;
  }

  elements.anomaliesListContainer.innerHTML = doc.anomalies.map(anom => `
    <div class="anomaly-item-card ${anom.severity}">
      <div class="anomaly-card-top">
        <div class="anomaly-title">
          <span>${icons.alertTriangle("", 16)}</span> ${escapeHTML(anom.title)}
        </div>
        <span class="badge ${anom.severity === 'critical' ? 'badge-danger' : 'badge-warning'}">
          ${anom.severity.toUpperCase()}
        </span>
      </div>
      <div class="anomaly-desc">
        ${escapeHTML(anom.description)}
      </div>
      <div class="anomaly-actions">
        <button class="btn btn-secondary btn-sm btn-resolve-anomaly" data-anom-id="${anom.id}">
          <span data-icon="checkCircle"></span> Verify &amp; Dismiss
        </button>
        <button class="btn btn-danger btn-sm btn-escalate-anomaly" data-anom-id="${anom.id}">
          Escalate to Treasury
        </button>
      </div>
    </div>
  `).join("");

  elements.anomaliesListContainer.querySelectorAll(".btn-resolve-anomaly").forEach(btn => {
    btn.addEventListener("click", () => {
      const anomId = btn.getAttribute("data-anom-id");
      doc.anomalies = doc.anomalies.filter(a => a.id !== anomId);
      if (doc.anomalies.length === 0) {
        doc.status = "ready_approval";
      }
      doc.auditTrail.unshift({
        timestamp: new Date().toLocaleTimeString(),
        user: "Sarah Chen (AP Reviewer)",
        action: `Resolved anomaly flag #${anomId} after out-of-band verification`,
        type: "human"
      });
      renderActiveDocumentStudio();
      updateKPICounters();
      showToast("Anomaly Resolved", "Flag cleared. Document updated to Ready for Approval.", "lime");
    });
  });

  elements.anomaliesListContainer.querySelectorAll(".btn-escalate-anomaly").forEach(btn => {
    btn.addEventListener("click", () => {
      showToast("Escalated to Treasury", "Notification dispatched to CFO & Security Sentinel Slack.", "warning");
    });
  });
}

function renderWorkflowStepper(doc) {
  if (!doc.workflow || !doc.workflow.stages) return;

  elements.studioWorkflowStepper.innerHTML = doc.workflow.stages.map(stage => {
    const isCompleted = stage.status === "completed";
    const isInProgress = stage.status === "in_progress";

    let statusClass = "pending";
    if (isCompleted) statusClass = "completed";
    if (isInProgress) statusClass = "in-progress";

    return `
      <div class="stepper-step ${statusClass}">
        <div class="step-node"></div>
        <div class="step-title">
          ${escapeHTML(stage.name)}
        </div>
        <div class="step-actor">${escapeHTML(stage.actor || 'Automated')}</div>
        <div class="step-time">${stage.timestamp ? stage.timestamp : 'Pending'}</div>
      </div>
    `;
  }).join("");
}

function renderAuditTrail(doc) {
  if (!doc.auditTrail) return;

  elements.studioAuditList.innerHTML = doc.auditTrail.map(log => `
    <div class="audit-entry">
      <div class="audit-meta">
        <span class="audit-user">${escapeHTML(log.user)}</span>
        <span class="audit-time">${escapeHTML(log.timestamp)}</span>
      </div>
      <div class="audit-action">${escapeHTML(log.action)}</div>
    </div>
  `).join("");
}

function handleApproveDocument() {
  const doc = getActiveDoc();
  if (!doc) return;

  const inProgressStage = doc.workflow.stages.find(s => s.status === "in_progress");
  if (inProgressStage) {
    inProgressStage.status = "completed";
    inProgressStage.timestamp = new Date().toLocaleTimeString();
  }

  const nextStage = doc.workflow.stages.find(s => s.status === "pending");
  if (nextStage) {
    nextStage.status = "in_progress";
    nextStage.timestamp = new Date().toLocaleTimeString();
    doc.status = "ready_approval";
  } else {
    doc.status = "approved";
  }

  doc.auditTrail.unshift({
    timestamp: new Date().toLocaleTimeString(),
    user: "Sarah Chen (AP Lead)",
    action: `Approved document for payment. Advanced to next milestone.`,
    type: "human"
  });

  renderActiveDocumentStudio();
  updateKPICounters();

  showToast(
    "Document Approved!",
    `Routed ${doc.id} (${doc.vendor.name}) to Controller Sign-off.`,
    "lime"
  );
}

function handleFlagDocument() {
  const doc = getActiveDoc();
  if (!doc) return;

  doc.status = "anomaly_flagged";
  doc.anomalies.push({
    id: `ANOM-${Date.now().toString().slice(-4)}`,
    severity: "high",
    type: "manual_flag",
    title: "Manual Inspection Flagged by AP Specialist",
    description: "Reviewer requested manual bank reconciliation and price cross-check.",
    resolved: false
  });

  doc.auditTrail.unshift({
    timestamp: new Date().toLocaleTimeString(),
    user: "Sarah Chen (AP Lead)",
    action: "Flagged document for investigation.",
    type: "human"
  });

  renderActiveDocumentStudio();
  updateKPICounters();
  showToast("Document Flagged", "Placed on hold and queued for compliance check.", "warning");
}

function handleRejectDocument() {
  const doc = getActiveDoc();
  if (!doc) return;

  doc.status = "needs_review";
  doc.auditTrail.unshift({
    timestamp: new Date().toLocaleTimeString(),
    user: "Sarah Chen (AP Lead)",
    action: "Rejected document. Requested revised PDF from vendor.",
    type: "human"
  });

  renderActiveDocumentStudio();
  showToast("Document Rejected", "Rejection notice sent back to vendor billing email.", "danger");
}

/* ==========================================================================
   Neural Search & RAG Q&A Engine
   ========================================================================== */
function initRAGSearch() {
  elements.btnExecuteRAG.addEventListener("click", () => {
    const q = elements.ragSearchInput.value.trim();
    if (q) executeRAGQuery(q);
  });

  elements.ragSearchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const q = elements.ragSearchInput.value.trim();
      if (q) executeRAGQuery(q);
    }
  });

  elements.promptChips.forEach(chip => {
    chip.addEventListener("click", () => {
      const q = chip.getAttribute("data-query");
      elements.ragSearchInput.value = q;
      executeRAGQuery(q);
    });
  });
}

function executeRAGQuery(queryString) {
  const queryLower = queryString.toLowerCase();
  
  let bestMatch = RAG_KNOWLEDGE_BASE.find(item => {
    return item.queryKeywords.some(kw => queryLower.includes(kw));
  }) || RAG_KNOWLEDGE_BASE[0];

  renderRAGAnswerCard(bestMatch, queryString);
}

function renderRAGAnswerCard(match, originalQuery) {
  elements.ragResultsContainer.innerHTML = `
    <div class="rag-answer-card">
      <div class="rag-answer-header">
        <div class="rag-ai-badge">
          ${icons.sparkles("", 18)}
          <span>DocuMind Grounded Intelligence</span>
        </div>
        <div style="font-size:0.75rem; color:var(--text-muted); font-family:var(--font-mono);">
          Latency: 380ms &bull; 4 Documents Indexed
        </div>
      </div>

      <div style="font-size:0.85rem; font-weight:700; color:var(--text-secondary); margin-bottom:8px;">
        Query: "${escapeHTML(originalQuery)}"
      </div>

      <div class="rag-answer-body">
        ${formatMarkdownBold(match.answer)}
      </div>

      <div class="rag-metrics-grid">
        ${match.keyMetrics.map(km => `
          <div class="rag-metric-tile">
            <div class="lbl">${escapeHTML(km.label)}</div>
            <div class="val">${escapeHTML(km.value)}</div>
          </div>
        `).join("")}
      </div>

      <div class="rag-citations-section">
        <div class="rag-citations-heading">Source Grounding Citations:</div>
        <div style="display:flex; gap:12px; flex-wrap:wrap;">
          ${match.citations.map(cit => `
            <div class="citation-chip" data-doc-id="${cit.docId}">
              <div style="color:var(--color-lime);">${icons.fileText("", 22)}</div>
              <div>
                <div style="font-size:0.82rem; font-weight:700; color:var(--color-white);">${escapeHTML(cit.title)}</div>
                <div style="font-size:0.7rem; color:var(--text-secondary);">${escapeHTML(cit.snippet)}</div>
              </div>
              <span class="badge badge-lime">${Math.round(cit.confidence * 100)}% Match</span>
            </div>
          `).join("")}
        </div>
      </div>
    </div>
  `;

  elements.ragResultsContainer.querySelectorAll(".citation-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      const docId = chip.getAttribute("data-doc-id");
      if (docId) {
        if (state.documents.length === 0) {
          loadEnterpriseDemoBatch();
        }
        selectDocument(docId);
        switchView("studio");
      }
    });
  });
}

function formatMarkdownBold(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--color-white);">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em style="color:var(--text-lime);">$1</em>')
    .replace(/`(.*?)`/g, '<code style="background:rgba(255,255,255,0.1); padding:1px 5px; border-radius:3px; font-family:var(--font-mono); font-size:0.8rem;">$1</code>');
}

/* ==========================================================================
   Approval Workflows Kanban
   ========================================================================== */
function initWorkflows() {
  renderWorkflowsKanban();
}

function renderWorkflowsKanban() {
  const columns = [
    { id: "ocr", title: "1. Ingestion & OCR", filter: doc => doc.status === "in_progress" },
    { id: "fraud", title: "2. Sentinel Risk & Anomaly", filter: doc => doc.status === "anomaly_flagged" },
    { id: "review", title: "3. AP Specialist Review", filter: doc => doc.status === "needs_review" },
    { id: "approval", title: "4. Controller Sign-off", filter: doc => doc.status === "ready_approval" },
    { id: "erp", title: "5. Synced to NetSuite", filter: doc => doc.status === "approved" || doc.status === "exported" }
  ];

  elements.workflowsKanbanBoard.innerHTML = columns.map(col => {
    const colDocs = state.documents.filter(col.filter);

    return `
      <div class="kanban-col">
        <div class="kanban-header">
          <span class="kanban-title">${col.title}</span>
          <span class="badge badge-neutral">${colDocs.length}</span>
        </div>

        <div style="display:flex; flex-direction:column; gap:10px; flex:1;">
          ${colDocs.map(doc => `
            <div class="kanban-card" data-doc-id="${doc.id}">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                <span style="font-size:0.7rem; font-weight:700; color:var(--text-violet); font-family:var(--font-mono);">${doc.id}</span>
                <span class="badge ${doc.status === 'anomaly_flagged' ? 'badge-danger' : 'badge-lime'}">${Math.round(doc.overallConfidence * 100)}%</span>
              </div>
              <div style="font-size:0.82rem; font-weight:700; color:var(--color-white); margin-bottom:4px;">
                ${escapeHTML(doc.vendor.name)}
              </div>
              <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.75rem; color:var(--text-secondary);">
                <span>${doc.type.toUpperCase()}</span>
                <strong style="color:var(--color-lime); font-family:var(--font-mono);">$${doc.financials.total.toFixed(2)}</strong>
              </div>
            </div>
          `).join("")}

          ${colDocs.length === 0 ? `
            <div style="text-align:center; padding:24px 0; color:var(--text-muted); font-size:0.75rem;">
              No documents in this queue
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }).join("");

  elements.workflowsKanbanBoard.querySelectorAll(".kanban-card").forEach(card => {
    card.addEventListener("click", () => {
      const docId = card.getAttribute("data-doc-id");
      if (docId) {
        selectDocument(docId);
        switchView("studio");
      }
    });
  });
}

/* ==========================================================================
   Executive ROI & Time-Saved Calculator
   ========================================================================== */
function initROICalculator() {
  const updateROI = () => {
    const volume = parseInt(elements.calcVolumeSlider.value, 10);
    const wage = parseFloat(elements.calcRateSlider.value);
    const minsPerDoc = parseFloat(elements.calcTimeSlider.value);

    elements.calcVolumeDisplay.textContent = `${volume.toLocaleString()} docs/mo`;
    elements.calcRateDisplay.textContent = `$${wage.toFixed(2)} / hr`;
    elements.calcTimeDisplay.textContent = `${minsPerDoc} minutes`;

    const manualHoursMonthly = volume * (minsPerDoc / 60);
    const docuMindHoursMonthly = (volume * (18 / 3600)) + (volume * 0.15 * (2 / 60));
    const hoursSavedMonthly = manualHoursMonthly - docuMindHoursMonthly;

    const annualLaborSavings = hoursSavedMonthly * wage * 12;
    const annualErrorSavings = volume * 12 * 0.048 * 85;
    const totalAnnualSavings = annualLaborSavings + annualErrorSavings;

    elements.roiAnnualDollars.textContent = `$${Math.round(totalAnnualSavings).toLocaleString()}`;
    elements.roiHoursSaved.textContent = `${Math.round(hoursSavedMonthly).toLocaleString()} hrs`;
    elements.roiPayback.textContent = volume > 2000 ? "< 18 Days" : "< 30 Days";
  };

  elements.calcVolumeSlider.addEventListener("input", updateROI);
  elements.calcRateSlider.addEventListener("input", updateROI);
  elements.calcTimeSlider.addEventListener("input", updateROI);

  updateROI();
}

/* ==========================================================================
   Modals & Live Data Ingestion
   ========================================================================== */
function initModals() {
  // Live Entry Modal triggers
  if (elements.btnOpenLiveEntryModal) {
    elements.btnOpenLiveEntryModal.addEventListener("click", () => {
      openModal("live-entry-modal");
    });
  }

  // Open Export Modal
  if (elements.btnOpenExportModal) {
    elements.btnOpenExportModal.addEventListener("click", () => {
      updateExportPreview();
      openModal("export-modal");
    });
  }

  // Close modals
  elements.closeModalBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const modalId = btn.getAttribute("data-close-modal");
      closeModal(modalId);
    });
  });

  // 1-Click Quick Fill Presets!
  elements.quickFillBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const preset = btn.getAttribute("data-fill-preset");
      if (preset === "cloud") {
        elements.entryDocType.value = "invoice";
        elements.entryVendorName.value = "CloudScale Technologies Inc.";
        elements.entryInvoiceNumber.value = "INV-2024-88921";
        elements.entryTaxId.value = "US-884102931";
        elements.entryDocDate.value = "2024-10-15";
        elements.entryDueDate.value = "2024-11-14";
        elements.entryLineDesc.value = "High-Performance GPU Clusters (A100-80GB) - 320 Instance Hrs";
        elements.entryTotalAmount.value = "14850.00";
      } else if (preset === "freight") {
        elements.entryDocType.value = "invoice";
        elements.entryVendorName.value = "Horizon Global Logistics Ltd.";
        elements.entryInvoiceNumber.value = "HZ-8921-OCT";
        elements.entryTaxId.value = "US-951239840";
        elements.entryDocDate.value = "2024-10-18";
        elements.entryDueDate.value = "2024-10-28";
        elements.entryLineDesc.value = "Ocean Intermodal Drayage - 40ft High Cube Containers x 12";
        elements.entryTotalAmount.value = "42300.00";
      } else if (preset === "legal") {
        elements.entryDocType.value = "contract";
        elements.entryVendorName.value = "Apex Dynamics Legal & Advisory LLC";
        elements.entryInvoiceNumber.value = "MSA-2024-NYC-09";
        elements.entryTaxId.value = "US-134902811";
        elements.entryDocDate.value = "2024-11-01";
        elements.entryDueDate.value = "2026-10-31";
        elements.entryLineDesc.value = "Quarterly Corporate Legal Retainer - SEC Governance & IP";
        elements.entryTotalAmount.value = "120000.00";
      } else if (preset === "travel") {
        elements.entryDocType.value = "receipt";
        elements.entryVendorName.value = "Delta Air Lines & Hyatt Regency";
        elements.entryInvoiceNumber.value = "DL-99418290";
        elements.entryTaxId.value = "US-580218548";
        elements.entryDocDate.value = "2024-10-12";
        elements.entryDueDate.value = "2024-10-20";
        elements.entryLineDesc.value = "Executive Travel SFO -> JFK (Business First) + 1 Night Hotel";
        elements.entryTotalAmount.value = "1280.50";
      }

      showToast("Preset Loaded", `Populated fields for ${elements.entryVendorName.value}`, "violet");
    });
  });

  // Live Data Entry Form Submission
  elements.liveEntryForm.addEventListener("submit", (e) => {
    e.preventDefault();

    elements.liveEntryProgress.style.display = "block";
    const btn = document.getElementById("btn-submit-live-entry");
    btn.disabled = true;

    const steps = [
      { pct: 25, text: "1. Binarizing layout and geometry..." },
      { pct: 55, text: "2. LayoutLMv3 Vision Token Extraction..." },
      { pct: 85, text: "3. Sentinel Anti-Fraud & PO Verification..." },
      { pct: 100, text: "4. Live Document Synthesized!" }
    ];

    let current = 0;
    const interval = setInterval(() => {
      if (current < steps.length) {
        elements.liveProgressFill.style.width = `${steps[current].pct}%`;
        elements.livePctText.textContent = `${steps[current].pct}%`;
        elements.liveStepText.textContent = steps[current].text;
        current++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          const newDocId = `DOC-2024-LIVE${(state.documents.length + 1).toString().padStart(3, '0')}`;
          const vendorName = elements.entryVendorName.value.trim();
          const docType = elements.entryDocType.value;
          const invoiceNum = elements.entryInvoiceNumber.value.trim();
          const taxId = elements.entryTaxId.value.trim();
          const docDate = elements.entryDocDate.value;
          const dueDate = elements.entryDueDate.value;
          const totalAmt = parseFloat(elements.entryTotalAmount.value) || 0;
          const lineDesc = elements.entryLineDesc.value.trim();
          const subtotal = totalAmt * 0.9;
          const taxAmt = totalAmt * 0.1;

          const createdDoc = {
            id: newDocId,
            title: `${vendorName} - ${docType.toUpperCase()}`,
            fileName: `${vendorName.replace(/\s+/g, '_')}_${invoiceNum}.pdf`,
            type: docType,
            vendor: {
              name: vendorName,
              address: "Live Ingested Partner Address",
              taxId: taxId || "US-99881029",
              email: "billing@vendor-live.io",
              bankAccount: "Citibank •••• 5590",
              routingNumber: "121000024",
              vendorId: `VEND-LIVE-${Date.now().toString().slice(-4)}`
            },
            meta: {
              invoiceNumber: invoiceNum,
              poNumber: "PO-LIVE-ENG-01",
              invoiceDate: docDate,
              dueDate: dueDate,
              currency: "USD",
              paymentTerms: "Net 30",
              receivedAt: new Date().toLocaleTimeString(),
              receivedVia: "Live User Entry"
            },
            financials: {
              subtotal: subtotal,
              taxRate: 10.0,
              taxAmount: taxAmt,
              total: totalAmt,
              discount: 0.00
            },
            lineItems: [
              {
                id: "LI-LIVE-1",
                description: lineDesc || "Live Ingested Service Entity",
                glCode: "6140 - Operations",
                quantity: 1,
                unitPrice: totalAmt,
                total: totalAmt,
                confidence: 0.99
              }
            ],
            status: "ready_approval",
            overallConfidence: 0.988,
            fieldConfidence: {
              vendorName: 0.995,
              taxId: 0.985,
              invoiceNumber: 0.998,
              total: 0.999
            },
            reviewNotes: "Entered live via user form. Layout tokens verified against Sentinel rules.",
            anomalies: [],
            workflow: {
              currentStage: "specialist_review",
              stages: [
                { name: "Live Ingestion & Multi-page OCR", status: "completed", timestamp: new Date().toLocaleTimeString(), actor: "DocuMind Live Engine" },
                { name: "Schema Extraction & Matching", status: "completed", timestamp: new Date().toLocaleTimeString(), actor: "DocuMind LLM" },
                { name: "AP Human Reviewer", status: "in_progress", timestamp: new Date().toLocaleTimeString(), actor: "Sarah Chen (AP Lead)" },
                { name: "Controller Sign-off", status: "pending", timestamp: null, actor: "David Kim" },
                { name: "ERP Synced", status: "pending", timestamp: null, actor: "NetSuite REST" }
              ]
            },
            auditTrail: [
              { timestamp: new Date().toLocaleTimeString(), user: "Live User Ingestion", action: `Document entered live via portal. Extracted $${totalAmt.toFixed(2)}`, type: "system" }
            ],
            boundingBoxes: {
              vendorName: { top: 7.5, left: 6.5, width: 40, height: 4.5, label: "Vendor Name", field: "vendorName", confidence: 0.995 },
              taxId: { top: 12.2, left: 6.5, width: 26, height: 2.8, label: "Tax ID", field: "taxId", confidence: 0.985 },
              invoiceNumber: { top: 7.5, left: 65, width: 28, height: 4.5, label: "Invoice #", field: "invoiceNumber", confidence: 0.998 },
              invoiceDate: { top: 12.5, left: 65, width: 28, height: 2.8, label: "Date", field: "invoiceDate", confidence: 0.992 },
              lineItemsTable: { top: 38.0, left: 6.0, width: 88, height: 20.0, label: "Line Item", field: "lineItems", confidence: 0.99 },
              total: { top: 72.0, left: 60.0, width: 34, height: 5.2, label: `Total $${totalAmt.toFixed(2)}`, field: "total", confidence: 0.999 }
            }
          };

          state.documents.unshift(createdDoc);
          state.activeDocId = createdDoc.id;

          elements.liveEntryProgress.style.display = "none";
          btn.disabled = false;
          closeModal("live-entry-modal");

          updateKPICounters();
          populateDocSelector();
          renderQueueTable();
          renderWorkflowsKanban();

          showToast("Live Document Ingested!", `Added ${createdDoc.id} (${vendorName}). Opening in Studio...`, "lime");
          switchView("studio");
        }, 500);
      }
    }, 300);
  });

  // Render Sample Quick-Loaders in Upload Modal
  elements.sampleDocsQuickLoad.innerHTML = SAMPLE_DOCUMENTS.map(doc => `
    <button class="btn btn-secondary btn-sm" style="justify-content:space-between;" data-load-sample="${doc.id}">
      <span style="display:flex; align-items:center; gap:8px;"><span data-icon="fileText"></span> <span>${escapeHTML(doc.title)}</span></span>
      <span class="badge ${doc.status === 'anomaly_flagged' ? 'badge-danger' : 'badge-lime'}">${doc.type.toUpperCase()}</span>
    </button>
  `).join("");

  elements.sampleDocsQuickLoad.querySelectorAll("[data-load-sample]").forEach(btn => {
    btn.addEventListener("click", () => {
      const docId = btn.getAttribute("data-load-sample");
      if (!state.documents.find(d => d.id === docId)) {
        const found = SAMPLE_DOCUMENTS.find(d => d.id === docId);
        if (found) state.documents.push(JSON.parse(JSON.stringify(found)));
      }
      closeModal("upload-modal");
      updateKPICounters();
      populateDocSelector();
      selectDocument(docId);
      switchView("studio");
      showToast("Document Loaded", `Switched to ${docId}`, "lime");
    });
  });

  // Export Target selection
  elements.exportTargetCards.forEach(card => {
    card.addEventListener("click", () => {
      elements.exportTargetCards.forEach(c => {
        c.style.borderColor = "var(--border-subtle)";
        c.classList.remove("selected");
      });
      card.style.borderColor = "var(--color-lime)";
      card.classList.add("selected");
      state.exportTarget = card.getAttribute("data-target");
      updateExportPreview();
    });
  });

  // Export Download Trigger
  elements.btnTriggerDownloadExport.addEventListener("click", () => {
    const doc = getActiveDoc();
    if (!doc) {
      showToast("No Document Selected", "Please ingest a document first before exporting.", "warning");
      closeModal("export-modal");
      return;
    }

    if (state.exportTarget === "csv") {
      exportDocumentToCSV(doc);
      showToast("CSV Downloaded", "Structured spreadsheet downloaded to your computer.", "lime");
    } else if (state.exportTarget === "json") {
      exportDocumentToJSON(doc);
      showToast("JSON Downloaded", "Standardized REST API payload downloaded.", "violet");
    } else if (state.exportTarget === "netsuite") {
      showToast("NetSuite Sync Complete", "Bill & PO Match record #BILL-8891 created via SuiteTalk.", "lime");
    } else if (state.exportTarget === "quickbooks") {
      showToast("QuickBooks Online Synced", "Journal entry #JE-9042 successfully exported with PDF.", "lime");
    }

    closeModal("export-modal");
  });
}

function updateExportPreview() {
  const doc = getActiveDoc();
  if (!doc) {
    elements.exportPreviewBox.textContent = "// No document active. Please ingest a document to preview exports.";
    return;
  }

  if (state.exportTarget === "json") {
    elements.exportPreviewBox.textContent = JSON.stringify({
      schema: "DocuMind_Extract_v4",
      docId: doc.id,
      vendor: doc.vendor.name,
      taxId: doc.vendor.taxId,
      total: doc.financials.total,
      currency: doc.meta.currency || "USD",
      confidence: doc.overallConfidence,
      lineItemsCount: doc.lineItems.length
    }, null, 2);
  } else if (state.exportTarget === "csv") {
    elements.exportPreviewBox.textContent = `DocID,Vendor,Date,Subtotal,Tax,Total,Status\n${doc.id},"${doc.vendor.name}",${doc.meta.invoiceDate || '2024-10-24'},${doc.financials.subtotal},${doc.financials.taxAmount},${doc.financials.total},${doc.status}`;
  } else if (state.exportTarget === "netsuite") {
    elements.exportPreviewBox.textContent = `<NetSuiteBill>\n  <vendorId>${doc.vendor.vendorId}</vendorId>\n  <tranId>${doc.meta.invoiceNumber}</tranId>\n  <amount>${doc.financials.total}</amount>\n  <approvalStatus>Approved</approvalStatus>\n</NetSuiteBill>`;
  } else if (state.exportTarget === "quickbooks") {
    elements.exportPreviewBox.textContent = `POST /v3/company/9130/bill\n{\n  "VendorRef": { "name": "${doc.vendor.name}" },\n  "TotalAmt": ${doc.financials.total},\n  "DocNumber": "${doc.meta.invoiceNumber}"\n}`;
  }
}

function openModal(modalId) {
  const m = document.getElementById(modalId);
  if (m) m.classList.add("open");
}

function closeModal(modalId) {
  const m = document.getElementById(modalId);
  if (m) m.classList.remove("open");
}

/* ==========================================================================
   Simulate Inbound Email Processing
   ========================================================================== */
function initInboundEmailSimulation() {
  if (elements.btnSimulateEmail) {
    elements.btnSimulateEmail.addEventListener("click", () => {
      if (!state.documents.find(d => d.id === "DOC-2024-0891")) {
        state.documents.unshift(JSON.parse(JSON.stringify(SAMPLE_DOCUMENTS[0])));
        updateKPICounters();
        populateDocSelector();
        renderQueueTable();
        renderWorkflowsKanban();
      }

      showToast(
        "Inbound Email Ingested",
        "Received: New Invoice from billing@cloudscale.io (2 attachments). Autonomous OCR pipeline triggered.",
        "lime"
      );

      setTimeout(() => {
        selectDocument("DOC-2024-0891");
        switchView("studio");
      }, 800);
    });
  }
}

/* ==========================================================================
   Toast Notification System
   ========================================================================== */
function showToast(title, message, type = "lime") {
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;

  let iconSVG = icons.checkCircle("", 18);
  if (type === "warning") iconSVG = icons.alertTriangle("", 18);
  if (type === "danger") iconSVG = icons.x("", 18);
  if (type === "violet") iconSVG = icons.sparkles("", 18);

  toast.innerHTML = `
    <div class="toast-icon">${iconSVG}</div>
    <div class="toast-content">
      <div class="toast-title">${escapeHTML(title)}</div>
      <div class="toast-message">${escapeHTML(message)}</div>
    </div>
  `;

  elements.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(20px)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, 4000);
}

function escapeHTML(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
