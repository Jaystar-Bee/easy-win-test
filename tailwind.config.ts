import defaultTheme from 'tailwindcss/defaultTheme'

module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: '#15bb4f',
        'primary-light': '#6fbf0e',
        secondary: '#f12c28',
        orange: '#ec7225',
      },
      screens: {
        xxxs: '350px',
        xxs: '360px',
        xsm: '375px',
        xs: '480px',
        ...defaultTheme.screens,
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
