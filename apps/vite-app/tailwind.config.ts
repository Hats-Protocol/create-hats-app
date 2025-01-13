import { Config } from 'tailwindcss';

import baseConfig from '../../packages/hats-ui/tailwind.config';

const config = {
  // Extend the base config
  presets: [baseConfig],
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    '../../packages/hats-ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
} satisfies Config;

export default config;
