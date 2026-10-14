import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Scenario, ScenarioId, RunwayResult } from '../config';
import { computeRunway } from '../lib/runway';
import { formatRupiah, formatNumber } from '../lib/format';
import { StatusBadge } from './StatusBadge';
import { Sliders, ArrowRight, Calculator, CheckCircle2 } from 'lucide-react';

export const ScenarioSimulator: React.FC = () => {
  const profile = useStore((s) => s.profile);
  const transactions = useStore((s) => s.transactions);
  const currentRunway = React.useMemo(
    () => computeRunway(profile, transactions),
    [profile, transactions]
  );

  const [scenarioId, setScenarioId] = useState<ScenarioId>('late_allowance');
  const [delayDays, setDelayDays] = useState(14);
  const [oneOffExpense, setOneOffExpense] = useState(1500000);
  const [incomeLossPct, setIncomeLossPct] = useState(0.3);
  const [customLabel, setCustomLabel] = useState('Servis Motor Mendadak');
  const [customAmount, setCustomAmount] = useState(600000);

  const [simResult, setSimResult] = useState<RunwayResult | null>(null);

  const handleSimulate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    let scenario: Scenario;
    if (scenarioId === 'late_allowance') {
      scenario = {
        id: 'late_allowance',
        label: `Uang Saku Terlambat (${delayDays} hari)`,
        params: { delayDays },
      };
    } else if (scenarioId === 'broken_laptop') {
      scenario = {
        id: 'broken_laptop',
        label: `Pengeluaran Darurat (${formatRupiah(oneOffExpense)})`,
        params: { oneOffExpense },
      };
    } else if (scenarioId === 'freelance_cancelled') {
      scenario = {
        id: 'freelance_cancelled',
        label: `Honor Freelance Terpotong (${Math.round(incomeLossPct * 100)}%)`,
        params: { incomeLossPct },
      };
    } else {
      scenario = {
        id: 'custom',
        label: customLabel || 'Pengeluaran Kustom',
        params: { oneOffExpense: customAmount },
      };
    }

    const res = computeRunway(profile, transactions, scenario);
    setSimResult(res);
  };

  const delta = simResult ? simResult.days - currentRunway.days : 0;

  return (
    <div className="bg-card rounded-card p-5 border border-ink-100 shadow-soft">
      <div className="flex items-center gap-2 mb-1">
        <Sliders className="w-5 h-5 text-brand-600" />
        <h3 className="font-bold text-base text-ink-900">
          Simulator Skenario Krisis
        </h3>
      </div>
      <p className="text-xs text-ink-500 mb-4">
        Uji ketahanan saldo mahasiswa terhadap berbagai potensi guncangan finansial
      </p>

      <form onSubmit={handleSimulate} className="space-y-4">
        {/* Pilih Skenario */}
        <div>
          <label className="text-xs font-semibold text-ink-700 block mb-1.5">
            Pilih Jenis Kejadian
          </label>
          <select
            value={scenarioId}
            onChange={(e) => {
              setScenarioId(e.target.value as ScenarioId);
              setSimResult(null);
            }}
            className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-ink-300 bg-surface focus:outline-none focus:border-brand-500 font-medium text-ink-900"
          >
            <option value="late_allowance">Uang Saku / Beasiswa Terlambat Cair</option>
            <option value="broken_laptop">Laptop / HP Rusak (Biaya Servis/Ganti)</option>
            <option value="freelance_cancelled">Honor Proyek / Side-Job Dibatalkan</option>
            <option value="custom">Skenario Kustom Sendiri</option>
          </select>
        </div>

        {/* Dynamic Parameter Sliders */}
        {scenarioId === 'late_allowance' && (
          <div className="bg-surface p-3.5 rounded-xl border border-ink-100 space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-ink-700">Durasi Keterlambatan:</span>
              <span className="text-brand-700 font-bold tabular-nums text-sm">
                {delayDays} Hari
              </span>
            </div>
            <input
              type="range"
              min={7}
              max={30}
              step={1}
              value={delayDays}
              onChange={(e) => setDelayDays(Number(e.target.value))}
              className="w-full accent-brand-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-ink-400">
              <span>7 hari (1 minggu)</span>
              <span>14 hari (2 minggu)</span>
              <span>30 hari (1 bulan)</span>
            </div>
          </div>
        )}

        {scenarioId === 'broken_laptop' && (
          <div className="bg-surface p-3.5 rounded-xl border border-ink-100 space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-ink-700">Biaya Servis / Penggantian:</span>
              <span className="text-brand-700 font-bold tabular-nums text-sm">
                {formatRupiah(oneOffExpense)}
              </span>
            </div>
            <input
              type="range"
              min={500000}
              max={4000000}
              step={100000}
              value={oneOffExpense}
              onChange={(e) => setOneOffExpense(Number(e.target.value))}
              className="w-full accent-brand-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-ink-400">
              <span>Rp500.000</span>
              <span>Rp2.000.000</span>
              <span>Rp4.000.000</span>
            </div>
          </div>
        )}

        {scenarioId === 'freelance_cancelled' && (
          <div className="bg-surface p-3.5 rounded-xl border border-ink-100 space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-ink-700">Persentase Kehilangan Honor:</span>
              <span className="text-brand-700 font-bold tabular-nums text-sm">
                {Math.round(incomeLossPct * 100)}%
              </span>
            </div>
            <input
              type="range"
              min={0.1}
              max={0.6}
              step={0.05}
              value={incomeLossPct}
              onChange={(e) => setIncomeLossPct(Number(e.target.value))}
              className="w-full accent-brand-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-ink-400">
              <span>10% (Ringan)</span>
              <span>30% (Sedang)</span>
              <span>60% (Berat)</span>
            </div>
          </div>
        )}

        {scenarioId === 'custom' && (
          <div className="bg-surface p-3.5 rounded-xl border border-ink-100 space-y-3">
            <div>
              <label className="text-[11px] font-semibold text-ink-600 block mb-1">
                Nama Kejadian
              </label>
              <input
                type="text"
                value={customLabel}
                onChange={(e) => setCustomLabel(e.target.value)}
                placeholder="Contoh: Beli tiket pulang kampung"
                className="w-full text-xs p-2 rounded-lg border border-ink-300 bg-white"
              />
            </div>
            <div>
              <div className="flex justify-between text-[11px] font-semibold text-ink-600 mb-1">
                <span>Estimasi Biaya:</span>
                <span className="font-bold text-brand-700">{formatRupiah(customAmount)}</span>
              </div>
              <input
                type="range"
                min={100000}
                max={3000000}
                step={50000}
                value={customAmount}
                onChange={(e) => setCustomAmount(Number(e.target.value))}
                className="w-full accent-brand-600 cursor-pointer"
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          className="w-full py-2.5 px-4 bg-brand-600 hover:bg-brand-700 active:scale-98 text-white rounded-button text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
        >
          <Calculator className="w-4 h-4" />
          <span>Hitung Simulasi Daya Tahan</span>
        </button>
      </form>

      {/* Hasil Perbandingan */}
      {simResult && (
        <div className="mt-5 pt-4 border-t border-ink-100 animate-in fade-in duration-200 space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-ink-900">
            <CheckCircle2 className="w-4 h-4 text-brand-600" />
            <span>Hasil Simulasi Skenario</span>
          </div>

          <div className="grid grid-cols-2 gap-3 bg-surface p-3.5 rounded-xl border border-ink-100">
            {/* Kondisi Sekarang */}
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-ink-500 block">
                Kondisi Sekarang
              </span>
              <div className="text-2xl font-extrabold text-ink-900 tabular-nums">
                {currentRunway.days} <span className="text-xs font-medium">hari</span>
              </div>
              <StatusBadge status={currentRunway.status} size="sm" />
            </div>

            {/* Setelah Kejadian */}
            <div className="space-y-1 border-l border-ink-200 pl-3">
              <span className="text-[11px] font-semibold text-ink-500 block">
                Setelah Kejadian
              </span>
              <div className="text-2xl font-extrabold text-ink-900 tabular-nums">
                {simResult.days} <span className="text-xs font-medium">hari</span>
                <span className="text-xs font-bold text-rose-600 ml-1.5">
                  ({delta >= 0 ? `+${delta}` : delta} hr)
                </span>
              </div>
              <StatusBadge status={simResult.status} size="sm" />
            </div>
          </div>

          <p className="text-xs text-ink-600 leading-relaxed bg-brand-50/50 p-2.5 rounded-lg border border-brand-100">
            {simResult.status === 'safe'
              ? '✅ Saldo masih dalam zona AMAN. Anda memiliki cukup waktu mencari solusi tanpa panik.'
              : simResult.status === 'warn'
              ? '⚠️ Status turun ke WASPADA. Segera pangkas pengeluaran hiburan dan jajan untuk menjaga daya tahan.'
              : '🚨 Status KRITIS! Saldo bertahan di bawah 7 hari. Segera cari pinjaman darurat atau bantuan kampus.'}
          </p>
        </div>
      )}
    </div>
  );
};
