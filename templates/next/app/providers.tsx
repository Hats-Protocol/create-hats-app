'use client';

import * as React from 'react';
import {
  RainbowKitProvider,
  darkTheme,
  getDefaultWallets,
} from '@rainbow-me/rainbowkit';
import {
  arbitrum,
  base,
  mainnet,
  optimism,
  polygon,
  sepolia,
  zora,
} from 'wagmi/chains';
import { WagmiConfig, configureChains, createConfig } from 'wagmi';
import { getDefaultConfig } from 'tailwind-merge';
import { env } from 'process';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [sepolia, mainnet],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL || '' }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'Hats App Template - Next',
  chains,
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? '',
});

const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

// const config = getDefaultConfig({
//   appName: 'RainbowKit demo',
//   projectId: 'YOUR_PROJECT_ID',
//   wallets: [
//     ...wallets,
//     {
//       groupName: 'Other',
//       wallets: [argentWallet, trustWallet, ledgerWallet],
//     },
//   ],
//   chains: [
//     mainnet,
//     polygon,
//     optimism,
//     arbitrum,
//     base,
//     zora,
//     ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [sepolia] : []),
//   ],
//   ssr: true,
// });

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig config={config}>
      <RainbowKitProvider chains={chains} modalSize="compact">
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
