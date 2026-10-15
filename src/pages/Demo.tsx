import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { PhoneFrame } from '../components/PhoneFrame';
import { ChatHeader } from '../components/ChatHeader';
import { MessageList } from '../components/MessageList';
import { QuickReplies } from '../components/QuickReplies';
import { ChatInput } from '../components/ChatInput';
import { BackstagePanel } from '../components/BackstagePanel';
import { LayoutDashboard, Sparkles, ChevronLeft, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Demo: React.FC = () => {
  const messages = useStore((s) => s.messages);
  const loadSampleProfile = useStore((s) => s.loadSampleProfile);
  const onboardingStep = useStore((s) => s.onboardingStep);

  const [isTyping, setIsTyping] = useState(false);
  const [showMobileBackstage, setShowMobileBackstage] = useState(false);
  const [showDesktopBackstage, setShowDesktopBackstage] = useState(true);

  const handleStartTyping = () => {
    setIsTyping(true);
  };

  const handleFinishTyping = () => {
    setIsTyping(false);
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-between selection:bg-brand-100 selection:text-brand-900">
      {/* Top Banner Penanda Prototipe & Navigasi Ringan */}
      <header className="bg-white border-b border-ink-200/80 sticky top-0 z-40 px-4 py-2 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-xs font-semibold text-ink-600 hover:text-ink-900 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Landing</span>
          </Link>
          <div className="flex items-center gap-1.5">
            <img src="/logo.png" alt="FinMinder Logo" className="w-5 h-5 rounded-md object-contain shadow-2xs" />
            <span className="text-xs font-bold text-ink-900 tracking-tight">
              FinMinder Simulator
            </span>
          </div>
          <span className="text-[10px] bg-brand-50 text-brand-700 font-bold px-2 py-0.5 rounded-full border border-brand-200">
            Prototipe: data simulasi
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Pintasan Wajib: Lewati, pakai profil contoh */}
          <button
            onClick={loadSampleProfile}
            className="text-xs font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 active:scale-95 px-3 py-1.5 rounded-full border border-brand-300 transition-all flex items-center gap-1.5"
            title="Muat profil Mahasiswa Rantau dengan ~30 transaksi"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>Pakai Profil Contoh</span>
          </button>

          <Link
            to="/dashboard"
            className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-ink-700 hover:text-ink-900 px-3 py-1.5 rounded-lg hover:bg-ink-100 transition-colors"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>

          {/* Toggle Panel Backstage untuk Desktop */}
          <button
            onClick={() => setShowDesktopBackstage(!showDesktopBackstage)}
            className="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-ink-600 hover:text-ink-900 px-2.5 py-1.5 rounded-lg hover:bg-ink-100 transition-colors"
            title="Tampilkan / Sembunyikan Panel Di Balik Layar"
          >
            {showDesktopBackstage ? (
              <>
                <EyeOff className="w-3.5 h-3.5" />
                <span>Tutup Panel</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span>Buka Panel</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Container Dua Kolom di Desktop, Full Screen di Mobile */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-0 sm:p-4 lg:p-6 flex flex-col lg:flex-row items-center lg:items-start justify-center gap-6">
        {/* Kolom Kiri: Simulator Chat dalam PhoneFrame */}
        <div className="w-full lg:w-auto flex-1 flex justify-center">
          <PhoneFrame>
            <ChatHeader
              onToggleBackstage={() => setShowMobileBackstage(true)}
              showBackstageToggle={true}
              isBackstageOpen={showMobileBackstage}
            />

            <MessageList messages={messages} isTyping={isTyping} />

            <QuickReplies
              onStartTyping={handleStartTyping}
              onFinishTyping={handleFinishTyping}
            />

            <ChatInput
              onStartTyping={handleStartTyping}
              onFinishTyping={handleFinishTyping}
            />
          </PhoneFrame>
        </div>

        {/* Kolom Kanan: Panel "Di Balik Layar" (Desktop) */}
        {showDesktopBackstage && (
          <div className="hidden lg:block w-[420px] shrink-0 sticky top-16 h-[85vh] min-h-[620px] max-h-[820px]">
            <BackstagePanel />
          </div>
        )}
      </main>

      {/* Mobile Bottom Sheet untuk "Di Balik Layar" */}
      {showMobileBackstage && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end bg-ink-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-h-[90vh] bg-white rounded-t-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300">
            {/* Grab handle bar */}
            <div className="w-full py-2 flex justify-center bg-surface border-b border-ink-100">
              <div className="w-12 h-1 bg-ink-300 rounded-full" />
            </div>
            <div className="p-4 overflow-y-auto max-h-[85vh]">
              <BackstagePanel
                onClose={() => setShowMobileBackstage(false)}
                isMobileDrawer={true}
              />
            </div>
          </div>
        </div>
      )}

      {/* Global Informative Footer */}
      <footer className="py-3 px-4 text-center text-xs text-ink-500 border-t border-ink-200/80 bg-white">
        FinMinder bersifat informatif, bukan nasihat keuangan.
      </footer>
    </div>
  );
};
