import React from 'react';
import { StatusBadge } from './StatusBadge';
import { RUNWAY_THRESHOLDS } from '../config';

interface RunwayGaugeProps {
  days: number;
  status: 'safe' | 'warn' | 'critical';
  variant?: 'compact' | 'full';
  showExplanation?: boolean;
}

export const RunwayGauge: React.FC<RunwayGaugeProps> = ({
  days,
  status,
  variant = 'full',
  showExplanation = true,
}) => {
  // Target maksimal gauge untuk visualisasi (misal 30 hari atau lebih)
  const maxScale = 30;
  const percentage = Math.min(100, Math.max(5, (days / maxScale) * 100));

  // Warna bar sesuai status
  const barColor =
    status === 'safe'
      ? 'from-emerald-500 to-teal-500'
      : status === 'warn'
      ? 'from-amber-400 to-amber-500'
      : 'from-rose-500 to-red-600';

  if (variant === 'compact') {
    return (
      <div className="flex items-center justify-between gap-4 py-2">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold tracking-tight text-ink-900 tabular-nums">
            {days}
          </span>
          <span className="text-sm font-medium text-ink-500">hari bertahan</span>
        </div>
        <StatusBadge status={status} size="md" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-ink-900 tabular-nums">
              {days}
            </span>
            <span className="text-base sm:text-lg font-medium text-ink-500">hari bertahan</span>
          </div>
          <p className="text-xs text-ink-500 mt-0.5">Estimasi tanpa pemasukan baru</p>
        </div>
        <StatusBadge status={status} size="lg" />
      </div>

      {/* Progress Bar Runway dengan zona indikator */}
      <div className="space-y-1.5 pt-1">
        <div className="relative w-full h-3 bg-ink-100 rounded-full overflow-hidden p-0.5">
          {/* Threshold markers */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-rose-400/80 z-10"
            style={{ left: `${(RUNWAY_THRESHOLDS.critical / maxScale) * 100}%` }}
            title="Batas Kritis (7 hari)"
          />
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-amber-400/80 z-10"
            style={{ left: `${(RUNWAY_THRESHOLDS.warn / maxScale) * 100}%` }}
            title="Batas Waspada (21 hari)"
          />
          {/* Progress fill */}
          <div
            className={`h-full rounded-full bg-gradient-to-r transition-all duration-700 ease-out ${barColor}`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="flex justify-between text-[11px] font-medium text-ink-500 px-0.5">
          <span className="text-rose-600 font-semibold">0 (Kritis)</span>
          <span className="text-amber-600 font-semibold">7 (Waspada)</span>
          <span className="text-emerald-600 font-semibold">21 (Aman)</span>
          <span>30+ hari</span>
        </div>
      </div>

      {showExplanation && (
        <div className="text-xs sm:text-sm text-ink-700 bg-surface rounded-xl p-3 border border-ink-100/80">
          {status === 'safe' && (
            <p>
              🎉 <strong className="text-ink-900 font-semibold">Kondisi Aman:</strong> Saldo saat ini mencukupi kebutuhan esensial dan tagihanmu selama lebih dari 3 minggu jika terjadi kondisi darurat.
            </p>
          )}
          {status === 'warn' && (
            <p>
              ⚠️ <strong className="text-ink-900 font-semibold">Perlu Waspada:</strong> Daya tahan saldo di bawah 3 minggu. Kurangi pengeluaran non-esensial untuk mencegah defisit mendadak.
            </p>
          )}
          {status === 'critical' && (
            <p>
              🚨 <strong className="text-ink-900 font-semibold">Kondisi Kritis:</strong> Daya tahan saldo kurang dari 7 hari. Segera prioritaskan hanya kebutuhan pokok makan & minum!
            </p>
          )}
        </div>
      )}
    </div>
  );
};
