/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      keyframes: {
        faceLoad: {
          '0%, 100%': { transform: 'scaleY(1)', opacity: '1' },
          '50%': { transform: 'scaleY(0.4)', opacity: '0.1' },
        },
      },
      animation: {
        'face-load-1': 'faceLoad 1s cubic-bezier(.2,.68,.18,1.08) infinite -0.4s',
        'face-load-2': 'faceLoad 1s cubic-bezier(.2,.68,.18,1.08) infinite -0.3s',
        'face-load-3': 'faceLoad 1s cubic-bezier(.2,.68,.18,1.08) infinite -0.2s',
        'face-load-4': 'faceLoad 1s cubic-bezier(.2,.68,.18,1.08) infinite -0.1s',
      },
    },
  },
  plugins: [],
}
