# ROUTES — Peta Semua Route Aktif PPEPD

Dokumen ini adalah referensi tunggal untuk semua route aktif: layout, akses role, visibilitas topbar, dan catatan implementasi.

**Sumber role & nav:** `app/composables/useRole.ts` → `NAV_ITEMS`
**Role tersedia:** `publik` · `pengelola` · `admin`

---

## Legenda

| Simbol | Arti |
|--------|------|
| ✓ | Tampil di topbar untuk role ini |
| — | Tidak di topbar (bisa diakses via URL atau link lain) |
| `publik` | Pengunjung umum, tanpa login |
| `pengelola` | Staf internal / operator dashboard |
| `admin` | Administrator sistem |

---

## 1. Halaman Publik

`/prodanau`: Portal Profil Danau Indonesia, layout default, profil navigasi prodanau, akses publik. Struktur navigasi diadaptasi dari situs PRODANAU, dengan tautan konten internal PPEPD. Dokumen kelembagaan belum terintegrasi; peta profil memerlukan akses internal.

`layout: default` — dapat diakses semua role.

| Route | File | Topbar | Deskripsi |
|-------|------|--------|-----------|
| `/` | `pages/index.vue` | publik+ | Beranda — hero, statistik, portal ekosistem, berita, edukasi |
| `/data` | `pages/data.vue` | publik+ | Katalog dataset (RAW & Statistic). Card/table view, search, pagination |
| `/regulasi` | `pages/regulasi/index.vue` | publik+ | Daftar regulasi per ekosistem. Tab: Mangrove / Danau / Mata Air |
| `/regulasi/[slug]` | `pages/regulasi/[slug].vue` | — | Detail satu regulasi |
| `/layanan` | `pages/layanan.vue` | publik+ | Layanan PPEPD |
| `/about` | `pages/about.vue` | publik+ | Profil, visi-misi, tugas dan fungsi Direktorat |
| `/zona-integritas` | `pages/zona-integritas.vue` | publik+ | Program zona integritas — 6 pilar |
| `/hubungi` | `pages/hubungi.vue` | publik+ | Form kontak dan info kantor |
| `/sitemap` | `pages/sitemap.vue` | — | Peta situs |

---

## 2. Berita, Edukasi & Konten

`layout: data` — dapat diakses publik, **tidak di topbar** (diakses via beranda atau tautan langsung).

| Route | File | Topbar | Deskripsi |
|-------|------|--------|-----------|
| `/berita-events` | `pages/berita-events/index.vue` | — | Daftar berita dan events. Tab: Berita / Events / Featured |
| `/berita-events/[slug]` | `pages/berita-events/[slug].vue` | — | Detail berita/event tunggal |
| `/edukasi` | `pages/edukasi/index.vue` | — | Daftar modul edukasi. Tab: Edukasi / Campaign |
| `/edukasi/[slug]` | `pages/edukasi/[slug].vue` | — | Detail modul edukasi tunggal |

> Jika perlu masuk topbar publik, tambahkan ke `NAV_ITEMS` di `useRole.ts` dengan `roles: ['publik', 'pengelola', 'admin']`.

---

## 3. Portal Ekosistem — Halaman Publik

`layout: default` — dapat diakses publik via beranda (PengelolaanGrid).
**Muncul di topbar hanya untuk `pengelola+`** sebagai shortcut navigasi cepat ke alat internal.

| Route | File | Topbar | Deskripsi |
|-------|------|--------|-----------|
| `/danau` | `pages/danau/index.vue` | pengelola+ | Portal danau — menu: Profil, Dashboard, Peta, Data, Regulasi |
| `/mangrove` | `pages/mangrove/index.vue` | pengelola+ | Portal mangrove |
| `/mataair` | `pages/mataair/index.vue` | pengelola+ | Portal mata air |
| `/permata` | `pages/permata.vue` | profil permata | Portal Perlindungan Mata Air; navigasi kontekstual Beranda, Artikel, Desa Peduli Sumber Air, Kebijakan, Sebaran Mata Air. Seluruh tautan konten internal PPEPD; peta publik belum terintegrasi; desain KLH/BPLH v2.1 |

---

## 4. Dashboard & Peta Internal

`/danau/profil`: Basis Data Profil Danau, layout default, middleware auth + dashboard, subaplikasi Manajemen Data Danau. Baca untuk dashboard.view, tulis hanya admin. Rincian: `docs/LAKE-PROFILES.md`. Berbeda dari peta `/danau/profil-danau`.

`/mataair/profil`: Basis Data Profil Mata Air, layout default, middleware auth + dashboard. Subaplikasi Manajemen Data Mata Air; baca untuk pemegang izin dashboard.view, tambah/ubah hanya admin. Rincian: `docs/SPRING-PROFILES.md`.

Pintu masuk dari `/apps` untuk danau dan mata air adalah `/danau/manajemen` dan `/mataair/manajemen`. Keduanya memakai layout default, middleware auth + dashboard, dan menampilkan Dashboard sebagai subaplikasi. Nama induk: Manajemen Data Danau dan Manajemen Data Mata Air.

`layout: map` (fullscreen, tanpa navbar/footer) — diakses melalui portal ekosistem, **tidak di topbar**.
Akses minimum: `pengelola`.

| Route | File | Topbar | Deskripsi |
|-------|------|--------|-----------|
| `/danau/dashboard` | `pages/danau/dashboard.vue` | — | Dashboard monitoring danau |
| `/danau/profil-danau` | `pages/danau/profil-danau.vue` | — | Peta profil danau interaktif (MapLibre). TOU overlay saat pertama dibuka |
| `/mangrove/dashboard` | `pages/mangrove/dashboard.vue` | — | Dashboard monitoring mangrove |
| `/mataair/dashboard` | `pages/mataair/dashboard.vue` | — | Dashboard monitoring mata air |

> Layout `map` adalah wrapper kosong `w-screen h-screen overflow-hidden`. Tidak ada navbar atau footer — appbar dirender langsung di halaman.

---

## 5. Admin

`layout: data` — **hanya `admin`**, tampil di topbar.

| Route | File | Topbar | Deskripsi |
|-------|------|--------|-----------|
| `/admin/share` | `pages/admin/share.vue` | admin | Kelola URL pendek: buat link, pantau klik, salin URL |

---

## 6. Sistem & Utilitas

- `/apps`: daftar aplikasi pengguna, pencarian dan pagination; middleware `auth`, layout default KLH/BPLH. Kartu ringkas: satu kolom mobile, dua tablet, tiga desktop; tanpa dock, jam, dan slot kosong.
- `/my-profiles`: pengaturan profil dan password; middleware `auth`, layout default. Login tanpa tujuan khusus mengarah ke `/apps`.

Tidak di topbar. Tidak ada role restriction — terbuka via URL langsung.

| Route | File | Layout | Deskripsi |
|-------|------|--------|-----------|
| `/s/[id]` | `pages/s/[id].vue` | `false` | Redirect URL pendek. Delay 6–10 detik lalu redirect ke tujuan. State: loading / redirect / not-found |
| `/link-tidak-ditemukan` | `pages/link-tidak-ditemukan.vue` | default | Fallback link tidak ditemukan. Query `?id=xxx` menampilkan ID yang dicoba |
| `/kontak` | `pages/kontak.vue` | — | Redirect permanen ke `/hubungi` via `definePageMeta({ redirect })` |
| `/[...slug]` | `pages/[...slug].vue` | default | Catch-all CMS — render dari `queryCollection('content')`. Throw 404 jika tidak ada |

---

## 7. Server API (Nitro)

Endpoint HTTP — bukan halaman Vue.

| Method | Path | File | Akses | Deskripsi |
|--------|------|------|-------|-----------|
| `GET` | `/api/s` | `server/api/s/index.get.ts` | admin | Daftar semua link pendek |
| `POST` | `/api/s` | `server/api/s/index.post.ts` | admin | Buat link pendek baru |
| `GET` | `/api/s/[id]` | `server/api/s/[id].get.ts` | publik | Ambil data satu link (dipanggil halaman `/s/[id]`) |

### Server Middleware

| Path | File | Fungsi |
|------|------|--------|
| `/s/*` | `server/middleware/s-redirect.ts` | Redirect ke `/link-tidak-ditemukan` untuk ID tidak ada; catat hit counter untuk ID valid; pass-through ke Vue SSR |

---

## 8. Tabel Ringkasan: Role × Topbar

| Route | publik | pengelola | admin |
|-------|:------:|:---------:|:-----:|
| `/` Beranda | ✓ | ✓ | ✓ |
| `/data` Data | ✓ | ✓ | ✓ |
| `/regulasi` Regulasi | ✓ | ✓ | ✓ |
| `/layanan` Layanan | ✓ | ✓ | ✓ |
| `/about` Tentang | ✓ | ✓ | ✓ |
| `/zona-integritas` Zona Integritas | ✓ | ✓ | ✓ |
| `/hubungi` Hubungi | ✓ | ✓ | ✓ |
| `/berita-events` | — | — | — |
| `/edukasi` | — | — | — |
| `/danau` Danau | — | ✓ | ✓ |
| `/mangrove` Mangrove | — | ✓ | ✓ |
| `/mataair` Mata Air | — | ✓ | ✓ |
| `/danau/dashboard` | — | — | — |
| `/danau/profil-danau` | — | — | — |
| `/mangrove/dashboard` | — | — | — |
| `/mataair/dashboard` | — | — | — |
| `/admin/share` Admin | — | — | ✓ |
| `/s/[id]` | — | — | — |
| `/link-tidak-ditemukan` | — | — | — |

---

## 9. Arsitektur Navigasi

```
app/composables/useRole.ts
  └── NAV_ITEMS[]           ← satu-satunya tempat mendefinisikan item nav + roles
        │
        └── useRole()
              └── visibleNav (computed)
                    │
                    ├── layouts/default.vue
                    │     ├── desktop nav  (hidden sm:flex, v-for visibleNav)
                    │     └── mobile drawer (sm:hidden, v-for visibleNav)
                    │
                    └── layouts/data.vue
                          ├── desktop nav  (hidden sm:flex, v-for visibleNav)
                          └── mobile drawer (sm:hidden, v-for visibleNav)
```

**Aturan:** Jangan pernah hardcode link navigasi di layout. Semua perubahan nav cukup di `NAV_ITEMS`.

---

## 10. Catatan Implementasi

- **Layout `map`** tidak punya topbar global — appbar dirender di dalam halaman masing-masing
- **Layout `data`** pakai `h-screen overflow-hidden` — jangan tambahkan scroll di `body`
- **`/kontak`** adalah alias redirect ke `/hubungi` — jangan duplikasi konten
- **Auth belum diimplementasi** — role saat ini selalu `publik` secara default. Lihat `docs/NAVIGATION.md` §Integrasi Auth untuk rencana implementasi
- **Dashboard & profil-danau** tidak ada route protection di sisi server — jika butuh guard, tambahkan middleware Nuxt di masing-masing halaman via `definePageMeta({ middleware: 'auth' })`
