import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import '@rainbow-me/rainbowkit/styles.css';

import { arbitrum, base, mainnet, optimism, sepolia } from 'wagmi/chains';
import {
  WagmiConfig,
  configureChains,
  createConfig,
  createStorage,
} from 'wagmi';
import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppRoutes from './routes';
import { Toaster } from 'sonner';

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [base, arbitrum, optimism, sepolia, mainnet],
  [
    alchemyProvider({ apiKey: import.meta.env.VITE_ALCHEMY_ID || '' }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'Hats App Template - Vite',
  chains,
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID ?? '',
});

// const storage = createStorage({ storage: window.localStorage });
const storage = createStorage({ storage: localStorage });

const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
  storage,
});

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Toaster />
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider chains={chains} modalSize="compact">
          <AppRoutes />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiConfig>
  </React.StrictMode>
);
