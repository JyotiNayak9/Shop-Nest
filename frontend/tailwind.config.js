

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
    extend: {},
  },
  plugins: [
    flowbite.plugin(),
    require('flowbite/plugin')
  ],
}

