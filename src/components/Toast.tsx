import React, { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Undo2, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const toastMessage = useStore((s) => s.toastMessage);
  const deletedTxTemp = useStore((s) => s.deletedTxTemp);
  const undoRemove = useStore((s) => s.undoRemove);
  const clearUndo = useStore((s) => s.clearUndo);

  useEffect(() => {
    if (!toastMessage) return;

    // Timer auto hide 5 detik
    const timer = setTimeout(() => {
      clearUndo();
    }, 5000);

    return () => clearTimeout(timer);
  }, [toastMessage, clearUndo]);

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-ink-900/95 backdrop-blur-md text-white px-4 py-3 rounded-2xl shadow-xl border border-ink-700 max-w-sm w-full mx-4 animate-in fade-in slide-in-from-bottom-4 duration-200">
      <span className="text-sm font-medium flex-1 truncate">{toastMessage}</span>

      {deletedTxTemp && (
        <button
          onClick={undoRemove}
          className="flex items-center gap-1.5 px-3 py-1 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-xs font-semibold transition-all shrink-0 active:scale-95"
        >
          <Undo2 className="w-3.5 h-3.5" />
          Urungkan
        </button>
      )}

      <button
        onClick={clearUndo}
        className="p-1 text-ink-300 hover:text-white transition-colors"
        aria-label="Tutup notifikasi"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
