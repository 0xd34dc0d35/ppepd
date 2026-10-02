# Style Guidelines — Design System KLH/BPLH v2.1

**Sumber tunggal:** Design System KLH/BPLH v2.1 (PT Bening Guru Semesta)
- 01 Fondasi — https://klh-project.vercel.app/docs/Design_System_KLH_BPLH_2.html
- 02 Komponen & Aset — https://klh-project.vercel.app/docs/Design_System_KLH_BPLH_2_Komponen.html
- 03 Standar Layout — https://klh-project.vercel.app/docs/Design_System_KLH_BPLH_2_Layout.html
- Snapshot offline (Okt 2026): `design/klh-design-system/`

Jika dokumen ini bertentangan dengan sumber di atas, **sumber yang menang**.
Status migrasi dan pemetaan token lama → baru: `design/DESIGN-MIGRATION.md`.

> Kelas legacy `brand-*`, `bg-*-gradient` dan font `Aptos` sudah **dihapus** dari config — tidak akan ter-render.
> `glass-card` & `gradient-text` masih ada sebagai alias kompatibilitas (kartu solid & teks hijau-700); kode baru pakai `klh-card` / `text-klh-green-700`.

---

## 1. Warna

Token didefinisikan sebagai CSS variable (kanal RGB) di `app/assets/css/main.css` dan
didaftarkan di `tailwind.config.js`. Modifier opasitas berfungsi: `bg-klh-green-600/10`.

### Skala brand (diekstrak dari lambang)

| Skala | Kelas Tailwind | Anchor logo | Peran |
|---|---|---|---|
| Hijau (primer) | `klh-green-50 … 900` | **600** `#005952` | Aksi & identitas: tombol utama, tautan aktif, header, fokus brand |
| Biru (sekunder) | `klh-blue-50 … 900` | **500** `#147DEF` | Informasi & data: tautan teks, visualisasi, tab aktif sekunder |
| Oranye (sekunder) | `klh-orange-50 … 900` | **500** `#F97910` | Sorotan & energi: aksen garis, penanda, CTA kampanye — **maks ±10% halaman** |

### Netral (bernuansa teal) & permukaan

| Kelas | Hex | Pemakaian |
|---|---|---|
| `ink-900` | `#10201D` | Teks utama, heading |
| `ink-700` | `#283835` | Teks sekunder kuat |
| `ink-500` | `#51625E` | Teks pendukung / keterangan |
| `ink-400` | `#75847F` | Meta, placeholder (jangan untuk teks isi) |
| `ink-300` | `#A6B2AE` | Ikon nonaktif, dekorasi |
| `line` / `line-strong` | `#E1E8E6` / `#C7D2CF` | Border kartu / border input |
| `surface` | `#FFFFFF` | Kartu, panel |
| `surface-2` / `surface-3` | `#F5F9F8` / `#EBF2F0` | Latar seksi sekunder, hover |
| `surface-bg` | `#F2F6F5` | Latar halaman (`body`) |

### Status semantik

Setiap status punya `DEFAULT` (teks/ikon), `-bg` (latar), `-line` (border):
`success` `#0E7A4E` · `warning` `#AE5104` · `danger` `#C03A2B` · `info` `#0B529D`.
Contoh alert: `bg-success-bg border border-success-line text-success`.

### Aturan kontras (WCAG 2.1 AA — wajib)

| Pasangan | Rasio | Status |
|---|---|---|
| Putih di atas `klh-green-600` | 8.23 : 1 | AAA |
| Putih di atas `klh-blue-600` | 5.65 : 1 | AA |
| `klh-orange-800` di atas `klh-orange-100` | 6.31 : 1 | AA |
| `klh-green-800` di atas `klh-green-100` | 11.5 : 1 | AAA |

- `klh-blue-500` (4.03:1) **hanya** untuk teks besar, ikon, grafik. Tombol/teks normal → `klh-blue-600`.
- **Oranye tidak pernah jadi latar teks putih.** Tombol oranye: `bg-klh-orange-500 text-[#3A1B02]`.
  Teks oranye di latar terang: `klh-orange-700` ke atas.
- Warna bukan satu-satunya pembawa makna — status selalu disertai ikon + label teks.

### Gradien yang diizinkan

- **Pita CTA / hero gelap:** hijau 700 → 900 (`bg-gradient-to-br from-klh-green-700 to-klh-green-900`) + motif leafmark opasitas .10–.20.
- Placeholder media `.ph`: gradien bertekstur titik (hijau / earth / sky / mist).
- Gradien lain (krem, mesh, oranye→oranye tua) **tidak dipakai lagi**.

---

## 2. Tipografi

| Peran | Font | Kelas |
|---|---|---|
| Judul | Plus Jakarta Sans | `font-display` |
| Isi | Inter | `font-body` |
| Data / kode / nomor tiket | JetBrains Mono | `font-mono` |

| Level | Ukuran / berat | Tailwind |
|---|---|---|
| Display | clamp(32px → 48px) / 800 | `font-display font-extrabold text-[clamp(2rem,1.4rem+2.6vw,3rem)] leading-[1.18]` |
| H1 | 32 / 700 | `font-display text-[2rem] font-bold leading-[1.18]` |
| H2 | 24 / 700 | `font-display text-2xl font-bold leading-[1.18]` |
| H3 | 20 / 700 | `font-display text-xl font-bold leading-[1.35]` |
| H4 | 17 / 700 | `font-display text-[1.0625rem] font-bold` |
| Body | 16 / 400 | `font-body text-base leading-[1.6]` |
| Small | 14 / 400 | `text-sm` |
| XS | 12 | `text-xs` |

- Berat maksimum heading **700** (display 800). `font-black` (900) tidak dipakai.
- Dasar 16px; harus tetap utuh saat teks diperbesar 200%.
- Panjang baris prosa 60–75 karakter → `max-w-prose` (720px).
- Satu `h1` per halaman, hierarki heading berurutan.

---

## 3. Spasi, Radius, Elevasi

- **Spasi:** kelipatan 4px — sesuai skala bawaan Tailwind (`1`=4px, `2`=8px, `4`=16px, `6`=24px, `8`=32px, `12`=48px, `16`=64px).
- **Radius** (DS → Tailwind): xs 4 → `rounded`, sm 8 → `rounded-lg`, md 12 → `rounded-xl`, lg 16 → `rounded-2xl`, xl 24 → `rounded-3xl`, pill → `rounded-full`.
  Kartu/panel memakai `rounded-2xl`; tombol & input `rounded-lg`.
- **Elevasi:** `shadow-klh-1` (kartu diam), `shadow-klh-2` (hover / dropdown), `shadow-klh-3` (modal, drawer).
  Bayangan bertint hijau tua — jangan pakai `shadow-lg`/`shadow-xl` bawaan.

---

## 4. Layout

| Konteks | Lebar maks | Kelas |
|---|---|---|
| Konten halaman publik | 1200px | `max-w-container mx-auto px-4 md:px-6` |
| Header situs | 1380px | `max-w-header` |
| Prosa artikel | 720px | `max-w-prose` |

**Breakpoint resmi** (sudah cocok dengan Tailwind bawaan):

| Rentang | Tailwind | Struktur |
|---|---|---|
| < 768 Mobile | (default) | Semua grid 1 kolom, padding seksi turun |
| 768–1023 Tablet | `md:` | Grid 3/4 → 2 kolom, panel sekunder dilepas |
| 1024–1279 Desktop | `lg:` | Tata letak utama penuh |
| ≥ 1280 Desktop luas | `xl:` | Seluruh panel tampil |

Titik minor yang diizinkan: 640 (`sm:` — kompresi kartu/stepper) dan 900. Selain itu jangan.

**Irama vertikal:** antar-seksi `py-16` (mobile `py-12`); judul seksi → konten `mb-8` (mobile `mb-6`);
gutter kartu `gap-6` (mobile `gap-4`); padding kartu `p-5`/`p-6` (mobile `p-4`).

**Template halaman** — setiap halaman harus salah satu dari: T1 Marketing, T2 Indeks + sidebar,
T3 Form stepper, T4 Auth split, T5 App shell, T6 Inbox, T7 Dashboard KPI.
Pemetaan halaman PPEPD ke template: `design/DESIGN-MIGRATION.md §4`.

---

## 5. Komponen inti (resep Tailwind)

```html
<!-- Tombol -->
<button class="btn bg-klh-green-600 hover:bg-klh-green-700 text-white">Aksi Utama</button>
<button class="btn bg-klh-blue-600 hover:bg-klh-blue-700 text-white">Aksi Biru</button>
<button class="btn bg-klh-orange-500 hover:bg-klh-orange-400 text-[#3A1B02]">CTA Kampanye</button>
<button class="btn bg-klh-green-100 hover:bg-klh-green-200 text-klh-green-700">Sekunder</button>
<button class="btn bg-surface border border-line-strong text-ink-700 hover:border-klh-green-600 hover:text-klh-green-700">Outline</button>
<button class="btn text-klh-green-700 hover:bg-klh-green-100">Ghost</button>
<button class="btn bg-danger text-white">Hapus</button>
<!-- Kelas tersedia di app/assets/css/main.css: .btn + .btn-primary|blue|orange|secondary|outline|ghost|danger, .btn-sm|lg
     Contoh ringkas: <NuxtLink class="btn btn-primary"> · <button class="btn btn-outline btn-sm"> -->

<!-- Input formulir (label wajib terhubung via for/id; error via aria-invalid="true") -->
<label for="nama" class="text-sm font-semibold text-ink-700">Nama</label>
<input id="nama" class="klh-input">

<!-- Kartu -->
<article class="klh-card p-6">

<!-- Badge status (selalu ikon + teks) -->
<span class="inline-flex items-center gap-1 rounded-full bg-success-bg text-success border border-success-line px-2.5 py-0.5 text-xs font-semibold">Selesai</span>

<!-- Tautan teks -->
<a class="text-klh-blue-600 hover:underline">
```

### Komponen kerangka (`app/components/klh/`)

| Komponen | Pakai di | Catatan |
|---|---|---|
| `<KlhSiteHeader>` | layout `default`, `data`, dashboard peta | Utility bar + navbar sub-brand + drawer. Slot `#actions` untuk CTA halaman. Menulis `--klh-header-h` |
| `<KlhSiteFooter>` | layout | Footer instansi 4 kolom; `compact` = baris bawah saja |
| `<KlhA11yToolbar>` | di dalam header | Kontras tinggi (`html[data-contrast=high]`) & perbesar teks, tersimpan di `localStorage` |
| `<KlhAuthShell>` | `/login`, `/register` | Template T4; prop `title`, `message` |
| `<KlhLeafmark>` | hero gelap, footer, pita CTA | Dekoratif, `aria-hidden`, opasitas .08–.20 |

Halaman setinggi viewport (katalog, beranda) memakai `h-[calc(100dvh-var(--klh-header-h))]` — jangan menulis tinggi header secara manual.

---

## 6. Ikon

- Ikon garis, `currentColor`, ukuran 24 (`icon`), 18 (`icon--sm`), 32 (`icon--lg`).
- Ikon fungsional wajib `aria-label`; ikon dekoratif `aria-hidden="true"`.
- **Dilarang emoji sebagai ikon.**
- Status tidak boleh disampaikan lewat ikon/warna saja — selalu dampingi teks.

---

## 7. Aksesibilitas (checklist wajib sebelum halaman dianggap selesai)

- [ ] Kontras teks ≥ 4.5:1 (normal), ≥ 3:1 (besar)
- [ ] Semua interaksi bisa diakses keyboard, urutan fokus logis
- [ ] Fokus terlihat: outline biru 3px via `:focus-visible` (`klh-blue-500`, offset 2px)
- [ ] Tautan "Lewati ke konten utama" ada di layout
- [ ] Menghormati `prefers-reduced-motion`
- [ ] Reflow 320px & teks 200% tanpa kehilangan konten
- [ ] Nol overflow horizontal di 390px (`document.scrollWidth ≤ 390`)
- [ ] Target sentuh ≥ 44×44px (termasuk tombol tutup drawer, chip filter)
- [ ] Drawer/panel: fokus masuk panel, `Esc` menutup, scrim bisa diklik
- [ ] Urutan konten = urutan DOM (tanpa `order` yang memutus urutan baca)
- [ ] `[hidden]{display:none!important}` dihormati
- [ ] Diverifikasi di viewport 1440px **dan** 390px
