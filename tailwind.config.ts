import type { Config } from 'tailwindcss'

export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui'),
  ],
//   corePlugins: {
//     preflight: true, // this removes the default styles
//  }
 
} satisfies Config

