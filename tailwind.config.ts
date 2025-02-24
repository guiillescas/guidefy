import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      fontFamily: {
        montserrat: ['var(--font-montserrat)'],
        space: ['var(--font-space)']
      }
    }
  },
  safelist: [
    // Cyan
    'bg-cyan-900/50',
    'hover:bg-cyan-900/70',
    'bg-cyan-900/30',
    'hover:bg-cyan-900/50',
    // Blue
    'bg-blue-900/50',
    'hover:bg-blue-900/70',
    'bg-blue-900/30',
    'hover:bg-blue-900/50',
    // Yellow
    'bg-yellow-900/50',
    'hover:bg-yellow-900/70',
    'bg-yellow-900/30',
    'hover:bg-yellow-900/50',
    // Orange
    'bg-orange-900/50',
    'hover:bg-orange-900/70',
    'bg-orange-900/30',
    'hover:bg-orange-900/50',
    // Green
    'bg-green-900/50',
    'hover:bg-green-900/70',
    'bg-green-900/30',
    'hover:bg-green-900/50',
    // Red
    'bg-red-900/50',
    'hover:bg-red-900/70',
    'bg-red-900/30',
    'hover:bg-red-900/50',
    // Purple (for non-base items)
    'bg-purple-900/50'
  ],
  plugins: [require('tailwindcss-animate')]
} satisfies Config;
