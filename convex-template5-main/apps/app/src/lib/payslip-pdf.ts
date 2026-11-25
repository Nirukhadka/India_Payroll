import { VICTOR_CHASEX_LOGO_BASE64 } from "./victor-chasex-logo-base64";

function getLogoBinaryString(): string {
  if (typeof atob !== "undefined") {
    return atob(VICTOR_CHASEX_LOGO_BASE64);
  }
  return Buffer.from(VICTOR_CHASEX_LOGO_BASE64, "base64").toString("binary");
}

export interface PayslipData {
  workspaceName: string;
  companyAddress?: string;
  companyPhone?: string;
  companyEmail?: string;
  periodMonth: string;
  startDate?: string;
  endDate?: string;
  paymentDate?: number;
  printDate?: string;
  employeeName: string;
  employeeNo?: string;
  joiningDate?: string;
  department: string;
  designation: string;
  location?: string;
  email: string;
  phone?: string;
  employeeId?: string;
  bankName?: string;
  bankAccountNumber?: string;
  maskedBankAccountNumber?: string;
  ifscCode?: string;
  pan?: string;
  maskedPan?: string;
  uan?: string;
  maskedUan?: string;
  pfMemberId?: string;
  esicIpNumber?: string;
  effectiveWorkDays?: number;
  totalWorkingDays?: number;
  basicSalary: number;
  masterBasicSalary?: number;
  allowances: { name: string; amount: number; masterAmount?: number }[];
  grossSalary: number;
  masterGrossSalary?: number;
  lopDays: number;
  lopDeduction: number;
  customDeductions: { name: string; amount: number }[];
  totalCustomDeductions: number;
  statutoryDeductions: {
    name: string;
    amount: number;
    isConfigured?: boolean;
  }[];
  totalStatutoryDeductions: number;
  employerContributions?: {
    name: string;
    amount: number;
    isConfigured?: boolean;
  }[];
  totalEmployerContributions?: number;
  totalCostToCompany?: number;
  totalDeductions: number;
  netSalary: number;
  netPayInWords?: string;
}

/**
 * Format numbers using the Indian numbering system (e.g. 1,50,000.00 or 15000)
 */
export function formatIndianCurrency(
  amount: number,
  showDecimals = true,
): string {
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  return safeAmount.toLocaleString("en-IN", {
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  });
}

/**
 * Converts a non-negative integer amount into Indian English Words.
 * Example: 26946 -> "Rupees Twenty Six Thousand Nine Hundred Forty Six Only"
 */
export function numberToIndianWords(amount: number): string {
  const rounded = Math.round(Math.max(0, amount));
  if (rounded === 0) return "Rupees Zero Only";

  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];

  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  function convertTwoDigits(n: number): string {
    if (n < 20) return ones[n] ?? "";
    const t = Math.floor(n / 10);
    const o = n % 10;
    return `${tens[t]}${o > 0 ? ` ${ones[o]}` : ""}`;
  }

  function convertThreeDigits(n: number): string {
    const h = Math.floor(n / 100);
    const rest = n % 100;
    let res = "";
    if (h > 0) {
      res += `${ones[h]} Hundred`;
      if (rest > 0) res += " ";
    }
    if (rest > 0) {
      res += convertTwoDigits(rest);
    }
    return res;
  }

  let num = rounded;
  const parts: string[] = [];

  const crores = Math.floor(num / 10000000);
  num %= 10000000;
  if (crores > 0) {
    parts.push(`${convertThreeDigits(crores)} Crore`);
  }

  const lakhs = Math.floor(num / 100000);
  num %= 100000;
  if (lakhs > 0) {
    parts.push(`${convertThreeDigits(lakhs)} Lakh`);
  }

  const thousands = Math.floor(num / 1000);
  num %= 1000;
  if (thousands > 0) {
    parts.push(`${convertThreeDigits(thousands)} Thousand`);
  }

  if (num > 0) {
    parts.push(convertThreeDigits(num));
  }

  return `Rupees ${parts.join(" ")} Only`;
}

function escapePdfText(text: string): string {
  if (!text) return "";
  return text
    .replace(/[—–]/g, "-") // Normalize em-dash and en-dash to hyphen for PDF Type 1 fonts
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)")
    .replace(/[^\x20-\x7E]/g, "?"); // Keep ASCII printable for Type 1 Helvetica
}

/**
 * Cross-platform byte length calculator using TextEncoder (Web standard).
 */
const _encoder = new TextEncoder();
function byteLength(str: string): number {
  return _encoder.encode(str).byteLength;
}

function formatPeriodMonth(period: string): string {
  if (!period) return "";
  const parts = period.split("-");
  if (parts.length === 2) {
    const year = parts[0];
    const monthNum = Number.parseInt(parts[1] ?? "1", 10);
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const m = months[monthNum - 1];
    if (m) return `${m} ${year}`;
  }
  return period;
}

export function formatPayslipAmount(val: number): string {
  if (!Number.isFinite(val)) return "0";
  if (Math.round(val) === val) {
    return String(Math.round(val));
  }
  return val.toFixed(2);
}

/**
 * Generates a clean, standards-compliant PDF 1.4 binary document for an employee payslip.
 * Completely zero external dependencies, 100% vector-sharp across browsers and node.
 * Strictly adheres to Victor Chasex Private Limited reference template.
 */
export function generatePayslipPdfString(data: PayslipData): string {
  const pageWidth = 595.28; // A4 width in pt
  const pageHeight = 841.89; // A4 height in pt
  const margin = 36;
  const contentWidth = pageWidth - margin * 2; // 523.28 pt
  const midX = margin + contentWidth / 2; // 297.64 pt

  const streamLines: string[] = [];

  // Helper for drawing rectangles
  const drawRect = (
    x: number,
    y: number,
    w: number,
    h: number,
    fillRgb?: [number, number, number],
    strokeRgb?: [number, number, number],
    lineWidth = 1,
  ) => {
    streamLines.push("q");
    streamLines.push(`${lineWidth} w`);
    if (strokeRgb) {
      streamLines.push(`${strokeRgb[0]} ${strokeRgb[1]} ${strokeRgb[2]} RG`);
    }
    if (fillRgb) {
      streamLines.push(`${fillRgb[0]} ${fillRgb[1]} ${fillRgb[2]} rg`);
    }
    streamLines.push(
      `${x.toFixed(2)} ${y.toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)} re`,
    );
    if (fillRgb && strokeRgb) {
      streamLines.push("B");
    } else if (fillRgb) {
      streamLines.push("f");
    } else if (strokeRgb) {
      streamLines.push("S");
    }
    streamLines.push("Q");
  };

  // Helper for drawing lines
  const drawLine = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    strokeRgb: [number, number, number] = [0.15, 0.15, 0.15],
    lineWidth = 0.75,
  ) => {
    streamLines.push("q");
    streamLines.push(`${lineWidth} w`);
    streamLines.push(`${strokeRgb[0]} ${strokeRgb[1]} ${strokeRgb[2]} RG`);
    streamLines.push(
      `${x1.toFixed(2)} ${y1.toFixed(2)} m ${x2.toFixed(2)} ${y2.toFixed(2)} l S`,
    );
    streamLines.push("Q");
  };

  // Helper for text rendering with regular, bold, and italic support
  const drawText = (
    text: string,
    x: number,
    y: number,
    fontSize = 8.5,
    style: "regular" | "bold" | "italic" = "regular",
    colorRgb: [number, number, number] = [0.1, 0.1, 0.1],
    align: "left" | "right" | "center" = "left",
  ) => {
    const escaped = escapePdfText(text);
    const font = style === "bold" ? "/F2" : style === "italic" ? "/F3" : "/F1";

    let renderX = x;
    if (align === "right") {
      const approxWidth = text.length * (fontSize * 0.52);
      renderX = Math.max(margin, x - approxWidth);
    } else if (align === "center") {
      const approxWidth = text.length * (fontSize * 0.52);
      renderX = Math.max(margin, x - approxWidth / 2);
    }

    streamLines.push("BT");
    streamLines.push(`${font} ${fontSize} Tf`);
    streamLines.push(`${colorRgb[0]} ${colorRgb[1]} ${colorRgb[2]} rg`);
    streamLines.push(`1 0 0 1 ${renderX.toFixed(2)} ${y.toFixed(2)} Tm`);
    streamLines.push(`(${escaped}) Tj`);
    streamLines.push("ET");
  };

  // 1. Prepare Earnings & Deductions Data
  const earningsList: { name: string; master: number; amount: number }[] = [
    {
      name: "BASIC",
      master: data.masterBasicSalary ?? data.basicSalary,
      amount: data.basicSalary,
    },
  ];

  const allowances = Array.isArray(data.allowances) ? data.allowances : [];
  for (const a of allowances) {
    earningsList.push({
      name: a.name.toUpperCase(),
      master: a.masterAmount ?? a.amount,
      amount: a.amount,
    });
  }

  // Deductions: only employee deductions present in the payroll record
  const deductionsList: { name: string; amount: number }[] = [];
  if (data.lopDeduction > 0) {
    deductionsList.push({
      name: "LOSS OF PAY (LOP)",
      amount: data.lopDeduction,
    });
  }

  const statutoryDeductions = Array.isArray(data.statutoryDeductions)
    ? data.statutoryDeductions
    : [];
  for (const s of statutoryDeductions) {
    if (s.amount > 0) {
      let displayName = s.name.toUpperCase();
      if (displayName.includes("PROVIDENT") || displayName.includes("PF")) {
        displayName = "PF";
      } else if (
        displayName.includes("STATE INSURANCE") ||
        displayName.includes("ESI")
      ) {
        displayName = "ESI";
      } else if (
        displayName.includes("PROFESSIONAL") ||
        displayName.includes("PT")
      ) {
        displayName = "PROF TAX";
      } else if (displayName.includes("TDS")) {
        displayName = "TDS";
      } else if (displayName.includes("LWF")) {
        displayName = "LWF";
      }
      deductionsList.push({ name: displayName, amount: s.amount });
    }
  }

  const customDeductions = Array.isArray(data.customDeductions)
    ? data.customDeductions
    : [];
  for (const c of customDeductions) {
    if (c.amount > 0) {
      deductionsList.push({
        name: c.name.toUpperCase(),
        amount: c.amount,
      });
    }
  }

  // Layout Height Calculations
  const boxTopY = pageHeight - 52;
  const headerH = 60;
  const empH = 78;
  const tableHeaderH = 15;
  const rowCount = Math.max(earningsList.length, deductionsList.length, 3);
  const tableRowH = 13;
  const tableFooterH = 15;
  const tableH = tableHeaderH + rowCount * tableRowH + tableFooterH;
  const netPayH = 30;

  const totalCardH = headerH + empH + tableH + netPayH;
  const boxBottomY = boxTopY - totalCardH;

  // Outer Border Box enclosing entire payslip
  drawRect(
    margin,
    boxBottomY,
    contentWidth,
    totalCardH,
    [1, 1, 1],
    [0.15, 0.15, 0.15],
    0.8,
  );

  // -------------------------------------------------------------
  // 1. COMPANY HEADER
  // -------------------------------------------------------------
  const headerBottomY = boxTopY - headerH;
  drawLine(
    margin,
    headerBottomY,
    margin + contentWidth,
    headerBottomY,
    [0.15, 0.15, 0.15],
    0.75,
  );

  // Yellow logo badge with official VICTOR CHASEX asset
  const logoW = 105;
  const logoH = 33.5;
  const logoX = margin + 3.5;
  const logoY = boxTopY - 46.5;

  drawRect(
    logoX,
    logoY,
    logoW,
    logoH,
    [1.0, 0.92, 0.15], // Bright reference yellow
    undefined,
    0,
  );

  // Paint the official image asset
  streamLines.push("q");
  streamLines.push(
    `${logoW.toFixed(2)} 0 0 ${logoH.toFixed(2)} ${logoX.toFixed(2)} ${logoY.toFixed(2)} cm`,
  );
  streamLines.push("/Im1 Do");
  streamLines.push("Q");

  // Centered Company Details in header area
  const headerCenterX = margin + logoW + (contentWidth - logoW) / 2;
  drawText(
    "Victor Chasex Private Limited",
    headerCenterX,
    boxTopY - 16,
    11,
    "bold",
    [0.08, 0.08, 0.08],
    "center",
  );

  const address =
    "2ND AND 3RD FLOOR, L-149, SRI ESHWARI MANSION, 5TH MAIN, 6TH SECTOR, HSR LAYOUT, BENGALURU,";
  drawText(
    address,
    headerCenterX,
    boxTopY - 27.5,
    6.6,
    "regular",
    [0.2, 0.2, 0.2],
    "center",
  );

  const periodStr = formatPeriodMonth(data.periodMonth);
  const titleText = `Payslip for the month of  ${periodStr}`;
  drawText(
    titleText,
    headerCenterX,
    boxTopY - 45.5,
    9.5,
    "bold",
    [0.08, 0.08, 0.08],
    "center",
  );

  // -------------------------------------------------------------
  // 2. EMPLOYEE DETAILS SECTION
  // -------------------------------------------------------------
  const empBottomY = headerBottomY - empH;
  drawLine(
    margin,
    empBottomY,
    margin + contentWidth,
    empBottomY,
    [0.15, 0.15, 0.15],
    0.75,
  );

  // Vertical line dividing left and right columns
  drawLine(midX, empBottomY, midX, headerBottomY, [0.15, 0.15, 0.15], 0.75);

  const empRowStep = 11.8;
  const empStartY = headerBottomY - 11;

  // Left column (6 items strictly matching reference)
  const leftItems = [
    { label: "Name:", value: data.employeeName || "—" },
    { label: "Designation:", value: data.designation || "Staff" },
    { label: "Department:", value: data.department || "General" },
    { label: "Location:", value: data.location || "Bangalore" },
    {
      label: "Effective Work Days:",
      value: String(
        data.effectiveWorkDays ?? Math.max(0, 30 - (data.lopDays || 0)),
      ),
    },
    { label: "LOP:", value: String(data.lopDays || 0) },
  ];

  for (let i = 0; i < leftItems.length; i++) {
    const item = leftItems[i];
    if (!item) continue;
    const y = empStartY - i * empRowStep;
    drawText(item.label, margin + 6, y, 7.5, "regular", [0.25, 0.25, 0.25]);
    drawText(item.value, margin + 120, y, 7.5, "regular", [0.08, 0.08, 0.08]);
  }

  // Right column (6 items strictly matching reference)
  const maskedAcc =
    data.maskedBankAccountNumber ||
    (data.bankAccountNumber ? `••••${data.bankAccountNumber.slice(-4)}` : "");

  const rightItems = [
    {
      label: "Employee No:",
      value: data.employeeNo || data.employeeId || "VC-OL-024",
    },
    { label: "Bank Name:", value: data.bankName || "" },
    { label: "Bank Account No:", value: maskedAcc },
    {
      label: "PAN Number:",
      value: data.pan || data.maskedPan || "",
    },
    { label: "PF No:", value: data.pfMemberId || "" },
    { label: "PF UAN:", value: data.uan || data.maskedUan || "" },
  ];

  for (let i = 0; i < rightItems.length; i++) {
    const item = rightItems[i];
    if (!item) continue;
    const y = empStartY - i * empRowStep;
    drawText(item.label, midX + 6, y, 7.5, "regular", [0.25, 0.25, 0.25]);
    drawText(item.value, midX + 120, y, 7.5, "regular", [0.08, 0.08, 0.08]);
  }

  // -------------------------------------------------------------
  // 3. EARNINGS & DEDUCTIONS TABLE
  // -------------------------------------------------------------
  const tableHeaderBottomY = empBottomY - tableHeaderH;
  drawLine(
    margin,
    tableHeaderBottomY,
    margin + contentWidth,
    tableHeaderBottomY,
    [0.15, 0.15, 0.15],
    0.75,
  );

  const tableTotalsTopY = tableHeaderBottomY - rowCount * tableRowH;
  drawLine(
    margin,
    tableTotalsTopY,
    margin + contentWidth,
    tableTotalsTopY,
    [0.15, 0.15, 0.15],
    0.75,
  );

  const tableBottomY = tableTotalsTopY - tableFooterH;
  drawLine(
    margin,
    tableBottomY,
    margin + contentWidth,
    tableBottomY,
    [0.15, 0.15, 0.15],
    0.75,
  );

  // Center vertical divider splitting Earnings and Deductions all the way through totals
  drawLine(midX, tableBottomY, midX, empBottomY, [0.15, 0.15, 0.15], 0.75);

  // Table Column Coordinates
  const masterX = margin + 185;
  const earnAmountX = midX - 10;
  const dedAmountX = margin + contentWidth - 10;

  // Header Text
  const thY = empBottomY - 10.5;
  drawText("Earnings", margin + 8, thY, 8, "bold", [0.1, 0.1, 0.1]);
  drawText("Master", masterX, thY, 8, "bold", [0.1, 0.1, 0.1], "right");
  drawText("Amount", earnAmountX, thY, 8, "bold", [0.1, 0.1, 0.1], "right");

  drawText("Deductions", midX + 8, thY, 8, "bold", [0.1, 0.1, 0.1]);
  drawText("Amount", dedAmountX, thY, 8, "bold", [0.1, 0.1, 0.1], "right");

  // Earnings Rows
  for (let i = 0; i < earningsList.length; i++) {
    const item = earningsList[i];
    if (!item) continue;
    const y = tableHeaderBottomY - 9.5 - i * tableRowH;
    drawText(item.name, margin + 8, y, 7.5, "regular", [0.15, 0.15, 0.15]);
    drawText(
      formatPayslipAmount(item.master),
      masterX,
      y,
      7.5,
      "regular",
      [0.15, 0.15, 0.15],
      "right",
    );
    drawText(
      formatPayslipAmount(item.amount),
      earnAmountX,
      y,
      7.5,
      "regular",
      [0.08, 0.08, 0.08],
      "right",
    );
  }

  // Deductions Rows
  for (let i = 0; i < deductionsList.length; i++) {
    const item = deductionsList[i];
    if (!item) continue;
    const y = tableHeaderBottomY - 9.5 - i * tableRowH;
    drawText(item.name, midX + 8, y, 7.5, "regular", [0.15, 0.15, 0.15]);
    drawText(
      formatPayslipAmount(item.amount),
      dedAmountX,
      y,
      7.5,
      "regular",
      [0.08, 0.08, 0.08],
      "right",
    );
  }

  // Totals Row
  const totalsY = tableTotalsTopY - 10.5;
  const masterGross = data.masterGrossSalary ?? data.grossSalary;
  drawText(
    "Total Earnings",
    margin + 8,
    totalsY,
    7.8,
    "bold",
    [0.08, 0.08, 0.08],
  );
  drawText(
    formatPayslipAmount(masterGross),
    masterX,
    totalsY,
    7.8,
    "bold",
    [0.08, 0.08, 0.08],
    "right",
  );
  drawText(
    formatPayslipAmount(data.grossSalary),
    earnAmountX,
    totalsY,
    7.8,
    "bold",
    [0.08, 0.08, 0.08],
    "right",
  );

  drawText(
    "Total Deductions",
    midX + 8,
    totalsY,
    7.8,
    "bold",
    [0.08, 0.08, 0.08],
  );
  drawText(
    formatPayslipAmount(data.totalDeductions),
    dedAmountX,
    totalsY,
    7.8,
    "bold",
    [0.08, 0.08, 0.08],
    "right",
  );

  // -------------------------------------------------------------
  // 4. NET PAY SECTION
  // -------------------------------------------------------------
  const netPayLabelY = tableBottomY - 11;
  drawText(
    "Net Pay for the Month",
    margin + 8,
    netPayLabelY,
    8.2,
    "bold",
    [0.08, 0.08, 0.08],
  );
  drawText(
    formatPayslipAmount(data.netSalary),
    masterX + 38,
    netPayLabelY,
    8.5,
    "bold",
    [0.08, 0.08, 0.08],
    "right",
  );

  const inWords = data.netPayInWords || numberToIndianWords(data.netSalary);
  drawText(
    `(${inWords})`,
    margin + 8,
    tableBottomY - 22,
    7.2,
    "italic",
    [0.25, 0.25, 0.25],
  );

  // -------------------------------------------------------------
  // 5. SYSTEM GENERATED NOTICE (BELOW OUTER BOX)
  // -------------------------------------------------------------
  drawText(
    "This is a system generated payslip and does not require signature.",
    margin + contentWidth / 2,
    boxBottomY - 14,
    7.5,
    "regular",
    [0.3, 0.3, 0.3],
    "center",
  );

  // Assemble PDF 1.4 Object Hierarchy
  const streamContent = streamLines.join("\n");
  const streamLength = byteLength(streamContent);

  const objects: string[] = [];

  // Object 1: Catalog
  objects.push(`1 0 obj
<<
  /Type /Catalog
  /Pages 2 0 R
>>
endobj`);

  // Object 2: Pages
  objects.push(`2 0 obj
<<
  /Type /Pages
  /Kids [3 0 R]
  /Count 1
>>
endobj`);

  // Object 3: Page
  objects.push(`3 0 obj
<<
  /Type /Page
  /Parent 2 0 R
  /MediaBox [0 0 ${pageWidth.toFixed(2)} ${pageHeight.toFixed(2)}]
  /Resources <<
    /Font <<
      /F1 4 0 R
      /F2 5 0 R
      /F3 7 0 R
    >>
    /XObject <<
      /Im1 8 0 R
    >>
  >>
  /Contents 6 0 R
>>
endobj`);

  // Object 4: Font Regular (Helvetica)
  objects.push(`4 0 obj
<<
  /Type /Font
  /Subtype /Type1
  /BaseFont /Helvetica
>>
endobj`);

  // Object 5: Font Bold (Helvetica-Bold)
  objects.push(`5 0 obj
<<
  /Type /Font
  /Subtype /Type1
  /BaseFont /Helvetica-Bold
>>
endobj`);

  // Object 7: Font Oblique / Italic (Helvetica-Oblique)
  objects.push(`7 0 obj
<<
  /Type /Font
  /Subtype /Type1
  /BaseFont /Helvetica-Oblique
>>
endobj`);

  // Object 8: Official VICTOR CHASEX Logo Image (JPEG)
  const logoBytes = getLogoBinaryString();
  objects.push(`8 0 obj
<<
  /Type /XObject
  /Subtype /Image
  /Width 661
  /Height 211
  /ColorSpace /DeviceRGB
  /BitsPerComponent 8
  /Filter /DCTDecode
  /Length ${logoBytes.length}
>>
stream
${logoBytes}
endstream
endobj`);

  // Object 6: Content Stream
  objects.push(`6 0 obj
<<
  /Length ${streamLength}
>>
stream
${streamContent}
endstream
endobj`);

  const header = "%PDF-1.4\n%\xE2\xE3\xCF\xD3\n";
  let body = "";
  const xrefOffsets: number[] = [0];

  let currentOffset = byteLength(header);

  for (let i = 0; i < objects.length; i++) {
    xrefOffsets.push(currentOffset);
    const objStr = `${objects[i]}\n`;
    body += objStr;
    currentOffset += byteLength(objStr);
  }

  const startXref = currentOffset;

  let xref = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i <= objects.length; i++) {
    const offsetStr = String(xrefOffsets[i]).padStart(10, "0");
    xref += `${offsetStr} 00000 n \n`;
  }

  const trailer = `trailer
<<
  /Size ${objects.length + 1}
  /Root 1 0 R
>>
startxref
${startXref}
%%EOF\n`;

  return header + body + xref + trailer;
}

/**
 * Creates a downloadable binary Blob for the Payslip PDF
 */
export function generatePayslipPdfBlob(data: PayslipData): Blob {
  const pdfString = generatePayslipPdfString(data);
  const len = pdfString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = pdfString.charCodeAt(i) & 0xff;
  }
  return new Blob([bytes.buffer], { type: "application/pdf" });
}

/**
 * Generates a clean, safe, and meaningful filename for the salary slip PDF.
 * Format: SalarySlip_<EmployeeID>_<YYYY-MM>.pdf
 */
export function getPayslipPdfFileName(data: PayslipData): string {
  const periodStr = formatPeriodMonth(data.periodMonth).replace(/\s+/g, "_");
  return `Payslip_${periodStr || "Salary"}.pdf`;
}

/**
 * Client-side triggers direct download of the generated PDF file
 */
export function downloadPayslipPdf(data: PayslipData): void {
  const blob = generatePayslipPdfBlob(data);
  const fileName = getPayslipPdfFileName(data);

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.setAttribute("download", fileName);
  a.setAttribute("target", "_self");
  a.rel = "noopener noreferrer";

  a.style.position = "fixed";
  a.style.top = "-9999px";
  a.style.left = "-9999px";
  a.style.opacity = "0";

  document.body.appendChild(a);

  try {
    const event = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      view: window,
    });
    a.dispatchEvent(event);
  } catch {
    a.click();
  }

  if (typeof requestAnimationFrame !== "undefined") {
    requestAnimationFrame(() => {
      if (a.parentNode) {
        a.parentNode.removeChild(a);
      }
    });
  } else {
    setTimeout(() => {
      if (a.parentNode) {
        a.parentNode.removeChild(a);
      }
    }, 100);
  }

  setTimeout(() => URL.revokeObjectURL(url), 60000);
}

/**
 * Triggers clean print view for native browser printer / PDF print
 */
export function printPayslip(): void {
  window.print();
}
