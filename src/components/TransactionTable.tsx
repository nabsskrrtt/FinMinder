import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Transaction, Category, CATEGORIES, CATEGORY_STYLES } from '../config';
import { formatRupiah, formatDate } from '../lib/format';
import {
  Search,
  Filter,
  Trash2,
  Edit2,
  Receipt,
  Mic,
  FileText,
  AlertCircle,
  PlusCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const TransactionTable: React.FC = () => {
  const transactions = useStore((s) => s.transactions);
  const updateTransaction = useStore((s) => s.updateTransaction);
  const removeTransaction = useStore((s) => s.removeTransaction);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingTxId, setEditingTxId] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState<Category>('Makanan & Minuman');

  // Filter transactions
  const filtered = transactions.filter((tx) => {
    const matchesSearch =
      tx.note.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.amount.toString().includes(searchTerm);

    const matchesCategory =
      selectedCategory === 'all' || tx.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleStartEdit = (tx: Transaction) => {
    setEditingTxId(tx.id);
    setNewCategory(tx.category);
  };

  const handleSaveEdit = (id: string) => {
    updateTransaction(id, { category: newCategory });
    setEditingTxId(null);
  };

  const handleDelete = (id: string) => {
    removeTransaction(id);
  };

  const getSourceIcon = (source?: string) => {
    switch (source) {
      case 'voice':
        return (
          <span title="Dari Suara" className="inline-flex">
            <Mic className="w-3.5 h-3.5 text-brand-600" />
          </span>
        );
      case 'receipt':
        return (
          <span title="Dari Struk Foto" className="inline-flex">
            <Receipt className="w-3.5 h-3.5 text-amber-600" />
          </span>
        );
      default:
        return (
          <span title="Dari Teks Chat" className="inline-flex">
            <FileText className="w-3.5 h-3.5 text-ink-400" />
          </span>
        );
    }
  };

  return (
    <div className="bg-card rounded-card p-5 border border-ink-100 shadow-soft space-y-4">
      {/* Header and Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-base text-ink-900">Riwayat Transaksi</h3>
          <p className="text-xs text-ink-500">
            Daftar pengeluaran & pemasukan yang tercatat oleh FinMinder
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search Box */}
          <div className="relative min-w-[180px] flex-1 sm:flex-initial">
            <Search className="w-4 h-4 text-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari transaksi..."
              className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-ink-200 bg-surface focus:outline-none focus:border-brand-500"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs py-2 px-3 rounded-xl border border-ink-200 bg-surface text-ink-700 font-medium focus:outline-none focus:border-brand-500"
            >
              <option value="all">Semua Kategori</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filtered.length === 0 ? (
        <div className="py-12 flex flex-col items-center justify-center text-center space-y-3 bg-surface rounded-xl border border-dashed border-ink-200">
          <div className="w-12 h-12 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-ink-800">
              Tidak ada transaksi ditemukan
            </h4>
            <p className="text-xs text-ink-500 mt-0.5">
              {transactions.length === 0
                ? 'Belum ada transaksi tercatat. Mulai chat di simulator demo!'
                : 'Coba ubah kata kunci pencarian atau penyaring kategori.'}
            </p>
          </div>
          <Link
            to="/demo"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-button text-xs font-bold transition-all shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Kirim Catatan via Chat</span>
          </Link>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-ink-200/80 text-ink-500 uppercase tracking-wider font-semibold text-[11px] bg-surface/50">
                  <th className="py-3 px-3">Tanggal</th>
                  <th className="py-3 px-3">Catatan</th>
                  <th className="py-3 px-3">Kategori</th>
                  <th className="py-3 px-3 text-right">Nominal</th>
                  <th className="py-3 px-3 text-center">Sumber</th>
                  <th className="py-3 px-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {filtered.map((tx) => (
                  <tr
                    key={tx.id}
                    className="hover:bg-brand-50/30 transition-colors group"
                  >
                    <td className="py-3 px-3 text-ink-600 font-medium whitespace-nowrap">
                      {formatDate(tx.date)}
                    </td>
                    <td className="py-3 px-3 font-semibold text-ink-900">
                      {tx.note}
                    </td>
                    <td className="py-3 px-3">
                      {editingTxId === tx.id ? (
                        <div className="flex items-center gap-1.5">
                          <select
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value as Category)}
                            className="text-xs p-1 rounded border border-brand-500 bg-white"
                          >
                            {CATEGORIES.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => handleSaveEdit(tx.id)}
                            className="px-2 py-1 bg-brand-600 text-white rounded text-[10px] font-bold"
                          >
                            OK
                          </button>
                        </div>
                      ) : (() => {
                        const catStyle =
                          CATEGORY_STYLES[tx.category] || CATEGORY_STYLES['Lainnya'];
                        return (
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-semibold text-[11px] border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full shrink-0 ${catStyle.dot}`}
                            />
                            {tx.category}
                          </span>
                        );
                      })()}
                    </td>
                    <td
                      className={`py-3 px-3 text-right font-bold tabular-nums whitespace-nowrap ${
                        tx.kind === 'income' ? 'text-emerald-600' : 'text-ink-900'
                      }`}
                    >
                      {tx.kind === 'income' ? '+' : '-'} {formatRupiah(tx.amount)}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex justify-center">
                        {getSourceIcon(tx.source)}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleStartEdit(tx)}
                          className="p-1.5 text-ink-400 hover:text-brand-600 rounded-md hover:bg-ink-100 transition-colors"
                          title="Ubah Kategori"
                          aria-label="Ubah kategori"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(tx.id)}
                          className="p-1.5 text-ink-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition-colors"
                          title="Hapus Transaksi"
                          aria-label="Hapus transaksi"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-2.5">
            {filtered.map((tx) => (
              <div
                key={tx.id}
                className="bg-surface p-3.5 rounded-xl border border-ink-100 flex items-start justify-between gap-3 shadow-2xs"
              >
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-ink-900 truncate">
                      {tx.note}
                    </span>
                    <span className="text-[10px] text-ink-500 shrink-0">
                      {formatDate(tx.date)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    {editingTxId === tx.id ? (
                      <div className="flex items-center gap-1 mt-1">
                        <select
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value as Category)}
                          className="text-xs p-1 rounded border border-brand-500 bg-white"
                        >
                          {CATEGORIES.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleSaveEdit(tx.id)}
                          className="px-2 py-1 bg-brand-600 text-white rounded text-[10px] font-bold"
                        >
                          OK
                        </button>
                      </div>
                    ) : (() => {
                      const catStyle =
                        CATEGORY_STYLES[tx.category] || CATEGORY_STYLES['Lainnya'];
                      return (
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-semibold text-[11px] border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full shrink-0 ${catStyle.dot}`}
                          />
                          {tx.category}
                        </span>
                      );
                    })()}
                    <span className="flex items-center gap-1 text-[11px] text-ink-400">
                      {getSourceIcon(tx.source)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span
                    className={`font-bold text-xs tabular-nums ${
                      tx.kind === 'income' ? 'text-emerald-600' : 'text-ink-900'
                    }`}
                  >
                    {tx.kind === 'income' ? '+' : '-'} {formatRupiah(tx.amount)}
                  </span>

                  <div className="flex items-center gap-1 mt-1">
                    <button
                      onClick={() => handleStartEdit(tx)}
                      className="p-1 text-ink-400 hover:text-brand-600"
                      aria-label="Ubah kategori"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(tx.id)}
                      className="p-1 text-ink-400 hover:text-rose-600"
                      aria-label="Hapus transaksi"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
