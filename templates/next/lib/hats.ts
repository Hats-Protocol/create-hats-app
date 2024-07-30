import { HatsModulesClient } from '@hatsprotocol/modules-sdk';
import { HatsClient } from '@hatsprotocol/sdk-v1-core';
import { HatsSubgraphClient } from '@hatsprotocol/sdk-v1-subgraph';
import { getDefaultWallets } from '@rainbow-me/rainbowkit';
import _ from 'lodash';
import { createPublicClient, http, createWalletClient, custom } from 'viem';
import { createConfig } from 'wagmi';
import { chainsMap, wagmiConfig } from './web3';
import { getWalletClient } from 'wagmi/actions';

const ALCHEMY_ID = process.env.NEXT_PUBLIC_ALCHEMY_ID;

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
  const chain = chainsMap(chainId);

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
