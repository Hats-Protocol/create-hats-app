import { first, get, values } from 'lodash';
import { Chain, http } from 'viem';
import { chainsList } from './chains';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  rainbowWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { mainnet, optimism, base, arbitrum, sepolia, polygon } from 'viem/chains';
import { createStorage, createConfig } from 'wagmi';

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

// const storage = createStorage({ storage: window.localStorage });
const storage = createStorage({ storage: localStorage });

export const RPC_URLS = {
  [mainnet.id]: `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_ID}`,
  [optimism.id]: `https://opt-mainnet.g.alchemy.com/v2/${ALCHEMY_ID}`,
  [polygon.id]: `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_ID}`,
  [base.id]: `https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_ID}`,
  [arbitrum.id]: `https://arb-mainnet.g.alchemy.com/v2/${ALCHEMY_ID}`,
  [sepolia.id]: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_ID}`,
}


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
