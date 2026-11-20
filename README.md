# 🌟 My Start Page

Halaman start page pribadi yang dibuat dengan HTML, CSS, dan JavaScript murni — tanpa framework, tanpa library tambahan. Bisa langsung dibuka di browser.

---

## ✨ Fitur

### 🕐 Greeting & Live Clock
- Sapaan otomatis berdasarkan waktu (**Good morning / afternoon / evening / night**)
- Jam dan tanggal yang update setiap detik secara real-time
- Nama pengguna kustom yang tersimpan di localStorage

### ⏱ Focus Timer (Pomodoro)
- Timer hitung mundur default **25 menit**
- Tombol **Start**, **Stop (pause)**, dan **Reset**
- Animasi pulse saat timer berjalan
- Notifikasi alert ketika waktu habis

### ✅ To-Do List
- Tambah, edit, dan hapus task
- Centang task sebagai selesai (dengan efek strikethrough)
- Data tersimpan otomatis di **localStorage** (tidak hilang saat refresh)

### 🔗 Quick Links
- Simpan link favorit dengan label kustom
- Klik untuk membuka di tab baru
- Tombol hapus per link
- Auto-prefix `https://` jika user lupa mengetiknya

---

## 🏆 Challenges (Semua 5 Selesai)

| # | Challenge | Status |
|---|-----------|--------|
| 1 | Light / Dark mode toggle | ✅ |
| 2 | Custom name di greeting | ✅ |
| 3 | Ubah durasi Pomodoro | ✅ |
| 4 | Cegah task duplikat | ✅ |
| 5 | Sort / urutkan task | ✅ |

---

## 📁 Struktur File

```
qayzan/
├── index.html       — Struktur HTML halaman utama
├── style.css        — Semua styling (dark/light theme, komponen, responsive)
├── app.js           — Logika JavaScript (timer, to-do, links, localStorage)
├── .gitattributes   — Konfigurasi Git line endings
└── README.md        — Dokumentasi project ini
```

---

## 🚀 Cara Menjalankan

1. Clone atau download repository ini
2. Buka file `index.html` langsung di browser (tidak perlu server)
3. Atau buka dengan Live Server di VS Code untuk auto-reload saat edit

```bash
# Jika pakai Git:
git clone https://github.com/username/qayzan.git
cd qayzan
# Buka index.html di browser
```

---

## 🛠 Teknologi

| Teknologi | Keterangan |
|-----------|-----------|
| HTML5 | Struktur semantik, accessible (aria-label, aria-hidden) |
| CSS3 | Custom properties (variables), Grid, Flexbox, animasi |
| JavaScript (ES6+) | Vanilla JS, localStorage, DOM manipulation |

---

## 🎨 Tampilan

- **Dark mode** (default) dengan warna ungu sebagai aksen
- **Light mode** tersedia via tombol toggle di pojok kanan atas
- Desain responsif — tampil baik di desktop maupun mobile
- Font: Segoe UI / system-ui

---

## 💾 Penyimpanan Data

Semua data disimpan di **localStorage** browser, meliputi:

- `userName` — nama pengguna
- `theme` — preferensi dark/light mode
- `pomDuration` — durasi Pomodoro terakhir
- `tasks` — daftar semua task
- `links` — daftar quick links

Data tidak akan hilang saat halaman di-refresh, namun akan hilang jika cache browser dibersihkan.

---

## 📄 Lisensi

Project ini dibuat untuk keperluan belajar dan bebas digunakan.
