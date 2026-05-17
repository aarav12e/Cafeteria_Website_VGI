/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');

export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: colors.gray[800],
                secondary: colors.gray[600],
                dark: "#0a0a0a",
                light: "#fafafa",
                "vgi-bg": "#121212",
                "yummies-bg": "#121212",
                "vgi-primary": colors.gray[100],
                "vgi-dark": colors.gray[900],
                // Overriding colorful tailwind colors to grayscale to enforce dark/white professional theme
                orange: colors.neutral,
                red: colors.neutral,
                purple: colors.neutral,
                amber: colors.neutral,
                yellow: colors.neutral,
                blue: colors.neutral,
                pink: colors.neutral,
                cyan: colors.neutral,
                teal: colors.neutral,
                emerald: colors.neutral,
                indigo: colors.neutral,
                green: colors.zinc,
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            boxShadow: {
                'vgi': '0 4px 30px rgba(0, 0, 0, 0.5)',
                'vgi-lg': '0 10px 40px rgba(0, 0, 0, 0.8)',
            }
        },
    },
    plugins: [],
}
