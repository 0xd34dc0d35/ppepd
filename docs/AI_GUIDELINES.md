# AI Guidelines — PPEPD

Dokumen ini adalah referensi utama AI untuk memahami arsitektur, konvensi, dan aturan kerja proyek ini.

---

## Ringkasan Proyek

**SIPPEM** — Sistem Informasi Perlindungan dan Pengelolaan Ekosistem Perairan Darat  
Dikelola oleh **Direktorat PPEPD**, Kementerian Lingkungan Hidup / Badan Perlindungan Lingkungan Hidup (KLH/BPLH).

Stack: **Nuxt 3** · **Vue 3 Composition API** · **Tailwind CSS** · **TypeScript**

---

## Struktur Direktori

```
app/
├── pages/           ← halaman (route otomatis Nuxt)
├── layouts/         ← wrapper halaman (default, data, map)
├── components/      ← komponen reusable
├── composables/     ← logika reaktif (useRole, useShare)
└── assets/          ← aset statis

docs/               ← panduan dan spesifikasi
design/             ← user story dan desain halaman

public/             ← file publik (ppepd-data.json, gambar)
server/
├── api/            ← endpoint API (H3/Nitro)
├── middleware/     ← middleware server
├── utils/          ← helper server
└── data/           ← data store JSON (redirects.json)
```

---

## Layout

| Layout | File | Digunakan oleh |
|--------|------|----------------|
| `default` | `app/layouts/default.vue` | Hampir semua halaman publik |
| `data` | `app/layouts/data.vue` | `/data`, `/admin/share` — full-height, tanpa scroll body |
| `map` | `app/layouts/map.vue` | `/danau/profil-danau`, dashboard peta — fullscreen |

**Perbedaan kritis layout:**
- `default`: scroll normal, footer lengkap, container `px-6 py-12`
- `data`: `h-screen overflow-hidden`, konten mengisi viewport, pagination internal
- `map`: wrapper kosong `w-screen h-screen overflow-hidden` — tidak ada navbar, tidak ada footer

---

## Halaman & Routes

### Publik

| Route | File | Layout | Keterangan |
|-------|------|--------|------------|
| `/` | `pages/index.vue` | default | Beranda utama |
| `/data` | `pages/data.vue` | data | Katalog dataset (RAW & Statistic) |
| `/regulasi` | `pages/regulasi/index.vue` | default | Daftar regulasi |
| `/regulasi/[slug]` | `pages/regulasi/[slug].vue` | default | Detail regulasi |
| `/layanan` | `pages/layanan.vue` | default | Layanan PPEPD |
| `/about` | `pages/about.vue` | default | Tentang organisasi |
| `/zona-integritas` | `pages/zona-integritas.vue` | default | Zona integritas |
| `/hubungi` | `pages/hubungi.vue` | default | Halaman kontak |
| `/berita-events` | `pages/berita-events/index.vue` | default | Daftar berita & event |
| `/berita-events/[slug]` | `pages/berita-events/[slug].vue` | default | Detail berita/event |
| `/edukasi` | `pages/edukasi/index.vue` | default | Daftar modul edukasi |
| `/edukasi/[slug]` | `pages/edukasi/[slug].vue` | default | Detail modul edukasi |
| `/danau` | `pages/danau/index.vue` | default | Portal Ekosistem Danau |
| `/mangrove` | `pages/mangrove/index.vue` | default | Portal Ekosistem Mangrove |
| `/mataair` | `pages/mataair/index.vue` | default | Portal Mata Air |
| `/sitemap` | `pages/sitemap.vue` | default | Peta situs |

### Internal / Pengelola

| Route | File | Layout | Keterangan |
|-------|------|--------|------------|
| `/danau/dashboard` | `pages/danau/dashboard.vue` | map | Dashboard monitoring danau |
| `/danau/profil-danau` | `pages/danau/profil-danau.vue` | map | Peta profil danau (MapLibre) |
| `/mangrove/dashboard` | `pages/mangrove/dashboard.vue` | map | Dashboard monitoring mangrove |
| `/mataair/dashboard` | `pages/mataair/dashboard.vue` | map | Dashboard monitoring mata air |

### Admin

| Route | File | Layout | Keterangan |
|-------|------|--------|------------|
| `/admin/share` | `pages/admin/share.vue` | data | Kelola URL pendek |

### Sistem

| Route | File | Keterangan |
|-------|------|------------|
| `/s/[id]` | `pages/s/[id].vue` | Redirect URL pendek (tunggu 6–10 detik lalu redirect) |
| `/link-tidak-ditemukan` | `pages/link-tidak-ditemukan.vue` | Fallback 404 link |

---

## Navigasi Berbasis Role

Lihat `docs/NAVIGATION.md` untuk spesifikasi lengkap dan `app/composables/useRole.ts` untuk implementasi.

**Roles:** `publik` · `pengelola` · `admin`

Semua item nav didefinisikan satu tempat di `useRole.ts` — **jangan** hardcode link di layout.  
Kedua layout (`default.vue` dan `data.vue`) mengambil nav dari `visibleNav` composable.

---

## Komponen

| Komponen | Keterangan |
|----------|------------|
| `DataCard.vue` | Card dataset di `/data` (card view). Props: `item` (termasuk `views`) |
| `DataSkeleton.vue` | Skeleton loading untuk DataCard |
| `DataTableRow.vue` | Baris tabel di `/data` (table view) |
| `BeritaEventsCard.vue` | Card berita/event |
| `BeritaEvents.vue` | Section berita di beranda |
| `EdukasiCard.vue` | Card modul edukasi |
| `EdukasiSection.vue` | Section edukasi di beranda (carousel) |
| `FeatureGrid.vue` | Grid fitur unggulan di beranda |
| `PengelolaanGrid.vue` | Grid ekosistem (Danau, Mangrove, Mata Air) |
| `ServiceLinks.vue` | Link layanan cepat |
| `Hero.vue` | Hero section beranda |
| `MapLibre.vue` | Komponen peta MapLibre (reusable, props: config) |
| `SiteMap.vue` | Komponen sitemap (dipakai di footer default) |
| `Counter.vue` | Angka animasi counter |
| `Alert.vue` | Komponen notifikasi/pesan |

---

## Composables

| File | Ekspor | Keterangan |
|------|--------|------------|
| `useRole.ts` | `useRole()`, `NAV_ITEMS`, `UserRole`, `NavItem` | Role pengguna & nav yang terlihat |
| `useShare.ts` | `useShare()` | Buat & salin URL pendek (`/s/{id}`) |

---

## Data & API

### Katalog Data
- **File:** `public/ppepd-data.json`
- **Schema:** `{ id, type, title, year, image, author, views, metadata: { format, category, size, tags[] } }`
- `type`: `'raw'` atau `'statistic'`

### URL Pendek (Share)
- **Store:** `server/data/redirects.json`
- **API:** `GET/POST /api/s` · `GET /api/s/[id]`
- **Composable:** `useShare()` — `createShareLink(url, title)`, `copyShareLink(url, title)`
- Dokumentasi lengkap: `design/PAGE-S.md`

---

## Konvensi Penting

### Styling
- Selalu pakai **color tokens** (`brand-green`, `brand-cream`, dst.) — jangan pakai hex langsung di template
- Referensi lengkap: `docs/STYLE_GUIDELINES.md`

### Terminologi
- Nama resmi organisasi: **Direktorat Perlindungan dan Pengelolaan Ekosistem Perairan Darat**
- Domain resmi: `kemenlh.go.id` (bukan `menlhk.go.id`)
- Singkatan resmi: `docs/DEFINISI.md`

### Navigasi
- **Satu sumber kebenaran:** `app/composables/useRole.ts` → `NAV_ITEMS`
- Tambah/hapus item nav hanya di `NAV_ITEMS` — tidak perlu ubah layout
- Role default: `publik` (tanpa login)

### Berita
- Sinkronisasi dengan file fisik di `d:\KontenWeb`
- Gambar dipilih acak jika ada lebih dari 1; dikompres sebelum dimuat

### Layout `data`
- Tidak ada scroll di `body` — scroll hanya di `#data-scroll-area`
- Toolbar (search, tab, toggle view) ada di `header` yang `flex-shrink-0`
- Konten area: `flex-grow overflow-y-auto`

---

## File Desain

| File | Isi |
|------|-----|
| `design/PAGE-DATA.md` | Spesifikasi halaman Katalog Data |
| `design/PAGE-S.md` | Spesifikasi sistem URL pendek |
| `design/PAGE-PROFILDANAU.md` | Spesifikasi halaman Profil Danau (peta) |
| `design/index/PAGE.md` | Spesifikasi section Edukasi di beranda |
