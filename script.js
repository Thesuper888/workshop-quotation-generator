const ids = [
  "technicianDays",
  "technicianRate",
  "toolsDays",
  "toolsRate",
  "ticket",
  "localTransport",
  "accommodation",
  "material",
  "otherCost",
];

const form = document.getElementById("quotation-form");
const output = document.getElementById("quotationOutput");
const grandTotalEl = document.getElementById("grandTotal");
const copyBtn = document.getElementById("copyBtn");
const exportBtn = document.getElementById("exportBtn");

const toNumber = (value) => Number(value) || 0;
const formatCurrency = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

const idrFormatCode = '[$Rp-421] #,##0';

function calculateTotal() {
  const technicianDays = toNumber(document.getElementById("technicianDays").value);
  const technicianRate = toNumber(document.getElementById("technicianRate").value);
  const toolsDays = toNumber(document.getElementById("toolsDays").value);
  const toolsRate = toNumber(document.getElementById("toolsRate").value);
  const ticket = toNumber(document.getElementById("ticket").value);
  const localTransport = toNumber(document.getElementById("localTransport").value);
  const accommodation = toNumber(document.getElementById("accommodation").value);
  const material = toNumber(document.getElementById("material").value);
  const otherCost = toNumber(document.getElementById("otherCost").value);

  const technicianCost = technicianDays * technicianRate;
  const toolsCost = toolsDays * toolsRate;

  const total =
    technicianCost +
    toolsCost +
    ticket +
    localTransport +
    accommodation +
    material +
    otherCost;

  grandTotalEl.textContent = formatCurrency(total);

  return {
    technicianDays,
    technicianRate,
    toolsDays,
    toolsRate,
    technicianCost,
    toolsCost,
    ticket,
    localTransport,
    accommodation,
    material,
    otherCost,
    total,
  };
}

function getFormData() {
  return {
    customer: document.getElementById("customer").value.trim(),
    location: document.getElementById("location").value.trim(),
    jobTitle: document.getElementById("jobTitle").value.trim(),
    background: document.getElementById("background").value.trim(),
    scope: document.getElementById("scope").value.trim(),
    duration: document.getElementById("duration").value.trim(),
  };
}

function buildQuotationText(costs, data) {
  const now = new Date().toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `QUOTATION PROPOSAL\nHydraulic Workshop Service Job\n\nDate: ${now}\nCustomer: ${data.customer}\nLocation: ${data.location}\nJob Title: ${data.jobTitle}\n\nAnnex 0 – Pendahuluan / Catatan Pengantar\nKami mengucapkan terima kasih atas kesempatan yang diberikan kepada tim kami untuk mendukung pekerjaan ${data.jobTitle} di ${data.location}. Dokumen ini menjelaskan penawaran biaya, ruang lingkup, metode kerja, serta ketentuan pelaksanaan pekerjaan secara profesional dan aman.\n\nLatar Belakang:\n${data.background}\n\nAnnex 1 – Ruang Lingkup Pekerjaan\n${data.scope}\n\nAnnex 2 – Rincian Biaya\n1. Jasa Teknisi (${costs.technicianDays} hari x ${formatCurrency(costs.technicianRate)}) = ${formatCurrency(costs.technicianCost)}\n2. Peralatan & Tools (${costs.toolsDays} hari x ${formatCurrency(costs.toolsRate)}) = ${formatCurrency(costs.toolsCost)}\n3. Ticket = ${formatCurrency(costs.ticket)}\n4. Local Transport = ${formatCurrency(costs.localTransport)}\n5. Accommodation = ${formatCurrency(costs.accommodation)}\n6. Material = ${formatCurrency(costs.material)}\n7. Other Cost = ${formatCurrency(costs.otherCost)}\n\nGRAND TOTAL = ${formatCurrency(costs.total)}\n\nAnnex 3 – Metode Pelaksanaan\nPekerjaan akan dilaksanakan melalui tahap persiapan, inspeksi awal, pelaksanaan service/repair, pengujian fungsi, dan serah terima hasil pekerjaan. Setiap tahapan dilakukan sesuai standar keselamatan kerja dan prosedur workshop hydraulic service.\n\nAnnex 4 – Penyediaan Material\nMaterial utama dan consumable disediakan sesuai kebutuhan pekerjaan. Jika terdapat material tambahan di luar estimasi awal, akan diinformasikan terlebih dahulu untuk persetujuan customer.\n\nAnnex 5 – Estimasi Durasi Pekerjaan\nEstimasi durasi pekerjaan: ${data.duration}. Jadwal aktual dapat menyesuaikan dengan kondisi lapangan, akses area kerja, dan ketersediaan material.\n\nAnnex 6 – Peralatan & Tools\nTim kami menyiapkan peralatan kerja standar hydraulic workshop dan tools pendukung yang relevan untuk memastikan pelaksanaan pekerjaan berlangsung efektif dan aman.\n\nAnnex 7 – Syarat & Ketentuan\n1. Penawaran berlaku 14 hari kalender sejak tanggal dokumen.\n2. Pekerjaan dimulai setelah konfirmasi PO/SPK diterima.\n3. Pembayaran dilakukan sesuai termin yang disepakati kedua belah pihak.\n4. Pekerjaan tambahan di luar scope akan dikutip terpisah.\n\nAnnex 8 – Asumsi & Disclaimer\n1. Area kerja dinyatakan aman dan dapat diakses pada waktu yang disepakati.\n2. Keterlambatan akibat force majeure berada di luar tanggung jawab penyedia jasa.\n3. Nilai penawaran dapat berubah bila terdapat perubahan scope, regulasi, atau kebutuhan teknis signifikan.\n\nHormat kami,\nHydraulic Workshop Service Team`;
}

function exportToExcel() {
  if (typeof XLSX === "undefined") {
    alert("Excel export library failed to load. Please refresh and try again.");
    return;
  }

  const costs = calculateTotal();
  const data = getFormData();
  const quotationText = output.value.trim() || buildQuotationText(costs, data);

  const wb = XLSX.utils.book_new();

  const inputSheetData = [
    ["Input Data"],
    ["Customer", data.customer],
    ["Location", data.location],
    ["Job Title", data.jobTitle],
    ["Background", data.background],
    ["Scope of Work", data.scope],
    ["Duration", data.duration],
  ];
  const wsInput = XLSX.utils.aoa_to_sheet(inputSheetData);
  wsInput["!cols"] = [{ wch: 22 }, { wch: 80 }];

  const costSheetData = [
    ["Cost Breakdown"],
    ["No", "Description", "Qty / Days", "Unit Rate", "Amount"],
    [1, "Technician Fee", costs.technicianDays, costs.technicianRate, costs.technicianCost],
    [2, "Tools / Equipment", costs.toolsDays, costs.toolsRate, costs.toolsCost],
    [3, "Ticket", "", "", costs.ticket],
    [4, "Local Transport", "", "", costs.localTransport],
    [5, "Accommodation", "", "", costs.accommodation],
    [6, "Material", "", "", costs.material],
    [7, "Other Cost", "", "", costs.otherCost],
    ["", "", "", "Grand Total", costs.total],
  ];
  const wsCost = XLSX.utils.aoa_to_sheet(costSheetData);
  wsCost["!cols"] = [{ wch: 6 }, { wch: 28 }, { wch: 12 }, { wch: 14 }, { wch: 16 }];

  const quotationSheetData = [["Quotation Text"], [quotationText]];
  const wsText = XLSX.utils.aoa_to_sheet(quotationSheetData);
  wsText["!cols"] = [{ wch: 120 }];

  const addCellStyle = (ws, cellRef, style = {}) => {
    if (!ws[cellRef]) return;
    ws[cellRef].s = {
      font: style.bold ? { bold: true } : undefined,
      border: style.border
        ? {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } },
          }
        : undefined,
    };
  };

  ["A1", "A1", "A1"].forEach((ref, index) => {
    const ws = [wsInput, wsCost, wsText][index];
    addCellStyle(ws, ref, { bold: true });
  });

  for (let row = 2; row <= 10; row += 1) {
    ["A", "B", "C", "D", "E"].forEach((col) => addCellStyle(wsCost, `${col}${row}`, { border: true }));
  }

  ["D2", "E2", "D10", "E10"].forEach((cell) => addCellStyle(wsCost, cell, { bold: true, border: true }));

  ["D3", "D4", "E3", "E4", "E5", "E6", "E7", "E8", "E9", "E10"].forEach((cellRef) => {
    if (wsCost[cellRef] && typeof wsCost[cellRef].v === "number") {
      wsCost[cellRef].z = idrFormatCode;
    }
  });

  if (wsText["A2"]) {
    wsText["A2"].s = { alignment: { wrapText: true, vertical: "top" } };
  }

  XLSX.utils.book_append_sheet(wb, wsInput, "Input Data");
  XLSX.utils.book_append_sheet(wb, wsCost, "Cost Breakdown");
  XLSX.utils.book_append_sheet(wb, wsText, "Quotation Text");

  const stamp = new Date().toISOString().slice(0, 10);
  const safeCustomer = (data.customer || "customer").replace(/[^a-zA-Z0-9-_]/g, "_");
  XLSX.writeFile(wb, `quotation_${safeCustomer}_${stamp}.xlsx`);
}

ids.forEach((id) => {
  document.getElementById(id).addEventListener("input", calculateTotal);
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const costs = calculateTotal();
  const data = getFormData();
  output.value = buildQuotationText(costs, data);
});

copyBtn.addEventListener("click", async () => {
  if (!output.value.trim()) {
    return;
  }
  try {
    await navigator.clipboard.writeText(output.value);
    copyBtn.textContent = "Copied";
    setTimeout(() => {
      copyBtn.textContent = "Copy";
    }, 1200);
  } catch (error) {
    copyBtn.textContent = "Copy failed";
    setTimeout(() => {
      copyBtn.textContent = "Copy";
    }, 1200);
  }
});

exportBtn.addEventListener("click", exportToExcel);

calculateTotal();
