import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-ink-200/80 bg-white py-6 px-4 text-center text-xs text-ink-500 space-y-2">
      <div className="flex items-center justify-center gap-2 font-bold text-ink-800">
        <img
          src="/logo.png"
          alt="FinMinder"
          className="w-5 h-5 rounded-md object-contain shadow-2xs"
        />
        <span>FinMinder</span>
        <span className="text-ink-300">•</span>
        <span className="text-ink-600 font-medium">Asisten Finansial Mahasiswa</span>
      </div>

      <p className="text-ink-600 max-w-2xl mx-auto leading-relaxed">
        Prototipe ini dikembangkan untuk kompetisi <strong>ELEVATE 2026</strong> (Rangkaian Program Peningkatan Literasi Finansial) oleh kelompok <strong>&quot;2027 Financial Freedom&quot;</strong>:
        <span className="block font-semibold text-ink-800 mt-0.5">
          Nabila • Shafwah • Aqeel • Fadil • Haliza
        </span>
      </p>

      <p className="text-[11px] text-ink-400 max-w-xl mx-auto leading-relaxed pt-1.5 border-t border-ink-100">
        FinMinder bersifat informatif, bukan nasihat keuangan. Seluruh data disimulasikan di sisi klien untuk keperluan demonstrasi proposal.
      </p>
    </footer>
  );
};
