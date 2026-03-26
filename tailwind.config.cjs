/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#aec6ff",
                "surface-tint": "#aec6ff",
                "on-tertiary-container": "#fbfffb",
                "on-primary-fixed": "#001a42",
                "on-surface": "#dde2f1",
                "inverse-on-surface": "#2a313c",
                "on-primary": "#002e6a",
                "on-primary-fixed-variant": "#004396",
                "primary-fixed": "#d8e2ff",
                "surface-container-lowest": "#080e18",
                "secondary": "#7bd0ff",
                "surface-bright": "#333945",
                "error": "#ffb4ab",
                "on-tertiary-fixed-variant": "#005141",
                "surface-dim": "#0d141e",
                "tertiary": "#5ddbbb",
                "on-tertiary-fixed": "#002019",
                "on-secondary-container": "#00374d",
                "primary-container": "#0070f0",
                "on-error-container": "#ffdad6",
                "surface-container": "#1a202a",
                "tertiary-fixed-dim": "#5ddbbb",
                "on-background": "#dde2f1",
                "surface-container-high": "#242a35",
                "on-secondary-fixed": "#001e2c",
                "background": "#0d141e",
                "surface": "#0d141e",
                "on-secondary": "#00354a",
                "on-secondary-fixed-variant": "#004c69",
                "surface-container-highest": "#2f3540",
                "secondary-container": "#00a6e0",
                "on-tertiary": "#00382c",
                "error-container": "#93000a",
                "on-error": "#690005",
                "outline": "#8b90a0",
                "tertiary-fixed": "#7cf8d6",
                "tertiary-container": "#00856d",
                "primary-fixed-dim": "#aec6ff",
                "inverse-primary": "#005ac3",
                "inverse-surface": "#dde2f1",
                "outline-variant": "#414754",
                "surface-variant": "#2f3540",
                "on-primary-container": "#fffdff",
                "secondary-fixed": "#c4e7ff",
                "surface-container-low": "#151c26",
                "on-surface-variant": "#c1c6d7",
                "secondary-fixed-dim": "#7bd0ff"
            },
            fontFamily: {
                "headline": ["Manrope", "sans-serif"],
                "body": ["Inter", "sans-serif"],
                "label": ["Inter", "sans-serif"]
            },
            borderRadius: { "DEFAULT": "0.125rem", "lg": "0.25rem", "xl": "0.5rem", "full": "0.75rem" }
        }
    },
    plugins: []
};
