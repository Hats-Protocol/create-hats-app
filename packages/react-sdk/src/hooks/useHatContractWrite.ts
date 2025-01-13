import { HATS_ABI, HATS_V1 } from '@hatsprotocol/sdk-v1-core';
import { TransactionReceipt } from 'viem';
import { useChainId, useConfig, useWriteContract } from 'wagmi';
import { waitForTransactionReceipt } from 'wagmi/actions';
import { useState } from 'react';

// Extract write function names from ABI
type AbiFunction = (typeof HATS_ABI)[number] & {
  type: 'function';
  stateMutability: 'nonpayable' | 'payable';
};
export type ValidFunctionName = AbiFunction['name'];

export interface UseHatContractWriteProps<T extends ValidFunctionName> {
  functionName: T;
  args?: (string | number | bigint)[];
  chainId?: number;
  enabled?: boolean;
  onSubmitted?: (hash: `0x${string}`) => void;
  onSuccess?: (data: TransactionReceipt) => void;
  onError?: (error: Error) => void;
  waitForSubgraph?: (data?: TransactionReceipt) => void;
}

export interface UseHatContractWriteResult {
  writeAsync: () => Promise<`0x${string}` | null>;
  isLoading: boolean;
  isPending: boolean;
}

const useHatContractWrite = <T extends ValidFunctionName>({
  functionName,
  args,
  chainId,
  enabled = true,
  onSubmitted,
  onSuccess,
  onError,
  waitForSubgraph,
}: UseHatContractWriteProps<T>): UseHatContractWriteResult => {
  const currentChainId = useChainId();
  const config = useConfig();
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const { writeContractAsync } = useWriteContract();

  const write = async () => {
    if (!enabled || !chainId || currentChainId !== chainId) return null;
    setIsLoading(true);
    setIsPending(true);

    try {
      // @ts-expect-error - wagmi types are not fully compatible
      const hash = await writeContractAsync({
        address: HATS_V1,
        chainId: Number(chainId),
        abi: HATS_ABI,
        functionName,
        args,
      });

      if (typeof hash === 'string') {
        const txHash = hash as `0x${string}`;
        if (onSubmitted) onSubmitted(txHash);

        const receipt = await waitForTransactionReceipt(config, {
          hash: txHash,
        });

        if (onSuccess) onSuccess(receipt);
        if (waitForSubgraph) waitForSubgraph(receipt);

        setIsPending(false);
        return txHash;
      }

      setIsPending(false);
      return null;
    } catch (error: any) {
      const err = error as Error;
      if (onError) onError(err);
      setIsPending(false);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    writeAsync: write,
    isLoading,
    isPending,
  };
};

export default useHatContractWrite;
