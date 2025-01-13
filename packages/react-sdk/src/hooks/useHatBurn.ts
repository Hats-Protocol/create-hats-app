import { Hat } from '@hatsprotocol/sdk-v1-subgraph';
import { TransactionReceipt } from 'viem';
import useHatContractWrite, { ValidFunctionName } from './useHatContractWrite';

export interface UseHatBurnProps {
  selectedHat: Hat;
  chainId?: number;
  onSubmitted?: (hash: `0x${string}`) => void;
  onSuccess?: (data: TransactionReceipt) => void;
  onError?: (error: Error) => void;
  waitForSubgraph?: () => void;
}

const useHatBurn = ({
  selectedHat,
  chainId,
  onSubmitted,
  onSuccess,
  onError,
  waitForSubgraph,
}: UseHatBurnProps) => {
  const { writeAsync, isLoading, isPending } = useHatContractWrite({
    functionName: 'renounceHat' as ValidFunctionName,
    args: [BigInt(selectedHat.id)],
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

export default useHatBurn;
