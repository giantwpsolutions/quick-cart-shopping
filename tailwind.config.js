/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    './node_modules/@headlessui/vue/**/*.{js,ts,jsx,tsx}',
    './node_modules/@heroicons/vue/**/*.{js,ts,jsx,tsx}',

  ],
    corePlugins: { preflight: false },
    prefix: 'tw-',

  theme: {
    extend: {

    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

