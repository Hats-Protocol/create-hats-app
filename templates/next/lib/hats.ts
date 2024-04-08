import { HatsModulesClient } from '@hatsprotocol/modules-sdk';
import { HatsClient } from '@hatsprotocol/sdk-v1-core';
import { HatsSubgraphClient } from '@hatsprotocol/sdk-v1-subgraph';
import { getDefaultWallets } from '@rainbow-me/rainbowkit';
import _ from 'lodash';
import { createPublicClient, http, createWalletClient, custom } from 'viem';
import { createConfig } from 'wagmi';
import { chains, chainsMap, publicClient } from './web3';

const ALCHEMY_ID = process.env.NEXT_PUBLIC_ALCHEMY_ID;

declare global {
  interface Window {
    ethereum: any;
  }
}

const { connectors } = getDefaultWallets({
  appName: 'Hats',
  chains,
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
});

export const wagmiConfig: any = createConfig({
  connectors,
  publicClient,
});

export const viemPublicClient: any = (chainId: number) => {
  const chain = chainsMap(chainId);
  let transportUrl = _.first(_.get(chain, 'rpcUrls.default.http')) as string;
  const alchemyUrl = _.get(chain, 'rpcUrls.alchemy.http');
  if (alchemyUrl) transportUrl = `${alchemyUrl}/${ALCHEMY_ID}`;

  return createPublicClient({
    chain,
    transport: http(transportUrl, { batch: true }),
  });
};

export function createHatsClient(
  chainId: number | undefined
): HatsClient | undefined {
  if (!chainId) return undefined;
  const chain = chainsMap(chainId);

  const localPublicClient = viemPublicClient(chainId);

  const localWalletClient = createWalletClient({
    chain,
    transport: custom(window.ethereum),
  });

  const hatsClient = new HatsClient({
    chainId,
    publicClient: localPublicClient,
    walletClient: localWalletClient,
  });

  return hatsClient;
}

export function createSubgraphClient(): HatsSubgraphClient {
  if (process.env.NODE_ENV === 'development') {
    return new HatsSubgraphClient({});
  }

  return new HatsSubgraphClient({});
}

export async function createHatsModulesClient(
  chainId: number | undefined
): Promise<HatsModulesClient | undefined> {
  if (!chainId) return undefined;
  const chain = chainsMap(chainId);

  const localWalletClient = createWalletClient({
    chain,
    transport: custom(window.ethereum),
  });

  const localPublicClient = viemPublicClient(chainId);

  const hatsModulesClient = new HatsModulesClient({
    publicClient: localPublicClient,
    walletClient: localWalletClient,
  });

  await hatsModulesClient.prepare();

  return hatsModulesClient as HatsModulesClient;
}
