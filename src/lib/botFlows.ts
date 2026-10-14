import { useStore } from '../store/useStore';
import { parseUserMessage, ParseResult } from './parser';
import { computeRunway } from './runway';
import { formatRupiah, formatNumber } from './format';
import { Scenario, Category, MAX_NUDGE_PER_DAY } from '../config';

/**
 * Orchestrator alur interaksi bot FinMinder
 */

export function handleUserIncoming(text: string) {
  const store = useStore.getState();

  // 1. Catat pesan pengguna ke riwayat chat
  store.pushMessage({
    sender: 'user',
    text,
  });

  const parsed = parseUserMessage(text);
  store.setLastParsed(parsed);

  // 2. Cek alur onboarding jika belum selesai
  if (store.onboardingStep < 5) {
    handleOnboardingInput(text, parsed);
    return;
  }

  // 3. Routing maksud pengguna
  switch (parsed.kind) {
    case 'query_stress': {
      handleStressTestTrigger();
      break;
    }
    case 'query_purchase': {
      handlePurchaseCheckTrigger(parsed);
      break;
    }
    case 'income': {
      handleIncomeInput(parsed);
      break;
    }
    case 'expense': {
      if (parsed.confidence >= 0.8 && parsed.amount) {
        // Simpan otomatis
        handleAutomaticExpense(parsed);
      } else {
        // Tampilkan kartu draf untuk dikonfirmasi
        handleDraftExpense(parsed);
      }
      break;
    }
    case 'unknown':
    default: {
      handleUnknownInput(text);
      break;
    }
  }
}

/**
 * Alur Onboarding
 */
function handleOnboardingInput(text: string, parsed: ParseResult) {
  const store = useStore.getState();
  const step = store.onboardingStep;

  if (text.toLowerCase().includes('lewati') || text.toLowerCase().includes('contoh')) {
    store.loadSampleProfile();
    return;
  }

  if (step === 1) {
    // Menunggu persetujuan data
    if (text.toLowerCase().includes('setuju') || text.toLowerCase().includes('ya')) {
      store.setProfile({ consentGiven: true });
      store.setOnboardingStep(2);
      store.pushMessage({
        sender: 'bot',
        text: 'Bagus! Privasimu aman bersama FinMinder.\n\nBerapa estimasi pemasukan bulananmu? (uang saku, beasiswa, atau gaji freelance)',
      });
      store.setQuickReplies(['1,5jt', '2,5jt', '3,5jt', 'Lewati, pakai profil contoh']);
    } else {
      store.pushMessage({
        sender: 'bot',
        text: 'Untuk melanjutkan, silakan setujui penyimpanan data lokal atau pilih tombol profil contoh di bawah.',
      });
    }
    return;
  }

  if (step === 2) {
    // Estimasi pemasukan
    const amount = parsed.amount || 2500000;
    store.setProfile({ monthlyIncome: amount });
    store.setOnboardingStep(3);
    store.pushMessage({
      sender: 'bot',
      text: `Pemasukan dicatat ${formatRupiah(amount)}/bulan.\n\nBerapa total tagihan tetap per bulan (sewa kos, wifi, listrik, dll.)?`,
    });
    store.setQuickReplies(['500rb', '800rb', '1,2jt', 'Lewati, pakai profil contoh']);
    return;
  }

  if (step === 3) {
    // Tagihan tetap
    const amount = parsed.amount || 800000;
    store.setProfile({ fixedBills: amount });
    store.setOnboardingStep(4);
    store.pushMessage({
      sender: 'bot',
      text: `Tagihan tetap ${formatRupiah(amount)}/bulan dicatat.\n\nTerakhir: berapa saldo kamu sekarang di rekening/e-wallet?`,
    });
    store.setQuickReplies(['500rb', '1,5jt', '2,5jt', 'Lewati, pakai profil contoh']);
    return;
  }

  if (step === 4) {
    // Saldo awal
    const amount = parsed.amount || 1500000;
    store.setProfile({ startingBalance: amount });
    store.setOnboardingStep(5);
    store.pushMessage({
      sender: 'bot',
      text: `Siap! Profil keuanganmu selesai dikonfigurasi. Anggaran harianmu adalah ${formatRupiah(
        Math.round((store.profile.monthlyIncome - store.profile.fixedBills) / 30)
      )}.\n\nCoba kirim catatan pertamamu, misalnya "ngopi 25rb" atau ketuk chip di bawah.`,
    });
    store.setQuickReplies([
      '🎙 Kirim voice',
      '📷 Foto nota',
      'Stress-Test',
      'Cek Sebelum Beli',
      'Ringkasan minggu ini',
    ]);
  }
}

/**
 * Simpan transaksi otomatis (confidence >= 0.8)
 */
function handleAutomaticExpense(parsed: ParseResult) {
  const store = useStore.getState();
  const tx = store.addTransaction({
    kind: 'expense',
    amount: parsed.amount!,
    category: parsed.category || 'Makanan & Minuman',
    note: parsed.note || 'Pengeluaran',
    source: 'text',
  });

  const spentToday = store.spentToday();
  const dailyBudget = store.profile.dailyBudget;
  const sisaHariIni = Math.max(0, dailyBudget - spentToday);

  // Balasan standar
  store.pushMessage({
    sender: 'bot',
    text: `Tercatat: ${tx.note}, ${formatRupiah(tx.amount)} (${tx.category}).\nSisa anggaran hari ini ${formatRupiah(sisaHariIni)}.`,
    payload: { txId: tx.id },
  });

  store.setQuickReplies(['Ubah kategori', 'Batalkan', 'Stress-Test', 'Cek Sebelum Beli']);

  // Nudge Anggaran Proaktif
  checkBudgetEmergencyNudge(spentToday, dailyBudget);
}

/**
 * Tampilkan kartu draf jika confidence rendah / dari media
 */
export function handleDraftExpense(draftData: {
  amount?: number;
  category?: Category;
  note?: string;
  source?: 'text' | 'voice' | 'receipt';
}) {
  const store = useStore.getState();
  store.pushMessage({
    sender: 'bot',
    type: 'draft',
    payload: {
      amount: draftData.amount || 25000,
      category: draftData.category || 'Lainnya',
      note: draftData.note || 'Pengeluaran',
      source: draftData.source || 'text',
    },
  });

  store.setQuickReplies(['Ubah kategori', 'Batalkan']);
}

/**
 * Handle pemasukan uang
 */
function handleIncomeInput(parsed: ParseResult) {
  const store = useStore.getState();
  const amount = parsed.amount || 500000;
  const note = parsed.note || 'Pemasukan';

  const tx = store.addTransaction({
    kind: 'income',
    amount,
    category: 'Lainnya',
    note,
    source: 'text',
  });

  const runway = store.runway();
  store.pushMessage({
    sender: 'bot',
    text: `Alhamdulillah, pemasukan ${formatRupiah(tx.amount)} (${tx.note}) berhasil dicatat!\n\nSaldo sekarang: ${formatRupiah(
      store.currentBalance()
    )}.\nDaya Tahan saldomu meningkat menjadi ${runway.days} hari (${
      runway.status === 'safe' ? 'Aman' : runway.status === 'warn' ? 'Waspada' : 'Kritis'
    }).`,
  });

  store.setQuickReplies(['Stress-Test', 'Cek Sebelum Beli', 'Ringkasan minggu ini']);
}

/**
 * Stress-Test Trigger & Scenarios
 */
export function handleStressTestTrigger() {
  const store = useStore.getState();
  store.pushMessage({
    sender: 'bot',
    text: 'Mari kita uji daya tahan keuanganmu jika terjadi kondisi darurat. Pilih skenario di bawah:',
  });

  store.setQuickReplies([
    'Uang saku terlambat',
    'Laptop rusak',
    'Freelance batal',
    'Buat sendiri',
  ]);
}

export function executeStressTest(scenarioType: 'late_allowance' | 'broken_laptop' | 'freelance_cancelled' | 'custom', customExpense?: number) {
  const store = useStore.getState();
  
  let scenario: Scenario;
  if (scenarioType === 'late_allowance') {
    scenario = {
      id: 'late_allowance',
      label: 'Uang saku terlambat 2 mgg',
      params: { delayDays: 14 },
    };
  } else if (scenarioType === 'broken_laptop') {
    scenario = {
      id: 'broken_laptop',
      label: 'Laptop rusak (Rp3.000.000)',
      params: { oneOffExpense: 3000000 },
    };
  } else if (scenarioType === 'freelance_cancelled') {
    scenario = {
      id: 'freelance_cancelled',
      label: 'Honor freelance batal',
      params: { incomeLossPct: 0.3 },
    };
  } else {
    scenario = {
      id: 'custom',
      label: 'Skenario Kustom',
      params: { oneOffExpense: customExpense || 600000 },
    };
  }

  const result = store.runway(scenario);

  store.pushMessage({
    sender: 'bot',
    type: 'stress_test',
    payload: {
      scenario,
      result,
    },
  });

  store.setQuickReplies(['Coba skenario lain', 'Buka Dashboard', 'Cek Sebelum Beli']);
}

/**
 * Cek Sebelum Beli
 */
export function handlePurchaseCheckTrigger(parsed?: ParseResult) {
  const store = useStore.getState();
  const amount = parsed?.amount;
  const itemName = parsed?.note || 'Earphone';

  if (!amount) {
    store.pushMessage({
      sender: 'bot',
      text: 'Kamu ingin beli barang apa dan berapa harganya? (Contoh: "kalau beli earphone 400rb gimana?")',
    });
    store.setQuickReplies(['Beli earphone 400rb', 'Beli sepatu 350rb', 'Beli buku 120rb']);
    return;
  }

  // Hitung Daya Tahan sebelum dan sesudah
  const currentRunway = store.runway();
  
  // Simulasi sementara
  const simulatedExpenseTx = {
    id: 'temp-calc',
    date: new Date().toISOString(),
    kind: 'expense' as const,
    amount,
    category: 'Belanja' as Category,
    note: itemName,
    source: 'text' as const,
  };

  const simulatedTransactions = [simulatedExpenseTx, ...store.transactions];
  const simResult = computeRunway(store.profile, simulatedTransactions);

  const avgLunch = store.avgLunchExpense();
  const lunchEquivalent = Math.max(1, Math.round(amount / avgLunch));

  store.pushMessage({
    sender: 'bot',
    type: 'purchase_check',
    payload: {
      itemName,
      amount,
      beforeDays: currentRunway.days,
      beforeStatus: currentRunway.status,
      afterDays: simResult.days,
      afterStatus: simResult.status,
      lunchEquivalent,
    },
  });

  store.setQuickReplies(['Jadi beli', 'Tunda 3 hari', 'Batal']);
}

/**
 * Weekly Summary Trigger
 */
export function handleWeeklySummary() {
  const store = useStore.getState();
  const spentThisWeek = store.spentThisWeek();
  // Rata-rata pengeluaran minggu lalu (simulasi berbasis data)
  const spentLastWeek = Math.round(spentThisWeek * 0.92);
  const diffPct = Math.round(((spentThisWeek - spentLastWeek) / spentLastWeek) * 100);
  const runway = store.runway();

  store.pushMessage({
    sender: 'bot',
    type: 'weekly_summary',
    payload: {
      spentThisWeek,
      diffPct,
      topCategory: runway.topCategory,
      runwayDays: runway.days,
      runwayStatus: runway.status,
      insight: 'Pengeluaranmu cukup terjaga pada hari kuliah, namun cenderung melonjak saat akhir pekan.',
    },
  });

  store.setQuickReplies(['Buka Dashboard', 'Stress-Test', 'Cek Sebelum Beli']);
}

/**
 * Simulasi Suara (Voice)
 */
export function handleSimulateVoice() {
  const store = useStore.getState();
  
  // 1. Tambah gelembung suara pengguna
  store.pushMessage({
    sender: 'user',
    type: 'voice',
    payload: { duration: '0:04' },
  });

  // 2. Bot membalas draf hasil transkripsi
  store.pushMessage({
    sender: 'bot',
    type: 'draft',
    payload: {
      amount: 25000,
      category: 'Makanan & Minuman',
      note: 'Kopi Susu Gula Aren',
      source: 'voice',
      transcript: 'tadi ngopi dua puluh lima ribu',
    },
  });

  store.setQuickReplies(['Ubah kategori', 'Batalkan']);
}

/**
 * Simulasi Foto Nota (Receipt)
 */
export function handleSimulateReceipt() {
  const store = useStore.getState();

  // 1. Tambah gelembung gambar struk pengguna
  store.pushMessage({
    sender: 'user',
    type: 'receipt',
    payload: {
      storeName: 'Minimarket Kampus',
      itemsCount: 3,
      total: 47500,
    },
  });

  // 2. Bot membalas draf hasil OCR
  store.pushMessage({
    sender: 'bot',
    type: 'draft',
    payload: {
      amount: 47500,
      category: 'Belanja',
      note: 'Minimarket (Sabun, Snack, Tisu)',
      source: 'receipt',
    },
  });

  store.setQuickReplies(['Ubah kategori', 'Batalkan']);
}

/**
 * Cek dan tampilkan Nudge Anggaran jika melewati batas
 */
function checkBudgetEmergencyNudge(spentToday: number, dailyBudget: number) {
  const store = useStore.getState();
  if (store.nudgeCountToday >= MAX_NUDGE_PER_DAY) return;

  if (spentToday >= dailyBudget) {
    store.incrementNudge();
    store.pushMessage({
      sender: 'bot',
      text: '⚠️ Anggaran hari ini habis. Pengeluaran berikutnya diambil dari jatah besok.',
    });
  } else if (spentToday >= dailyBudget * 0.8) {
    store.incrementNudge();
    const sisa = Math.max(0, dailyBudget - spentToday);
    store.pushMessage({
      sender: 'bot',
      text: `💡 Anggaran hari ini tinggal ${formatRupiah(sisa)}. Masih ada makan malam, ya.`,
    });
  }
}

/**
 * Respon input yang tidak dikenali
 */
function handleUnknownInput(text: string) {
  const store = useStore.getState();
  store.pushMessage({
    sender: 'bot',
    text: `Aku belum paham maksud "${text}".\n\nCoba ketik nominal pengeluaran seperti "makan siang 18rb", "bensin 20rb", atau gunakan tombol menu di bawah.`,
  });
  store.setQuickReplies(['🎙 Kirim voice', '📷 Foto nota', 'Stress-Test', 'Cek Sebelum Beli']);
}
