import React from 'react';
import { useStore } from '../store/useStore';
import { ShieldCheck, Lock, Trash2, ArrowRight } from 'lucide-react';

export const ConsentCard: React.FC = () => {
  const setProfile = useStore((s) => s.setProfile);
  const setOnboardingStep = useStore((s) => s.setOnboardingStep);
  const pushMessage = useStore((s) => s.pushMessage);
  const setQuickReplies = useStore((s) => s.setQuickReplies);
  const loadSampleProfile = useStore((s) => s.loadSampleProfile);

  const handleAgree = () => {
    setProfile({ consentGiven: true });
    setOnboardingStep(2);

    pushMessage({
      sender: 'user',
      text: 'Saya setuju',
    });

    setTimeout(() => {
      pushMessage({
        sender: 'bot',
        text: 'Bagus! Privasimu aman bersama FinMinder.\n\nBerapa estimasi pemasukan bulananmu? (uang saku, beasiswa, atau gaji freelance)',
      });
      setQuickReplies(['1,5jt', '2,5jt', '3,5jt', 'Lewati, pakai profil contoh']);
    }, 400);
  };

  const handleSkip = () => {
    loadSampleProfile();
  };

  return (
    <div className="bg-card rounded-card p-4 border border-brand-100 shadow-soft max-w-sm my-1 space-y-3 text-ink-900">
      <div className="flex items-center gap-2 text-brand-700">
        <ShieldCheck className="w-5 h-5 text-brand-600 shrink-0" />
        <h4 className="text-sm font-bold">Persetujuan & Privasi Data</h4>
      </div>

      <p className="text-xs text-ink-700 leading-relaxed">
        FinMinder hanya memproses data secara lokal di perambanmu untuk membantumu mengelola keuangan:
      </p>

      <ul className="text-xs text-ink-700 space-y-1.5 pl-1">
        <li className="flex items-start gap-2">
          <Lock className="w-3.5 h-3.5 text-brand-500 shrink-0 mt-0.5" />
          <span>Data disimpan di perangkatmu, tanpa pelacak atau pihak ketiga.</span>
        </li>
        <li className="flex items-start gap-2">
          <Trash2 className="w-3.5 h-3.5 text-brand-500 shrink-0 mt-0.5" />
          <span>Kamu bebas menghapus semua data kapan saja dengan 1 klik.</span>
        </li>
      </ul>

      <div className="pt-2 flex flex-col gap-2">
        <button
          onClick={handleAgree}
          className="w-full py-2.5 px-3 bg-brand-600 hover:bg-brand-700 active:scale-98 text-white rounded-button text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
        >
          <span>Saya setuju</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={handleSkip}
          className="w-full py-2 px-3 bg-surface hover:bg-ink-100 active:scale-98 text-ink-700 border border-ink-300 rounded-button text-xs font-semibold transition-all"
        >
          Lewati, pakai profil contoh
        </button>
      </div>
    </div>
  );
};
