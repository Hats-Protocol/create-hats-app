import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  rainbowWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { first, get, values } from 'lodash';
import { Chain, http } from 'viem';
import { arbitrum, base, mainnet, optimism, polygon, sepolia } from 'viem/chains';
import { createConfig, createStorage } from 'wagmi';

import { chainsList } from './chains';

const ALCHEMY_ID = import.meta.env.VITE_ALCHEMY_ID;

export const chainsMap = (chainId?: number) =>
  chainId
    ? chainsList[chainId as number]
    : (first(values(chainsList)) as Chain);

export const explorerUrl = (chainId?: number) =>
  chainId &&
  get(
    chainsMap(chainId),
    'blockExplorers.etherscan.url',
    get(chainsMap(chainId), 'blockExplorers.default.url')
  );

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [rainbowWallet, walletConnectWallet],
    },
  ],
  {
    appName: 'Create Hats Vite App',
    projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID ?? '',
  }
);

export const RPC_URLS = {
  [mainnet.id]: `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_ID}`,
  [optimism.id]: `https://opt-mainnet.g.alchemy.com/v2/${ALCHEMY_ID}`,
  [polygon.id]: `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_ID}`,
  [base.id]: `https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_ID}`,
  [arbitrum.id]: `https://arb-mainnet.g.alchemy.com/v2/${ALCHEMY_ID}`,
  [sepolia.id]: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_ID}`,
}

const noopStorage = {
  getItem: () => null,
  setItem: () => { },
  removeItem: () => { },
};

// uses a fallback value noopStorage (saw this example in the wagmi docs) if not on the client
// this is resolved in wagmi v2 with the "ssr" option in createConfig
const storage = createStorage({
  storage:
    typeof window !== 'undefined' && window.localStorage
      ? window.localStorage
      : noopStorage,
});

export const wagmiConfig = createConfig({
  connectors,
  chains: [mainnet, optimism, base, arbitrum, sepolia],
  storage,
  transports: {
    [mainnet.id]: http(RPC_URLS[mainnet.id]),
    [optimism.id]: http(RPC_URLS[optimism.id]),
    [polygon.id]: http(RPC_URLS[polygon.id]),
    [base.id]: http(RPC_URLS[base.id]),
    [arbitrum.id]: http(RPC_URLS[arbitrum.id]),
    [sepolia.id]: http(RPC_URLS[sepolia.id]),
  }
});
