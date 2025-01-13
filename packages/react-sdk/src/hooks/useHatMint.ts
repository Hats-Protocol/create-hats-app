import { Hat } from '@hatsprotocol/sdk-v1-subgraph';
import { TransactionReceipt } from 'viem';
import useHatContractWrite, { ValidFunctionName } from './useHatContractWrite';

export interface UseHatMintProps {
  selectedHat: Hat;
  chainId?: number;
  wearer: `0x${string}`;
  onSubmitted?: (hash: `0x${string}`) => void;
  onSuccess?: (data: TransactionReceipt) => void;
  onError?: (error: Error) => void;
  waitForSubgraph?: () => void;
}

const useHatMint = ({
  selectedHat,
  chainId,
  wearer,
  onSubmitted,
  onSuccess,
  onError,
  waitForSubgraph,
}: UseHatMintProps) => {
  const { writeAsync, isLoading, isPending } = useHatContractWrite({
    functionName: 'mintHat' as ValidFunctionName,
    args: [BigInt(selectedHat.id), wearer],
    chainId,
    onSubmitted,
    onSuccess: (data) => {
      if (onSuccess) onSuccess(data);
      if (waitForSubgraph) waitForSubgraph();
    },
    onError,
  });

  return {
    writeAsync,
    isLoading,
    isPending,
  };
};

export default useHatMint;
