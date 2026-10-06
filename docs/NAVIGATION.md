# Navigasi Berbasis Role

## Profil navigasi halaman

Profil `prodanau` pada `/prodanau` mengikuti menu sumber PRODANAU: Beranda, Tentang, Danau Prioritas, Peta Sebaran, Kebijakan, Kelembagaan, Kontak. Desktop menampilkan empat pertama dan tiga sisanya dalam Lainnya; mobile menampilkan semua dalam drawer. Tujuan konten memakai layanan internal PPEPD.

Bar desktop PPEPD menampilkan Beranda, Data, Layanan, Tentang, dan tombol Lainnya. Publikasi, Regulasi, Zona Integritas, Hubungi serta shortcut pengelola/admin berada dalam Lainnya sesuai izin yang sama dari `useRole`. Pada ponsel seluruh menu tetap dapat diakses lewat drawer. Menu PERMATA tetap menggunakan lima menu portal.

Header menggunakan `useSiteNavigation.ts`. Halaman biasa memakai profil PPEPD dan menu berbasis role dari `useRole.ts`. Halaman portal dapat menetapkan `definePageMeta({ navigation: 'permata' })` untuk memakai identitas dan menu PERMATA yang sama pada desktop dan mobile. Menu portal didefinisikan terpusat dalam `PERMATA_NAV`; tautan konten tetap di dalam PPEPD. Navigasi anchor menutup drawer dan menandai item aktif berdasarkan hash URL. Profil saat ini berupa konfigurasi proyek, belum berupa pengaturan yang dapat diedit melalui panel admin.

Spesifikasi item topbar yang ditampilkan sesuai role pengguna yang mengakses.

---

## Implementasi

**Sumber tunggal:** `app/composables/useRole.ts`  
**Dipakai oleh:** `app/components/klh/SiteHeader.vue` (header bersama layout `default`, `data`, dan dashboard peta)

```ts
const { visibleNav } = useRole()
// visibleNav → NavItem[] yang sesuai dengan role aktif
```

Untuk menambah atau mengubah item nav, cukup edit array `NAV_ITEMS` di `useRole.ts`.  
Semua halaman yang memakai header akan otomatis mengikuti — tidak perlu ubah template.

---

## Role

| Role | Deskripsi | Status Auth |
|------|-----------|-------------|
| `publik` | Pengunjung umum, tanpa login | Default (tanpa autentikasi) |
| `pengelola` | Staf internal / operator dashboard | Memerlukan login (belum diimplementasi) |
| `admin` | Administrator sistem | Memerlukan login (belum diimplementasi) |

> **Catatan:** Saat ini `role` di-set ke `publik` secara statis di `useState`. Ganti nilai awal ini dengan hasil session/token autentikasi ketika sistem auth ditambahkan.

---

## Item Navigasi per Role

| Label | Route | publik | pengelola | admin |
|-------|-------|:------:|:---------:|:-----:|
| Beranda | `/` | ✓ | ✓ | ✓ |
| Data | `/data` | ✓ | ✓ | ✓ |
| Regulasi | `/regulasi` | ✓ | ✓ | ✓ |
| Layanan | `/layanan` | ✓ | ✓ | ✓ |
| Tentang | `/about` | ✓ | ✓ | ✓ |
| Zona Integritas | `/zona-integritas` | ✓ | ✓ | ✓ |
| Hubungi | `/hubungi` | ✓ | ✓ | ✓ |
| Danau | `/danau` | — | ✓ | ✓ |
| Mangrove | `/mangrove` | — | ✓ | ✓ |
| Mata Air | `/mataair` | — | ✓ | ✓ |
| Admin | `/admin/share` | — | — | ✓ |

---

## Alasan Pemisahan

| Grup | Role Minimum | Alasan |
|------|-------------|--------|
| Beranda s/d Hubungi | `publik` | Konten publik — terbuka untuk semua pengunjung |
| Danau, Mangrove, Mata Air | `pengelola` | Portal ekosistem berisi alat monitoring internal (dashboard, peta) yang tidak relevan untuk publik umum |
| Admin | `admin` | Halaman pengelolaan sistem (URL shortener, konfigurasi) — akses terbatas administrator |

---

## Menambah Role Baru

1. Tambah tipe ke `UserRole` di `useRole.ts`:
   ```ts
   export type UserRole = 'publik' | 'pengelola' | 'admin' | 'operator'
   ```
2. Tambah role ke array `roles` item yang relevan di `NAV_ITEMS`
3. Pastikan setter role (`setRole`) dipanggil dengan nilai yang benar dari sistem auth

---

## Menambah Item Nav Baru

Edit `NAV_ITEMS` di `app/composables/useRole.ts`:

```ts
{ label: 'Label Baru', to: '/route-baru', roles: ['pengelola', 'admin'] }
```

Header (tautan desktop ≥1280px + drawer mobile) akan langsung menampilkan item baru sesuai role.

---

## Integrasi Auth (Rencana)

Ketika sistem autentikasi ditambahkan, ubah baris ini di `useRole.ts`:

```ts
// Sebelum (hardcoded)
const role = useState<UserRole>('userRole', () => 'publik')

// Sesudah (dari session)
const { session } = useAuth()
const role = useState<UserRole>('userRole', () => session.value?.role ?? 'publik')
```

Tidak ada perubahan lain yang diperlukan di layout atau komponen.
