import flowbite from "flowbite-react/tailwind";
import tailwindcssAnimate from "tailwindcss-animate";
import tailwindSrollbar from "tailwind-scrollbar";

/** @type {import('tailwindcss').Config} */

export default {
   darkMode: ["class"],
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
            "Dropdown-option-night": "linear-gradient(to right, #80839C, #A7ABC4)"
         },
         colors: {
            "Bg-night-700": "#5B5D73",
            "Bg-light-50": "#F7EFE5",
            "Bg-warning": "#FFBF00",
            "Bg-disabled-btn-50": "#F0F0F2",
            "Text-black": "#383A4A",
            "Text-white": "#F7EFE5",
            background: "hsl(var(--background))",
            foreground: "hsl(var(--foreground))",
            card: {
               DEFAULT: "hsl(var(--card))",
               foreground: "hsl(var(--card-foreground))"
            },
            popover: {
               DEFAULT: "hsl(var(--popover))",
               foreground: "hsl(var(--popover-foreground))"
            },
            primary: {
               DEFAULT: "hsl(var(--primary))",
               foreground: "hsl(var(--primary-foreground))"
            },
            secondary: {
               DEFAULT: "hsl(var(--secondary))",
               foreground: "hsl(var(--secondary-foreground))"
            },
            muted: {
               DEFAULT: "hsl(var(--muted))",
               foreground: "hsl(var(--muted-foreground))"
            },
            accent: {
               DEFAULT: "hsl(var(--accent))",
               foreground: "hsl(var(--accent-foreground))"
            },
            destructive: {
               DEFAULT: "hsl(var(--destructive))",
               foreground: "hsl(var(--destructive-foreground))"
            },
            border: "hsl(var(--border))",
            input: "hsl(var(--input))",
            ring: "hsl(var(--ring))",
            chart: {
               1: "hsl(var(--chart-1))",
               2: "hsl(var(--chart-2))",
               3: "hsl(var(--chart-3))",
               4: "hsl(var(--chart-4))",
               5: "hsl(var(--chart-5))"
            },
            sidebar: {
               DEFAULT: "hsl(var(--sidebar-background))",
               foreground: "hsl(var(--sidebar-foreground))",
               primary: "hsl(var(--sidebar-primary))",
               "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
               accent: "hsl(var(--sidebar-accent))",
               "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
               border: "hsl(var(--sidebar-border))",
               ring: "hsl(var(--sidebar-ring))"
            }
         },
         zIndex: {
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
            auto: "auto",
            "-1": "-1"
         },
         keyframes: {
            bounceScale: {
               "0%, 100%": {
                  transform: "translateY(0) scaleX(1.2)"
               },
               "50%": {
                  transform: "translateY(-5px) scaleX(0.9)"
               }
            }
         },
         animation: {
            bounceScale: "bounceScale 0.5s infinite ease-in-out"
         },
         borderRadius: {
            lg: "var(--radius)",
            md: "calc(var(--radius) - 2px)",
            sm: "calc(var(--radius) - 4px)"
         }
      }
   },
   plugins: [flowbite.plugin(), tailwindcssAnimate, tailwindSrollbar]
};
