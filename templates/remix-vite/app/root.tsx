import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  json,
  useLoaderData,
} from '@remix-run/react';
import './styles/global.css';
import { LoaderFunctionArgs } from '@remix-run/node';
import { useState } from 'react';
import {
  WagmiConfig,
  configureChains,
  createConfig,
  mainnet,
  sepolia,
} from 'wagmi';
import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { getEnv } from './.server/env';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

export async function loader({ request }: LoaderFunctionArgs) {
  return json({ env: getEnv() });
}

export default function App() {
  const { env } = useLoaderData<typeof loader>();

  const [{ config, chains }] = useState(() => {
    const { chains, publicClient, webSocketPublicClient } = configureChains(
      [sepolia, mainnet],
      [
        alchemyProvider({ apiKey: import.meta.env.VITE_ALCHEMY_ID || '' }),
        publicProvider(),
      ]
    );

    const { connectors } = getDefaultWallets({
      appName: 'Hats App Template - Remix',
      chains,
      projectId: env.WALLETCONNECT_PROJECT_ID ?? '',
    });

    const config = createConfig({
      autoConnect: true,
      connectors,
      publicClient,
      webSocketPublicClient,
    });

    return {
      config,
      chains,
    };
  });

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
        {config && chains ? (
          <WagmiConfig config={config}>
            <QueryClientProvider client={queryClient}>
              <RainbowKitProvider chains={chains} modalSize="compact">
                <Outlet />
              </RainbowKitProvider>
            </QueryClientProvider>
          </WagmiConfig>
        ) : null}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
