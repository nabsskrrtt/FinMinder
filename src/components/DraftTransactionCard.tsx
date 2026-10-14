import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { formatRupiah } from '../lib/format';
import { Category, CATEGORIES } from '../config';
import { Check, Edit3, Tag, Sparkles, Receipt, Mic } from 'lucide-react';

interface DraftTransactionCardProps {
  payload: {
    amount: number;
    category: Category;
    note: string;
    source?: 'text' | 'voice' | 'receipt';
    transcript?: string;
  };
  messageId?: string;
}

export const DraftTransactionCard: React.FC<DraftTransactionCardProps> = ({
  payload,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [amount, setAmount] = useState(payload.amount);
  const [category, setCategory] = useState<Category>(payload.category);
  const [note, setNote] = useState(payload.note);
  const [isSaved, setIsSaved] = useState(false);

  const addTransaction = useStore((s) => s.addTransaction);
  const pushMessage = useStore((s) => s.pushMessage);
  const profile = useStore((s) => s.profile);
  const spentToday = useStore((s) => s.spentToday);
  const setQuickReplies = useStore((s) => s.setQuickReplies);

  const handleSave = () => {
    if (isSaved) return;

    const tx = addTransaction({
      amount,
      category,
      note,
      kind: 'expense',
      source: payload.source || 'text',
    });

    setIsSaved(true);
    setIsEditing(false);

    const newSpentToday = spentToday();
    const sisa = Math.max(0, profile.dailyBudget - newSpentToday);

    pushMessage({
      sender: 'bot',
      text: `Tercatat: ${tx.note}, ${formatRupiah(tx.amount)} (${tx.category}).\nSisa anggaran hari ini ${formatRupiah(sisa)}.`,
      payload: { txId: tx.id },
    });

    setQuickReplies(['Ubah kategori', 'Batalkan', 'Stress-Test', 'Cek Sebelum Beli']);
  };

  return (
    <div className="bg-card rounded-card p-4 border border-brand-200 shadow-soft max-w-sm my-1 space-y-3 text-ink-900">
      <div className="flex items-center justify-between border-b border-ink-100 pb-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-brand-700">
          <Sparkles className="w-3.5 h-3.5 text-brand-500" />
          <span>Draf Catatan Transaksi</span>
        </div>
        {payload.source === 'voice' && (
          <span className="flex items-center gap-1 text-[11px] font-medium bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full border border-brand-200">
            <Mic className="w-3 h-3" /> Transkripsi Suara
          </span>
        )}
        {payload.source === 'receipt' && (
          <span className="flex items-center gap-1 text-[11px] font-medium bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200">
            <Receipt className="w-3 h-3" /> Hasil OCR Nota
          </span>
        )}
      </div>

      {!isEditing ? (
        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-semibold text-ink-900">{note}</span>
            <span className="text-lg font-bold text-ink-900 tabular-nums">
              {formatRupiah(amount)}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-ink-500">
            <Tag className="w-3.5 h-3.5 text-brand-500" />
            <span className="bg-ink-100 text-ink-700 px-2 py-0.5 rounded-md font-medium">
              {category}
            </span>
          </div>
        </div>
      ) : (
        <div className="space-y-2.5 pt-1">
          <div>
            <label className="text-[11px] font-medium text-ink-500 block mb-0.5">Catatan</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full text-xs p-2 rounded-lg border border-ink-300 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-medium text-ink-500 block mb-0.5">Nominal (Rp)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value) || 0)}
              className="w-full text-xs p-2 rounded-lg border border-ink-300 focus:outline-none focus:border-brand-500 font-medium tabular-nums"
            />
          </div>

          <div>
            <label className="text-[11px] font-medium text-ink-500 block mb-1">Kategori</label>
            <div className="flex flex-wrap gap-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`text-[11px] px-2 py-1 rounded-md font-medium border transition-colors ${
                    category === cat
                      ? 'bg-brand-600 text-white border-brand-600'
                      : 'bg-surface text-ink-700 border-ink-300 hover:bg-ink-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tombol Aksi */}
      <div className="pt-2 flex gap-2 border-t border-ink-100">
        {!isSaved ? (
          <>
            <button
              onClick={handleSave}
              className="flex-1 py-2 px-3 bg-brand-600 hover:bg-brand-700 active:scale-98 text-white rounded-button text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Simpan</span>
            </button>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="py-2 px-3 bg-surface hover:bg-ink-100 active:scale-98 text-ink-700 border border-ink-300 rounded-button text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Batal Edit' : 'Ubah'}</span>
            </button>
          </>
        ) : (
          <div className="w-full py-1.5 text-center text-xs font-semibold text-emerald-600 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center justify-center gap-1.5">
            <Check className="w-4 h-4" />
            <span>Telah Disimpan ke Catatan</span>
          </div>
        )}
      </div>
    </div>
  );
};
