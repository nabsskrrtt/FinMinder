import React from 'react';
import { Cpu, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ChatHeaderProps {
  onToggleBackstage?: () => void;
  showBackstageToggle?: boolean;
  isBackstageOpen?: boolean;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  onToggleBackstage,
  showBackstageToggle = true,
  isBackstageOpen = false,
}) => {
  return (
    <header className="bg-brand-700 text-white px-3.5 py-2.5 flex items-center justify-between shadow-sm shrink-0 z-20">
      <div className="flex items-center gap-2.5">
        <Link
          to="/"
          className="text-brand-100 hover:text-white p-1 rounded-full transition-colors lg:hidden"
          title="Kembali ke Landing"
          aria-label="Kembali"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>

        {/* Avatar FM */}
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-900 via-brand-600 to-teal-400 flex items-center justify-center font-bold text-sm tracking-wider text-white shadow-inner border border-brand-500/30">
            FM
          </div>
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-brand-700 rounded-full" />
        </div>

        {/* Info Bot */}
        <div className="leading-tight">
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold tracking-tight text-white">FinMinder</h1>
            <span className="text-[10px] bg-brand-800/80 text-brand-100 px-1.5 py-0.2 rounded font-medium border border-brand-600/40">
              Bot Keuangan
            </span>
          </div>
          <p className="text-[11px] text-teal-100 font-medium flex items-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
            <span>online</span>
            <span className="text-brand-300">•</span>
            <span className="text-brand-200 text-[10px]">asisten mahasiswa</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Tombol Di Balik Layar untuk Mobile / Small Screen */}
        {showBackstageToggle && (
          <button
            onClick={onToggleBackstage}
            className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-full font-semibold transition-all ${
              isBackstageOpen
                ? 'bg-white text-brand-900 shadow-xs'
                : 'bg-brand-800/80 hover:bg-brand-800 text-teal-100 border border-brand-600/40'
            }`}
            title="Buka Panel Di Balik Layar"
            aria-label="Di Balik Layar"
          >
            <Cpu className="w-3.5 h-3.5 text-teal-300" />
            <span className="text-[11px]">Di Balik Layar</span>
          </button>
        )}
      </div>
    </header>
  );
};
