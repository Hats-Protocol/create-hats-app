import { hatIdDecimalToIp } from '@hatsprotocol/sdk-v1-core';
import { Hat } from '@hatsprotocol/sdk-v1-subgraph';
import { TransactionReceipt } from 'viem';
import { useChainId } from 'wagmi';

import useHatContractWrite, { ValidFunctionName } from './useHatContractWrite';

interface UseHatBurnProps {
  selectedHat: Hat;
  chainId: number;
  waitForSubgraph?: () => void;
  onSuccess?: (data: TransactionReceipt) => void;
  onError?: (error: Error) => void;
}

const useHatBurn = ({
  selectedHat,
  chainId,
  waitForSubgraph,
  onSuccess,
  onError,
}: UseHatBurnProps) => {
  const currentNetworkId = useChainId();
  const hatId = selectedHat?.id;

  const txDescription =
    hatId && `Renounced hat ${hatIdDecimalToIp(BigInt(hatId))}`;

  const { writeAsync, isLoading } = useHatContractWrite({
    functionName: 'renounceHat' as ValidFunctionName,
    args: [BigInt(hatId)],
    chainId: Number(chainId),
    txDescription,
    enabled: Boolean(hatId) && chainId === currentNetworkId,
    onSuccess,
    onError,
    waitForSubgraph,
  });

  return { writeAsync, isLoading };
};

export default useHatBurn;
