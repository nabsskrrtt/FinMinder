import React from 'react';
import { useStore } from '../store/useStore';
import { formatRupiah } from '../lib/format';
import { StatusBadge } from './StatusBadge';
import {
  Cpu,
  Zap,
  TrendingDown,
  Bell,
  Code2,
  FastForward,
  RotateCcw,
  Sparkles,
  ChevronRight,
  X,
} from 'lucide-react';
import { handleWeeklySummary } from '../lib/botFlows';
import { Link } from 'react-router-dom';

import { computeRunway } from '../lib/runway';

interface BackstagePanelProps {
  onClose?: () => void;
  isMobileDrawer?: boolean;
}

export const BackstagePanel: React.FC<BackstagePanelProps> = ({
  onClose,
  isMobileDrawer = false,
}) => {
  const lastParsed = useStore((s) => s.lastParsed);
  const profile = useStore((s) => s.profile);
  const transactions = useStore((s) => s.transactions);
  const reminders = useStore((s) => s.reminders);
  const pushMessage = useStore((s) => s.pushMessage);
  const setQuickReplies = useStore((s) => s.setQuickReplies);
  const loadSampleProfile = useStore((s) => s.loadSampleProfile);
  const incrementNudge = useStore((s) => s.incrementNudge);

  const runway = React.useMemo(
    () => computeRunway(profile, transactions),
    [profile, transactions]
  );

  const todaySpent = React.useMemo(() => {
    const todayStr = new Date().toDateString();
    return transactions
      .filter(
        (t) =>
          t.kind === 'expense' &&
          new Date(t.date).toDateString() === todayStr
      )
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const dailyBudget = profile.dailyBudget;
  const budgetPct = Math.min(100, Math.round((todaySpent / (dailyBudget || 1)) * 100));

  // Simulasi akhir hari
  const handleSimulateEndOfDay = () => {
    incrementNudge();
    pushMessage({
      sender: 'bot',
      text: '🌙 [Simulasi Akhir Hari]: Pengeluaran minggu ini 135% di atas biasanya. Mau lihat kategori terbesarnya?',
    });
    setQuickReplies(['Ringkasan minggu ini', 'Buka Dashboard', 'Stress-Test']);
    if (onClose && isMobileDrawer) onClose();
  };

  // Simulasi akhir minggu
  const handleSimulateEndOfWeek = () => {
    handleWeeklySummary();
    if (onClose && isMobileDrawer) onClose();
  };

  return (
    <div
      className={`bg-white rounded-card border border-ink-200/80 shadow-soft p-4 sm:p-5 flex flex-col gap-4 text-ink-900 ${
        isMobileDrawer ? 'max-h-[85vh] overflow-y-auto' : 'h-full overflow-y-auto'
      }`}
    >
      {/* Header Panel */}
      <div className="flex items-center justify-between border-b border-ink-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1 bg-brand-50 rounded-lg border border-brand-200">
            <img src="/logo.png" alt="FinMinder Logo" className="w-6 h-6 rounded-md object-contain shadow-2xs" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm sm:text-base text-ink-900">
                Di Balik Layar
              </h3>
              <span className="text-[10px] bg-brand-100 text-brand-800 font-bold px-2 py-0.5 rounded-full">
                LIVE
              </span>
            </div>
            <p className="text-xs text-ink-500">
              State & kalkulasi waktu-nyata untuk penilai juri
            </p>
          </div>
        </div>

        {isMobileDrawer && onClose && (
          <button
            onClick={onClose}
            className="p-1.5 text-ink-400 hover:text-ink-700 rounded-lg"
            aria-label="Tutup panel"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* 1. Hasil Ekstraksi AI Pesan Terakhir */}
      <div className="bg-surface rounded-xl p-3 border border-ink-100 space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-ink-700">
          <span className="flex items-center gap-1.5">
            <Code2 className="w-4 h-4 text-brand-600" />
            Ekstraksi Pesan Terakhir (Parser)
          </span>
          <span className="text-[11px] text-ink-500 font-mono">lib/parser.ts</span>
        </div>

        <div className="bg-ink-900 text-emerald-400 p-3 rounded-lg font-mono text-[11px] leading-relaxed overflow-x-auto shadow-inner">
          <pre>
            {JSON.stringify(
              lastParsed || {
                kind: 'expense',
                amount: 25000,
                category: 'Makanan & Minuman',
                note: 'ngopi',
                confidence: 0.95,
              },
              null,
              2
            )}
          </pre>
        </div>
      </div>

      {/* 2. Metrik Daya Tahan Saat Ini */}
      <div className="bg-surface rounded-xl p-3 border border-ink-100 space-y-2.5">
        <div className="flex items-center justify-between text-xs font-semibold text-ink-700">
          <span className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-500" />
            Daya Tahan Saldo (computeRunway)
          </span>
          <StatusBadge status={runway.status} size="sm" />
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="bg-white p-2.5 rounded-lg border border-ink-100">
            <span className="text-[11px] text-ink-500 block">Daya Tahan</span>
            <div className="text-2xl font-bold text-ink-900 tabular-nums">
              {runway.days} <span className="text-xs font-medium">hari</span>
            </div>
          </div>
          <div className="bg-white p-2.5 rounded-lg border border-ink-100">
            <span className="text-[11px] text-ink-500 block">Burn Rate Harian</span>
            <div className="text-sm font-bold text-ink-900 tabular-nums mt-1">
              {formatRupiah(runway.dailyBurn)}/hr
            </div>
          </div>
        </div>
      </div>

      {/* 3. Pemakaian Anggaran Hari Ini */}
      <div className="bg-surface rounded-xl p-3 border border-ink-100 space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-ink-700">
          <span className="flex items-center gap-1.5">
            <TrendingDown className="w-4 h-4 text-teal-600" />
            Anggaran Hari Ini
          </span>
          <span className="text-xs font-bold text-ink-900 tabular-nums">
            {formatRupiah(todaySpent)} / {formatRupiah(dailyBudget)}
          </span>
        </div>

        <div className="w-full bg-ink-200 h-2.5 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              budgetPct >= 100
                ? 'bg-rose-500'
                : budgetPct >= 80
                ? 'bg-amber-500'
                : 'bg-emerald-500'
            }`}
            style={{ width: `${Math.min(100, budgetPct)}%` }}
          />
        </div>

        <div className="flex justify-between text-[11px] text-ink-500">
          <span>{budgetPct}% terpakai</span>
          <span>Sisa: {formatRupiah(Math.max(0, dailyBudget - todaySpent))}</span>
        </div>
      </div>

      {/* 4. Pengingat Aktif (Cek Sebelum Beli Tunda 3 Hari) */}
      <div className="bg-surface rounded-xl p-3 border border-ink-100 space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-ink-700">
          <span className="flex items-center gap-1.5">
            <Bell className="w-4 h-4 text-brand-600" />
            Pengingat Tunda Beli ({reminders.length})
          </span>
        </div>

        {reminders.length > 0 ? (
          <div className="space-y-1.5 max-h-24 overflow-y-auto">
            {reminders.map((rem) => (
              <div
                key={rem.id}
                className="bg-white p-2 rounded-lg border border-ink-100 text-xs flex justify-between items-center"
              >
                <div>
                  <div className="font-semibold text-ink-900">{rem.item}</div>
                  <div className="text-[10px] text-ink-500">
                    {formatRupiah(rem.amount)} • Diingatkan dlm 3 hari
                  </div>
                </div>
                <span className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-semibold border border-amber-200">
                  Tertunda
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-ink-500 italic">Belum ada barang yang ditunda.</p>
        )}
      </div>

      {/* 5. Pintasan Simulasi Demo Juri */}
      <div className="pt-2 border-t border-ink-100 space-y-2">
        <span className="text-xs font-bold text-ink-700 block flex items-center gap-1.5">
          <FastForward className="w-4 h-4 text-brand-600" />
          Aksi Cepat Simulasi Demo
        </span>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleSimulateEndOfDay}
            className="p-2.5 bg-surface hover:bg-ink-100 active:scale-95 text-ink-800 rounded-lg text-xs font-semibold border border-ink-200 text-left transition-colors flex items-center justify-between"
          >
            <span>⏭ Akhir Hari</span>
            <ChevronRight className="w-3.5 h-3.5 text-ink-400" />
          </button>

          <button
            onClick={handleSimulateEndOfWeek}
            className="p-2.5 bg-surface hover:bg-ink-100 active:scale-95 text-ink-800 rounded-lg text-xs font-semibold border border-ink-200 text-left transition-colors flex items-center justify-between"
          >
            <span>⏭ Akhir Minggu</span>
            <ChevronRight className="w-3.5 h-3.5 text-ink-400" />
          </button>
        </div>

        <button
          onClick={loadSampleProfile}
          className="w-full py-2 px-3 bg-brand-50 hover:bg-brand-100 text-brand-800 rounded-lg text-xs font-bold border border-brand-200 flex items-center justify-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Muat Ulang Profil Contoh Mahasiswa</span>
        </button>
      </div>

      {/* Tautan Dashboard */}
      <div className="pt-1">
        <Link
          to="/dashboard"
          className="w-full py-2.5 px-3 bg-ink-900 hover:bg-ink-800 text-white rounded-button text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
        >
          <span>Buka Dashboard Analitik</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
