# Basis Data Profil Mata Air

Subaplikasi `/mataair/profil`, diakses melalui `/mataair/manajemen`. Desain KLH/BPLH, kartu responsif, pencarian nama/lokasi, pagination 15 profil, detail serta formulir tambah/ubah. Formulir dan detail tampil sebagai bagian langsung di halaman, tanpa dialog atau overlay. Bagian tersebut menerima fokus saat dibuka dan memakai scroll halaman pada desktop maupun mobile.

Data: nama, provinsi, kabupaten/kota, desa/kelurahan, latitude/longitude berpasangan, debit liter/detik (opsional), status aktif/tidak aktif, catatan. Timestamp dan pelaku perubahan disimpan server. Data awal kosong, tanpa data contoh. Tidak ada penghapusan; profil dapat dinonaktifkan.

API `/api/management/spring-profiles`: GET daftar dengan query search/page, POST tambah, PATCH ubah dengan id dan updated_at untuk mencegah penimpaan perubahan pengguna lain. Semua endpoint memakai sesi, izin dashboard.view, perlindungan same-origin, dan validasi server. Hanya role admin boleh menulis; pengelola dengan izin dashboard.view dapat membaca. Produksi tanpa localManagement mengembalikan 404; tidak ada fallback ke API eksternal yang belum tersedia.

File mode: koleksi springs di store.json. PostgreSQL mode: tabel `<managementSchema>.<managementTablePrefix>spring_profiles` (UUID dan dokumen JSONB), dibuat idempotent mengikuti initializer manajemen. Transaksi dan advisory lock mengikuti penyimpanan manajemen yang sudah ada. Tambah/ubah dicatat dalam audit. Penyimpanan saat ini memuat koleksi untuk filter/pagination; dataset besar perlu kueri SQL langsung dan indeks pencarian.
