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

export async function loader({ request }: LoaderFunctionArgs) {
  return json({ env: getEnv() });
}

export default function App() {
  const { env } = useLoaderData<LoaderData>();

  const [{ config, chains }] = useState(() => {
    const { chains, publicClient, webSocketPublicClient } = configureChains(
      [sepolia, mainnet],
      [alchemyProvider({ apiKey: env.ALCHEMY_RPC_URL || '' }), publicProvider()]
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

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {config && chains ? (
          <WagmiConfig config={config}>
            <RainbowKitProvider chains={chains} modalSize="compact">
              <Outlet />
            </RainbowKitProvider>
          </WagmiConfig>
        ) : null}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
