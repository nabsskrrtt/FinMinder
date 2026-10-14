// STUB: ganti dengan rumus final tim
import { Profile, Transaction, Scenario, RunwayResult, RUNWAY_THRESHOLDS, Category } from '../config';

/**
 * Mesin Daya Tahan (Runway Engine)
 * Menghitung estimasi berapa hari saldo bertahan jika terjadi krisis / tanpa pemasukan.
 * Didesain sebagai fungsi murni terisolasi agar mudah digantikan dengan rumus final tim.
 */
export function computeRunway(
  profile: Profile,
  transactions: Transaction[],
  scenario?: Scenario
): RunwayResult {
  // 1. Hitung total saldo riil saat ini
  const totalIncome = transactions
    .filter((t) => t.kind === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.kind === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  let currentBalance = profile.startingBalance + totalIncome - totalExpense;

  // 2. Rata-rata pengeluaran esensial 14 hari terakhir
  // Kategori esensial: Makanan & Minuman, Transportasi, Pulsa & Internet, Kuliah
  const essentialCategories: Category[] = [
    'Makanan & Minuman',
    'Transportasi',
    'Pulsa & Internet',
    'Kuliah',
  ];

  const now = new Date();
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  const recentEssentialExpenses = transactions.filter((t) => {
    if (t.kind !== 'expense') return false;
    if (!essentialCategories.includes(t.category)) return false;
    const txDate = new Date(t.date);
    return txDate >= fourteenDaysAgo;
  });

  const sumEssential14Days = recentEssentialExpenses.reduce((sum, t) => sum + t.amount, 0);
  
  // Jika data 14 hari belum penuh atau kosong, gunakan estimasi harian wajar
  const rataEsensialHarian = sumEssential14Days > 0 ? sumEssential14Days / 14 : 35000;

  // Tagihan tetap bulanan dibagi 30
  const tagihanHarian = profile.fixedBills > 0 ? profile.fixedBills / 30 : 0;

  // Daily burn rate
  const burnHarian = Math.max(1000, rataEsensialHarian + tagihanHarian);

  // 3. Modifikasi saldo atau parameter berdasarkan skenario krisis
  let saldoSetelahSkenario = currentBalance;

  if (scenario) {
    switch (scenario.id) {
      case 'late_allowance': {
        // Tanpa pemasukan selama delayDays (default 14 hari)
        // Pada skenario ini, saldo saat ini adalah modal murni tanpa suntikan uang saku baru
        const delayDays = scenario.params.delayDays ?? 14;
        // Saldo tetap, namun tidak ada suntikan dana selama delayDays
        saldoSetelahSkenario = currentBalance;
        break;
      }
      case 'broken_laptop': {
        // Saldo terpotong biaya tak terduga (default Rp3.000.000)
        const expense = scenario.params.oneOffExpense ?? 3000000;
        saldoSetelahSkenario = currentBalance - expense;
        break;
      }
      case 'freelance_cancelled': {
        // TODO: (tidak ada pengaruh pada stub; catat sebagai TODO untuk rumus tim selanjutnya)
        const lossPct = scenario.params.incomeLossPct ?? 0.3;
        saldoSetelahSkenario = currentBalance - (profile.monthlyIncome * 0.2);
        break;
      }
      case 'custom': {
        const expense = scenario.params.oneOffExpense ?? 500000;
        saldoSetelahSkenario = currentBalance - expense;
        break;
      }
    }
  }

  // 4. Hitung hari bertahan
  const rawDays = saldoSetelahSkenario / burnHarian;
  const days = Math.max(0, Math.floor(rawDays));

  // 5. Tentukan status
  let status: 'safe' | 'warn' | 'critical' = 'safe';
  if (days < RUNWAY_THRESHOLDS.critical) {
    status = 'critical';
  } else if (days < RUNWAY_THRESHOLDS.warn) {
    status = 'warn';
  } else {
    status = 'safe';
  }

  // 6. Cari kategori pengeluaran terbesar
  const categoryTotals: Record<string, number> = {};
  transactions
    .filter((t) => t.kind === 'expense')
    .forEach((t) => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });

  let topCategory: Category = 'Makanan & Minuman';
  let maxSpend = 0;
  for (const [cat, spend] of Object.entries(categoryTotals)) {
    if (spend > maxSpend) {
      maxSpend = spend;
      topCategory = cat as Category;
    }
  }

  return {
    days,
    status,
    topCategory,
    dailyBurn: Math.round(burnHarian),
    effectiveBalance: Math.max(0, saldoSetelahSkenario),
  };
}
