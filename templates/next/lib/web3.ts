import _ from 'lodash';
import { Chain } from 'viem';
import { chainsList } from './chains';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia, mainnet, arbitrum, base, optimism, polygon } from 'viem/chains';

export const chainsMap = (chainId?: number) =>
  chainId
    ? chainsList[chainId as number]
    : (_.first(_.values(chainsList)) as Chain);

export const explorerUrl = (chainId?: number) =>
  chainId &&
  _.get(
    chainsMap(chainId),
    'blockExplorers.etherscan.url',
    _.get(chainsMap(chainId), 'blockExplorers.default.url')
  );


export const wagmiConfig = getDefaultConfig({
  appName: 'Create Hats Next App',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? '',
  chains: [mainnet, optimism, base, arbitrum, polygon, sepolia],
  ssr: true, // If your dApp uses server side rendering (SSR)
});
