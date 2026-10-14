import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { formatRupiah } from '../lib/format';
import { ConfirmDialog } from './ConfirmDialog';
import { useNavigate } from 'react-router-dom';
import { Settings, ShieldCheck, Trash2, Save, Check } from 'lucide-react';

export const SettingsPanel: React.FC = () => {
  const profile = useStore((s) => s.profile);
  const setProfile = useStore((s) => s.setProfile);
  const resetAll = useStore((s) => s.resetAll);
  const setToast = useStore((s) => s.setToast);
  const navigate = useNavigate();

  const [monthlyIncome, setMonthlyIncome] = useState(profile.monthlyIncome);
  const [fixedBills, setFixedBills] = useState(profile.fixedBills);
  const [startingBalance, setStartingBalance] = useState(profile.startingBalance);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveParams = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile({
      monthlyIncome: Number(monthlyIncome) || 0,
      fixedBills: Number(fixedBills) || 0,
      startingBalance: Number(startingBalance) || 0,
    });
    setIsSaved(true);
    setToast('Parameter keuangan berhasil disimpan');
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleConfirmReset = () => {
    resetAll();
    setShowConfirmReset(false);
    navigate('/');
  };

  return (
    <div className="bg-card rounded-card p-5 border border-ink-100 shadow-soft space-y-5">
      <div className="flex items-center gap-2 border-b border-ink-100 pb-3">
        <Settings className="w-5 h-5 text-brand-600" />
        <div>
          <h3 className="font-bold text-base text-ink-900">Pengaturan & Privasi</h3>
          <p className="text-xs text-ink-500">
            Sesuaikan parameter keuangan atau hapus riwayat data simulasi
          </p>
        </div>
      </div>

      {/* Form Parameter Keuangan */}
      <form onSubmit={handleSaveParams} className="space-y-3.5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-semibold text-ink-700 block mb-1">
              Estimasi Pemasukan Bulanan
            </label>
            <input
              type="number"
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(Number(e.target.value))}
              className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-ink-300 bg-surface focus:outline-none focus:border-brand-500 font-medium tabular-nums"
            />
            <span className="text-[10px] text-ink-400 mt-0.5 block">
              {formatRupiah(monthlyIncome)}
            </span>
          </div>

          <div>
            <label className="text-xs font-semibold text-ink-700 block mb-1">
              Total Tagihan Tetap (Kos/Wifi)
            </label>
            <input
              type="number"
              value={fixedBills}
              onChange={(e) => setFixedBills(Number(e.target.value))}
              className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-ink-300 bg-surface focus:outline-none focus:border-brand-500 font-medium tabular-nums"
            />
            <span className="text-[10px] text-ink-400 mt-0.5 block">
              {formatRupiah(fixedBills)}
            </span>
          </div>

          <div>
            <label className="text-xs font-semibold text-ink-700 block mb-1">
              Saldo Awal
            </label>
            <input
              type="number"
              value={startingBalance}
              onChange={(e) => setStartingBalance(Number(e.target.value))}
              className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-ink-300 bg-surface focus:outline-none focus:border-brand-500 font-medium tabular-nums"
            />
            <span className="text-[10px] text-ink-400 mt-0.5 block">
              {formatRupiah(startingBalance)}
            </span>
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            className="px-4 py-2 bg-brand-600 hover:bg-brand-700 active:scale-98 text-white rounded-button text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
          >
            {isSaved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
            <span>{isSaved ? 'Tersimpan' : 'Simpan Perubahan'}</span>
          </button>
        </div>
      </form>

      {/* Info Privasi & Status Persetujuan */}
      <div className="bg-surface rounded-xl p-3.5 border border-ink-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-ink-900">
              Penyimpanan Data Lokal (Peramban)
            </div>
            <p className="text-ink-500 leading-relaxed text-[11px] mt-0.5">
              Semua catatan transaksi FinMinder tersimpan di <code>localStorage</code> peramban Anda. Tidak ada data yang dikirim ke server luar.
            </p>
          </div>
        </div>
        <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full font-bold border border-emerald-200 shrink-0 self-start sm:self-center text-[11px]">
          Persetujuan Aktif
        </span>
      </div>

      {/* Tombol Hapus Semua Data */}
      <div className="pt-2 border-t border-ink-100 flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold text-rose-700">Zona Berbahaya</h4>
          <p className="text-[11px] text-ink-500">
            Hapus seluruh catatan transaksi, chat, dan kembalikan profil ke awal
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowConfirmReset(true)}
          className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-button text-xs font-bold transition-colors flex items-center gap-1.5 active:scale-95"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Hapus semua data saya</span>
        </button>
      </div>

      {/* Dialog Konfirmasi Hapus Data */}
      <ConfirmDialog
        isOpen={showConfirmReset}
        title="Hapus Seluruh Data Saya?"
        message="Aksi ini akan menghapus semua riwayat transaksi, pesan chat WhatsApp bot, dan pengaturan profil secara permanen. Anda akan diarahkan kembali ke halaman Landing."
        confirmText="Ya, Hapus Semua"
        cancelText="Batal"
        isDestructive={true}
        onConfirm={handleConfirmReset}
        onCancel={() => setShowConfirmReset(false)}
      />
    </div>
  );
};
