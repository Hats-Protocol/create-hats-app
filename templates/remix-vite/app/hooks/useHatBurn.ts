import { hatIdDecimalToIp } from '@hatsprotocol/sdk-v1-core';
import { Hat } from '@hatsprotocol/sdk-v1-subgraph';
import _ from 'lodash';

import { useAccount, useChainId } from 'wagmi';

import useHatContractWrite, { ValidFunctionName } from './useHatContractWrite';

const useHatBurn = ({
  selectedHat,
  chainId,
}: // handlePendingTx,

{
  selectedHat: Hat; // AppHat;
  chainId: number; // SupportedChains;

  waitForSubgraph?: () => void | undefined;
}) => {
  const currentNetworkId = useChainId();
  const { address } = useAccount();

  const hatId = selectedHat?.id;
  const wearers = selectedHat?.wearers || [];

  const txDescription =
    hatId && `Renounced hat ${hatIdDecimalToIp(BigInt(hatId))}`;

  const { writeAsync, isLoading, isSuccess, prepareErrorMessage } =
    useHatContractWrite({
      functionName: 'renounceHat' as ValidFunctionName,
      args: [BigInt(hatId)],
      chainId: Number(chainId),
      txDescription,
      onSuccessToastData: {
        title: 'Hat removed!',
        description: txDescription,
      },

      enabled: Boolean(hatId) && chainId === currentNetworkId,
    });

  return { writeAsync, isLoading, isSuccess, prepareErrorMessage };
};

export default useHatBurn;
