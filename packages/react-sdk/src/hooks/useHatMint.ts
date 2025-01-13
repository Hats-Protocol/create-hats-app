import { Hat } from '@hatsprotocol/sdk-v1-subgraph';
import { TransactionReceipt } from 'viem';
import useHatContractWrite, {
  UseHatContractWriteResult,
} from './useHatContractWrite';

export interface UseHatMintProps {
  selectedHat: Hat;
  chainId: number;
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
}: UseHatMintProps): UseHatContractWriteResult => {
  return useHatContractWrite({
    functionName: 'mintHat',
    args: [BigInt(selectedHat.id), wearer],
    chainId,
    onSubmitted,
    onSuccess,
    onError,
    waitForSubgraph,
  });
};

export default useHatMint;
