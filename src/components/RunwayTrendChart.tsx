import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  ReferenceArea,
} from 'recharts';
import { Profile, Transaction, RUNWAY_THRESHOLDS } from '../config';
import { computeRunway } from '../lib/runway';
import { formatShortDate } from '../lib/format';
import { Shield } from 'lucide-react';

interface RunwayTrendChartProps {
  profile: Profile;
  transactions: Transaction[];
}

export const RunwayTrendChart: React.FC<RunwayTrendChartProps> = ({
  profile,
  transactions,
}) => {
  const now = new Date();
  const trendData: { date: string; displayDate: string; days: number }[] = [];

  // Hitung perkiraan runway selama 14 hari terakhir
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    d.setHours(23, 59, 59, 999);

    // Filter transaksi yang terjadi sampai tanggal d
    const txUntilDate = transactions.filter((t) => new Date(t.date) <= d);
    const r = computeRunway(profile, txUntilDate);

    trendData.push({
      date: d.toISOString().split('T')[0],
      displayDate: formatShortDate(d),
      days: r.days,
    });
  }

  return (
    <div className="bg-card rounded-card p-5 border border-ink-100 shadow-soft flex flex-col justify-between">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-base text-ink-900">
              Tren Daya Tahan Saldo
            </h3>
          </div>
          <p className="text-xs text-ink-500">
            Perubahan hari bertahan dalam 14 hari terakhir
          </p>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-semibold">
          <span className="px-2 py-0.5 rounded-sm bg-emerald-100 text-emerald-800">
            ≥21 Aman
          </span>
          <span className="px-2 py-0.5 rounded-sm bg-amber-100 text-amber-800">
            7-20 Waspada
          </span>
          <span className="px-2 py-0.5 rounded-sm bg-rose-100 text-rose-800">
            &lt;7 Kritis
          </span>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            {/* Background status zones */}
            <ReferenceArea
              y1={RUNWAY_THRESHOLDS.warn}
              y2={35}
              fill="#10B981"
              fillOpacity={0.07}
            />
            <ReferenceArea
              y1={RUNWAY_THRESHOLDS.critical}
              y2={RUNWAY_THRESHOLDS.warn}
              fill="#F59E0B"
              fillOpacity={0.07}
            />
            <ReferenceArea
              y1={0}
              y2={RUNWAY_THRESHOLDS.critical}
              fill="#EF4444"
              fillOpacity={0.08}
            />

            <ReferenceLine
              y={RUNWAY_THRESHOLDS.warn}
              stroke="#D97706"
              strokeDasharray="3 3"
              strokeWidth={1}
            />
            <ReferenceLine
              y={RUNWAY_THRESHOLDS.critical}
              stroke="#DC2626"
              strokeDasharray="3 3"
              strokeWidth={1}
            />

            <XAxis
              dataKey="displayDate"
              tickLine={false}
              axisLine={{ stroke: '#E2E8F0' }}
              tick={{ fill: '#64748B', fontSize: 10 }}
              interval={2}
            />
            <YAxis
              domain={[0, 32]}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#64748B', fontSize: 10 }}
              tickFormatter={(v) => `${v} hr`}
            />
            <Tooltip
              formatter={(value: number) => [`${value} hari`, 'Daya Tahan']}
              labelFormatter={(label) => `Tanggal: ${label}`}
              contentStyle={{
                backgroundColor: '#0F172A',
                borderRadius: '8px',
                color: '#FFFFFF',
                fontSize: '12px',
                border: 'none',
              }}
            />
            <Line
              type="monotone"
              dataKey="days"
              stroke="#0F766E"
              strokeWidth={3}
              dot={{ r: 3, fill: '#0F766E' }}
              activeDot={{ r: 6, fill: '#14B8A6' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
