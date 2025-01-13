import { HATS_ABI, HATS_V1 } from '@hatsprotocol/sdk-v1-core';
import { TransactionReceipt } from 'viem';
import { useChainId, useConfig, useWriteContract } from 'wagmi';
import { waitForTransactionReceipt } from 'wagmi/actions';
import { useState } from 'react';

// Explicitly define valid function names for writing
export type ValidFunctionName = 'mintHat' | 'renounceHat';

export interface UseHatContractWriteProps<T extends ValidFunctionName> {
  functionName: T;
  args?: readonly unknown[];
  chainId?: number;
  txDescription?: string;
  enabled?: boolean;
  onSubmitted?: (hash: `0x${string}`) => void;
  onSuccess?: (data: TransactionReceipt) => void;
  onError?: (error: Error) => void;
  waitForSubgraph?: () => void;
}

export interface UseHatContractWriteResult {
  writeAsync: () => Promise<`0x${string}` | null>;
  isLoading: boolean;
  isPending: boolean;
  error: Error | undefined;
  isError: boolean;
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
  const [error, setError] = useState<Error>();

  const { writeContract } = useWriteContract();

  const write = async () => {
    if (!enabled || !chainId || currentChainId !== chainId) return null;
    setIsLoading(true);
    setError(undefined);

    try {
      // @ts-expect-error - wagmi types are not fully compatible
      const hash = await writeContract({
        address: HATS_V1[chainId as keyof typeof HATS_V1] as `0x${string}`,
        abi: HATS_ABI,
        functionName,
        args,
      });

      if (typeof hash === 'string') {
        const txHash = hash as `0x${string}`;
        if (onSubmitted) onSubmitted(txHash);
        setIsPending(true);

        const receipt = await waitForTransactionReceipt(config, {
          hash: txHash,
        });
        if (onSuccess) onSuccess(receipt);
        if (waitForSubgraph) waitForSubgraph();

        setIsPending(false);
        return txHash;
      }

      return null;
    } catch (error: any) {
      const err = error as Error;
      setError(err);
      if (onError) onError(err);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    writeAsync: write,
    isLoading,
    isPending,
    error,
    isError: !!error,
  };
};

export default useHatContractWrite;
