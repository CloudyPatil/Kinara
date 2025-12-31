/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // From Image 2: The Deep Sea
        petrol: {
          50: '#f2f7f9',
          100: '#ddebf0',
          500: '#3e6b82',
          800: '#233d4d', // <--- MAIN BRAND COLOR
          900: '#1b2f3d',
        },
        // From Image 2: The Sunset (Buttons/Highlights)
        sunset: {
          400: '#ff9f63',
          500: '#fe7f2d', // <--- MAIN ACTION COLOR
          600: '#e5620e',
        },
        // The Sun (Subtle highlights)
        sunny: '#fcca46',
        
        // "Not White" Backgrounds
        cream: {
          50: '#fff8f0', // <--- MAIN LIGHT BG (Warm)
          100: '#faeadd',
        },
        // "Not Black" Backgrounds
        lagoon: {
          800: '#152630',
          900: '#101d25', // <--- MAIN DARK BG
          950: '#081016',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],        
        body: ['Plus Jakarta Sans', 'sans-serif'], 
      }
    },
  },
  plugins: [],
}