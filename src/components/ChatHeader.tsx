import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ChatHeaderProps {
  onToggleBackstage?: () => void;
  showBackstageToggle?: boolean;
  isBackstageOpen?: boolean;
}

export const ChatHeader: React.FC<ChatHeaderProps> = () => {
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

        {/* Avatar Logo FinMinder */}
        <div className="relative">
          <img
            src="/logo.png"
            alt="FinMinder Logo"
            className="w-10 h-10 rounded-full object-cover shadow-inner border border-white/30 bg-white"
          />
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
          </p>
        </div>
      </div>
    </header>
  );
};
