import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { formatRupiah } from '../lib/format';
import { StatusBadge } from './StatusBadge';
import { ArrowRight, ShoppingBag, Utensils, Clock, Check, X } from 'lucide-react';

interface PurchaseCheckCardProps {
  payload: {
    itemName: string;
    amount: number;
    beforeDays: number;
    beforeStatus: 'safe' | 'warn' | 'critical';
    afterDays: number;
    afterStatus: 'safe' | 'warn' | 'critical';
    lunchEquivalent: number;
  };
}

export const PurchaseCheckCard: React.FC<PurchaseCheckCardProps> = ({ payload }) => {
  const {
    itemName,
    amount,
    beforeDays,
    beforeStatus,
    afterDays,
    afterStatus,
    lunchEquivalent,
  } = payload;

  const [decision, setDecision] = useState<'buy' | 'delay' | 'cancel' | null>(null);

  const addTransaction = useStore((s) => s.addTransaction);
  const addReminder = useStore((s) => s.addReminder);
  const pushMessage = useStore((s) => s.pushMessage);
  const setQuickReplies = useStore((s) => s.setQuickReplies);

  const deltaDays = afterDays - beforeDays;

  const handleBuy = () => {
    if (decision) return;
    setDecision('buy');

    // Catat sebagai transaksi
    const tx = addTransaction({
      amount,
      category: 'Belanja',
      note: itemName,
      kind: 'expense',
      source: 'text',
    });

    setTimeout(() => {
      pushMessage({
        sender: 'bot',
        text: `Tercatat: ${tx.note}, ${formatRupiah(tx.amount)} (Belanja).\nDaya tahan saldomu sekarang menjadi ${afterDays} hari (${
          afterStatus === 'safe' ? 'Aman' : afterStatus === 'warn' ? 'Waspada' : 'Kritis'
        }).`,
      });
      setQuickReplies(['Stress-Test', 'Buka Dashboard', 'Cek Sebelum Beli']);
    }, 400);
  };

  const handleDelay = () => {
    if (decision) return;
    setDecision('delay');

    addReminder(itemName, amount);

    setTimeout(() => {
      pushMessage({
        sender: 'bot',
        text: `Oke, aku ingatkan 3 hari lagi untuk mengecek apakah kamu masih benar-benar butuh ${itemName}. Tabunganmu terselamatkan untuk sementara!`,
      });
      setQuickReplies(['Stress-Test', 'Buka Dashboard', 'Ringkasan minggu ini']);
    }, 400);
  };

  const handleCancel = () => {
    if (decision) return;
    setDecision('cancel');

    setTimeout(() => {
      pushMessage({
        sender: 'bot',
        text: `Keputusan bijak! Daya tahan saldomu tetap aman di ${beforeDays} hari. Uang ${formatRupiah(amount)} tetap ada untuk kebutuhan esensial.`,
      });
      setQuickReplies(['Stress-Test', 'Buka Dashboard', 'Ringkasan minggu ini']);
    }, 400);
  };

  return (
    <div className="bg-card rounded-card p-4 border border-brand-200 shadow-soft max-w-sm my-1 space-y-3.5 text-ink-900">
      {/* Header Barang & Harga */}
      <div className="flex items-center justify-between border-b border-ink-100 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg shrink-0">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-ink-500 uppercase tracking-wider block">
              Cek Sebelum Beli
            </span>
            <h4 className="text-sm font-bold text-ink-900">{itemName}</h4>
          </div>
        </div>
        <span className="text-base font-extrabold text-ink-900 tabular-nums">
          {formatRupiah(amount)}
        </span>
      </div>

      {/* Komparasi Daya Tahan Sebelum vs Sesudah */}
      <div className="bg-surface rounded-xl p-3 border border-ink-100 flex items-center justify-between">
        <div className="text-center flex-1">
          <span className="text-[11px] text-ink-500 block">Sebelumnya</span>
          <div className="text-2xl font-bold text-ink-900 tabular-nums">
            {beforeDays} <span className="text-xs font-medium">hari</span>
          </div>
          <div className="mt-1">
            <StatusBadge status={beforeStatus} size="sm" />
          </div>
        </div>

        <div className="flex flex-col items-center px-2 text-ink-400">
          <ArrowRight className="w-5 h-5 text-ink-400" />
          <span className="text-[11px] font-bold text-rose-600 mt-0.5">
            {deltaDays} hari
          </span>
        </div>

        <div className="text-center flex-1">
          <span className="text-[11px] text-ink-500 block">Jika Beli</span>
          <div className="text-2xl font-bold text-ink-900 tabular-nums">
            {afterDays} <span className="text-xs font-medium">hari</span>
          </div>
          <div className="mt-1">
            <StatusBadge status={afterStatus} size="sm" />
          </div>
        </div>
      </div>

      {/* Ekivalen Makan Siang */}
      <div className="flex items-center gap-2 text-xs font-medium text-amber-800 bg-amber-50/80 p-2.5 rounded-lg border border-amber-200/60">
        <Utensils className="w-4 h-4 text-amber-600 shrink-0" />
        <span>
          Nominal ini setara dengan <strong>{lunchEquivalent}× makan siang</strong> di warteg/kantin.
        </span>
      </div>

      {/* Pilihan Keputusan */}
      {!decision ? (
        <div className="grid grid-cols-3 gap-2 pt-1">
          <button
            onClick={handleBuy}
            className="py-2 px-2 bg-ink-100 hover:bg-ink-200 active:scale-95 text-ink-900 rounded-button text-xs font-semibold transition-all border border-ink-200 text-center"
          >
            Jadi beli
          </button>
          <button
            onClick={handleDelay}
            className="py-2 px-2 bg-amber-50 hover:bg-amber-100 active:scale-95 text-amber-800 rounded-button text-xs font-bold transition-all border border-amber-300 text-center flex items-center justify-center gap-1"
          >
            <Clock className="w-3 h-3" />
            <span>Tunda 3 hr</span>
          </button>
          <button
            onClick={handleCancel}
            className="py-2 px-2 bg-brand-600 hover:bg-brand-700 active:scale-95 text-white rounded-button text-xs font-bold transition-all shadow-sm text-center"
          >
            Batal
          </button>
        </div>
      ) : (
        <div className="pt-1">
          {decision === 'buy' && (
            <div className="text-xs py-2 px-3 bg-ink-100 text-ink-700 rounded-lg text-center font-medium">
              🛒 Kamu memutuskan untuk membeli.
            </div>
          )}
          {decision === 'delay' && (
            <div className="text-xs py-2 px-3 bg-amber-100 text-amber-800 rounded-lg text-center font-medium flex items-center justify-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Pembelian ditunda 3 hari (pengingat disimpan).</span>
            </div>
          )}
          {decision === 'cancel' && (
            <div className="text-xs py-2 px-3 bg-emerald-100 text-emerald-800 rounded-lg text-center font-medium flex items-center justify-center gap-1.5">
              <Check className="w-3.5 h-3.5" />
              <span>Pembelian dibatalkan. Saldo tetap aman!</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
