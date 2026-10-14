import React from 'react';
import { Wifi, Battery } from 'lucide-react';

interface PhoneFrameProps {
  children: React.ReactNode;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({ children }) => {
  return (
    <div className="w-full flex justify-center items-center py-2 lg:py-6">
      {/* Phone container */}
      <div className="w-full max-w-[390px] h-[85vh] min-h-[620px] max-h-[820px] flex flex-col bg-chatBg rounded-none sm:rounded-[38px] shadow-none sm:shadow-2xl border-0 sm:border-[8px] sm:border-ink-900 overflow-hidden relative transition-all">
        {/* Status Bar */}
        <div className="bg-brand-700 text-white px-5 pt-2 pb-1 flex items-center justify-between text-xs font-semibold shrink-0 select-none z-30">
          <span className="text-[12px] tabular-nums font-bold">09:41</span>

          {/* Dynamic Island / Speaker Pill */}
          <div className="w-20 h-4 bg-ink-950/80 rounded-full flex items-center justify-center gap-1.5 px-2">
            <span className="w-2 h-2 rounded-full bg-ink-900 border border-ink-800" />
            <span className="w-1.5 h-1.5 rounded-full bg-brand-900" />
          </div>

          <div className="flex items-center gap-1.5">
            <Wifi className="w-3.5 h-3.5" />
            <span className="text-[10px]">5G</span>
            <Battery className="w-4 h-4" />
          </div>
        </div>

        {/* Screen Content */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {children}
        </div>

        {/* Bottom Home Indicator Bar */}
        <div className="bg-chatBg py-1.5 flex justify-center shrink-0 z-30">
          <div className="w-32 h-1 bg-ink-400 rounded-full" />
        </div>
      </div>
    </div>
  );
};
