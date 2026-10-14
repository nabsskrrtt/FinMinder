import { Profile, Transaction, ReminderItem } from '../config';

export const INITIAL_PROFILE: Profile = {
  monthlyIncome: 3000000, // uang saku 2.500.000 + honor freelance 500.000
  fixedBills: 1000000,    // kos 900.000 + internet 100.000
  startingBalance: 1800000,
  dailyBudget: 66667,     // (3000000 - 1000000) / 30
  consentGiven: true,
};

// Generate 32 transaksi realistis 21 hari terakhir
export function generateSeedTransactions(): Transaction[] {
  const now = new Date();
  const getPastDate = (daysAgo: number, hours = 12, mins = 0) => {
    const d = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    d.setHours(hours, mins, 0, 0);
    return d.toISOString();
  };

  return [
    // Hari ini (day 0)
    {
      id: 'tx-01',
      date: getPastDate(0, 9, 30),
      kind: 'expense',
      amount: 14000,
      category: 'Makanan & Minuman',
      note: 'Sarapan Bubur Ayam',
      source: 'text',
    },
    // Kemarin (day 1)
    {
      id: 'tx-02',
      date: getPastDate(1, 13, 15),
      kind: 'expense',
      amount: 18000,
      category: 'Makanan & Minuman',
      note: 'Makan siang Ayam Geprek',
      source: 'text',
    },
    {
      id: 'tx-03',
      date: getPastDate(1, 17, 45),
      kind: 'expense',
      amount: 12000,
      category: 'Transportasi',
      note: 'Ojol balik kampus',
      source: 'text',
    },
    // 2 hari lalu
    {
      id: 'tx-04',
      date: getPastDate(2, 12, 0),
      kind: 'expense',
      amount: 22000,
      category: 'Makanan & Minuman',
      note: 'Nasi Padang Rendang',
      source: 'text',
    },
    {
      id: 'tx-05',
      date: getPastDate(2, 16, 20),
      kind: 'expense',
      amount: 15000,
      category: 'Makanan & Minuman',
      note: 'Kopi Susu Gula Aren',
      source: 'text',
    },
    // 3 hari lalu
    {
      id: 'tx-06',
      date: getPastDate(3, 10, 30),
      kind: 'expense',
      amount: 30000,
      category: 'Transportasi',
      note: 'Isi Bensin Motor',
      source: 'text',
    },
    {
      id: 'tx-07',
      date: getPastDate(3, 19, 10),
      kind: 'expense',
      amount: 20000,
      category: 'Makanan & Minuman',
      note: 'Nasi Goreng Gila',
      source: 'text',
    },
    // 4 hari lalu
    {
      id: 'tx-08',
      date: getPastDate(4, 14, 0),
      kind: 'expense',
      amount: 15000,
      category: 'Kuliah',
      note: 'Print & Jilid Makalah',
      source: 'text',
    },
    {
      id: 'tx-09',
      date: getPastDate(4, 20, 15),
      kind: 'expense',
      amount: 35000,
      category: 'Hiburan',
      note: 'Nongkrong Warkop',
      source: 'text',
    },
    // 5 hari lalu
    {
      id: 'tx-10',
      date: getPastDate(5, 11, 45),
      kind: 'expense',
      amount: 16000,
      category: 'Makanan & Minuman',
      note: 'Warteg Bahari',
      source: 'text',
    },
    {
      id: 'tx-11',
      date: getPastDate(5, 15, 30),
      kind: 'expense',
      amount: 50000,
      category: 'Pulsa & Internet',
      note: 'Paket Data By.U 20GB',
      source: 'text',
    },
    // 6 hari lalu
    {
      id: 'tx-12',
      date: getPastDate(6, 12, 15),
      kind: 'expense',
      amount: 25000,
      category: 'Makanan & Minuman',
      note: 'Mie Gacoan Level 3 + Es',
      source: 'text',
    },
    {
      id: 'tx-13',
      date: getPastDate(6, 18, 0),
      kind: 'expense',
      amount: 45000,
      category: 'Belanja',
      note: 'Sabun, Shampo & Odol',
      source: 'receipt',
    },
    // 7 hari lalu - Freelance Income
    {
      id: 'tx-14',
      date: getPastDate(7, 10, 0),
      kind: 'income',
      amount: 500000,
      category: 'Lainnya',
      note: 'Honor Freelance Desain Poster',
      source: 'text',
    },
    {
      id: 'tx-15',
      date: getPastDate(7, 13, 0),
      kind: 'expense',
      amount: 28000,
      category: 'Makanan & Minuman',
      note: 'Makan bareng teman',
      source: 'text',
    },
    // 8 hari lalu
    {
      id: 'tx-16',
      date: getPastDate(8, 11, 30),
      kind: 'expense',
      amount: 18000,
      category: 'Makanan & Minuman',
      note: 'Soto Ayam Lamongan',
      source: 'text',
    },
    {
      id: 'tx-17',
      date: getPastDate(8, 16, 45),
      kind: 'expense',
      amount: 14000,
      category: 'Transportasi',
      note: 'Gojek Stasiun ke Kampus',
      source: 'text',
    },
    // 9 hari lalu
    {
      id: 'tx-18',
      date: getPastDate(9, 12, 0),
      kind: 'expense',
      amount: 15000,
      category: 'Makanan & Minuman',
      note: 'Pecel Lele Mas Tri',
      source: 'text',
    },
    {
      id: 'tx-19',
      date: getPastDate(9, 15, 20),
      kind: 'expense',
      amount: 35000,
      category: 'Kuliah',
      note: 'Buku Modul Praktikum Lab',
      source: 'text',
    },
    // 10 hari lalu
    {
      id: 'tx-20',
      date: getPastDate(10, 13, 10),
      kind: 'expense',
      amount: 20000,
      category: 'Makanan & Minuman',
      note: 'Nasi Uduk Komplit',
      source: 'text',
    },
    {
      id: 'tx-21',
      date: getPastDate(10, 19, 0),
      kind: 'expense',
      amount: 50000,
      category: 'Hiburan',
      note: 'Tiket Bioskop XXI',
      source: 'text',
    },
    // 11 hari lalu
    {
      id: 'tx-22',
      date: getPastDate(11, 9, 30),
      kind: 'expense',
      amount: 12000,
      category: 'Makanan & Minuman',
      note: 'Lontong Sayur Padang',
      source: 'text',
    },
    {
      id: 'tx-23',
      date: getPastDate(11, 14, 0),
      kind: 'expense',
      amount: 15000,
      category: 'Transportasi',
      note: 'KRL Pulang Pergi',
      source: 'text',
    },
    // 12 hari lalu
    {
      id: 'tx-24',
      date: getPastDate(12, 12, 30),
      kind: 'expense',
      amount: 18000,
      category: 'Makanan & Minuman',
      note: 'Makan Siang Kantin',
      source: 'text',
    },
    {
      id: 'tx-25',
      date: getPastDate(12, 17, 30),
      kind: 'expense',
      amount: 60000,
      category: 'Belanja',
      note: 'Kaos Polos Katun',
      source: 'text',
    },
    // 13 hari lalu
    {
      id: 'tx-26',
      date: getPastDate(13, 11, 0),
      kind: 'expense',
      amount: 22000,
      category: 'Makanan & Minuman',
      note: 'Bakso Urat Malang',
      source: 'text',
    },
    {
      id: 'tx-27',
      date: getPastDate(13, 16, 0),
      kind: 'expense',
      amount: 25000,
      category: 'Kuliah',
      note: 'Fotokopi Diktat Kuliah',
      source: 'text',
    },
    // 14 hari lalu
    {
      id: 'tx-28',
      date: getPastDate(14, 12, 0),
      kind: 'expense',
      amount: 17000,
      category: 'Makanan & Minuman',
      note: 'Ayam Penyet Sambal Ijo',
      source: 'text',
    },
    // 16 hari lalu
    {
      id: 'tx-29',
      date: getPastDate(16, 13, 0),
      kind: 'expense',
      amount: 24000,
      category: 'Makanan & Minuman',
      note: 'Nasi Bebek Madura',
      source: 'text',
    },
    // 18 hari lalu
    {
      id: 'tx-30',
      date: getPastDate(18, 10, 0),
      kind: 'expense',
      amount: 30000,
      category: 'Transportasi',
      note: 'Isi Bensin Pertalite',
      source: 'text',
    },
    // 20 hari lalu
    {
      id: 'tx-31',
      date: getPastDate(20, 12, 0),
      kind: 'expense',
      amount: 20000,
      category: 'Makanan & Minuman',
      note: 'Nasi Kuning Komplit',
      source: 'text',
    },
  ];
}

export const INITIAL_REMINDERS: ReminderItem[] = [
  {
    id: 'rem-1',
    item: 'Earphone Bluetooth ANC',
    amount: 400000,
    dateCreated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'pending',
  },
];
