

/** @type {import('tailwindcss').Config} */
const flowbite = require("flowbite-react/tailwind")
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
    flowbite.content(),
     'node_modules/flowbite-react/lib/esm/**/*.js'
  ],
  theme: {
    extend: {
      screens: {
        'xs': '475px',
        '3xl': '1600px',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
      },
    },
  },
  plugins: [
    flowbite.plugin(),
    require('flowbite/plugin')
  ],
}

