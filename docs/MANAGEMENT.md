# Manajemen akun, role, dan hak akses (development)

## Mencoba di dev

1. Jalankan `npm run db:tunnel` pada terminal pertama dan masukkan password SSH saat diminta. Biarkan terminal ini berjalan.
2. Jalankan `npm run db:check` untuk memastikan koneksi database.
3. Jalankan `npm run dev` pada terminal kedua. Dev PPEPD ada di **http://localhost:3003**.
4. Buka `/admin/system` dari komputer yang menjalankan server.
5. Buat administrator pertama dengan username, nama, dan password minimal 12 karakter.
6. Tambahkan akun melalui tab **Akun pengguna**, kemudian coba login di jendela browser terpisah.
7. Atur izin Pengelola/Pengguna melalui tab **Role & hak akses**. Tab **Log aktivitas** menampilkan riwayat autentikasi dan perubahan.

Tidak ada akun atau password bawaan. Setup ditutup setelah akun pertama dibuat. Registrasi publik dinonaktifkan dalam mode lokal; administrator membuat akun. `/account/security` tersedia untuk mengganti password sendiri.

Halaman `/my-profiles` memiliki bagian **Aplikasi** dan **Profil & password**. Pengguna dapat memperbarui nama, instansi, dan organisasi. Username serta email hanya ditampilkan sebagai read-only. `PATCH /api/management/auth/profile` menggunakan whitelist field; permintaan yang menyertakan email, username, role, atau kolom lain ditolak server. Perubahan profil langsung memperbarui state pengguna dan dicatat pada log aktivitas. Penggantian password memerlukan password saat ini dan mencabut sesi pada perangkat lain.

## Ruang lingkup

Backend akun berjalan di Nitro pada `/api/management/*`. Login, logout, pemulihan sesi, serta daftar aplikasi `/my-profiles` memakai backend lokal saat `runtimeConfig.public.localManagement` aktif. Default aktif di development, nonaktif pada build production. Override menggunakan `NUXT_PUBLIC_LOCAL_MANAGEMENT=true/false`.

Berita, publikasi, analitik, serta URL pendek masih menggunakan API eksternal. Akun lokal tidak menjadi akun backend eksternal dan sesi lokal tidak memberikan izin ke layanan tersebut. Katalog data tetap berasal dari JSON publik. Tahap ini tidak memigrasikan konten, akun lama, atau penyimpanan layanan eksternal.

## Akun dan role

- Administrator memiliki semua izin. Hak akses role ini tetap.
- Pengelola default mendapat portal, profil, dan dashboard ekosistem.
- Pengguna (`publik`) default mendapat portal dan profil.
- Admin dapat mengatur matriks izin dua role lainnya. Hanya admin dapat memberi/mengubah role admin atau mengubah kebijakan role.
- Pemilik akun tidak dapat menonaktifkan atau mengganti role sendiri; server mempertahankan minimal satu admin aktif.
- Akun dinonaktifkan, bukan dihapus, agar riwayat tetap dapat ditelusuri.
- Perubahan role, penonaktifan akun, reset password, dan perubahan matriks izin mencabut sesi terkait.
- Middleware melindungi dashboard ekosistem dalam mode lokal. Portal dan katalog publik tetap terbuka untuk pengunjung dan tidak termasuk matriks izin internal.
- Izin `profile.view` mengatur `/my-profiles`; keamanan akun tetap dapat diakses pengguna login.
- Menu manajemen administrator menuju `/admin/system`. Pengguna dengan izin manajemen yang didelegasikan dapat masuk melalui daftar aplikasi pada profil.

## Penyimpanan dan sesi

Env dev sekarang menggunakan **PostgreSQL** (`NUXT_MANAGEMENT_STORAGE=postgres`) melalui `NUXT_MANAGEMENT_DATABASE_URL`, konfigurasi server privat. Kredensial hanya berada di `.env` yang diabaikan Git; `.env.example` berisi contoh tanpa password nyata. Database dev adalah `ppepd_dev`, role aplikasi `ppepd_dev`, schema `ppepd_management`.

Instance khusus berada di server SSH `prodanau@prodanau`: container `ppepd-postgres`, PostgreSQL 16, port **127.0.0.1:5434**, volume `ppepd-postgres-data`. Dev mengaksesnya melalui SSH tunnel **127.0.0.1:15434 → prodanau:127.0.0.1:5434**. Port tidak dipublikasikan ke jaringan. Compose dan kredensial owner berada di `~/ppepd-postgres` pada server; role aplikasi bukan superuser dan hanya memiliki schema aplikasinya. Database lama tetap terpisah.

Tabel `roles`, `users`, `sessions`, `audit`, dan `metadata` dibuat otomatis pada schema yang sudah disiapkan. Username unik, sesi mereferensikan akun, dan perubahan disimpan dalam transaksi dengan advisory lock agar aman antarworker. Data profil dan izin memakai JSONB; password hash memiliki kolom tersendiri. Operasi baca/tulis dibatch untuk mengurangi perjalanan jaringan melalui tunnel.

Pada akses PostgreSQL pertama, data legacy `.data/management/store.json` diimpor satu kali jika tabel akun masih kosong. Akun/password serta riwayat dipertahankan, tetapi sesi dicabut agar pengguna masuk kembali. File legacy tidak dihapus. Jika koneksi PostgreSQL gagal, API mengembalikan 503 dan **tidak beralih diam-diam ke file lokal**.

Password di-hash dengan scrypt dan salt acak per akun. Sesi menggunakan token acak; server hanya menyimpan hash token. Cookie `ppepd_session` bersifat HttpOnly, SameSite Strict, berlaku 8 jam, dan Secure jika request memakai HTTPS. Token tidak dikirim dalam respons login.

Mode file (`NUXT_MANAGEMENT_STORAGE=file`) tetap tersedia untuk pengujian terisolasi. Mode tersebut memakai penulisan file atomik dan ditujukan untuk satu proses. Penggunaan production tetap membutuhkan HTTPS/proxy terpercaya dan pembatasan login terdistribusi; deployment portal production belum diubah oleh penyiapan database dev ini.

Untuk backup manual di server, jalankan `~/ppepd-postgres/backup.sh`. Dump berformat custom dibuat di `~/ppepd-postgres/backups` dengan izin privat. Jadwal backup otomatis belum diaktifkan. Untuk menyiapkan ulang pada volume kosong, jalankan compose lalu alirkan file privat `init.sql` ke `docker exec -i ppepd-postgres psql -U ppepd_owner -d ppepd_dev`; script ini hanya untuk inisialisasi pertama, bukan untuk database yang sudah terisi.

Login dibatasi 10 kegagalan per alamat koneksi selama 15 menit. Jika worker dev tidak menyediakan alamat koneksi, pembatas berlaku bersama untuk semua klien dev. Pembatasnya dalam memori dan kembali kosong ketika proses restart. Setup memerlukan koneksi loopback; worker development Nuxt yang tidak menyediakan alamat koneksi memakai host loopback sebagai fallback. Karena itu jalankan dev dengan `--host 127.0.0.1`, seperti instruksi di atas, dan jangan mengekspos setup ke jaringan. Header IP dari klien tidak dipercaya. Semua penulisan API memerlukan JSON, dan Origin browser harus sama dengan origin server.

Riwayat menyimpan hingga 1.000 aktivitas; panel menampilkan 200 terbaru. Password, hash password, serta token sesi tidak ditampilkan di API pengguna atau log.

## Endpoint

| Endpoint | Akses |
|---|---|
| `GET /status` | Publik; hanya status setup |
| `POST /setup` | Loopback, sebelum akun pertama tersedia |
| `POST /auth/login` | Publik, dibatasi percobaan |
| `GET /auth/me`, `POST /auth/logout`, `POST /auth/password` | Sesi pengguna; logout idempotent |
| `GET /app` | `profile.view` |
| `GET /overview` | Salah satu izin manajemen |
| `GET/POST /users` | `users.manage` |
| `PATCH /users/:id` | `users.manage`; proteksi administrator |
| `POST /users/:id/password`, `POST /users/:id/sessions` | `users.manage`; proteksi administrator |
| `PATCH /roles/:id` | `roles.manage` dan role admin; admin tidak dapat diubah |
| `GET /audit` | `audit.view` |

Semua endpoint pada tabel berawalan `/api/management`.

## Verifikasi

`npm run test:management` memakai file sementara. `npm run test:management:postgres` memakai PostgreSQL yang disetel di `.env`, dengan tabel berawalan acak `test_...` di schema PPEPD. Server uji terpisah berjalan di port 3101; tabel fixture dibersihkan setelah pengujian tanpa menyentuh tabel akun dev. Pengujian mencakup setup, login/logout, cookie, hak akses, perlindungan admin, perubahan role, pencabutan sesi, reset password, validasi input, Origin, dan pembatasan login.
# Halaman pengguna dan navigasi

- `/my-profiles`: aplikasi sesuai izin, profil pribadi, dan perubahan password.
- `/admin/system`: manajemen akun dan log aktivitas sesuai izin.
- `/admin/roles`: matriks izin tiga role bawaan; membaca memerlukan `roles.manage`, menyimpan tetap khusus administrator. Hak akses administrator tidak dapat diubah.
- `/dokumentasi`: panduan pengguna yang sudah masuk, dengan bagian administrasi mengikuti izin akun.

Komponen `AccountNavigation` menghubungkan halaman tersebut dan menyembunyikan tautan administrasi yang tidak diizinkan. Pembatasan halaman dan API tetap berlaku meskipun URL dibuka langsung. Perubahan role mencabut sesi pengguna role terkait. Pengaturan roles mendukung penyimpanan per role dan pembatalan pilihan yang belum disimpan.
