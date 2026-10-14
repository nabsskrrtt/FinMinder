import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import { Transaction } from '../config';
import { formatRupiah, formatShortDate } from '../lib/format';
import { TrendingDown } from 'lucide-react';

interface SpendTrendChartProps {
  transactions: Transaction[];
  dailyBudget: number;
}

export const SpendTrendChart: React.FC<SpendTrendChartProps> = ({
  transactions,
  dailyBudget,
}) => {
  // Susun data 30 hari terakhir
  const now = new Date();
  const daysData: { date: string; displayDate: string; amount: number }[] = [];

  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = d.toISOString().split('T')[0];

    const dayExpense = transactions
      .filter(
        (t) =>
          t.kind === 'expense' &&
          new Date(t.date).toISOString().split('T')[0] === dateStr
      )
      .reduce((sum, t) => sum + t.amount, 0);

    daysData.push({
      date: dateStr,
      displayDate: formatShortDate(d),
      amount: dayExpense,
    });
  }

  return (
    <div className="bg-card rounded-card p-5 border border-ink-100 shadow-soft flex flex-col justify-between">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-brand-600" />
            <h3 className="font-bold text-base text-ink-900">
              Tren Pengeluaran Harian
            </h3>
          </div>
          <p className="text-xs text-ink-500">
            30 hari terakhir dibandingkan batas anggaran harian
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
            <span className="text-ink-600 font-medium">Pengeluaran</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-rose-500 border-t border-dashed" />
            <span className="text-rose-600 font-semibold">
              Batas {formatRupiah(dailyBudget)}
            </span>
          </div>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={daysData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#14B8A6" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="displayDate"
              tickLine={false}
              axisLine={{ stroke: '#E2E8F0' }}
              tick={{ fill: '#64748B', fontSize: 10 }}
              interval={4}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#64748B', fontSize: 10 }}
              tickFormatter={(v) => `${Math.round(v / 1000)}k`}
            />
            <Tooltip
              formatter={(value: number) => [formatRupiah(value), 'Pengeluaran']}
              labelFormatter={(label) => `Tanggal: ${label}`}
              contentStyle={{
                backgroundColor: '#0F172A',
                borderRadius: '8px',
                color: '#FFFFFF',
                fontSize: '12px',
                border: 'none',
              }}
            />
            {/* Garis Batas Anggaran Harian */}
            <ReferenceLine
              y={dailyBudget}
              stroke="#DC2626"
              strokeDasharray="4 4"
              strokeWidth={1.5}
            />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="#0D9488"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#spendGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
