import './styles/global.css';
import '@rainbow-me/rainbowkit/styles.css';

import {
  connectorsForWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import {
  rainbowWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { LoaderFunction } from '@remix-run/node';
import {
  json,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { Toaster } from 'sonner';
import {
  arbitrum,
  base,
  mainnet,
  optimism,
  polygon,
  sepolia,
} from 'viem/chains';
import { createConfig, createStorage, http, WagmiProvider } from 'wagmi';

interface LoaderData {
  ENV: {
    PUBLIC_ENABLE_TESTNETS: string;
    ALCHEMY_ID: string;
    WALLETCONNECT_PROJECT_ID: string;
  };
}

const noopStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

// uses a fallback value noopStorage (saw this example in the wagmi docs) if not on the client
// this is resolved in wagmi v2 with the "ssr" option in createConfig
const storage = createStorage({
  storage:
    typeof window !== 'undefined' && window.localStorage
      ? window.localStorage
      : noopStorage,
});

// Note: These environment variables are hard coded for demonstration purposes.
// See: https://remix.run/docs/en/v1/guides/envvars#browser-environment-variables
export const loader: LoaderFunction = () => {
  const data: LoaderData = {
    ENV: {
      PUBLIC_ENABLE_TESTNETS: process.env.PUBLIC_ENABLE_TESTNETS || 'false',
      ALCHEMY_ID: process.env.VITE_ALCHEMY_ID || '',
      WALLETCONNECT_PROJECT_ID: process.env.VITE_WALLETCONNECT_PROJECT_ID || '',
    },
  };

  return json(data);
};

export default function App() {
  function makeQueryClient() {
    return new QueryClient({
      defaultOptions: {
        queries: {
          // With SSR, we usually want to set some default staleTime
          // above 0 to avoid refetching immediately on the client

          staleTime: 60 * 1000,
        },
      },
    });
  }

  let browserQueryClient: QueryClient | undefined = undefined;

  function getQueryClient() {
    if (typeof window === 'undefined') {
      // Server: always make a new query client
      return makeQueryClient();
    } else {
      // Browser: make a new query client if we don't already have one
      // This is very important so we don't re-make a new client if React
      // suspends during the initial render. This may not be needed if we
      // have a suspense boundary BELOW the creation of the query client
      if (!browserQueryClient) browserQueryClient = makeQueryClient();
      return browserQueryClient;
    }
  }

  const queryClient = getQueryClient();

  const { ENV } = useLoaderData<LoaderData>();

  // Remix modules cannot have side effects so the initialization of `wagmi`
  // client happens during render, but the result is cached via `useState`
  // and a lazy initialization function.
  // See: https://remix.run/docs/en/v1/guides/constraints#no-module-side-effects
  const [{ config }] = useState(() => {
    const ALCHEMY_ID = ENV.ALCHEMY_ID;

    const RPC_URLS = {
      [mainnet.id]: `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_ID}`,
      [optimism.id]: `https://opt-mainnet.g.alchemy.com/v2/${ALCHEMY_ID}`,
      [polygon.id]: `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_ID}`,
      [base.id]: `https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_ID}`,
      [arbitrum.id]: `https://arb-mainnet.g.alchemy.com/v2/${ALCHEMY_ID}`,
      [sepolia.id]: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_ID}`,
    };

    const connectors = connectorsForWallets(
      [
        {
          groupName: 'Recommended',
          wallets: [rainbowWallet, walletConnectWallet],
        },
      ],
      {
        appName: 'Create Hats Next App',
        projectId: ENV.WALLETCONNECT_PROJECT_ID ?? '',
      },
    );

    const wagmiConfig = createConfig({
      connectors,
      chains: [mainnet, optimism, base, arbitrum, polygon, sepolia],
      storage,
      ssr: true, // If your dApp uses server side rendering (SSR)
      transports: {
        [mainnet.id]: http(RPC_URLS[mainnet.id]),
        [optimism.id]: http(RPC_URLS[optimism.id]),
        [polygon.id]: http(RPC_URLS[polygon.id]),
        [base.id]: http(RPC_URLS[base.id]),
        [arbitrum.id]: http(RPC_URLS[arbitrum.id]),
        [sepolia.id]: http(RPC_URLS[sepolia.id]),
      },
    });

    return {
      config: wagmiConfig,
    };
  });

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Toaster />
        {config ? (
          <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
              <RainbowKitProvider modalSize="compact">
                <Outlet />
              </RainbowKitProvider>
            </QueryClientProvider>
          </WagmiProvider>
        ) : null}

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
