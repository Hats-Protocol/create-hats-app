import { HatsModulesClient } from '@hatsprotocol/modules-sdk';
import { HatsClient } from '@hatsprotocol/sdk-v1-core';
import { HatsSubgraphClient } from '@hatsprotocol/sdk-v1-subgraph';
import { createPublicClient, http } from 'viem';
import { arbitrum, base, mainnet, optimism, polygon, sepolia } from 'viem/chains';
import { createConfig } from 'wagmi';
import { getWalletClient } from 'wagmi/actions';

import { chainsMap } from './web3';

export const localWagmiConfig = createConfig({
  chains: [mainnet, optimism, base, arbitrum, polygon, sepolia],
  transports: {
    [mainnet.id]: http(),
    [optimism.id]: http(),
    [polygon.id]: http(),
    [base.id]: http(),
    [arbitrum.id]: http(),
    [sepolia.id]: http(),
  },
});

export const viemPublicClient = (chainId: number) => {
  return createPublicClient({
    chain: chainsMap(chainId),
    transport: http(),
  });
};

export async function createHatsClient(
  chainId: number | undefined
): Promise<HatsClient | undefined> {
  if (!chainId) return undefined;

  const publicClient = viemPublicClient(chainId);

  try {
    const walletClient = await getWalletClient(localWagmiConfig);

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
    const walletClient = await getWalletClient(localWagmiConfig);

    const hatsModulesClient = new HatsModulesClient({
      publicClient,
      walletClient,
    });

    await hatsModulesClient.prepare();

    return Promise.resolve(hatsModulesClient as HatsModulesClient);
  } catch (e) {
    // If we can't create a wallet client, we can still create a public client
    const hatsModulesClient = new HatsModulesClient({
      publicClient,
    });

    await hatsModulesClient.prepare();

    return Promise.resolve(hatsModulesClient)
  }
}
