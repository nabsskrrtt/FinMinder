import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { formatRupiah } from '../lib/format';
import { RunwayGauge } from '../components/RunwayGauge';
import { CategoryDonut } from '../components/CategoryDonut';
import { SpendTrendChart } from '../components/SpendTrendChart';
import { RunwayTrendChart } from '../components/RunwayTrendChart';
import { ScenarioSimulator } from '../components/ScenarioSimulator';
import { TransactionTable } from '../components/TransactionTable';
import { SettingsPanel } from '../components/SettingsPanel';
import {
  MessageSquare,
  Wallet,
  TrendingDown,
  ArrowUpRight,
  PiggyBank,
  ChevronLeft,
  Calendar,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { computeRunway } from '../lib/runway';
import { Footer } from '../components/Footer';

export const Dashboard: React.FC = () => {
  const profile = useStore((s) => s.profile);
  const transactions = useStore((s) => s.transactions);

  const runway = React.useMemo(
    () => computeRunway(profile, transactions),
    [profile, transactions]
  );

  const currentBalance = React.useMemo(() => {
    const totalIncome = transactions
      .filter((t) => t.kind === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions
      .filter((t) => t.kind === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return profile.startingBalance + totalIncome - totalExpense;
  }, [profile.startingBalance, transactions]);

  const [period, setPeriod] = useState<'this_month' | 'last_30_days'>('this_month');

  // Kalkulasi metrik ringkasan
  const totalExpense = transactions
    .filter((t) => t.kind === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalIncome = transactions
    .filter((t) => t.kind === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  // Estimasi total pemasukan gabungan
  const effectiveMonthlyIncome = profile.monthlyIncome + totalIncome;
  const sisaAnggaranBulanIni = Math.max(0, effectiveMonthlyIncome - profile.fixedBills - totalExpense);

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-between selection:bg-brand-100 selection:text-brand-900">
      {/* Top Banner Penanda Prototipe & Navigasi */}
      <header className="bg-white border-b border-ink-200/80 sticky top-0 z-30 px-4 sm:px-6 py-3 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/demo"
              className="flex items-center gap-1 text-xs sm:text-sm font-bold text-brand-700 hover:text-brand-800 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-lg border border-brand-200 transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-brand-600" />
              <span>Kembali ke Chat</span>
            </Link>

            <span className="text-ink-300 hidden sm:inline">|</span>

            <div>
              <div className="flex items-center gap-2">
                <img src="/logo.png" alt="FinMinder Logo" className="w-6 h-6 rounded-md object-contain shadow-2xs" />
                <h1 className="text-lg font-extrabold text-ink-900 tracking-tight">
                  Dashboard Refleksi
                </h1>
                <span className="text-[10px] bg-brand-50 text-brand-700 font-bold px-2 py-0.5 rounded-full border border-brand-200">
                  Prototipe: data simulasi
                </span>
              </div>
            </div>
          </div>

          {/* Period Selector */}
          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-xl p-1 bg-surface border border-ink-200 text-xs font-semibold">
              <button
                onClick={() => setPeriod('this_month')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  period === 'this_month'
                    ? 'bg-white text-ink-900 shadow-2xs'
                    : 'text-ink-500 hover:text-ink-900'
                }`}
              >
                Bulan Ini
              </button>
              <button
                onClick={() => setPeriod('last_30_days')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  period === 'last_30_days'
                    ? 'bg-white text-ink-900 shadow-2xs'
                    : 'text-ink-500 hover:text-ink-900'
                }`}
              >
                30 Hari Terakhir
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* 1. KARTU DAYA TAHAN UTAMA (Lebar Penuh) */}
        <section className="bg-card rounded-card p-6 sm:p-7 border border-brand-200 shadow-soft">
          <div className="flex items-center justify-between border-b border-ink-100 pb-3 mb-4">
            <span className="text-xs font-bold text-brand-700 uppercase tracking-wider">
              Status Ketahanan Finansial Anda
            </span>
            <span className="text-xs text-ink-500 font-medium flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              Sinkron Waktu-Nyata dengan Chat Bot
            </span>
          </div>

          <RunwayGauge
            days={runway.days}
            status={runway.status}
            variant="full"
            showExplanation={true}
          />
        </section>

        {/* 2. KARTU RINGKASAN METRIK (4 KARTU) */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Saldo Saat Ini */}
          <div className="bg-card p-4 rounded-card border border-ink-100 shadow-soft space-y-1">
            <div className="flex items-center justify-between text-ink-500">
              <span className="text-xs font-semibold">Saldo Saat Ini</span>
              <Wallet className="w-4 h-4 text-brand-600" />
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-ink-900 tabular-nums">
              {formatRupiah(currentBalance)}
            </div>
            <span className="text-[10px] text-ink-400 block">Tersedia di rekening & e-wallet</span>
          </div>

          {/* Pemasukan Bulan Ini */}
          <div className="bg-card p-4 rounded-card border border-ink-100 shadow-soft space-y-1">
            <div className="flex items-center justify-between text-ink-500">
              <span className="text-xs font-semibold">Pemasukan Bulan Ini</span>
              <ArrowUpRight className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-emerald-700 tabular-nums">
              {formatRupiah(effectiveMonthlyIncome)}
            </div>
            <span className="text-[10px] text-ink-400 block">Uang saku + honor freelance</span>
          </div>

          {/* Pengeluaran Bulan Ini */}
          <div className="bg-card p-4 rounded-card border border-ink-100 shadow-soft space-y-1">
            <div className="flex items-center justify-between text-ink-500">
              <span className="text-xs font-semibold">Pengeluaran Tercatat</span>
              <TrendingDown className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-ink-900 tabular-nums">
              {formatRupiah(totalExpense)}
            </div>
            <span className="text-[10px] text-ink-400 block">{transactions.length} transaksi</span>
          </div>

          {/* Sisa Anggaran Bebas */}
          <div className="bg-card p-4 rounded-card border border-ink-100 shadow-soft space-y-1">
            <div className="flex items-center justify-between text-ink-500">
              <span className="text-xs font-semibold">Sisa Anggaran Bebas</span>
              <PiggyBank className="w-4 h-4 text-teal-600" />
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-teal-700 tabular-nums">
              {formatRupiah(sisaAnggaranBulanIni)}
            </div>
            <span className="text-[10px] text-ink-400 block">Setelah tagihan kos & wifi</span>
          </div>
        </section>

        {/* 3 & 4. CHARTS ROW: DISTRIBUSI KATEGORI & TREN PENGELUARAN */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5">
            <CategoryDonut transactions={transactions} />
          </div>
          <div className="lg:col-span-7">
            <SpendTrendChart
              transactions={transactions}
              dailyBudget={profile.dailyBudget}
            />
          </div>
        </section>

        {/* 5 & 6. CHARTS ROW: TREN DAYA TAHAN & SIMULATOR SKENARIO */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6">
            <RunwayTrendChart
              profile={profile}
              transactions={transactions}
            />
          </div>
          <div className="lg:col-span-6">
            <ScenarioSimulator />
          </div>
        </section>

        {/* 7. RIWAYAT TRANSAKSI DENGAN AKSI UBAH & HAPUS */}
        <section>
          <TransactionTable />
        </section>

        {/* 8. PENGATURAN PARAMETER & HAPUS DATA */}
        <section>
          <SettingsPanel />
        </section>
      </main>

      {/* Global Informative Footer */}
      <Footer />
    </div>
  );
};
