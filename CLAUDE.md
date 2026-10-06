# PPEPD — Panduan untuk AI

## Formulir input

Semua input pengguna harus berada langsung di halaman atau halaman formulir khusus, bukan dialog, modal, drawer, atau bottom sheet. Berlaku untuk desktop dan mobile. Gunakan scroll halaman, label yang terhubung, target sentuh minimal 44px, serta tombol simpan/batal yang jelas. Dialog informasi tanpa input dan drawer navigasi tidak termasuk formulir input.

## Lingkungan development

- Server development PPEPD berada di **http://localhost:3003** (port 3000 dipakai aplikasi lain).
- Gunakan alamat tersebut untuk membuka dan memeriksa perubahan di dev, termasuk `/login` dan `/admin/system`.
- `https://ppepd.kemenlh.go.id` adalah lingkungan produksi, bukan server dev.
- Database manajemen dev: PostgreSQL khusus PPEPD di server SSH `prodanau@prodanau`, bind `127.0.0.1:5434`, database/role aplikasi `ppepd_dev`.
- Koneksi dev memakai SSH tunnel lokal `127.0.0.1:15434` ke port server 5434. Jalankan `npm run db:tunnel`, lalu `npm run db:check` sebelum dev.
- Env privat ada di `.env`; jangan menampilkan atau memasukkan kredensial ke Git. Panduan ada di `docs/MANAGEMENT.md`.

Semua guidelines ada di folder `docs/`:

| File | Isi |
|---|---|
| `docs/AI_GUIDELINES.md` | Arsitektur proyek, halaman, komponen, konvensi |
| `docs/NAVIGATION.md` | Role-based nav — item topbar per role, cara tambah item/role |
| `docs/STYLE_GUIDELINES.md` | **Design System KLH/BPLH v2.1** — token warna, tipografi, layout, komponen, checklist a11y |
| `docs/DEFINISI.md` | Terminologi dan singkatan resmi |

Folder `design/` berisi detail desain dan user story:

| File | Isi |
|---|---|
| `design/DESIGN-MIGRATION.md` | Rencana & status migrasi ke DS KLH/BPLH v2.1, pemetaan token lama→baru, keputusan terbuka |
| `design/klh-design-system/` | Snapshot offline dokumen DS v2.1 (Fondasi, Komponen, Layout) + ikon `cil-*` |
| `design/ROUTES.md` | **Peta semua route aktif** — layout, role akses, visibilitas topbar |
| `design/PAGE-DATA.md` | Spesifikasi halaman Katalog Data |
| `design/PAGE-S.md` | Spesifikasi sistem URL pendek |
| `design/PAGE-PROFILDANAU.md` | Spesifikasi halaman Profil Danau (peta) |
| `design/index/PAGE.md` | Spesifikasi section Edukasi di beranda |

# Pembuatan Berita
Untuk membuat berita maka harus melakukan sinkronisasi dengan file fisik yang terdapat pada folder d:\KontenWeb
kemudian cocokan dengan katalo
- jika tidak tersedia sesuai sumber, maka buat berita baru
- jika pada folder tersedia gambar 1 atau lebih maka dipilih random salah 1
- gambar sebelum dimuat di kompresi agar lebih ringan di web
