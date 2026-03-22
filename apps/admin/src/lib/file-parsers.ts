import * as XLSX from 'xlsx';

export interface ParsedRow {
  transaction_date: string;
  description: string;
  reference_number: string;
  debit_amount: number;
  credit_amount: number;
}

function normalizeHeader(h: string): string {
  return h.toLowerCase().trim().replace(/"/g, '');
}

function parseRowsFromHeaders(headers: string[], rows: any[][]): ParsedRow[] {
  const nh = headers.map(normalizeHeader);
  const dateIdx = nh.findIndex(h => h.includes('date'));
  const descIdx = nh.findIndex(h => h.includes('desc') || h.includes('narr') || h.includes('detail'));
  const refIdx = nh.findIndex(h => h.includes('ref'));
  const debitIdx = nh.findIndex(h => h.includes('debit') || h.includes('withdrawal'));
  const creditIdx = nh.findIndex(h => h.includes('credit') || h.includes('deposit'));
  const amountIdx = nh.findIndex(h => h === 'amount');

  return rows.map(cols => {
    const raw = (i: number) => String(cols[i] ?? '').trim().replace(/"/g, '');
    const num = (i: number) => Math.abs(Number(raw(i).replace(/[^\d.-]/g, '') || 0));
    const rawAmount = amountIdx >= 0 ? Number(raw(amountIdx).replace(/[^\d.-]/g, '') || 0) : 0;
    let debit = debitIdx >= 0 ? num(debitIdx) : 0;
    let credit = creditIdx >= 0 ? num(creditIdx) : 0;
    if (amountIdx >= 0 && debitIdx < 0 && creditIdx < 0) {
      if (rawAmount < 0) debit = Math.abs(rawAmount);
      else credit = rawAmount;
    }
    return {
      transaction_date: raw(dateIdx >= 0 ? dateIdx : 0),
      description: raw(descIdx >= 0 ? descIdx : 1),
      reference_number: raw(refIdx >= 0 ? refIdx : 2),
      debit_amount: debit,
      credit_amount: credit,
    };
  }).filter(r => r.transaction_date);
}

export function parseCSV(text: string): ParsedRow[] {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];
  const headers = lines[0].split(',');
  const rows = lines.slice(1).map(line => line.split(','));
  return parseRowsFromHeaders(headers, rows);
}

export function parseExcel(buffer: ArrayBuffer): ParsedRow[] {
  const wb = XLSX.read(buffer, { type: 'array', cellDates: true });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json<any[]>(ws, { header: 1 });
  if (data.length < 2) return [];
  const headers = (data[0] as any[]).map(String);
  const rows = data.slice(1).map(row => {
    return (row as any[]).map(cell => {
      if (cell instanceof Date) return cell.toISOString().split('T')[0];
      return cell;
    });
  });
  return parseRowsFromHeaders(headers, rows);
}

export function parseFile(file: File): Promise<ParsedRow[]> {
  return new Promise((resolve, reject) => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext === 'csv') {
      const reader = new FileReader();
      reader.onload = e => resolve(parseCSV(e.target?.result as string));
      reader.onerror = reject;
      reader.readAsText(file);
    } else if (ext === 'xlsx' || ext === 'xls') {
      const reader = new FileReader();
      reader.onload = e => resolve(parseExcel(e.target?.result as ArrayBuffer));
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    } else {
      reject(new Error('Unsupported file format. Use .csv or .xlsx'));
    }
  });
}
