import {
  arbitrum,
  base,
  celo,
  // baseSepolia,
  Chain,
  gnosis,
  mainnet,
  optimism,
  polygon,
  sepolia,
} from 'wagmi/chains';

// ORDER HERE WILL BE USED IN THE UI
export const orderedChains: number[] = [
  // main networks
  1, // mainnet
  10, // optimism
  42161, // arbitrum
  137, // polygon
  100, // gnosis
  8453, // base
  42220, // celo
  // testnets
  11155111, // sepolia
  // 84532 // baseSepolia
];

// celo and gnosis are missing images, also used by NetworkFilter
export const networkImages: { [key in number]: string } = {
  1: '/chains/ethereum.svg',
  10: '/chains/optimism.svg',
  100: '/chains/gnosis.png',
  137: '/chains/polygon.svg',
  8453: '/chains/base.png',
  42161: '/chains/arbitrum.svg',
  42220: '/chains/celo.svg',
  // 84532: '/chains/base-sepolia.svg',
  11155111: '/chains/sepolia.png',
};

const extendIcon = (chain: Chain) => ({
  ...chain,
  hasIcon: true,
  iconUrl: networkImages[chain.id as number],
  iconBackground: 'none',
});

export const chainsList: { [key in number]: Chain } = {
  1: mainnet,
  10: optimism,
  42161: arbitrum,
  137: polygon,
  100: extendIcon(gnosis),
  8453: base,
  42220: extendIcon(celo),

  // TESTNETS
  11155111: extendIcon(sepolia),
  // 84532: baseSepolia,
};