import React from 'react';

interface StatusBadgeProps {
  status: 'safe' | 'warn' | 'critical';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  className = '',
}) => {
  const configs = {
    safe: {
      label: 'Aman',
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dot: 'bg-emerald-500 shadow-emerald-500/50',
    },
    warn: {
      label: 'Waspada',
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      dot: 'bg-amber-500 shadow-amber-500/50',
    },
    critical: {
      label: 'Kritis',
      bg: 'bg-rose-50 text-rose-700 border-rose-200',
      dot: 'bg-rose-500 shadow-rose-500/50',
    },
  };

  const current = configs[status] || configs.safe;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1.5 font-medium',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-semibold',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-bold',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border shadow-xs transition-colors ${current.bg} ${sizeClasses[size]} ${className}`}
    >
      <span className={`rounded-full shrink-0 animate-pulse ${size === 'lg' ? 'w-2.5 h-2.5' : 'w-2 h-2'} ${current.dot}`} />
      <span>{current.label}</span>
    </span>
  );
};
