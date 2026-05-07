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

const toNumber = (value) => Number(value) || 0;
const formatCurrency = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

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

ids.forEach((id) => {
  document.getElementById(id).addEventListener("input", calculateTotal);
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const costs = calculateTotal();
  const customer = document.getElementById("customer").value.trim();
  const location = document.getElementById("location").value.trim();
  const jobTitle = document.getElementById("jobTitle").value.trim();
  const background = document.getElementById("background").value.trim();
  const scope = document.getElementById("scope").value.trim();
  const duration = document.getElementById("duration").value.trim();
  const now = new Date().toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const quotationText = `QUOTATION PROPOSAL\nHydraulic Workshop Service Job\n\nDate: ${now}\nCustomer: ${customer}\nLocation: ${location}\nJob Title: ${jobTitle}\n\nAnnex 0 – Pendahuluan / Catatan Pengantar\nKami mengucapkan terima kasih atas kesempatan yang diberikan kepada tim kami untuk mendukung pekerjaan ${jobTitle} di ${location}. Dokumen ini menjelaskan penawaran biaya, ruang lingkup, metode kerja, serta ketentuan pelaksanaan pekerjaan secara profesional dan aman.\n\nLatar Belakang:\n${background}\n\nAnnex 1 – Ruang Lingkup Pekerjaan\n${scope}\n\nAnnex 2 – Rincian Biaya\n1. Jasa Teknisi (${costs.technicianDays} hari x ${formatCurrency(costs.technicianRate)}) = ${formatCurrency(costs.technicianCost)}\n2. Peralatan & Tools (${costs.toolsDays} hari x ${formatCurrency(costs.toolsRate)}) = ${formatCurrency(costs.toolsCost)}\n3. Ticket = ${formatCurrency(costs.ticket)}\n4. Local Transport = ${formatCurrency(costs.localTransport)}\n5. Accommodation = ${formatCurrency(costs.accommodation)}\n6. Material = ${formatCurrency(costs.material)}\n7. Other Cost = ${formatCurrency(costs.otherCost)}\n\nGRAND TOTAL = ${formatCurrency(costs.total)}\n\nAnnex 3 – Metode Pelaksanaan\nPekerjaan akan dilaksanakan melalui tahap persiapan, inspeksi awal, pelaksanaan service/repair, pengujian fungsi, dan serah terima hasil pekerjaan. Setiap tahapan dilakukan sesuai standar keselamatan kerja dan prosedur workshop hydraulic service.\n\nAnnex 4 – Penyediaan Material\nMaterial utama dan consumable disediakan sesuai kebutuhan pekerjaan. Jika terdapat material tambahan di luar estimasi awal, akan diinformasikan terlebih dahulu untuk persetujuan customer.\n\nAnnex 5 – Estimasi Durasi Pekerjaan\nEstimasi durasi pekerjaan: ${duration}. Jadwal aktual dapat menyesuaikan dengan kondisi lapangan, akses area kerja, dan ketersediaan material.\n\nAnnex 6 – Peralatan & Tools\nTim kami menyiapkan peralatan kerja standar hydraulic workshop dan tools pendukung yang relevan untuk memastikan pelaksanaan pekerjaan berlangsung efektif dan aman.\n\nAnnex 7 – Syarat & Ketentuan\n1. Penawaran berlaku 14 hari kalender sejak tanggal dokumen.\n2. Pekerjaan dimulai setelah konfirmasi PO/SPK diterima.\n3. Pembayaran dilakukan sesuai termin yang disepakati kedua belah pihak.\n4. Pekerjaan tambahan di luar scope akan dikutip terpisah.\n\nAnnex 8 – Asumsi & Disclaimer\n1. Area kerja dinyatakan aman dan dapat diakses pada waktu yang disepakati.\n2. Keterlambatan akibat force majeure berada di luar tanggung jawab penyedia jasa.\n3. Nilai penawaran dapat berubah bila terdapat perubahan scope, regulasi, atau kebutuhan teknis signifikan.\n\nHormat kami,\nHydraulic Workshop Service Team`;

  output.value = quotationText;
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

calculateTotal();
