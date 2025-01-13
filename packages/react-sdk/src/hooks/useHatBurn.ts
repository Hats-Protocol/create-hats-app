import { Hat } from '@hatsprotocol/sdk-v1-subgraph';
import { TransactionReceipt } from 'viem';
import useHatContractWrite, {
  UseHatContractWriteResult,
} from './useHatContractWrite';

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
}: UseHatBurnProps): UseHatContractWriteResult => {
  return useHatContractWrite({
    functionName: 'renounceHat',
    args: [BigInt(selectedHat.id)],
    chainId,
    onSubmitted,
    onSuccess,
    onError,
    waitForSubgraph,
  });
};

export default useHatBurn;
