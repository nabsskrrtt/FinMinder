import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Transaction } from '../config';
import { formatRupiah } from '../lib/format';
import { PieChart as PieIcon } from 'lucide-react';

interface CategoryDonutProps {
  transactions: Transaction[];
}

const CATEGORY_COLORS: Record<string, string> = {
  'Makanan & Minuman': '#14B8A6', // teal brand
  'Transportasi': '#0284C7',      // sky
  'Tagihan': '#6366F1',           // indigo
  'Pulsa & Internet': '#8B5CF6',  // purple
  'Kuliah': '#EC4899',            // pink
  'Hiburan': '#F59E0B',           // amber
  'Belanja': '#10B981',           // emerald
  'Lainnya': '#94A3B8',           // slate
};

export const CategoryDonut: React.FC<CategoryDonutProps> = ({ transactions }) => {
  const expenseTransactions = transactions.filter((t) => t.kind === 'expense');

  // Hitung total per kategori
  const totals: Record<string, number> = {};
  let grandTotal = 0;

  expenseTransactions.forEach((t) => {
    totals[t.category] = (totals[t.category] || 0) + t.amount;
    grandTotal += t.amount;
  });

  const data = Object.entries(totals)
    .map(([name, value]) => ({
      name,
      value,
      percentage: grandTotal > 0 ? Math.round((value / grandTotal) * 100) : 0,
    }))
    .sort((a, b) => b.value - a.value);

  if (data.length === 0) {
    return (
      <div className="bg-card rounded-card p-5 border border-ink-100 shadow-soft flex flex-col items-center justify-center py-12 text-center text-ink-500">
        <PieIcon className="w-10 h-10 text-ink-300 mb-2" />
        <p className="text-sm font-semibold">Belum ada data pengeluaran</p>
        <p className="text-xs text-ink-400 mt-0.5">Catat transaksi pertamamu lewat chat.</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-card p-5 border border-ink-100 shadow-soft flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="font-bold text-base text-ink-900">Distribusi Pengeluaran</h3>
          <p className="text-xs text-ink-500">Proporsi kategori pengeluaran bulan ini</p>
        </div>
        <span className="text-xs font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full border border-brand-200">
          Total {formatRupiah(grandTotal)}
        </span>
      </div>

      <div className="h-56 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={55}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry) => (
                <Cell
                  key={`cell-${entry.name}`}
                  fill={CATEGORY_COLORS[entry.name] || '#94A3B8'}
                  stroke="#FFFFFF"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [
                formatRupiah(value),
                'Total Pengeluaran',
              ]}
              contentStyle={{
                backgroundColor: '#0F172A',
                borderRadius: '8px',
                color: '#FFFFFF',
                fontSize: '12px',
                border: 'none',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend Berjajar */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-ink-100 text-xs">
        {data.slice(0, 6).map((item) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 truncate pr-1">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{
                  backgroundColor: CATEGORY_COLORS[item.name] || '#94A3B8',
                }}
              />
              <span className="text-ink-700 truncate">{item.name}</span>
            </div>
            <span className="font-bold text-ink-900 tabular-nums shrink-0">
              {item.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
