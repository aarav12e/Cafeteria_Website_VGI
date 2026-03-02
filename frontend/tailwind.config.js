/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#EA580C",
                secondary: "#F97316",
                dark: "#1F2937",
                light: "#F3F4F6",
                "vgi-bg": "#FFF8F4",
                "yummies-bg": "#FFF8F4",
                "vgi-primary": "#EA580C",
                "vgi-dark": "#7c3aed",
            },
            fontFamily: {
                sans: ['Poppins', 'Inter', 'sans-serif'],
            },
            boxShadow: {
                'vgi': '0 4px 30px rgba(234, 88, 12, 0.15)',
                'vgi-lg': '0 10px 40px rgba(234, 88, 12, 0.2)',
            }
        },
    },
    plugins: [],
}
