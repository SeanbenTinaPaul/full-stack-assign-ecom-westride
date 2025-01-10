import flowbite from "flowbite-react/tailwind";

/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    flowbite.content(),
  ],
  theme: {
    extend: {
      backgroundImage: {
        'Primary-btn': 'linear-gradient(to right, #7C5D8E, #A17EB7)',
        'Almost-prim-btn': 'linear-gradient(to right, #A17EB7, #C8A1E0)',
        'Second-btn-light': 'linear-gradient(to right, #B3A99C, #D5CCC0)',
        'Second-btn-night': 'linear-gradient(to right, #80839C, #A7ABC4)',
        'Header-bar-light': 'linear-gradient(to right, #7C5D8E 25%, #A17EB7 100%)',
        'Footer-bar-light': 'linear-gradient(to right, #F7EFE5, #F0F0F2)',
        'Header-footer-bar-night': 'linear-gradient(to right, #383A4A 25%, #5B5D73 100%)',
        'Dropdown-option-light': 'linear-gradient(to right, #F7EFE5, #F1F0EF)',
        'Dropdown-option-night': 'linear-gradient(to right, #80839C, #A7ABC4)',
      },
      colors:{
        'Bg-night-700': '#5B5D73',
        'Bg-light-50': '#F7EFE5',
        'Bg-warning': '#FFBF00',
        'Bg-disabled-btn-50': '#F0F0F2',
        'Text-black': '#383A4A',
        'Text-white': '#F7EFE5',
      }
    },
  },
  plugins: [
    flowbite.plugin(),
  ],
}