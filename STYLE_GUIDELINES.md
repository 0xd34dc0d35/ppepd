Berikut adalah **Color Style Guidelines** berbasis logo KLHK — diekstrak dari warna-warna utama logo tersebut.

---

## 🎨 Style Guidelines — KLHK Brand Colors

### 1. Palet Warna Utama

Warna diambil langsung dari logo:

| Nama | Hex | Tailwind Custom | Peran |
|---|---|---|---|
| **Forest Green** | `#1E5C4B` | `brand-green` | Primary / dominan |
| **Deep Teal** | `#0D3D30` | `brand-green-dark` | Dark bg, border |
| **Sky Blue** | `#5BACD6` | `brand-blue` | Accent / highlight |
| **Burnt Orange** | `#D97B3A` | `brand-orange` | Call-to-action |
| **Warm White** | `#F5F2EC` | `brand-cream` | **Background Utama** |
| **Charcoal** | `#1A2A24` | `brand-charcoal` | Text utama |

---

### 2. Konfigurasi Tailwind (`tailwind.config.js`)

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          green:      '#1E5C4B',
          'green-dark': '#0D3D30',
          blue:       '#5BACD6',
          orange:     '#D97B3A',
          cream:      '#F5F2EC',
          charcoal:   '#1A2A24',
        }
      },
      backgroundImage: {
        // Gradients — lihat seksi berikutnya
        'hero-gradient':    'linear-gradient(135deg, #0D3D30 0%, #1E5C4B 50%, #2A7A62 100%)',
        'section-gradient': 'linear-gradient(180deg, #F5F2EC 0%, #E8F2EE 100%)',
        'accent-gradient':  'linear-gradient(90deg, #5BACD6 0%, #1E5C4B 100%)',
        'cta-gradient':     'linear-gradient(135deg, #D97B3A 0%, #C4612A 100%)',
        'mesh-gradient':    'radial-gradient(ellipse at top left, #1E5C4B 10%, transparent 70%), radial-gradient(ellipse at bottom right, #5BACD6 10%, transparent 70%), #F5F2EC',
      }
    }
  }
}
```

---

### 3. Rekomendasi Gradient

#### 🟢 `hero-gradient` — Hero Section / Header Utama
```
linear-gradient(135deg, #F5F2EC → #E8F2EE → #D9EAE4)
```
> Cocok untuk hero section light. Memberi kesan **bersih, modern, dan segar**.

#### 🔵 `accent-gradient` — Banner / Highlight Strip
```
linear-gradient(90deg, #5BACD6 → #1E5C4B)
```
> Transisi biru ke hijau → visual yang hidup, cocok untuk **callout bar** atau **section divider**.

#### 🟠 `cta-gradient` — Tombol / CTA
```
linear-gradient(135deg, #D97B3A → #C4612A)
```
> Warna oranye tegas untuk **tombol utama** agar menonjol di atas latar hijau.

#### 🌿 `mesh-gradient` — Background Dekoratif
```
radial-gradient(top-left: green) + radial-gradient(bottom-right: blue) di atas #F5F2EC
```
> Efek **mesh/ambient** premium untuk hero fullscreen atau splash page.

#### ⬜ `section-gradient` — Section Terang
```
linear-gradient(180deg, #FFFFFF → #F5F2EC)
```
> Transisi dari putih murni ke krem — menjaga halaman tetap **terang dan fokus pada konten**.

---

### 4. Panduan Penerapan (Nuxt Components)

```html
<!-- Navbar -->
<nav class="bg-white/80 backdrop-blur-md text-brand-green-dark border-b border-brand-green/10">

<!-- Hero Section -->
<section class="bg-section-gradient text-brand-charcoal min-h-[80vh]">

<!-- Highlight / Stats Bar -->
<div class="bg-brand-green text-white py-4 shadow-lg">

<!-- Konten Utama -->
<section class="bg-white text-brand-charcoal">

<!-- Tombol Utama -->
<button class="bg-cta-gradient text-white px-6 py-3 rounded-full shadow-brand-orange/20 hover:shadow-brand-orange/40">

<!-- Footer -->
<footer class="bg-brand-cream text-brand-green-dark border-t border-brand-green/5">
```

---

### 5. Hierarki Tipografi (Light Theme)

| Elemen | Warna | Tailwind |
|---|---|---|
| Heading H1/H2 | `#0D3D30` | `text-brand-green-dark` |
| Body text | `#1A2A24` | `text-brand-charcoal` |
| Link / Accent text | `#1E5C4B` | `text-brand-green` |
| CTA / Badge | `#D97B3A` | `text-brand-orange` |

---

### 6. Prinsip Desain

- **Dominasi Putih/Krem** → kebersihan, transparansi, profesionalisme
- **Hijau Tua sebagai penegas** → digunakan pada teks heading dan elemen kunci
- **Oranye tetap untuk CTA** → kontras tinggi di atas latar terang
- **Gunakan bayangan halus (soft shadows)** → untuk memberi kedalaman tanpa harus menggunakan latar gelap
- Pertahankan whitespace yang luas agar desain terasa bernapas