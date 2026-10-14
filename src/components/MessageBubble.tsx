import React, { useState } from 'react';
import { ChatMessage } from '../config';
import { CheckCheck, Play, Pause, Receipt } from 'lucide-react';
import { ConsentCard } from './ConsentCard';
import { DraftTransactionCard } from './DraftTransactionCard';
import { StressTestCard } from './StressTestCard';
import { PurchaseCheckCard } from './PurchaseCheckCard';
import { WeeklySummaryCard } from './WeeklySummaryCard';

interface MessageBubbleProps {
  message: ChatMessage;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);

  // Jika pesan bertipe kartu bot khusus
  if (message.type === 'consent') {
    return (
      <div className="flex justify-start my-1.5 animate-in fade-in slide-in-from-bottom-2 duration-200">
        <ConsentCard />
      </div>
    );
  }

  if (message.type === 'draft' && message.payload) {
    return (
      <div className="flex justify-start my-1.5 animate-in fade-in slide-in-from-bottom-2 duration-200">
        <DraftTransactionCard payload={message.payload} messageId={message.id} />
      </div>
    );
  }

  if (message.type === 'stress_test' && message.payload) {
    return (
      <div className="flex justify-start my-1.5 animate-in fade-in slide-in-from-bottom-2 duration-200">
        <StressTestCard payload={message.payload} />
      </div>
    );
  }

  if (message.type === 'purchase_check' && message.payload) {
    return (
      <div className="flex justify-start my-1.5 animate-in fade-in slide-in-from-bottom-2 duration-200">
        <PurchaseCheckCard payload={message.payload} />
      </div>
    );
  }

  if (message.type === 'weekly_summary' && message.payload) {
    return (
      <div className="flex justify-start my-1.5 animate-in fade-in slide-in-from-bottom-2 duration-200">
        <WeeklySummaryCard payload={message.payload} />
      </div>
    );
  }

  return (
    <div
      className={`flex ${
        isUser ? 'justify-end' : 'justify-start'
      } my-1 animate-in fade-in slide-in-from-bottom-1 duration-150`}
    >
      <div
        className={`max-w-[82%] sm:max-w-[78%] px-3.5 py-2 rounded-bubble relative chat-bubble-shadow ${
          isUser
            ? 'bg-bubbleUser text-ink-900 rounded-tr-xs'
            : 'bg-bubbleBot text-ink-900 rounded-tl-xs border border-ink-100/60'
        }`}
      >
        {/* Konten Pesan Suara Simulasi */}
        {message.type === 'voice' && (
          <div className="flex items-center gap-3 py-1 min-w-[210px]">
            <button
              onClick={() => setIsPlayingVoice(!isPlayingVoice)}
              className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center shrink-0 shadow-xs hover:bg-brand-700 transition-colors"
              aria-label="Putar rekaman suara"
            >
              {isPlayingVoice ? (
                <Pause className="w-4 h-4 fill-white" />
              ) : (
                <Play className="w-4 h-4 fill-white ml-0.5" />
              )}
            </button>

            {/* Bentuk Gelombang Audio SVG */}
            <div className="flex-1 flex items-center gap-0.5 h-6">
              {[6, 12, 18, 10, 16, 22, 14, 8, 19, 13, 20, 15, 9, 17, 11, 7].map((h, i) => (
                <span
                  key={i}
                  className={`w-1 rounded-full transition-all ${
                    isPlayingVoice
                      ? 'bg-brand-600 animate-pulse'
                      : 'bg-ink-400'
                  }`}
                  style={{ height: `${h}px` }}
                />
              ))}
            </div>

            <span className="text-[11px] font-semibold text-ink-500 tabular-nums">
              0:04
            </span>
          </div>
        )}

        {/* Konten Foto Struk Simulasi */}
        {message.type === 'receipt' && (
          <div className="space-y-2 py-1 max-w-[230px]">
            <div className="bg-white rounded-lg p-3 border border-ink-200 shadow-inner font-mono text-[11px] text-ink-700 space-y-1.5">
              <div className="text-center border-b border-dashed border-ink-300 pb-1.5">
                <div className="flex items-center justify-center gap-1 font-bold text-ink-900">
                  <Receipt className="w-3.5 h-3.5" />
                  <span>MINIMARKET KAMPUS</span>
                </div>
                <span className="text-[9px] text-ink-500">Struk Pembelian #4819</span>
              </div>

              <div className="space-y-1 text-[10px]">
                <div className="flex justify-between">
                  <span>1x Sabun Mandi Cair</span>
                  <span>18.500</span>
                </div>
                <div className="flex justify-between">
                  <span>1x Biskuit Cokelat</span>
                  <span>14.000</span>
                </div>
                <div className="flex justify-between">
                  <span>1x Tisu Kering 200s</span>
                  <span>15.000</span>
                </div>
              </div>

              <div className="border-t border-dashed border-ink-300 pt-1.5 flex justify-between font-bold text-ink-900">
                <span>TOTAL BELANJA</span>
                <span>Rp47.500</span>
              </div>
            </div>
            <p className="text-[11px] text-ink-600 italic">📷 Foto struk belanja</p>
          </div>
        )}

        {/* Konten Teks Biasa */}
        {message.text && (
          <p className="text-[13px] leading-relaxed whitespace-pre-line break-words">
            {message.text}
          </p>
        )}

        {/* Waktu dan Centang WhatsApp */}
        <div className="flex items-center justify-end gap-1 mt-1 -mb-0.5 text-[10px] text-ink-500">
          <span className="tabular-nums">{message.timestamp}</span>
          {isUser && (
            <CheckCheck className="w-3.5 h-3.5 text-teal-600 inline" aria-label="Terkirim" />
          )}
        </div>
      </div>
    </div>
  );
};
