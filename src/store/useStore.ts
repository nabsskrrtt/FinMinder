import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  Profile,
  Transaction,
  ChatMessage,
  ReminderItem,
  RunwayResult,
  Scenario,
  Category,
  MAX_NUDGE_PER_DAY,
} from '../config';
import { ParseResult } from '../lib/parser';
import { computeRunway } from '../lib/runway';
import { INITIAL_PROFILE, generateSeedTransactions, INITIAL_REMINDERS } from '../data/seed';
import { formatTime } from '../lib/format';

export interface AppState {
  profile: Profile;
  transactions: Transaction[];
  messages: ChatMessage[];
  reminders: ReminderItem[];
  nudgeCountToday: number;
  lastParsed: ParseResult | null;
  activeQuickReplies: string[];
  onboardingStep: number;
  deletedTxTemp: Transaction | null;
  toastMessage: string | null;

  // Actions
  setProfile: (updates: Partial<Profile>) => void;
  addTransaction: (tx: Omit<Transaction, 'id' | 'date'> & { id?: string; date?: string }) => Transaction;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  removeTransaction: (id: string) => void;
  undoRemove: () => void;
  clearUndo: () => void;
  setToast: (msg: string | null) => void;
  pushMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'> & { id?: string; timestamp?: string }) => ChatMessage;
  updateMessage: (id: string, updates: Partial<ChatMessage>) => void;
  addReminder: (item: string, amount: number) => void;
  setLastParsed: (parsed: ParseResult | null) => void;
  setQuickReplies: (chips: string[]) => void;
  setOnboardingStep: (step: number) => void;
  incrementNudge: () => void;
  resetAll: () => void;
  loadSampleProfile: () => void;

  // Derived selectors
  currentBalance: () => number;
  spentToday: () => number;
  spentThisWeek: () => number;
  runway: (scenario?: Scenario) => RunwayResult;
  avgLunchExpense: () => number;
}

const DEFAULT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-init-1',
    sender: 'bot',
    timestamp: formatTime(new Date(Date.now() - 3 * 60 * 1000)),
    text: 'Halo! Aku FinMinder, asisten keuangan WhatsApp-mu.',
  },
  {
    id: 'msg-init-2',
    sender: 'bot',
    timestamp: formatTime(new Date(Date.now() - 2 * 60 * 1000)),
    text: 'Tugasku bantu kamu catat pengeluaran instan, hitung daya tahan saldo jika krisis, dan cek sebelum beli.',
  },
  {
    id: 'msg-init-consent',
    sender: 'bot',
    timestamp: formatTime(new Date(Date.now() - 1 * 60 * 1000)),
    type: 'consent',
  },
];

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      profile: INITIAL_PROFILE,
      transactions: generateSeedTransactions(),
      messages: DEFAULT_MESSAGES,
      reminders: INITIAL_REMINDERS,
      nudgeCountToday: 0,
      lastParsed: null,
      activeQuickReplies: [
        '🎙 Kirim voice',
        '📷 Foto nota',
        'Stress-Test',
        'Cek Sebelum Beli',
        'Ringkasan minggu ini',
      ],
      onboardingStep: 5, // 5 = completed (default sample state)
      deletedTxTemp: null,
      toastMessage: null,

      setProfile: (updates) =>
        set((state) => {
          const newProfile = { ...state.profile, ...updates };
          // Otomatis hitung ulang dailyBudget
          newProfile.dailyBudget = Math.max(
            0,
            Math.round((newProfile.monthlyIncome - newProfile.fixedBills) / 30)
          );
          return { profile: newProfile };
        }),

      addTransaction: (txData) => {
        const id = txData.id || `tx-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
        const date = txData.date || new Date().toISOString();
        const newTx: Transaction = {
          ...txData,
          id,
          date,
        };

        set((state) => ({
          transactions: [newTx, ...state.transactions],
        }));

        return newTx;
      },

      updateTransaction: (id, updates) => {
        set((state) => ({
          transactions: state.transactions.map((tx) =>
            tx.id === id ? { ...tx, ...updates } : tx
          ),
        }));
      },

      removeTransaction: (id) => {
        const state = get();
        const target = state.transactions.find((t) => t.id === id);
        if (target) {
          set({
            deletedTxTemp: target,
            toastMessage: `Transaksi "${target.note}" dihapus`,
            transactions: state.transactions.filter((t) => t.id !== id),
          });
        }
      },

      undoRemove: () => {
        const target = get().deletedTxTemp;
        if (target) {
          set((state) => ({
            transactions: [target, ...state.transactions],
            deletedTxTemp: null,
            toastMessage: 'Transaksi berhasil dipulihkan',
          }));
        }
      },

      clearUndo: () => set({ deletedTxTemp: null, toastMessage: null }),

      setToast: (msg) => set({ toastMessage: msg }),

      pushMessage: (msgData) => {
        const id = msgData.id || `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
        const timestamp = msgData.timestamp || formatTime();
        const newMsg: ChatMessage = {
          ...msgData,
          id,
          timestamp,
        };

        set((state) => ({
          messages: [...state.messages, newMsg],
        }));

        return newMsg;
      },

      updateMessage: (id, updates) => {
        set((state) => ({
          messages: state.messages.map((m) =>
            m.id === id ? { ...m, ...updates } : m
          ),
        }));
      },

      addReminder: (item, amount) => {
        const now = new Date();
        const due = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000); // 3 hari lagi
        const newReminder: ReminderItem = {
          id: `rem-${Date.now()}`,
          item,
          amount,
          dateCreated: now.toISOString(),
          dueDate: due.toISOString(),
          status: 'pending',
        };

        set((state) => ({
          reminders: [newReminder, ...state.reminders],
        }));
      },

      setLastParsed: (parsed) => set({ lastParsed: parsed }),

      setQuickReplies: (chips) => set({ activeQuickReplies: chips }),

      setOnboardingStep: (step) => set({ onboardingStep: step }),

      incrementNudge: () =>
        set((state) => ({
          nudgeCountToday: Math.min(MAX_NUDGE_PER_DAY, state.nudgeCountToday + 1),
        })),

      resetAll: () => {
        set({
          profile: {
            monthlyIncome: 2500000,
            fixedBills: 800000,
            startingBalance: 1200000,
            dailyBudget: Math.round((2500000 - 800000) / 30),
            consentGiven: false,
          },
          transactions: [],
          messages: [
            {
              id: 'msg-fresh-1',
              sender: 'bot',
              timestamp: formatTime(),
              text: 'Halo! Aku FinMinder, asisten keuangan WhatsApp-mu.',
            },
            {
              id: 'msg-fresh-2',
              sender: 'bot',
              timestamp: formatTime(),
              text: 'Tugasku bantu kamu mencatat keuangan tanpa ribet, mengecek daya tahan saldo, dan memberikan pertimbangan sebelum beli.',
            },
            {
              id: 'msg-fresh-consent',
              sender: 'bot',
              timestamp: formatTime(),
              type: 'consent',
            },
          ],
          reminders: [],
          nudgeCountToday: 0,
          lastParsed: null,
          activeQuickReplies: ['Saya setuju', 'Lewati, pakai profil contoh'],
          onboardingStep: 1,
          deletedTxTemp: null,
          toastMessage: null,
        });
      },

      loadSampleProfile: () => {
        set({
          profile: INITIAL_PROFILE,
          transactions: generateSeedTransactions(),
          messages: [
            {
              id: 'msg-s-1',
              sender: 'bot',
              timestamp: '09:00',
              text: 'Halo! Aku FinMinder, asisten keuangan WhatsApp-mu.',
            },
            {
              id: 'msg-s-2',
              sender: 'bot',
              timestamp: '09:01',
              text: 'Profil contoh mahasiswa rantau aktif! Saldo awal Rp1.800.000, pemasukan Rp3.000.000, tagihan tetap Rp1.000.000.',
            },
            {
              id: 'msg-s-3',
              sender: 'bot',
              timestamp: '09:02',
              text: 'Siap! Coba kirim catatan pertamamu, misalnya "ngopi 25rb" atau klik chip simulasi di bawah.',
            },
          ],
          reminders: INITIAL_REMINDERS,
          nudgeCountToday: 0,
          lastParsed: {
            kind: 'expense',
            amount: 25000,
            category: 'Makanan & Minuman',
            note: 'ngopi',
            confidence: 0.95,
          },
          activeQuickReplies: [
            '🎙 Kirim voice',
            '📷 Foto nota',
            'Stress-Test',
            'Cek Sebelum Beli',
            'Ringkasan minggu ini',
          ],
          onboardingStep: 5,
          deletedTxTemp: null,
          toastMessage: 'Profil contoh mahasiswa berhasil dimuat',
        });
      },

      // Selectors
      currentBalance: () => {
        const { profile, transactions } = get();
        const totalIncome = transactions
          .filter((t) => t.kind === 'income')
          .reduce((sum, t) => sum + t.amount, 0);
        const totalExpense = transactions
          .filter((t) => t.kind === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);
        return profile.startingBalance + totalIncome - totalExpense;
      },

      spentToday: () => {
        const { transactions } = get();
        const todayStr = new Date().toDateString();
        return transactions
          .filter(
            (t) =>
              t.kind === 'expense' &&
              new Date(t.date).toDateString() === todayStr
          )
          .reduce((sum, t) => sum + t.amount, 0);
      },

      spentThisWeek: () => {
        const { transactions } = get();
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return transactions
          .filter(
            (t) =>
              t.kind === 'expense' && new Date(t.date) >= sevenDaysAgo
          )
          .reduce((sum, t) => sum + t.amount, 0);
      },

      runway: (scenario) => {
        const { profile, transactions } = get();
        return computeRunway(profile, transactions, scenario);
      },

      avgLunchExpense: () => {
        const { transactions } = get();
        const foodExpenses = transactions.filter(
          (t) => t.kind === 'expense' && t.category === 'Makanan & Minuman'
        );
        if (foodExpenses.length === 0) return 20000;
        const total = foodExpenses.reduce((sum, t) => sum + t.amount, 0);
        return Math.max(10000, Math.round(total / foodExpenses.length));
      },
    }),
    {
      name: 'finminder_storage_v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        profile: state.profile,
        transactions: state.transactions,
        messages: state.messages,
        reminders: state.reminders,
        onboardingStep: state.onboardingStep,
      }),
    }
  )
);
