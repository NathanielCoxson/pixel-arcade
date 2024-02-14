import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      gridTemplateColumns: {
        'equal-10': 'repeat(10, minmax(0, 1fr))',
        '25': 'repeat(25, minmax(0, 1fr))'
      },
      gridTemplateRows: {
        'equal-10': 'repeat(10, minmax(0, 1fr))',
        '25': 'repeat(25, minmax(0, 1fr))'
      },
      minWidth: {
        'game-width': '720px'
      },
      minHeight: {
        'game-height': '720px'
      },
      maxWidth: {
        'game-width': '720px'
      }
    }, 
  },
  plugins: [],
}
export default config
