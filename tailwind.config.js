/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#06121f",
          900: "#0a1929",
          800: "#0f2236",
          700: "#15324c",
        },
        mint: {
          400: "#5ee3b3",
          500: "#3dd2a5",
          600: "#2bb98e",
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'sans-serif'],
        signature: ['"Caveat"', 'cursive'],
      },
      backgroundImage: {
        grid: "linear-gradient(rgba(61,210,165,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(61,210,165,0.06) 1px, transparent 1px)",
        radial: "radial-gradient(ellipse at center, rgba(61,210,165,0.15), transparent 65%)",
      },
      animation: {
        shine: "shine 6s linear infinite",
        float: "float 6s ease-in-out infinite",
        "fade-up": "fadeUp 0.8s ease-out forwards",
      },
      keyframes: {
        shine: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
