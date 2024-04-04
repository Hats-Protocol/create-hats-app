import { hatIdDecimalToIp, hatIdHexToDecimal, hatIdToTreeId } from '@hatsprotocol/sdk-v1-core';
import { Hat } from '@hatsprotocol/sdk-v1-subgraph';
// import { useWaitForSubgraph } from 'hooks';
import _ from 'lodash';
// import { AppHat, HandlePendingTx, SupportedChains } from 'types';
// import { fetchHatDetails } from 'utils';
import { useChainId } from 'wagmi';

import useHatContractWrite from './useHatContractWrite';


const useHatMakeImmutable = ({
  selectedHat,
  onchainHats,
  chainId,
  isAdminUser,
  mutable,
  // handlePendingTx,
}: UseHatMakeImmutableProps) => {
  const currentNetworkId = useChainId();
  const selectedHatId = selectedHat?.id;

  // const waitForSubgraph = useWaitForSubgraph({
  //   fetchHelper: () => fetchHatDetails(selectedHat.id, chainId),
  //   checkResult: (hatDetails) => !hatDetails?.mutable,
  // });

  const { writeAsync, isLoading } = useHatContractWrite({
    functionName: 'makeHatImmutable',
    args: [hatIdHexToDecimal(selectedHatId)],
    chainId: Number(chainId),
    // handlePendingTx,
    // waitForSubgraph,
    onSuccessToastData: {
      title: 'Hat Updated!',
      description:
        selectedHatId &&
        `Successfully made hat #${hatIdDecimalToIp(
          BigInt(selectedHatId),
        )} immutable`,
    },
    queryKeys: [
      ['hatDetails', { id: selectedHatId, chainId }],
      ['treeDetails', !!selectedHatId ? hatIdToTreeId(BigInt(selectedHatId)) : {}],
    ],
    enabled:
      !!selectedHatId &&
      !!selectedHat?.mutable &&
      Boolean(hatIdHexToDecimal(selectedHatId)) &&
      !!mutable &&
      _.gt(selectedHat?.levelAtLocalTree, 0) &&
      _.includes(_.map(onchainHats, 'id'), selectedHatId) &&
      !!isAdminUser &&
      chainId === currentNetworkId,
  });

  return { writeAsync, isLoading };
};

export default useHatMakeImmutable;

interface UseHatMakeImmutableProps {
  selectedHat: Hat; // AppHat;
  onchainHats: Hat[]; // AppHat[];
  chainId: number | undefined; // SupportedChains | undefined;
  isAdminUser?: boolean;
  mutable?: boolean;
  // handlePendingTx?: HandlePendingTx | undefined;
}
