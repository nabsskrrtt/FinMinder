import { Category } from '../config';

export interface ParseResult {
  kind: 'expense' | 'income' | 'query_stress' | 'query_purchase' | 'unknown';
  amount?: number;
  category?: Category;
  note?: string; // Teks nama barang / catatan
  confidence: number; // 0..1
}

/**
 * Konversi teks kata angka bahasa Indonesia ke nominal angka
 * Contoh: "dua puluh lima ribu" -> 25000, "tiga ratus ribu" -> 300000
 */
function parseIndonesianNumberWords(text: string): number | null {
  const wordMap: Record<string, number> = {
    satu: 1, se: 1, dua: 2, tiga: 3, empat: 4, lima: 5, enam: 6,
    tujuh: 7, delapan: 8, sembilan: 9, sepuluh: 10, sebelas: 11,
    seratus: 100, seribu: 1000, sejuta: 1000000,
  };

  const lower = text.toLowerCase();
  
  // Deteksi pola umum kombinasi kata angka
  if (lower.includes('dua puluh lima ribu')) return 25000;
  if (lower.includes('lima puluh ribu')) return 50000;
  if (lower.includes('tujuh puluh lima ribu')) return 75000;
  if (lower.includes('seratus ribu')) return 100000;
  if (lower.includes('dua ratus ribu')) return 200000;
  if (lower.includes('tiga ratus ribu')) return 300000;
  if (lower.includes('empat ratus ribu')) return 400000;
  if (lower.includes('lima ratus ribu')) return 500000;
  if (lower.includes('satu juta')) return 1000000;
  if (lower.includes('dua juta')) return 2000000;
  if (lower.includes('tiga juta')) return 3000000;

  // Analisis token kata angka dasar
  const tokens = lower.split(/\s+/);
  let total = 0;
  let current = 0;
  let matchedAny = false;

  for (let i = 0; i < tokens.length; i++) {
    const word = tokens[i].replace(/[^a-z]/g, '');
    if (!word) continue;

    if (wordMap[word] !== undefined) {
      current += wordMap[word];
      matchedAny = true;
    } else if (word === 'belas') {
      current += 10;
      matchedAny = true;
    } else if (word === 'puluh') {
      current = (current === 0 ? 1 : current) * 10;
      matchedAny = true;
    } else if (word === 'ratus') {
      current = (current === 0 ? 1 : current) * 100;
      matchedAny = true;
    } else if (word === 'ribu') {
      total += (current === 0 ? 1 : current) * 1000;
      current = 0;
      matchedAny = true;
    } else if (word === 'juta') {
      total += (current === 0 ? 1 : current) * 1000000;
      current = 0;
      matchedAny = true;
    }
  }

  total += current;
  return matchedAny && total >= 1000 ? total : null;
}

/**
 * Ekstraksi nominal angka dari teks
 * Mendukung format: 18rb, 18k, 18.000, 18000, 1,5jt, 1.5jt, 2 juta, dua puluh lima ribu
 */
export function extractAmount(text: string): { amount?: number; cleanText: string } {
  const clean = text.trim();

  // 1. Coba pola angka teks terlebih dahulu
  const wordAmount = parseIndonesianNumberWords(clean);
  if (wordAmount) {
    // Bersihkan kata angka dari teks untuk mengambil sisa sebagai catatan
    const cleanWords = clean
      .replace(/\b(satu|dua|tiga|empat|lima|enam|tujuh|delapan|sembilan|sepuluh|sebelas|belas|puluh|ratus|seratus|ribu|seribu|juta|sejuta)\b/gi, '')
      .replace(/\s+/g, ' ')
      .trim();
    return { amount: wordAmount, cleanText: cleanWords };
  }

  // 2. Pola ekspresi reguler numerik: (\d+(?:[.,]\d+)?)\s*(rb|ribu|k|jt|juta)?
  // Dukung format ribuan dengan titik (contoh 18.000 atau 1.500.000)
  const dotThousandsRegex = /(?:^|\s|rp\.?)\s*(\d{1,3}(?:\.\d{3})+)(?!\d)/i;
  const dotMatch = clean.match(dotThousandsRegex);
  if (dotMatch) {
    const rawNum = dotMatch[1].replace(/\./g, '');
    const num = parseInt(rawNum, 10);
    const cleanText = clean.replace(dotMatch[0], '').replace(/\s+/g, ' ').trim();
    return { amount: num, cleanText };
  }

  // Suffix regex: 18rb, 18k, 1.5jt, 1,5jt, 2 juta, dll.
  const regex = /(?:^|\s|rp\.?)\s*(\d+(?:[.,]\d+)?)\s*(rb|ribu|k|jt|juta)?(?:\b|\s|$)/i;
  const match = clean.match(regex);

  if (match) {
    let numStr = match[1].replace(',', '.');
    const suffix = match[2] ? match[2].toLowerCase() : '';
    let val = parseFloat(numStr);

    if (suffix === 'rb' || suffix === 'ribu' || suffix === 'k') {
      val *= 1000;
    } else if (suffix === 'jt' || suffix === 'juta') {
      val *= 1000000;
    } else {
      // Tanpa sufiks: hanya anggap nominal jika >= 1000
      if (val < 1000) {
        val = 0;
      }
    }

    if (val > 0) {
      const cleanText = clean.replace(match[0], '').replace(/\s+/g, ' ').trim();
      return { amount: Math.round(val), cleanText };
    }
  }

  return { cleanText: clean };
}

/**
 * Pencocokan kategori berdasarkan kata kunci (case-insensitive)
 */
export function detectCategory(text: string): { category: Category; isMatched: boolean } {
  const lower = text.toLowerCase();

  const rules: { category: Category; keywords: string[] }[] = [
    {
      category: 'Makanan & Minuman',
      keywords: ['makan', 'ngopi', 'kopi', 'minum', 'jajan', 'boba', 'nasi', 'ayam', 'warteg', 'bakso', 'mie', 'sate', 'cafe', 'sarapan', 'lunch', 'dinner', 'snack', 'roti', 'kue', 'teh'],
    },
    {
      category: 'Transportasi',
      keywords: ['grab', 'gojek', 'ojol', 'bensin', 'parkir', 'tol', 'krl', 'transjakarta', 'mrt', 'kereta', 'bus', 'angkot', 'pertalite', 'pertamax', 'maxim', 'indrive', 'taksi'],
    },
    {
      category: 'Tagihan',
      keywords: ['kos', 'kost', 'listrik', 'air', 'cicilan', 'pdam', 'token', 'iuran', 'kontrakan', 'pln'],
    },
    {
      category: 'Pulsa & Internet',
      keywords: ['pulsa', 'paket data', 'wifi', 'kuota', 'indihome', 'telkomsel', 'xl', 'tri', 'axis', 'smartfren', 'byu', 'biznet', 'myrepublic'],
    },
    {
      category: 'Kuliah',
      keywords: ['buku', 'fotokopi', 'fotocopy', 'print', 'ukt', 'praktikum', 'modul', 'alat tulis', 'skripsi', 'kertas', 'seminar', 'kuliah', 'kampus', 'diktat'],
    },
    {
      category: 'Hiburan',
      keywords: ['nonton', 'game', 'spotify', 'netflix', 'nongkrong', 'bioskop', 'steam', 'topup', 'karaoke', 'jalan-jalan', 'liburan', 'youtube', 'disney'],
    },
    {
      category: 'Belanja',
      keywords: ['belanja', 'baju', 'sepatu', 'skincare', 'indomaret', 'alfamart', 'minimarket', 'jaket', 'celana', 'tas', 'kemeja', 'odol', 'sabun', 'shampoo', 'shopee', 'tokopedia', 'supermarket', 'mall'],
    },
  ];

  for (const rule of rules) {
    for (const kw of rule.keywords) {
      const regex = new RegExp(`\\b${kw}\\b`, 'i');
      if (regex.test(lower)) {
        return { category: rule.category, isMatched: true };
      }
    }
  }

  return { category: 'Lainnya', isMatched: false };
}

/**
 * Parser utama untuk pesan pengguna (tanpa LLM, deterministic extraction)
 */
export function parseUserMessage(text: string): ParseResult {
  const clean = text.trim();
  const lower = clean.toLowerCase();

  // 1. Cek Maksud: Stress Test
  if (
    lower.includes('stress test') ||
    lower.includes('stress-test') ||
    lower.includes('daya tahan') ||
    lower.includes('bertahan berapa hari') ||
    lower.includes('cek ketahanan')
  ) {
    return {
      kind: 'query_stress',
      confidence: 1.0,
      note: 'Stress-Test Daya Tahan',
    };
  }

  // 2. Cek Maksud: Cek Sebelum Beli
  const purchaseTriggers = ['kalau beli', 'jadi beli', 'boleh beli', 'beli', 'mau beli', 'pengen beli'];
  const hasPurchaseTrigger = purchaseTriggers.some((t) => lower.includes(t));

  if (hasPurchaseTrigger && (lower.includes('gimana') || lower.includes('boleh') || lower.includes('bisa') || lower.includes('apakah') || lower.includes('kalau'))) {
    const { amount, cleanText } = extractAmount(clean);
    
    // Ekstraksi nama barang dari sisa teks
    let itemName = cleanText
      .replace(/kalau|gimana|boleh|beli|mau|pengen|jadinya|kira-kira|dong|\?/gi, '')
      .trim();

    if (!itemName) {
      itemName = 'Barang impian';
    } else {
      // Huruf kapital awal
      itemName = itemName.charAt(0).toUpperCase() + itemName.slice(1);
    }

    return {
      kind: 'query_purchase',
      amount,
      note: itemName,
      confidence: amount ? 0.9 : 0.5,
    };
  }

  // 3. Cek Maksud: Pemasukan (Income)
  const incomeTriggers = ['gajian', 'uang saku masuk', 'dapat honor', 'pemasukan', 'transfer masuk', 'dapat uang', 'sangu masuk'];
  if (incomeTriggers.some((t) => lower.includes(t))) {
    const { amount, cleanText } = extractAmount(clean);
    let note = cleanText || 'Pemasukan';
    note = note.charAt(0).toUpperCase() + note.slice(1);

    return {
      kind: 'income',
      amount,
      note,
      confidence: amount ? 0.95 : 0.6,
    };
  }

  // 4. Deteksi Pengeluaran (Expense)
  const { amount, cleanText } = extractAmount(clean);
  const { category, isMatched } = detectCategory(clean);

  if (amount && amount > 0) {
    // Bersihkan nama catatan
    let note = cleanText
      .replace(/tadi|beli|bayar|pesan|jajan|ngopi|habis|buat|untuk/gi, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!note || note.length < 2) {
      note = category !== 'Lainnya' ? category : 'Pengeluaran';
    } else {
      note = note.charAt(0).toUpperCase() + note.slice(1);
    }

    // Skor confidence: 0.9 jika kategori & nominal jelas terdeteksi, 0.6 jika kategori Lainnya
    const confidence = isMatched ? 0.9 : 0.6;

    return {
      kind: 'expense',
      amount,
      category,
      note,
      confidence,
    };
  }

  // 5. Jika tidak ada nominal dan bukan query
  return {
    kind: 'unknown',
    confidence: 0.1,
    note: clean,
  };
}
