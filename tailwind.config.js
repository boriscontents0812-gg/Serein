/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light theme / Clay palette (inspired by kree8.studio + Deadly Ponies)
        canvas: {
          light: '#F5F6F8',
          dark: '#0A0D0F',
        },
        card: {
          light: '#FFFFFF',
          dark: '#141A1D',
          darkRaised: '#1B2327',
        },
        ink: {
          light: '#111827',
          lightMuted: '#4B5563',
          lightSubtle: '#9CA3AF',
          dark: '#F4F1EB',
          darkMuted: '#94A3B8',
          darkSubtle: '#64748B',
        },
        border: {
          light: '#E5E8EC',
          lightHairline: '#EFF2F5',
          dark: '#222D33',
          darkHairline: '#182126',
        },
        // Serein Signature Teal
        teal: {
          DEFAULT: '#25B6A7',
          hover: '#1FA294',
          bright: '#39CBBB',
          glow: 'rgba(37, 182, 167, 0.35)',
          light: '#E6F8F6',
          border: '#B3E8E3',
          darkBg: 'rgba(37, 182, 167, 0.12)',
          darkBorder: 'rgba(37, 182, 167, 0.28)',
        },
        champagne: {
          DEFAULT: '#C8B38C',
          light: '#F5EFE6',
          dark: '#7D6F56',
        },
        // Backward-compatible tokens
        dp: {
          white: '#FFFFFF',
          offwhite: '#F9F9F7',
          black: '#000000',
          ink: '#141414',
          grayDark: '#3A3A3A',
          gray: '#615F5F',
          grayLight: '#8B8A89',
          border: '#E3E1E1',
          borderLight: '#EBEBEB',
        },
      },
      fontFamily: {
        sans: ['"DLYP"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
        serif: ['"SerifDisplay"', '"DLYP-Serif"', 'Georgia', 'serif'],
        display: ['"DLYP"', 'sans-serif'],
        editorial: ['"SerifDisplay"', '"DLYP-Serif"', 'Georgia', 'serif'],
      },
      letterSpacing: {
        'tightest': '-0.04em',
        'tighter': '-0.03em',
        'tight': '-0.02em',
        'heading': '-0.035em',
        'price': '-0.02em',
        'caps': '0.12em',
        'wide-caps': '0.22em',
        'logo': '0.26em',
      },
      boxShadow: {
        // Multi-layered soft diffuse clay shadows (Kree8 inspired)
        'clay': '0px 1.67px 4.18px rgba(181,186,203,0.28), 0px 17.57px 10.88px rgba(181,187,203,0.14), 0px 31.8px 12.55px rgba(181,187,203,0.05), inset 0px 1px 0px rgba(255,255,255,0.9)',
        'clay-hover': '0px 2px 6px rgba(181,186,203,0.35), 0px 22px 14px rgba(181,187,203,0.2), 0px 38px 16px rgba(181,187,203,0.08), inset 0px 1px 0px rgba(255,255,255,1)',
        'clay-sm': '0px 1px 3px rgba(181,186,203,0.24), 0px 6px 12px rgba(181,187,203,0.1), inset 0px 1px 0px rgba(255,255,255,0.8)',
        'clay-btn': '0px 2px 4px rgba(37, 182, 167, 0.25), 0px 10px 20px rgba(37, 182, 167, 0.18), inset 0px 1px 1px rgba(255,255,255,0.4)',
        'clay-btn-black': '0px 2px 6px rgba(0, 0, 0, 0.2), 0px 12px 24px rgba(0, 0, 0, 0.15), inset 0px 1px 0px rgba(255,255,255,0.15)',
        'clay-dark': '0px 4px 20px rgba(0, 0, 0, 0.5), 0px 16px 36px rgba(0, 0, 0, 0.35), inset 0px 1px 0px rgba(255,255,255,0.08)',
        'clay-dark-hover': '0px 6px 24px rgba(0, 0, 0, 0.65), 0px 24px 44px rgba(0, 0, 0, 0.45), inset 0px 1px 0px rgba(255,255,255,0.14)',
        'teal-glow': '0px 0px 24px rgba(37, 182, 167, 0.45)',
        'drawer': '-10px 0 35px rgba(0, 0, 0, 0.15)',
      },
      borderRadius: {
        'clay-card': '28px',
        'clay-hero': '32px',
        'clay-pill': '9999px',
      }
    },
  },
  plugins: [],
}
