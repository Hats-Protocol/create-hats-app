import _ from "lodash";
import { Chain } from "viem";
import { configureChains } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { chainsList, orderedChains } from "./chains";

const ALCHEMY_ID = process.env.NEXT_PUBLIC_ALCHEMY_ID;

export const chainsMap = (chainId?: number) =>
  chainId
    ? chainsList[chainId as number]
    : (_.first(_.values(chainsList)) as Chain);

export const explorerUrl = (chainId?: number) =>
  chainId &&
  _.get(
    chainsMap(chainId),
    'blockExplorers.etherscan.url',
    _.get(chainsMap(chainId), 'blockExplorers.default.url'),
  );

const configuredChains: any = configureChains(
  _.map(orderedChains, (c: number) => chainsMap(c)),
  [alchemyProvider({ apiKey: ALCHEMY_ID || '' }), publicProvider()],
);

const { chains, publicClient } = configuredChains;

export { chains, publicClient };
