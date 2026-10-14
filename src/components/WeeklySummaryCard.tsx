import React from 'react';
import { Link } from 'react-router-dom';
import { formatRupiah } from '../lib/format';
import { StatusBadge } from './StatusBadge';
import { Calendar, ArrowUpRight, TrendingUp, TrendingDown, LayoutDashboard } from 'lucide-react';

interface WeeklySummaryCardProps {
  payload: {
    spentThisWeek: number;
    diffPct: number;
    topCategory: string;
    runwayDays: number;
    runwayStatus: 'safe' | 'warn' | 'critical';
    insight: string;
  };
}

export const WeeklySummaryCard: React.FC<WeeklySummaryCardProps> = ({ payload }) => {
  const {
    spentThisWeek,
    diffPct,
    topCategory,
    runwayDays,
    runwayStatus,
    insight,
  } = payload;

  const isUp = diffPct > 0;

  return (
    <div className="bg-card rounded-card p-4 border border-brand-200 shadow-soft max-w-sm my-1 space-y-3.5 text-ink-900">
      {/* Header Ringkasan */}
      <div className="flex items-center justify-between border-b border-ink-100 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-brand-50 text-brand-600 rounded-lg shrink-0">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-ink-500 uppercase tracking-wider block">
              Laporan Mingguan
            </span>
            <h4 className="text-sm font-bold text-ink-900">Ringkasan Minggu Ini</h4>
          </div>
        </div>
      </div>

      {/* Total Pengeluaran & Perbandingan */}
      <div className="bg-surface rounded-xl p-3 border border-ink-100 space-y-2">
        <span className="text-xs text-ink-500 font-medium">Total Pengeluaran</span>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-extrabold text-ink-900 tabular-nums">
            {formatRupiah(spentThisWeek)}
          </span>
          <span
            className={`flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full ${
              isUp
                ? 'bg-rose-50 text-rose-700'
                : 'bg-emerald-50 text-emerald-700'
            }`}
          >
            {isUp ? (
              <TrendingUp className="w-3.5 h-3.5" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5" />
            )}
            <span>{Math.abs(diffPct)}% vs minggu lalu</span>
          </span>
        </div>

        <div className="pt-2 border-t border-ink-200/60 flex items-center justify-between text-xs text-ink-700">
          <span>Kategori Terbanyak:</span>
          <strong className="text-ink-900">{topCategory}</strong>
        </div>
      </div>

      {/* Skor Daya Tahan Saat Ini */}
      <div className="flex items-center justify-between px-1">
        <div>
          <span className="text-xs text-ink-500 block">Daya Tahan Saat Ini</span>
          <span className="text-xl font-bold text-ink-900 tabular-nums">
            {runwayDays} hari
          </span>
        </div>
        <StatusBadge status={runwayStatus} size="md" />
      </div>

      {/* Insight */}
      <p className="text-xs text-ink-600 italic bg-brand-50/50 p-2.5 rounded-lg border border-brand-100">
        💡 {insight}
      </p>

      {/* Tombol ke Dashboard */}
      <div className="pt-1">
        <Link
          to="/dashboard"
          className="w-full py-2.5 px-3 bg-brand-600 hover:bg-brand-700 active:scale-98 text-white rounded-button text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Buka Dashboard Lengkap</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
