import React from 'react';
import { useStore } from '../store/useStore';
import {
  handleUserIncoming,
  handleSimulateVoice,
  handleSimulateReceipt,
  handleStressTestTrigger,
  executeStressTest,
  handlePurchaseCheckTrigger,
  handleWeeklySummary,
} from '../lib/botFlows';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES, Category } from '../config';

interface QuickRepliesProps {
  onStartTyping?: () => void;
  onFinishTyping?: () => void;
}

export const QuickReplies: React.FC<QuickRepliesProps> = ({
  onStartTyping,
  onFinishTyping,
}) => {
  const activeChips = useStore((s) => s.activeQuickReplies);
  const setQuickReplies = useStore((s) => s.setQuickReplies);
  const updateTransaction = useStore((s) => s.updateTransaction);
  const removeTransaction = useStore((s) => s.removeTransaction);
  const transactions = useStore((s) => s.transactions);
  const pushMessage = useStore((s) => s.pushMessage);
  const loadSampleProfile = useStore((s) => s.loadSampleProfile);
  const navigate = useNavigate();

  const handleChipClick = (chip: string) => {
    // 0. Profil Contoh Shortcut
    if (chip.includes('profil contoh') || chip.includes('Profil Contoh')) {
      loadSampleProfile();
      return;
    }

    // 1. Kirim Voice
    if (chip.includes('Kirim voice') || chip.includes('voice')) {
      if (onStartTyping) onStartTyping();
      setTimeout(() => {
        handleSimulateVoice();
        if (onFinishTyping) onFinishTyping();
      }, 700);
      return;
    }

    // 2. Foto Nota
    if (chip.includes('Foto nota') || chip.includes('nota')) {
      if (onStartTyping) onStartTyping();
      setTimeout(() => {
        handleSimulateReceipt();
        if (onFinishTyping) onFinishTyping();
      }, 700);
      return;
    }

    // 3. Stress-Test
    if (chip === 'Stress-Test') {
      if (onStartTyping) onStartTyping();
      setTimeout(() => {
        handleStressTestTrigger();
        if (onFinishTyping) onFinishTyping();
      }, 600);
      return;
    }

    // Skenario Stress-Test spesifik
    if (chip === 'Uang saku terlambat') {
      if (onStartTyping) onStartTyping();
      setTimeout(() => {
        executeStressTest('late_allowance');
        if (onFinishTyping) onFinishTyping();
      }, 700);
      return;
    }
    if (chip === 'Laptop rusak') {
      if (onStartTyping) onStartTyping();
      setTimeout(() => {
        executeStressTest('broken_laptop');
        if (onFinishTyping) onFinishTyping();
      }, 700);
      return;
    }
    if (chip === 'Freelance batal') {
      if (onStartTyping) onStartTyping();
      setTimeout(() => {
        executeStressTest('freelance_cancelled');
        if (onFinishTyping) onFinishTyping();
      }, 700);
      return;
    }
    if (chip === 'Buat sendiri' || chip === 'Coba skenario lain') {
      pushMessage({
        sender: 'bot',
        text: 'Kejadian apa dan berapa biayanya? (Contoh: "servis motor 600rb" atau "ganti kacamata 300rb")',
      });
      setQuickReplies(['Servis motor 600rb', 'Beli buku 150rb', 'Biaya wisuda 800rb']);
      return;
    }

    // 4. Cek Sebelum Beli
    if (chip === 'Cek Sebelum Beli') {
      if (onStartTyping) onStartTyping();
      setTimeout(() => {
        handlePurchaseCheckTrigger();
        if (onFinishTyping) onFinishTyping();
      }, 600);
      return;
    }

    // 5. Ringkasan minggu ini
    if (chip === 'Ringkasan minggu ini') {
      if (onStartTyping) onStartTyping();
      setTimeout(() => {
        handleWeeklySummary();
        if (onFinishTyping) onFinishTyping();
      }, 700);
      return;
    }

    // 6. Buka Dashboard
    if (chip === 'Buka Dashboard') {
      navigate('/dashboard');
      return;
    }

    // 7. Ubah Kategori Transaksi Terakhir
    if (chip === 'Ubah kategori') {
      pushMessage({
        sender: 'bot',
        text: 'Pilih kategori baru untuk transaksi terakhirmu:',
      });
      setQuickReplies(CATEGORIES.map((c) => `Pilih: ${c}`));
      return;
    }

    if (chip.startsWith('Pilih: ')) {
      const newCat = chip.replace('Pilih: ', '') as Category;
      const lastExpense = transactions.find((t) => t.kind === 'expense');
      if (lastExpense) {
        updateTransaction(lastExpense.id, { category: newCat });
        pushMessage({
          sender: 'bot',
          text: `Kategori transaksi "${lastExpense.note}" telah diperbarui menjadi ${newCat}.`,
        });
        setQuickReplies(['Stress-Test', 'Cek Sebelum Beli', 'Ringkasan minggu ini']);
      }
      return;
    }

    // 8. Batalkan Transaksi Terakhir
    if (chip === 'Batalkan') {
      const lastExpense = transactions.find((t) => t.kind === 'expense');
      if (lastExpense) {
        removeTransaction(lastExpense.id);
        pushMessage({
          sender: 'bot',
          text: `Dibatalkan. Transaksi ${lastExpense.note} telah dihapus.`,
        });
        setQuickReplies(['🎙 Kirim voice', '📷 Foto nota', 'Stress-Test', 'Cek Sebelum Beli']);
      }
      return;
    }

    // Default: Perlakukan sebagai pesan teks pengguna biasa
    if (onStartTyping) onStartTyping();
    setTimeout(() => {
      handleUserIncoming(chip);
      if (onFinishTyping) onFinishTyping();
    }, 600);
  };

  if (!activeChips || activeChips.length === 0) return null;

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto py-2 px-3 no-scrollbar shrink-0 bg-chatBg/70 border-t border-ink-200/40">
      {activeChips.map((chip, idx) => (
        <button
          key={`${chip}-${idx}`}
          onClick={() => handleChipClick(chip)}
          className="whitespace-nowrap px-3 py-1.5 bg-white/95 hover:bg-white text-ink-700 hover:text-ink-900 border border-ink-200/80 rounded-full text-xs font-semibold shadow-xs transition-all active:scale-95 shrink-0 hover:border-brand-300"
        >
          {chip}
        </button>
      ))}
    </div>
  );
};
