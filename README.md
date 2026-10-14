# FinMinder: Prototipe Frontend Asisten Keuangan Mahasiswa

**FinMinder** adalah prototipe asisten finansial interaktif berbasis chat WhatsApp yang dirancang khusus untuk mahasiswa. Solusi ini menyelesaikan kecemasan keuangan mahasiswa bukan dengan sekadar pencatat uang pasif, melainkan dengan menghitung **Daya Tahan Saldo** (berapa hari sanggup bertahan jika kiriman uang saku terlambat atau terjadi krisis), **Nudge Anggaran Proaktif**, dan fitur **Cek Sebelum Beli**.

---

## 🚀 Cara Menjalankan Proyek

Pastikan Node.js (>= 18) telah terpasang di komputer Anda.

```bash
# 1. Pindah ke direktori dev
cd dev

# 2. Pasang dependensi
npm install

# 3. Jalankan server pengembangan lokal
npm run dev

# 4. Uji kompilasi & build produksi
npm run build
```

Buka peramban di URL yang ditampilkan oleh Vite (biasanya `http://localhost:5173`).

---

## 🧭 Panduan Rute & Navigasi

| Rute | Halaman | Deskripsi |
|---|---|---|
| `/` | **Landing Page** | Menjelaskan *value proposition*, 4 langkah alur kerja, dan cuplikan visual produk. |
| `/demo` | **Simulator Chat WhatsApp** | **Layar Utama.** Pengalaman interaktif bot WhatsApp lengkap dengan bingkai ponsel (*PhoneFrame*), chip cepat, dan panel *Di Balik Layar*. |
| `/dashboard` | **Dashboard Web Refleksi** | Analisis komprehensif: Kartu Daya Tahan, Distribusi Kategori (Donut Chart), Tren Pengeluaran Harian (Line/Area Chart), Tren Runway, Simulator Skenario Krisis, Riwayat Transaksi (Ubah/Hapus), dan Pengaturan Privasi. |

---

## 🎬 Skenario Skrip Demo (Durasi < 3 Menit)

Gunakan alur demonstrasi berikut saat presentasi di hadapan juri:

1. **Buka `/demo`** → Klik tombol **"Pakai Profil Contoh"** di pojok kanan atas atau tombol **"Lewati, pakai profil contoh"** pada chat untuk langsung mengaktifkan profil realistis *Mahasiswa Rantau* (Saldo Rp1,8jt, Pemasukan Rp3jt, Tagihan Rp1jt, ~30 transaksi historis).
2. **Kirim "ngopi 25rb"** lewat kolom input teks chat → Bot membalas instan: *"Tercatat: ngopi, Rp25.000 (Makanan & Minuman). Sisa anggaran hari ini Rp41.667."* (Menunjukkan *frictionless entry* dan parser deterministik tanpa LLM).
3. **Klik chip `📷 Foto nota`** (atau tombol ikon kamera di kiri input) → Muncul gelembung foto struk minimarket → Bot menampilkan **Kartu Draf Transaksi** (*Minimarket, Rp47.500, Belanja*) → Klik tombol **[Simpan]**.
4. **Klik chip `Stress-Test`** → Pilih skenario **"Uang saku terlambat"** → Bot menampilkan **Kartu Hasil Stress-Test** dengan skor Daya Tahan **23 hari (● Aman)** dan tips penghematan esensial.
5. **Ketik pesan "kalau beli earphone 400rb gimana?"** → Bot menampilkan **Kartu Cek Sebelum Beli**:
   - Daya tahan berubah: **23 hari (Aman) ──▶ 17 hari (Waspada) (−6 hari)**
   - Ekuivalensi: **Setara 16× makan siang di warteg**.
   - Klik tombol **[Tunda 3 hari]** → Bot membalas suportif dan pengingat otomatis tersimpan di panel *Di Balik Layar*.
6. **Buka panel "Di Balik Layar"** → Klik tombol **⏭ Simulasikan akhir minggu** → Muncul **Kartu Ringkasan Mingguan** di chat → Klik tombol **[Buka Dashboard Lengkap]**.
7. **Di halaman Dashboard (`/dashboard`)**:
   - Tunjukkan **Kartu Daya Tahan** yang tersinkronisasi sempurna (*single source of truth*).
   - Tunjukkan grafik interaktif Recharts: Donut Distribusi Kategori & Area Chart batas anggaran harian.
   - Pada tabel transaksi, klik ikon **Hapus** pada salah satu transaksi → Angka daya tahan langsung bertambah naik secara *real-time*, dan muncul notifikasi Toast **"Urungkan"** selama 5 detik.

---

## ⚙️ Arsitektur & Prinsip Desain

- **Isolasi Mesin Daya Tahan (`src/lib/runway.ts`)**:
  Fungsi murni `computeRunway(profile, transactions, scenario)` sepenuhnya terisolasi dan diberi komentar `// STUB: ganti dengan rumus final tim`. Mengganti logika di file ini tidak akan merusak komponen lain.
- **Parser Deterministik (`src/lib/parser.ts`)**:
  Mengekstrak nominal rupiah (`25rb`, `18k`, `1.5jt`, `dua puluh lima ribu`), kategori (`Makanan & Minuman`, `Transportasi`, dll.), dan maksud kueri pengguna tanpa ketergantungan API pihak ketiga.
- **Zustand Store Bersatu (`src/store/useStore.ts`)**:
  Satu store sentral untuk profil, transaksi, chat, dan pengingat dengan persistensi opsional ke `localStorage`.
- **Independensi Merek**:
  Tampilan chat terinspirasi dari WhatsApp UX (gelembung, centang dua, indikator mengetik), namun menggunakan identitas visual dan palet warna FinMinder murni tanpa logo/merek pihak ketiga.
- **Aksesibilitas & Etika**:
  Setiap layar menyertakan penanda halus *"Prototipe: data simulasi"* dan *footer* edukatif *"FinMinder bersifat informatif, bukan nasihat keuangan."*
