import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.tsx'],
  format: ['esm', 'cjs'],
  dts: true,
  external: [
    'react',
    '@hatsprotocol/sdk-v1-core',
    '@hatsprotocol/sdk-v1-subgraph',
    'viem',
    'wagmi',
  ],
  clean: true,
});
