/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Mood Brew Palette
                background: "#F5F2EB", // Warm Cream / Paper
                surface: "#FFFFFF", // White
                primary: "#1B2430", // Deep Navy (from Logo)
                secondary: "#C5A065", // Muted Gold/Bronze (from Logo)
                accent: "#E6D5B8", // Beige
                text: "#1B2430", // Deep Navy
                muted: "#8C8C8C", // Grey
            },
            fontFamily: {
                sans: ['Noto Sans KR', 'sans-serif'],
                heading: ['Playfair Display', 'serif'],
                handwriting: ['"Nanum Pen Script"', 'cursive'],
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out',
                'slide-up': 'slideUp 0.5s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            },
        },
    },
    plugins: [],
}
