/** @type {import('tailwindcss').Config} */
// Design System KLH/BPLH v2.1 — token didefinisikan di app/assets/css/main.css (kanal RGB).
// Aturan pemakaian: docs/STYLE_GUIDELINES.md
const v = (name) => `rgb(var(--klh-${name}) / <alpha-value>)`
const scale = (k) => Object.fromEntries([50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((s) => [s, v(`${k}-${s}`)]))

const fontDisplay = ['"Plus Jakarta Sans Variable"', '"Plus Jakarta Sans"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif']
const fontBody = ['"Inter Variable"', 'Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif']
const fontMono = ['"JetBrains Mono"', '"SF Mono"', 'Consolas', 'monospace']

module.exports = {
  content: [
    "./app/components/**/*.{js,vue,ts}",
    "./app/layouts/**/*.vue",
    "./app/pages/**/*.vue",
    "./app/plugins/**/*.{js,ts}",
    "./app/app.vue",
    "./app/error.vue",
    "./content/**/*.md"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: fontBody,
        body: fontBody,
        display: fontDisplay,
        mono: fontMono,
      },
      colors: {
        klh: {
          green: scale('g'),
          blue: scale('b'),
          orange: scale('o'),
        },
        // Teks di atas latar oranye (kontras AA) — oranye tidak pernah memakai teks putih
        'on-orange': '#3A1B02',
        ink: { 900: v('ink-900'), 700: v('ink-700'), 500: v('ink-500'), 400: v('ink-400'), 300: v('ink-300') },
        line: { DEFAULT: v('line'), strong: v('line-strong') },
        surface: { DEFAULT: v('surface'), 2: v('surface-2'), 3: v('surface-3'), bg: v('bg') },
        success: { DEFAULT: v('success'), bg: v('success-bg'), line: v('success-line') },
        warning: { DEFAULT: v('warning'), bg: v('warning-bg'), line: v('warning-line') },
        danger: { DEFAULT: v('danger'), bg: v('danger-bg'), line: v('danger-line') },
        info: { DEFAULT: v('info'), bg: v('info-bg'), line: v('info-line') },
      },
      boxShadow: {
        'klh-1': '0 1px 2px rgba(0,54,49,.06), 0 1px 3px rgba(0,54,49,.05)',
        'klh-2': '0 2px 6px rgba(0,54,49,.08), 0 6px 16px rgba(0,54,49,.07)',
        'klh-3': '0 12px 32px rgba(0,54,49,.12)',
      },
      maxWidth: {
        container: '1200px',
        header: '1380px',
        prose: '720px',
      },
      backgroundImage: {
        // Pita CTA / hero gelap: hijau 700 → 900
        'klh-hero': 'linear-gradient(135deg, rgb(var(--klh-g-700)) 0%, rgb(var(--klh-g-900)) 100%)',
        // Placeholder media .ph (gradien bertekstur titik)
        'klh-ph': 'radial-gradient(rgba(255,255,255,.14) 1px, transparent 1.4px), linear-gradient(135deg, rgb(var(--klh-g-500)) 0%, rgb(var(--klh-g-800)) 100%)',
      },
      typography: () => ({
        klh: {
          css: {
            '--tw-prose-body': 'rgb(var(--klh-ink-700))',
            '--tw-prose-headings': 'rgb(var(--klh-ink-900))',
            '--tw-prose-lead': 'rgb(var(--klh-ink-500))',
            '--tw-prose-links': 'rgb(var(--klh-b-600))',
            '--tw-prose-bold': 'rgb(var(--klh-ink-900))',
            '--tw-prose-counters': 'rgb(var(--klh-ink-500))',
            '--tw-prose-bullets': 'rgb(var(--klh-g-500))',
            '--tw-prose-hr': 'rgb(var(--klh-line))',
            '--tw-prose-quotes': 'rgb(var(--klh-ink-900))',
            '--tw-prose-quote-borders': 'rgb(var(--klh-g-600))',
            '--tw-prose-captions': 'rgb(var(--klh-ink-500))',
            '--tw-prose-code': 'rgb(var(--klh-ink-900))',
            '--tw-prose-pre-code': 'rgb(var(--klh-g-50))',
            '--tw-prose-pre-bg': 'rgb(var(--klh-g-900))',
            '--tw-prose-th-borders': 'rgb(var(--klh-line-strong))',
            '--tw-prose-td-borders': 'rgb(var(--klh-line))',
            'h1, h2, h3, h4': { fontFamily: fontDisplay.join(', '), fontWeight: '700' },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
