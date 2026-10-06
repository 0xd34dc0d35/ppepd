# Basis Data Profil Danau

Subaplikasi `/danau/profil` di Manajemen Data Danau (`/danau/manajemen`). Terpisah dari halaman peta publik `/danau/profil-danau`.

Memuat nama, provinsi, kabupaten/kota, desa/kelurahan, koordinat berpasangan, luas permukaan (ha), kedalaman maksimum (meter), volume air (m³), status aktif/tidak aktif dan catatan. Koordinat dan ukuran opsional; angka tidak boleh negatif. Nama/provinsi/kabupaten wajib diisi. Status menandai keaktifan catatan, bukan penilaian kesehatan ekosistem.

Daftar menggunakan pencarian nama/lokasi dan pagination 15 profil. Detail dan formulir tambah/ubah tampil langsung di halaman, tanpa dialog atau overlay, pada desktop maupun mobile. Pengguna dengan dashboard.view boleh membaca; hanya admin boleh menulis. Server memvalidasi masukan, memeriksa same-origin, mencatat audit, serta menolak perubahan dengan updated_at lama. Tidak ada penghapusan permanen.

API: GET/POST/PATCH `/api/management/lake-profiles`. File mode: koleksi lakes pada store.json. PostgreSQL: tabel `<managementSchema>.<managementTablePrefix>lake_profiles`, dibuat idempotent oleh initializer manajemen. Transaksi mengikuti advisory lock manajemen. Data awal kosong; tidak menyalin data contoh dashboard. Memerlukan localManagement; produksi tanpa sistem manajemen lokal tidak menyediakan endpoint ini. Untuk data besar, filter/pagination koleksi perlu diganti kueri SQL terindeks.
