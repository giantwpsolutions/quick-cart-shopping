/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    './node_modules/@headlessui/vue/**/*.{js,ts,jsx,tsx}',
    './node_modules/@heroicons/vue/**/*.{js,ts,jsx,tsx}',

  ],
  theme: {
    extend: {

    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

