import flowbite from "flowbite-react/tailwind";

/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", flowbite.content()],
  theme: {
    extend: {
      backgroundImage: {
        "Primary-btn": "linear-gradient(to right, #7C5D8E, #A17EB7)",
        "Almost-prim-btn": "linear-gradient(to right, #A17EB7, #C8A1E0)",
        "Second-btn-light": "linear-gradient(to right, #B3A99C, #D5CCC0)",
        "Second-btn-night": "linear-gradient(to right, #80839C, #A7ABC4)",
        "Header-bar-light": "linear-gradient(to right, #7C5D8E 25%, #A17EB7 100%)",
        "Footer-bar-light": "linear-gradient(to right, #F7EFE5, #F0F0F2)",
        "Header-footer-bar-night": "linear-gradient(to right, #383A4A 25%, #5B5D73 100%)",
        "Dropdown-option-light": "linear-gradient(to right, #F7EFE5, #F1F0EF)",
        "Dropdown-option-night": "linear-gradient(to right, #80839C, #A7ABC4)",
      },
      colors: {
        "Bg-night-700": "#5B5D73",
        "Bg-light-50": "#F7EFE5",
        "Bg-warning": "#FFBF00",
        "Bg-disabled-btn-50": "#F0F0F2",
        "Text-black": "#383A4A",
        "Text-white": "#F7EFE5",
      },
      zIndex: {
        auto: "auto",
        "-1": "-1",
        0: "0",
        1: "1",
        2: "2",
        3: "3",
        4: "4",
        5: "5",
        6: "6",
        7: "7",
        8: "8",
        9: "9",
        10: "10",
        11: "11",
        12: "12",
        13: "13",
        14: "14",
        15: "15",
        16: "16",
        17: "17",
        18: "18",
        19: "19",
        20: "20",
        21: "21",
        22: "22",
      },
      keyframes: {
        bounceScale: {
          "0%, 100%": { transform: "translateY(0) scaleX(1.2)" }, //พื้น→ขยาย
          "50%": { transform: "translateY(-5px) scaleX(0.9)" }, //ขึ้น→หด
        },
      },
      animation: {
        bounceScale: "bounceScale 0.5s infinite ease-in-out",
      },
    },
  },
  plugins: [flowbite.plugin()],
};
