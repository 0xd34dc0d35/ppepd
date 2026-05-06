/** @type {import('tailwindcss').Config} */
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
        sans: ['Aptos', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        h1: ['ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      colors: {
        slate: {
          950: '#020617',
        },
        brand: {
          green: '#1E5C4B',
          'green-dark': '#0D3D30',
          blue: '#5BACD6',
          orange: '#D97B3A',
          cream: '#F5F2EC',
          charcoal: '#1A2A24',
        }
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #0D3D30 0%, #1E5C4B 50%, #2A7A62 100%)',
        'section-gradient': 'linear-gradient(180deg, #F5F2EC 0%, #E8F2EE 100%)',
        'accent-gradient': 'linear-gradient(90deg, #5BACD6 0%, #1E5C4B 100%)',
        'cta-gradient': 'linear-gradient(135deg, #D97B3A 0%, #C4612A 100%)',
        'mesh-gradient': 'radial-gradient(ellipse at top left, #1E5C4B 10%, transparent 70%), radial-gradient(ellipse at bottom right, #5BACD6 10%, transparent 70%), #F5F2EC',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
