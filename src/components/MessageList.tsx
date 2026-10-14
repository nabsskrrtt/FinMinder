import React, { useEffect, useRef } from 'react';
import { ChatMessage } from '../config';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';

interface MessageListProps {
  messages: ChatMessage[];
  isTyping?: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  isTyping = false,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div
      className="flex-1 overflow-y-auto px-3.5 py-3 space-y-1 bg-chatBg relative"
      style={{
        backgroundImage: `radial-gradient(#D5CEBE 0.75px, transparent 0.75px)`,
        backgroundSize: '16px 16px',
      }}
    >
      {/* Date Pill Divider */}
      <div className="flex justify-center my-2">
        <span className="bg-white/80 backdrop-blur-xs text-ink-600 text-[11px] font-semibold px-3 py-1 rounded-full shadow-xs border border-ink-200/40">
          Hari ini
        </span>
      </div>

      {/* Messages */}
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}

      {/* Typing Indicator */}
      {isTyping && <TypingIndicator />}

      <div ref={bottomRef} className="h-1" />
    </div>
  );
};
