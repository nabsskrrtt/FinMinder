import React, { useState } from 'react';
import { Send, Mic, Camera } from 'lucide-react';
import { handleUserIncoming, handleSimulateVoice, handleSimulateReceipt } from '../lib/botFlows';

interface ChatInputProps {
  onStartTyping?: () => void;
  onFinishTyping?: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onStartTyping,
  onFinishTyping,
}) => {
  const [inputText, setInputText] = useState('');

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = inputText.trim();
    if (!clean) return;

    setInputText('');

    if (onStartTyping) onStartTyping();
    setTimeout(() => {
      handleUserIncoming(clean);
      if (onFinishTyping) onFinishTyping();
    }, 700);
  };

  const handleVoiceClick = () => {
    if (onStartTyping) onStartTyping();
    setTimeout(() => {
      handleSimulateVoice();
      if (onFinishTyping) onFinishTyping();
    }, 700);
  };

  const handleCameraClick = () => {
    if (onStartTyping) onStartTyping();
    setTimeout(() => {
      handleSimulateReceipt();
      if (onFinishTyping) onFinishTyping();
    }, 700);
  };

  return (
    <div className="bg-[#F0F2F5] px-2.5 py-2 flex items-center gap-1.5 shrink-0 z-20 border-t border-ink-200/50">
      {/* Tombol Kamera Simulasi */}
      <button
        type="button"
        onClick={handleCameraClick}
        className="w-10 h-10 rounded-full flex items-center justify-center text-ink-500 hover:text-brand-600 hover:bg-white active:scale-95 transition-all shrink-0"
        title="Simulasikan foto struk nota belanja"
        aria-label="Foto nota"
      >
        <Camera className="w-5 h-5" />
      </button>

      {/* Tombol Mikrofon Simulasi */}
      <button
        type="button"
        onClick={handleVoiceClick}
        className="w-10 h-10 rounded-full flex items-center justify-center text-ink-500 hover:text-brand-600 hover:bg-white active:scale-95 transition-all shrink-0"
        title="Simulasikan kirim pesan suara"
        aria-label="Pesan suara"
      >
        <Mic className="w-5 h-5" />
      </button>

      {/* Input Form */}
      <form onSubmit={handleSend} className="flex-1 flex items-center gap-1.5">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ketik pengeluaran... (misal: ngopi 25rb)"
          className="flex-1 bg-white text-ink-900 placeholder:text-ink-400 text-sm px-4 py-2.5 rounded-full border border-ink-200 focus:outline-none focus:border-brand-500 transition-colors shadow-xs"
        />

        <button
          type="submit"
          disabled={!inputText.trim()}
          className={`w-10 h-10 rounded-full flex items-center justify-center text-white transition-all shrink-0 shadow-sm ${
            inputText.trim()
              ? 'bg-brand-600 hover:bg-brand-700 active:scale-95'
              : 'bg-ink-300 cursor-not-allowed opacity-70'
          }`}
          title="Kirim pesan"
          aria-label="Kirim"
        >
          <Send className="w-4 h-4 ml-0.5" />
        </button>
      </form>
    </div>
  );
};
