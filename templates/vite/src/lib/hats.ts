import { HatsModulesClient } from '@hatsprotocol/modules-sdk';
import { HatsClient } from '@hatsprotocol/sdk-v1-core';
import { HatsSubgraphClient } from '@hatsprotocol/sdk-v1-subgraph';
import { first, get, has } from 'lodash';
import { createPublicClient, http } from 'viem';
import { chainsMap, RPC_URLS, wagmiConfig } from './web3';
import { getWalletClient } from 'wagmi/actions';

export const getRpcUrl = (chainId: number) => {
  if (!has(RPC_URLS, chainId)) {
    const chain = chainsMap(chainId);
    return first(get(chain, 'rpcUrls.default.http'));
  }

  return get(RPC_URLS, chainId);
};

export const viemPublicClient = (chainId: number) => {
  return createPublicClient({
    chain: chainsMap(chainId),
    transport: http(getRpcUrl(chainId), { batch: true }),
  });
};

export async function createHatsClient(
  chainId: number | undefined
): Promise<HatsClient | undefined> {
  if (!chainId) return undefined;

  const publicClient = viemPublicClient(chainId);

  try {
    const walletClient = await getWalletClient(wagmiConfig);

    const hatsClient = new HatsClient({
      chainId,
      publicClient,
      walletClient,
    });

    return Promise.resolve(hatsClient);
  } catch (e) {
    // If we can't create a wallet client, we can still create a public client
    return Promise.resolve(new HatsClient({
      chainId,
      publicClient,
    }));
  }
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

  const publicClient = viemPublicClient(chainId);

  try {

    const walletClient = await getWalletClient(wagmiConfig);

    const hatsModulesClient = new HatsModulesClient({
      publicClient,
      walletClient,
    });

    await hatsModulesClient.prepare();

    return Promise.resolve(hatsModulesClient as HatsModulesClient);
  } catch (e) {
    // If we can't create a wallet client, we can still create a public client
    return Promise.resolve(new HatsModulesClient({
      publicClient,
    }));
  }
}
