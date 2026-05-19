# Sistem Informasi PPEPD

Aplikasi web resmi **Direktorat Perlindungan dan Pengelolaan Ekosistem Perairan Darat (PPEPD)**, Deputi Bidang Tata Lingkungan dan Sumber Daya Alam Berkelanjutan, **Kementerian Lingkungan Hidup/Badan Perlindungan Lingkungan Hidup**.

## Tentang

Portal informasi publik yang menyajikan data, berita, edukasi, dan layanan terkait perlindungan dan pengelolaan ekosistem perairan darat — mencakup danau, mata air, dan ekosistem perairan lainnya di Indonesia.

**Fitur utama:**
- Profil dan data danau nasional dengan visualisasi peta (MapLibre GL)
- Data mata air
- Berita dan agenda kegiatan
- Konten edukasi
- Informasi layanan dan zona integritas

## Teknologi

- **Framework:** [Nuxt 4](https://nuxt.com)
- **Konten:** [@nuxt/content](https://content.nuxt.com)
- **Styling:** Tailwind CSS
- **Peta:** MapLibre GL
- **Database:** better-sqlite3
- **Versi:** 1.0.0

## Pengembangan

Install dependensi:

```bash
npm install
```

Jalankan server development di `http://localhost:3000`:

```bash
npm run dev
```

## Build & Deployment

Build untuk production:

```bash
npm run build
```

Preview hasil build:

```bash
npm run preview
```

Untuk panduan deployment lengkap, lihat [dokumentasi deployment Nuxt](https://nuxt.com/docs/getting-started/deployment).
