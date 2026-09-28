// DocuMind - Accounting Integration & File Exporter
// Generates live CSV, JSON, NetSuite & QuickBooks payloads

export function exportDocumentToCSV(doc) {
  const headers = [
    "Doc ID",
    "Invoice/Doc Number",
    "Vendor Name",
    "Tax ID",
    "Date",
    "Due Date",
    "Currency",
    "Line Item ID",
    "Line Description",
    "GL Code",
    "Quantity",
    "Unit Price",
    "Line Total",
    "Doc Subtotal",
    "Doc Tax",
    "Doc Total",
    "Confidence Score",
    "Approval Status"
  ];

  const rows = [];

  if (doc.lineItems && doc.lineItems.length > 0) {
    doc.lineItems.forEach(item => {
      rows.push([
        doc.id,
        doc.meta.invoiceNumber || doc.meta.contractId || doc.meta.receiptNumber || "N/A",
        `"${doc.vendor.name.replace(/"/g, '""')}"`,
        doc.vendor.taxId || "N/A",
        doc.meta.invoiceDate || doc.meta.effectiveDate || doc.meta.receiptDate || "N/A",
        doc.meta.dueDate || doc.meta.expirationDate || "N/A",
        doc.meta.currency || "USD",
        item.id,
        `"${item.description.replace(/"/g, '""')}"`,
        `"${item.glCode || 'General'}"`,
        item.quantity || 1,
        (item.unitPrice || 0).toFixed(2),
        (item.total || 0).toFixed(2),
        (doc.financials.subtotal || 0).toFixed(2),
        (doc.financials.taxAmount || 0).toFixed(2),
        (doc.financials.total || 0).toFixed(2),
        `${Math.round(doc.overallConfidence * 100)}%`,
        doc.status.toUpperCase()
      ]);
    });
  } else {
    rows.push([
      doc.id,
      doc.meta.invoiceNumber || doc.meta.contractId || doc.meta.receiptNumber || "N/A",
      `"${doc.vendor.name.replace(/"/g, '""')}"`,
      doc.vendor.taxId || "N/A",
      doc.meta.invoiceDate || doc.meta.effectiveDate || doc.meta.receiptDate || "N/A",
      doc.meta.dueDate || doc.meta.expirationDate || "N/A",
      doc.meta.currency || "USD",
      "HEADER_ONLY",
      `"${doc.title.replace(/"/g, '""')}"`,
      "N/A",
      1,
      (doc.financials.total || 0).toFixed(2),
      (doc.financials.total || 0).toFixed(2),
      (doc.financials.subtotal || 0).toFixed(2),
      (doc.financials.taxAmount || 0).toFixed(2),
      (doc.financials.total || 0).toFixed(2),
      `${Math.round(doc.overallConfidence * 100)}%`,
      doc.status.toUpperCase()
    ]);
  }

  const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
  downloadFile(csvContent, `${doc.id}_documind_export.csv`, "text/csv;charset=utf-8;");
}

export function exportBatchDocumentsToCSV(documents) {
  const headers = [
    "Doc ID",
    "Type",
    "Doc Reference",
    "Vendor Name",
    "Date",
    "Due Date",
    "Currency",
    "Subtotal",
    "Tax",
    "Total",
    "Confidence",
    "Status"
  ];

  const rows = documents.map(d => [
    d.id,
    d.type.toUpperCase(),
    d.meta.invoiceNumber || d.meta.contractId || d.meta.receiptNumber || "N/A",
    `"${d.vendor.name.replace(/"/g, '""')}"`,
    d.meta.invoiceDate || d.meta.effectiveDate || d.meta.receiptDate || "N/A",
    d.meta.dueDate || d.meta.expirationDate || "N/A",
    d.meta.currency || "USD",
    (d.financials.subtotal || 0).toFixed(2),
    (d.financials.taxAmount || 0).toFixed(2),
    (d.financials.total || 0).toFixed(2),
    `${Math.round(d.overallConfidence * 100)}%`,
    d.status.toUpperCase()
  ]);

  const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
  downloadFile(csvContent, `documind_batch_ledger_${Date.now()}.csv`, "text/csv;charset=utf-8;");
}

export function exportDocumentToJSON(doc) {
  const payload = {
    exportMetadata: {
      generatedBy: "DocuMind Autonomous AI Engine",
      organization: "QuolyTech",
      exportedAt: new Date().toISOString(),
      schemaVersion: "3.2.0"
    },
    document: doc
  };
  const jsonContent = JSON.stringify(payload, null, 2);
  downloadFile(jsonContent, `${doc.id}_schema_payload.json`, "application/json;charset=utf-8;");
}

function downloadFile(content, fileName, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}
