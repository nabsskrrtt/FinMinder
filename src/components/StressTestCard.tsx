import React from 'react';
import { RunwayResult, Scenario } from '../config';
import { StatusBadge } from './StatusBadge';
import { ShieldAlert, ArrowUpRight, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

interface StressTestCardProps {
  payload: {
    scenario: Scenario;
    result: RunwayResult;
  };
}

export const StressTestCard: React.FC<StressTestCardProps> = ({ payload }) => {
  const { scenario, result } = payload;
  const maxScale = 30;
  const percentage = Math.min(100, Math.max(5, (result.days / maxScale) * 100));

  const barColor =
    result.status === 'safe'
      ? 'from-emerald-500 to-teal-500'
      : result.status === 'warn'
      ? 'from-amber-400 to-amber-500'
      : 'from-rose-500 to-red-600';

  return (
    <div className="bg-card rounded-card p-4 border border-brand-200 shadow-soft max-w-sm my-1 space-y-3.5 text-ink-900">
      {/* Header Skenario */}
      <div className="flex items-center gap-2 border-b border-ink-100 pb-2.5">
        <div className="p-1.5 bg-brand-50 text-brand-600 rounded-lg shrink-0">
          <ShieldAlert className="w-4 h-4" />
        </div>
        <div>
          <span className="text-[11px] font-semibold text-ink-500 uppercase tracking-wider block">
            Hasil Stress-Test
          </span>
          <h4 className="text-sm font-bold text-ink-900 leading-tight">
            {scenario.label}
          </h4>
        </div>
      </div>

      {/* Nilai Utama Daya Tahan */}
      <div className="flex items-baseline justify-between pt-1">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-4xl font-extrabold text-ink-900 tabular-nums">
              {result.days}
            </span>
            <span className="text-sm font-bold text-ink-900">hari</span>
          </div>
          <p className="text-xs text-ink-500 font-medium">saldo bertahan</p>
        </div>
        <StatusBadge status={result.status} size="lg" />
      </div>

      {/* Progress Bar Visual */}
      <div className="space-y-1">
        <div className="h-2.5 w-full bg-ink-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full bg-gradient-to-r transition-all duration-500 ${barColor}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-ink-500 font-medium">
          <span>0 hari</span>
          <span>Target 21+ hari</span>
        </div>
      </div>

      {/* Rekomendasi / Wawasan Berbasis Data */}
      <div className="bg-surface rounded-xl p-3 border border-ink-100 text-xs text-ink-700 space-y-1">
        <div className="flex items-center gap-1.5 text-ink-900 font-semibold">
          <TrendingUp className="w-3.5 h-3.5 text-brand-600 shrink-0" />
          <span>Kategori Terbesar: {result.topCategory}</span>
        </div>
        <p className="text-ink-600 leading-relaxed">
          Mengurangi jajan 2× per minggu dapat menambah ketahanan saldo hingga ±3–4 hari.
        </p>
      </div>

      <div className="pt-1 flex items-center justify-between text-xs">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1 text-brand-700 hover:text-brand-800 font-semibold hover:underline"
        >
          <span>Simulasi lengkap di Dashboard</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
