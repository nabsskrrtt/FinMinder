import React from 'react';
import { Link } from 'react-router-dom';
import {
  MessageSquare,
  ShieldCheck,
  Scale,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Lock,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { RunwayGauge } from '../components/RunwayGauge';
import { Footer } from '../components/Footer';

export const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-surface flex flex-col justify-between selection:bg-brand-100 selection:text-brand-900">
      {/* Top Banner Penanda Prototipe */}
      <div className="bg-brand-900 text-brand-100 text-[11px] font-medium py-1.5 px-4 text-center tracking-wide">
        ✨ <strong>Prototipe: data simulasi</strong> — Dibuat untuk demonstrasi asisten finansial mahasiswa
      </div>

      {/* Top Navbar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-ink-100 sticky top-0 z-30 px-4 sm:px-8 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/logo.png" alt="FinMinder" className="w-8 h-8 rounded-xl object-contain shadow-2xs" />
            <span className="font-extrabold text-base tracking-tight text-ink-900">FinMinder</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="text-xs font-semibold text-ink-600 hover:text-ink-900 transition-colors">
              Dashboard
            </Link>
            <Link to="/demo" className="text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white px-3.5 py-1.5 rounded-full transition-all shadow-xs">
              Coba Demo
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-16 space-y-20 sm:space-y-28">
        {/* HERO SECTION */}
        <section className="text-center space-y-6 sm:space-y-8 max-w-3xl mx-auto pt-4">
          <div className="flex flex-col items-center gap-3">
            <img
              src="/logo.png"
              alt="FinMinder Logo"
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-contain shadow-card border border-ink-100 animate-in zoom-in-95 duration-200"
            />
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold shadow-2xs">
              <Sparkles className="w-4 h-4 text-brand-600" />
              <span>Asisten Keuangan WhatsApp untuk Mahasiswa</span>
            </div>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-ink-900 tracking-tight leading-[1.15]">
            Catat sambil chat,{' '}
            <span className="bg-gradient-to-r from-brand-600 via-teal-600 to-emerald-600 bg-clip-text text-transparent">
              siap sebelum krisis.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-ink-700 leading-relaxed max-w-2xl mx-auto font-normal">
            Bukan sekadar pencatat uang. FinMinder langsung menghitung berapa hari saldomu sanggup bertahan jika uang saku terlambat atau laptop mendadak rusak.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/demo"
              className="w-full sm:w-auto px-8 py-3.5 bg-brand-600 hover:bg-brand-700 active:scale-98 text-white rounded-button text-sm sm:text-base font-bold transition-all shadow-md hover:shadow-brand-600/25 flex items-center justify-center gap-2"
            >
              <span>Coba Demo Simulator</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-7 py-3.5 bg-card hover:bg-ink-100 active:scale-98 text-ink-800 border border-ink-300 rounded-button text-sm sm:text-base font-semibold transition-all flex items-center justify-center gap-2 shadow-2xs"
            >
              <span>Lihat Dashboard Web</span>
            </Link>
          </div>
        </section>

        {/* 3 NILAI UTAMA (KARTU) */}
        <section className="space-y-6">
          <div className="text-center max-w-md mx-auto space-y-1">
            <h2 className="text-2xl font-bold text-ink-900">Kenapa FinMinder Berbeda?</h2>
            <p className="text-xs text-ink-500">Tiga keunggulan utama dalam genggaman chat sehari-hari</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Card 1 */}
            <div className="bg-card rounded-card p-6 border border-ink-100 shadow-soft hover:border-brand-200 transition-all hover:shadow-card space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-brand-600 flex items-center justify-center">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-ink-900">Catat Tanpa Ribet</h3>
              <p className="text-xs sm:text-sm text-ink-600 leading-relaxed">
                Ketik seperti chat biasa (misal: <em>"ngopi 25rb"</em>), kirim voice note, atau foto nota belanjaan. Ekstraksi otomatis tanpa formulir rumit.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-card rounded-card p-6 border border-ink-100 shadow-soft hover:border-brand-200 transition-all hover:shadow-card space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-ink-900">Tahu Berapa Hari Kamu Bertahan</h3>
              <p className="text-xs sm:text-sm text-ink-600 leading-relaxed">
                Skor <strong>Daya Tahan</strong> memberi tahu secara akurat berapa hari saldo mampu menopang kebutuhan esensial dan tagihan bulananmu.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-card rounded-card p-6 border border-ink-100 shadow-soft hover:border-brand-200 transition-all hover:shadow-card space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Scale className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-ink-900">Pikir Dulu Sebelum Beli</h3>
              <p className="text-xs sm:text-sm text-ink-600 leading-relaxed">
                Cek sebelum checkout: bot menghitung penurunan daya tahan (contoh: 23 hari turun ke 17 hari) dan mengonversinya ke porsi makan siang.
              </p>
            </div>
          </div>
        </section>

        {/* CARA KERJA (4 LANGKAH) */}
        <section className="bg-card rounded-card p-6 sm:p-10 border border-ink-100 shadow-soft space-y-8">
          <div className="text-center max-w-md mx-auto space-y-1">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
              Langkah Sederhana
            </span>
            <h2 className="text-2xl font-bold text-ink-900">Cara Kerja FinMinder</h2>
            <p className="text-xs text-ink-500">Dari pesan santai hingga keputusan finansial yang matang</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Step 1 */}
            <div className="space-y-2 bg-surface p-4 rounded-xl border border-ink-100 relative">
              <div className="w-8 h-8 rounded-full bg-brand-600 text-white font-bold text-xs flex items-center justify-center">
                1
              </div>
              <h4 className="text-sm font-bold text-ink-900">Kirim Pesan</h4>
              <p className="text-xs text-ink-600 leading-relaxed">
                Ketik teks biasa, kirim rekaman suara, atau unggah foto struk minimarket.
              </p>
            </div>

            {/* Step 2 */}
            <div className="space-y-2 bg-surface p-4 rounded-xl border border-ink-100 relative">
              <div className="w-8 h-8 rounded-full bg-brand-600 text-white font-bold text-xs flex items-center justify-center">
                2
              </div>
              <h4 className="text-sm font-bold text-ink-900">AI Mencatat</h4>
              <p className="text-xs text-ink-600 leading-relaxed">
                Ekstraksi instan mengenali nominal, kategori, dan sisa anggaran harianmu.
              </p>
            </div>

            {/* Step 3 */}
            <div className="space-y-2 bg-surface p-4 rounded-xl border border-ink-100 relative">
              <div className="w-8 h-8 rounded-full bg-brand-600 text-white font-bold text-xs flex items-center justify-center">
                3
              </div>
              <h4 className="text-sm font-bold text-ink-900">Lihat Daya Tahan</h4>
              <p className="text-xs text-ink-600 leading-relaxed">
                Ketahui estimasi ketahanan saldo jika kiriman bulanan terlambat datang.
              </p>
            </div>

            {/* Step 4 */}
            <div className="space-y-2 bg-surface p-4 rounded-xl border border-ink-100 relative">
              <div className="w-8 h-8 rounded-full bg-brand-600 text-white font-bold text-xs flex items-center justify-center">
                4
              </div>
              <h4 className="text-sm font-bold text-ink-900">Putuskan Lebih Bijak</h4>
              <p className="text-xs text-ink-600 leading-relaxed">
                Uji skenario darurat dan jalankan Cek Sebelum Beli tanpa rasa was-was.
              </p>
            </div>
          </div>
        </section>

        {/* CUPLIKAN VISUAL (PRATINJAU STATIS) */}
        <section className="space-y-6">
          <div className="text-center max-w-md mx-auto space-y-1">
            <h2 className="text-2xl font-bold text-ink-900">Pratinjau Pengalaman Pengguna</h2>
            <p className="text-xs text-ink-500">Tampilan intuitif bot dan kartu interaktif daya tahan</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Pratinjau Chat */}
            <div className="bg-chatBg p-4 sm:p-6 rounded-card border border-ink-200/80 shadow-soft space-y-3 font-sans">
              <div className="flex items-center gap-2 pb-2 border-b border-ink-200/50">
                <img
                  src="/logo.png"
                  alt="FinMinder Logo"
                  className="w-7 h-7 rounded-full object-cover bg-white border border-brand-200 shadow-2xs"
                />
                <div>
                  <div className="text-xs font-bold text-ink-900">FinMinder Bot</div>
                  <div className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                    online
                  </div>
                </div>
              </div>

              {/* Chat bubbles preview */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-end">
                  <div className="bg-bubbleUser px-3 py-1.5 rounded-bubble rounded-tr-xs shadow-2xs max-w-[80%] text-ink-900">
                    ngopi 25rb
                    <span className="text-[10px] text-ink-500 block text-right mt-0.5">14:02 ✓✓</span>
                  </div>
                </div>

                <div className="flex justify-start">
                  <div className="bg-bubbleBot px-3 py-1.5 rounded-bubble rounded-tl-xs shadow-2xs max-w-[80%] text-ink-900 border border-ink-100">
                    Tercatat: ngopi, Rp25.000 (Makanan & Minuman).
                    <br />
                    Sisa anggaran hari ini Rp41.667.
                    <span className="text-[10px] text-ink-500 block text-right mt-0.5">14:02</span>
                  </div>
                </div>

                <div className="flex justify-end">
                  <div className="bg-bubbleUser px-3 py-1.5 rounded-bubble rounded-tr-xs shadow-2xs max-w-[80%] text-ink-900">
                    kalau beli earphone 400rb gimana?
                    <span className="text-[10px] text-ink-500 block text-right mt-0.5">14:03 ✓✓</span>
                  </div>
                </div>

                <div className="flex justify-start">
                  <div className="bg-white p-3 rounded-card border border-brand-200 shadow-soft max-w-[90%] text-ink-900 space-y-2">
                    <div className="font-bold text-[11px] text-brand-700">Cek Sebelum Beli: Earphone (Rp400.000)</div>
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-emerald-700">23 hari (Aman)</span>
                      <span>──▶</span>
                      <span className="text-amber-700">17 hari (Waspada)</span>
                    </div>
                    <p className="text-[10px] text-amber-800 bg-amber-50 p-1.5 rounded">
                      Setara 16× makan siang di warteg.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pratinjau Gauge Daya Tahan */}
            <div className="bg-card p-6 sm:p-8 rounded-card border border-ink-100 shadow-soft space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-ink-500 uppercase tracking-wider">
                  Metrik Utama
                </span>
                <StatusBadge status="safe" size="md" />
              </div>

              <RunwayGauge days={23} status="safe" variant="full" />

              <div className="pt-2">
                <Link
                  to="/demo"
                  className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-button text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <span>Mulai Demo Interaktif</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA BANNER */}
        <section className="bg-gradient-to-br from-brand-900 via-teal-900 to-ink-900 text-white p-8 sm:p-12 rounded-card text-center space-y-5 shadow-xl relative overflow-hidden">
          <div className="relative z-10 space-y-3 max-w-xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Siap Menjaga Keuangan Mahasiswa?
            </h3>
            <p className="text-xs sm:text-sm text-teal-100 leading-relaxed">
              Jalankan simulasi skenario, catat pengeluaran harian tanpa repot, dan rasakan ketenangan finansial.
            </p>
            <div className="pt-3">
              <Link
                to="/demo"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-500 hover:bg-brand-400 active:scale-95 text-ink-950 font-bold text-sm rounded-button transition-all shadow-lg"
              >
                <span>Buka Demo Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};
