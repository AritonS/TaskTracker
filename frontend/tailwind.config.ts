import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-gold': '#FFB347',
        'secondary-gold': '#FFA07A',
        'soft-red': '#FF6B6B',
        'deep-red': '#FF4040',
        'warm-white': '#FFF3E0',
        'warm-gray': '#2C2825',
        'soft-beige': '#FFE4C4',
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
        playfair: ['var(--font-playfair)'],
      },
      boxShadow: {
        'luxury': '0 8px 32px rgba(255, 179, 71, 0.1)',
      },
      backgroundImage: {
        'warm-gradient': 'linear-gradient(135deg, var(--warm-white) 0%, var(--soft-beige) 100%)',
        'gold-gradient': 'linear-gradient(135deg, var(--primary-gold) 0%, var(--secondary-gold) 100%)',
        'red-gradient': 'linear-gradient(135deg, var(--soft-red) 0%, var(--deep-red) 100%)',
      },
    },
  },
  plugins: [],
};
export default config;
