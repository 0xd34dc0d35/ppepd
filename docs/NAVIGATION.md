# Navigasi Berbasis Role

Spesifikasi item topbar yang ditampilkan sesuai role pengguna yang mengakses.

---

## Implementasi

**Sumber tunggal:** `app/composables/useRole.ts`  
**Dipakai oleh:** `app/layouts/default.vue` dan `app/layouts/data.vue`

```ts
const { visibleNav } = useRole()
// visibleNav → NavItem[] yang sesuai dengan role aktif
```

Untuk menambah atau mengubah item nav, cukup edit array `NAV_ITEMS` di `useRole.ts`.  
Kedua layout akan otomatis mengikuti — tidak perlu ubah template.

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

Kedua layout (desktop nav + mobile drawer) akan langsung menampilkan item baru sesuai role.

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
