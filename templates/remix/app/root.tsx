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
import {
  RainbowKitProvider,
  darkTheme,
  getDefaultWallets,
} from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { optimismSepolia } from 'wagmi/chains';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider, publicProvider } from 'wagmi/providers/public';
import { s } from 'node_modules/vite/dist/node/types.d-FdqQ54oU';

type Env = {
  PUBLIC_ENABLE_TESTNETS?: string;
  ALCHEMY_RPC_URL: string;
  WALLETCONNECT_PROJECT_ID: string;
};

type LoaderData = { env: Env };

export async function loader({ request }: LoaderFunctionArgs) {
  const env: Env = {
    PUBLIC_ENABLE_TESTNETS: import.meta.env.PUBLIC_ENABLE_TESTNETS || 'false',
    ALCHEMY_RPC_URL: import.meta.env.VITE_ALCHEMY_RPC_URL,
    WALLETCONNECT_PROJECT_ID: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,
  };
  console.log('env in loader', env);
  return json({ env });
}

export default function App() {
  const { env } = useLoaderData<LoaderData>();

  const [{ config, chains }] = useState(() => {
    const { chains, publicClient, webSocketPublicClient } = configureChains(
      [sepolia, mainnet],
      [alchemyProvider({ apiKey: env.ALCHEMY_RPC_URL || '' }), publicProvider()]
    );

    const { connectors } = getDefaultWallets({
      appName: 'Intuition App Template - Remix',
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
            <RainbowKitProvider
              chains={chains}
              modalSize="compact"
              theme={darkTheme()}
            >
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
