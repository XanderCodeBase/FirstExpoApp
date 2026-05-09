/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/**/*.{js,jsx,ts,tsx}',
        './components/**/*.{js,jsx,ts,tsx}',
    ],

    presets: [require('nativewind/preset')],

    theme: {
        extend: {
            colors: {
                primary: '#2563eb',
                background: '#0f172a',
                card: '#1e293b',
            },
        },
    },

    plugins: [],
};
