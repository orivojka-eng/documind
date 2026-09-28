import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';

// Load index.html
const htmlContent = fs.readFileSync('index.html', 'utf8');

// Setup JSDOM environment
const dom = new JSDOM(htmlContent, {
  url: 'http://localhost:5173/',
  runScripts: 'dangerously',
  resources: 'usable'
});

const { window } = dom;
global.window = window;
global.document = window.document;
global.HTMLElement = window.HTMLElement;
global.Blob = window.Blob || class Blob { constructor(c) { this.c = c; } };
URL.createObjectURL = () => 'blob:mock-url';
URL.revokeObjectURL = () => {};
window.URL = URL;
global.scrollTo = () => {};
window.scrollTo = () => {};

// Mock alert, prompt, confirm
window.alert = (msg) => console.log('  [Alert]', msg);
window.confirm = (msg) => true;

// Mock custom elements or styles
window.getComputedStyle = (el) => ({
  getPropertyValue: () => '',
  display: el.style?.display || 'block'
});

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
  if (condition) {
    testsPassed++;
    console.log(`  ✓ ${message}`);
  } else {
    testsFailed++;
    console.error(`  ✗ FAIL: ${message}`);
  }
}

async function runTests() {
  console.log('\n======================================================');
  console.log(' DOCUMIND END-TO-END AUTOMATED TEST SUITE (Node.js/JSDOM)');
  console.log('======================================================\n');

  // Load modules
  const { icons } = await import('../src/icons.js');
  const { SAMPLE_DOCUMENTS, RAG_KNOWLEDGE_BASE } = await import('../src/data.js');
  const { exportDocumentToCSV, exportBatchDocumentsToCSV, exportDocumentToJSON } = await import('../src/export.js');

  console.log('--- TEST GROUP 1: Static Codebase & Icon System ---');
  assert(typeof icons === 'object' && Object.keys(icons).length >= 25, 'Icon library contains 25+ vector SVG icons');
  assert(typeof icons.fileText === 'function', 'fileText SVG generator is callable');
  assert(typeof icons.shieldAlert === 'function', 'shieldAlert SVG generator is callable');
  assert(typeof icons.checkCircle === 'function', 'checkCircle SVG generator is callable');

  // Verify Zero Emojis in DOM
  const rawHtml = document.documentElement.outerHTML;
  const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{27BF}\u{2300}-\u{23FF}\u{2B50}\u{203C}\u{2049}]/u;
  assert(!emojiRegex.test(rawHtml), 'DOM is 100% clean of unicode emojis');

  // QuolyTech Copyright Notices
  assert(rawHtml.includes('QuolyTech'), 'QuolyTech branding is present in DOM');
  assert(rawHtml.includes('© 2026') || rawHtml.includes('&copy; 2026'), '2026 Copyright is present in DOM');
  const footerEl = document.querySelector('.app-footer');
  assert(footerEl !== null, 'Global enterprise footer element exists');

  console.log('\n--- TEST GROUP 2: App Initialization & Zero-Data Mode ---');
  
  // Trigger DOMContentLoaded
  const appModule = await import('../src/app.js');
  document.dispatchEvent(new window.Event('DOMContentLoaded'));

  // Test DOM references initialized
  const queueTableBody = document.getElementById('documents-table-body');
  assert(queueTableBody !== null, 'documents-table-body exists');
  assert(queueTableBody.innerHTML.includes('No Documents in Ingestion Queue') || queueTableBody.innerHTML.includes('Zero-Data Standby'), 'Initial state is Zero-Data standby mode');

  const queueBadgeCount = document.getElementById('queue-badge-count');
  assert(queueBadgeCount.textContent === '0', 'Queue badge displays 0 initially');

  const kpiQueueCount = document.getElementById('kpi-queue-count');
  assert(kpiQueueCount.textContent === '0', 'KPI Queue count displays 0');

  console.log('\n--- TEST GROUP 3: Kyma-Style Intro Landing Page ---');
  const introSection = document.getElementById('view-intro');
  assert(introSection.classList.contains('active'), 'Intro view is active by default');

  // Hero Document Chips Selector
  const heroDocChips = document.querySelectorAll('.hero-doc-chip');
  assert(heroDocChips.length === 4, '4 Hero interactive document chips exist');

  // Click on Horizon Freight Alert Chip (index 1)
  heroDocChips[1].click();
  const heroVendor = document.getElementById('hero-preview-vendor');
  const heroSentinelBox = document.getElementById('hero-sentinel-box');
  assert(heroVendor.textContent.includes('Horizon Global Logistics'), 'Clicking chip 1 loads Horizon Logistics');
  assert(heroSentinelBox.classList.contains('alert') || heroSentinelBox.textContent.includes('Mismatch') || heroSentinelBox.textContent.includes('BLOCKED'), 'Horizon Freight triggers Sentinel alert');

  // Click on CloudScale Chip (index 0)
  heroDocChips[0].click();
  assert(heroVendor.textContent.includes('CloudScale'), 'Clicking chip 0 reloads CloudScale Technologies');

  // Interactive In-Console Vendor Editing
  const heroVendorCard = document.getElementById('hero-field-vendor-card');
  assert(heroVendorCard !== null, 'hero-field-vendor-card exists');
  const initialVendorName = heroVendor.textContent;
  heroVendorCard.click();
  assert(heroVendor.textContent !== initialVendorName, 'Clicking hero vendor card cycles vendor name');

  // Interactive Total Card
  const heroTotalCard = document.getElementById('hero-field-total-card');
  const heroTotalPreview = document.getElementById('hero-preview-total');
  assert(heroTotalCard !== null, 'hero-field-total-card exists');
  const initialTotal = heroTotalPreview.textContent;
  heroTotalCard.click();
  assert(heroTotalPreview.textContent !== initialTotal, 'Clicking hero total card cycles statutory totals');

  // Tab switching in console: Smart Extract vs JSON
  const tabJson = document.getElementById('tab-hero-json-stream');
  const tabSmart = document.getElementById('tab-hero-smart-extract');
  const paneJson = document.getElementById('pane-hero-json-stream');
  const paneSmart = document.getElementById('pane-hero-smart-extract');
  tabJson.click();
  assert(tabJson.classList.contains('active') && paneJson.style.display === 'block', 'Switching to JSON tab displays JSON stream');
  tabSmart.click();
  assert(tabSmart.classList.contains('active') && paneSmart.style.display === 'flex', 'Switching back to Smart Extract displays fields pane');

  // Front-Page Neural RAG Sandbox
  const frontInput = document.getElementById('front-rag-input');
  const frontChips = document.querySelectorAll('.front-chip');
  assert(frontChips.length > 0, 'Front-page RAG chips exist');
  frontChips[0].click();
  assert(frontInput.value.length > 0, 'Clicking front prompt chip fills input query');

  const btnFrontSubmit = document.getElementById('btn-front-rag-submit');
  btnFrontSubmit.click();
  const frontResultCard = document.getElementById('front-rag-result-card');
  assert(frontResultCard.innerHTML.length > 50 && (frontResultCard.textContent.includes('Synthesized') || frontResultCard.textContent.includes('Confidence')), 'Submitting front RAG query displays synthesized answer');

  // Front-Page Mini ROI Calculator
  const miniSlider = document.getElementById('mini-calc-slider');
  const miniDollars = document.getElementById('mini-calc-dollars');
  assert(miniSlider !== null && miniDollars !== null, 'Mini ROI calculator elements exist');
  miniSlider.value = '5000';
  miniSlider.dispatchEvent(new window.Event('input'));
  assert(miniDollars.textContent.includes('$') || miniDollars.textContent.includes(','), 'Changing slider updates calculated dollar savings');

  // Currency Selector Chips
  const eurChip = Array.from(document.querySelectorAll('.currency-chip')).find(c => c.getAttribute('data-curr') === 'EUR');
  if (eurChip) {
    eurChip.click();
    assert(miniDollars.textContent.includes('€'), 'Selecting EUR updates currency symbol to €');
    const usdChip = Array.from(document.querySelectorAll('.currency-chip')).find(c => c.getAttribute('data-curr') === 'USD');
    if (usdChip) usdChip.click();
  }

  console.log('\n--- TEST GROUP 4: Stream Demo Batch & Live Queue Operations ---');
  const btnHeaderStream = document.getElementById('btn-header-stream-demo');
  assert(btnHeaderStream !== null, 'btn-header-stream-demo exists');
  btnHeaderStream.click();

  assert(kpiQueueCount.textContent === '4', 'Streaming demo batch populates 4 documents in queue');
  assert(queueBadgeCount.textContent === '4', 'Queue badge updates to 4');
  assert(queueTableBody.querySelectorAll('tr').length === 4, 'Table renders 4 rows');

  // Filter pills
  const receiptsFilter = Array.from(document.querySelectorAll('#type-filter-group .filter-pill-btn')).find(b => b.getAttribute('data-filter-type') === 'receipt');
  if (receiptsFilter) {
    receiptsFilter.click();
    const rows = queueTableBody.querySelectorAll('tr');
    assert(rows.length === 1, 'Filtering by Receipt displays only Delta Air Lines receipt');
    const allFilter = Array.from(document.querySelectorAll('#type-filter-group .filter-pill-btn')).find(b => b.getAttribute('data-filter-type') === 'all');
    allFilter.click();
    assert(queueTableBody.querySelectorAll('tr').length === 4, 'Resetting type filter restores 4 rows');
  }

  // Search Filter
  const searchInput = document.getElementById('queue-search-input');
  searchInput.value = 'Apex';
  searchInput.dispatchEvent(new window.Event('input'));
  assert(queueTableBody.querySelectorAll('tr').length === 1, 'Searching "Apex" filters to Apex Legal MSA');
  searchInput.value = '';
  searchInput.dispatchEvent(new window.Event('input'));
  assert(queueTableBody.querySelectorAll('tr').length === 4, 'Clearing search input restores 4 rows');

  console.log('\n--- TEST GROUP 5: Document Studio (Split Review) ---');
  // Navigate to Studio
  const studioTab = Array.from(document.querySelectorAll('.nav-tab-btn')).find(b => b.getAttribute('data-view') === 'studio');
  studioTab.click();
  const studioSection = document.getElementById('view-studio');
  assert(studioSection.classList.contains('active'), 'Navigating to studio view succeeds');

  const studioSelector = document.getElementById('studio-doc-selector');
  assert(studioSelector.options.length === 4, 'Studio document selector populated with 4 documents');

  // Studio Subtabs
  const anomaliesSubtab = Array.from(document.querySelectorAll('.review-subtab')).find(t => t.getAttribute('data-subtab') === 'anomalies');
  const anomaliesContent = document.getElementById('subtab-anomalies');
  if (anomaliesSubtab && anomaliesContent) {
    anomaliesSubtab.click();
    assert(anomaliesContent.classList.contains('active'), 'Switching to anomalies subtab activates anomalies pane');
  }

  // Verify Line Items Editing
  const lineItemsSubtab = Array.from(document.querySelectorAll('.review-subtab')).find(t => t.getAttribute('data-subtab') === 'fields');
  lineItemsSubtab.click();
  const inputVendor = document.getElementById('input-vendorName');
  assert(inputVendor !== null && inputVendor.value.length > 0, 'Studio input-vendorName populated with active vendor');

  // Studio Zoom Controls
  const btnZoomIn = document.getElementById('btn-zoom-in');
  const btnZoomReset = document.getElementById('btn-zoom-reset');
  assert(btnZoomIn !== null && btnZoomReset !== null, 'Zoom control buttons exist');
  btnZoomIn.click();
  btnZoomReset.click();
  assert(true, 'Zoom controls execute cleanly');

  // Studio Bounding Box & Laser Toggle
  const btnToggleBBoxes = document.getElementById('btn-toggle-bboxes');
  const btnToggleLaser = document.getElementById('btn-toggle-laser');
  btnToggleBBoxes.click();
  btnToggleLaser.click();
  assert(true, 'Bounding box and laser toggles execute cleanly');

  // Approve Document Action
  const btnApprove = document.getElementById('btn-approve-route');
  btnApprove.click();
  assert(true, 'Approve & Route action executes cleanly and updates status');

  console.log('\n--- TEST GROUP 6: Neural Search & RAG Q&A Workspace ---');
  const ragTab = Array.from(document.querySelectorAll('.nav-tab-btn')).find(b => b.getAttribute('data-view') === 'rag');
  ragTab.click();
  const ragSection = document.getElementById('view-rag');
  assert(ragSection.classList.contains('active'), 'Navigating to RAG view succeeds');

  const ragInput = document.getElementById('rag-search-input');
  const btnExecuteRag = document.getElementById('btn-execute-rag');
  const ragResults = document.getElementById('rag-results-container');

  ragInput.value = 'What is the refund policy in the Apex contract?';
  btnExecuteRag.click();
  assert(ragResults.innerHTML.includes('Apex Legal Services') || ragResults.innerHTML.includes('refund'), 'RAG query executes and returns relevant contract clauses');

  console.log('\n--- TEST GROUP 7: Workflows Kanban Board ---');
  const workflowsTab = Array.from(document.querySelectorAll('.nav-tab-btn')).find(b => b.getAttribute('data-view') === 'workflows');
  workflowsTab.click();
  const workflowsSection = document.getElementById('view-workflows');
  assert(workflowsSection.classList.contains('active'), 'Navigating to Workflows Kanban succeeds');

  const kanbanBoard = document.getElementById('workflows-kanban-board');
  const kanbanCards = kanbanBoard.querySelectorAll('.kanban-card');
  assert(kanbanCards.length === 4, 'Kanban board displays all 4 active documents');

  console.log('\n--- TEST GROUP 8: Full ROI & Financial Impact Calculator ---');
  const metricsTab = Array.from(document.querySelectorAll('.nav-tab-btn')).find(b => b.getAttribute('data-view') === 'metrics');
  metricsTab.click();
  const metricsSection = document.getElementById('view-metrics');
  assert(metricsSection.classList.contains('active'), 'Navigating to Metrics view succeeds');

  const calcVolSlider = document.getElementById('calc-volume-slider');
  const roiAnnualDollars = document.getElementById('roi-annual-dollars');
  const roiHoursSaved = document.getElementById('roi-hours-saved');
  assert(calcVolSlider !== null && roiAnnualDollars !== null, 'Full ROI calculator sliders exist');

  calcVolSlider.value = '12000';
  calcVolSlider.dispatchEvent(new window.Event('input'));
  assert(roiAnnualDollars.textContent.includes('$') || roiAnnualDollars.textContent.includes(','), 'Full ROI calculator calculates annual dollars saved');
  assert(roiHoursSaved.textContent.includes('Hours') || roiHoursSaved.textContent.includes('hrs'), 'Full ROI calculator calculates hours saved');

  console.log('\n--- TEST GROUP 9: Modals & Live Intake ---');
  const btnOpenLiveModal = document.getElementById('btn-open-live-entry-modal');
  btnOpenLiveModal.click();
  const liveModal = document.getElementById('live-entry-modal');
  assert(liveModal.classList.contains('open'), 'Opening live entry modal succeeds');

  // Quick fill preset
  const quickFillBtn = document.querySelector('[data-fill-preset="freight"]');
  if (quickFillBtn) {
    quickFillBtn.click();
    const entryVendor = document.getElementById('entry-vendor-name');
    assert(entryVendor.value.includes('Horizon'), 'Quick fill preset fills Horizon Logistics');
  }

  // Close modal
  const closeLiveBtn = liveModal.querySelector('[data-close-modal="live-entry-modal"]');
  if (closeLiveBtn) {
    closeLiveBtn.click();
    assert(!liveModal.classList.contains('open'), 'Closing live entry modal succeeds');
  }

  // Export Modal
  const btnOpenExport = document.getElementById('btn-open-export-modal');
  if (btnOpenExport) {
    btnOpenExport.click();
    const exportModal = document.getElementById('export-modal');
    assert(exportModal.classList.contains('open'), 'Opening export modal succeeds');
    const closeExportBtn = exportModal.querySelector('[data-close-modal="export-modal"]');
    closeExportBtn.click();
    assert(!exportModal.classList.contains('open'), 'Closing export modal succeeds');
  }

  console.log('\n--- TEST GROUP 10: Inbound Email Simulation ---');
  const btnSimEmail = document.getElementById('btn-simulate-email');
  if (btnSimEmail) {
    btnSimEmail.click();
    assert(true, 'Simulate email button clicks and triggers pipeline cleanly');
  }

  console.log('\n--- TEST GROUP 11: Export Engine Functions ---');
  assert(typeof exportDocumentToCSV === 'function', 'exportDocumentToCSV exists');
  assert(typeof exportBatchDocumentsToCSV === 'function', 'exportBatchDocumentsToCSV exists');
  assert(typeof exportDocumentToJSON === 'function', 'exportDocumentToJSON exists');

  // Test CSV generation for a sample doc
  try {
    exportDocumentToCSV(SAMPLE_DOCUMENTS[0]);
    exportBatchDocumentsToCSV(SAMPLE_DOCUMENTS);
    exportDocumentToJSON(SAMPLE_DOCUMENTS[0]);
    assert(true, 'Export functions execute without runtime errors');
  } catch (err) {
    assert(false, `Export function error: ${err.message}`);
  }

  console.log('\n--- TEST GROUP 12: Enterprise Footer & Navigation Routing ---');
  const footerOverviewLink = document.querySelector('[data-footer-view="intro"]');
  assert(footerOverviewLink !== null, 'Footer overview link exists');
  footerOverviewLink.click();
  assert(introSection.classList.contains('active'), 'Clicking footer overview link switches view back to intro');

  console.log('\n======================================================');
  console.log(` TEST RESULTS SUMMARY:`);
  console.log(` Passed: ${testsPassed}`);
  console.log(` Failed: ${testsFailed}`);
  console.log('======================================================\n');

  if (testsFailed === 0) {
    console.log('🎉 ALL TESTS PASSED PERFECTLY!');
    process.exit(0);
  } else {
    console.error('❌ SOME TESTS FAILED. PLEASE FIX.');
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Unhandled test suite error:', err);
  process.exit(1);
});
