# Dashboard mangrove PPEPD

Route: `/mangrove/dashboard`. Akses tetap mengikuti middleware `dashboard` yang sudah ada.

## Sumber bersama SI-PPEM

- Frontend meminta `/api/mangrove/catalog` pada origin PPEPD.
- Endpoint Nitro membaca katalog publik anonim `${runtimeConfig.public.apiBase}/public/geoportal/layers`; default produksi `https://ppepd.kemenlh.go.id/proxies/api/api/public/geoportal/layers`.
- Token/cookie pengguna tidak diteruskan ke layanan katalog. Hanya layer aktif, publik, dapat diakses, dan memiliki berkas PMTiles pada storage PPEPD yang digunakan.
- Berkas PMTiles dimuat langsung dengan HTTP Range; tidak disalin ke portal. Header dan metadata PMTiles menentukan rentang zoom aktual serta nama vector layer.
- Legenda dan pencocokan kelas mengikuti `style.categories` katalog, termasuk kapitalisasi nilai atribut.
- Tautan penjelajah SI-PPEM menggunakan rute produksi `/sippem/peta-mangrove`, sesuai arsitektur satu domain dengan Nginx.

Edisi mangrove dipilih dari nama `Mangrove YYYY` dengan `year` yang sama. Edisi terbaru dipilih otomatis. Potensi habitat/KLM, grid KLM, batas provinsi, dan batas desa adalah layer pendamping terpisah. Layer lain dan entri nonaktif tidak ditampilkan.

## Interpretasi dan batas data

- Tahun edisi tidak selalu sama dengan tahun pengamatan citra. Detail objek menampilkan atribut sumber tanpa menafsirkan ulang nilainya.
- Kelas lebat/sedang/jarang adalah kelas kerapatan, bukan penilaian menyeluruh kesehatan ekosistem.
- Produsen/atribusi yang kosong ditampilkan sebagai belum tersedia. Domain storage tidak dianggap sebagai produsen.
- Ketersediaan teknis peta tidak dianggap sebagai validasi ilmiah metadata atau ketelitian.
- Atas permintaan pengguna, seluruh panel, isi, dan layout di luar section peta dikembalikan ke implementasi awal. KPI, kerapatan, ancaman, galeri kawasan, distribusi pulau, dan tren di luar peta masih memakai nilai literal lama; jangan menganggapnya hasil agregasi SI-PPEM. Pembaruan data hanya berlaku pada section peta.
- Tidak menjumlahkan luas potongan tile karena geometri dapat tersederhanakan, terpotong, atau terulang.
- Pada pemeriksaan 16 Oktober 2026, API agregasi SI-PPEM mengembalikan `inti_2025.tahun = 2026` dan `total_ha = 0`, sedangkan peta terbaru beredisi 2025. Agregasi ini tidak digunakan sebagai angka luas dashboard.
- Penambahan statistik harus memakai sumber agregasi dengan identitas dataset/edisi dan satuan yang jelas. Jangan mengambil fallback mock dari dashboard SI-PPEM sebagai data observasi.

## Keadaan antarmuka

Dashboard menyediakan loading, katalog kosong, katalog gagal, kegagalan layer, batas waktu pemuatan, coba lagi, dan pembaruan katalog. Indikator “Peta termuat” menunggu sumber tematik termuat, bukan hanya peta dasar. Permintaan edisi yang terlambat diabaikan setelah pilihan berubah. Peta dibersihkan saat komponen ditutup dan ukurannya mengikuti container.

Halaman memakai template dan style awal di Git HEAD; hanya blok peta diganti dengan `MangroveDashboardMap.vue`. Panel lama di luar peta tidak didesain ulang. Komponen peta mengelola katalog, pilihan edisi, detail objek, serta fallback katalog sendiri. Tombol “Layar penuh” di dalam container peta memperbesar hanya peta beserta kontrol/legendanya; tombol keluar atau Esc mengembalikan layout. Browser tanpa dukungan Fullscreen API memakai perluasan viewport dengan pengelolaan fokus. Batas responsivitas layout lama juga kembali mengikuti implementasi awal.

Pengujian kontrak data: `node --test tests/mangrove-catalog.test.mjs` (Node 24).

Pengujian endpoint terkompilasi: setelah `npm run build`, jalankan `node --test tests/mangrove-api.integration.mjs`. Pengujian memakai upstream dan port lokal terisolasi untuk memeriksa katalog normal/kosong, respons salah/gagal, serta memastikan cookie dan token pemanggil tidak diteruskan.
