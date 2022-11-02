/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.tsx'],
  theme: {
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
    },
    extend: {
      backgroundImage: {
        galaxy: 'url(background-galaxy.png)',
        'nlw-gradient':
          'linear-gradient(90deg, #9572FC 20%, #43E7AD 50%, #E1D55D 100%)',
        'dark-gradient':
          'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.9) 67%)',
        gradient:
          'linear-gradient(60deg, #35235D 10%, #191623 50%,  #35235D 100%)',
      },
    },
  },
  plugins: [],
};
