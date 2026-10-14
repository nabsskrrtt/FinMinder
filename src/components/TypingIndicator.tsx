import React from 'react';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex justify-start my-1 animate-in fade-in duration-200">
      <div className="bg-bubbleBot px-3.5 py-2.5 rounded-bubble rounded-tl-xs chat-bubble-shadow border border-ink-100/60 flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-brand-500 animate-dot-1" />
        <span className="w-2 h-2 rounded-full bg-brand-500 animate-dot-2" />
        <span className="w-2 h-2 rounded-full bg-brand-500 animate-dot-3" />
      </div>
    </div>
  );
};
