import { hatIdDecimalToIp } from '@hatsprotocol/sdk-v1-core';
import { Hat } from '@hatsprotocol/sdk-v1-subgraph';
import { TransactionReceipt } from 'viem';
import { useChainId } from 'wagmi';

import useHatContractWrite, { ValidFunctionName } from './useHatContractWrite';

interface UseHatMintProps {
  selectedHat: Hat;
  chainId: number;
  wearer: `0x${string}`;
  onSuccess?: (data: TransactionReceipt) => void;
  onError?: (error: Error) => void;
  waitForSubgraph?: () => void;
}

const useHatMint = ({
  selectedHat,
  chainId,
  wearer,
  onSuccess,
  onError,
  waitForSubgraph,
}: UseHatMintProps) => {
  const currentNetworkId = useChainId();
  const hatId = selectedHat?.id;

  const txDescription =
    hatId && `Minted hat ${hatIdDecimalToIp(BigInt(hatId))}`;

  const { writeAsync, isLoading } = useHatContractWrite({
    functionName: 'mintHat' as ValidFunctionName,
    args: [BigInt(hatId), wearer],
    chainId,
    txDescription,
    enabled: Boolean(hatId) && chainId === currentNetworkId,
    onSuccess,
    onError,
    waitForSubgraph,
  });

  return { writeAsync, isLoading };
};

export default useHatMint;
