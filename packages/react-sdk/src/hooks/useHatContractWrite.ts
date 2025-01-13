import { HATS_ABI, HATS_V1 } from '@hatsprotocol/sdk-v1-core';
import { TransactionReceipt } from 'viem';
import { useChainId, useConfig, useWriteContract } from 'wagmi';
import { waitForTransactionReceipt } from 'wagmi/actions';
import { useState } from 'react';

type ExtractFunctionNames<ABI> = ABI extends {
  name: infer N;
  type: 'function';
}[]
  ? N
  : never;

export type ValidFunctionName = ExtractFunctionNames<typeof HATS_ABI>;

interface UseHatContractWriteProps<T extends ValidFunctionName> {
  functionName: T;
  args?: (string | number | bigint)[];
  chainId: number;
  txDescription?: string;
  enabled?: boolean;
  onSuccess?: (data: TransactionReceipt) => void;
  onError?: (error: Error) => void;
  waitForSubgraph?: () => void;
}

const useHatContractWrite = <T extends ValidFunctionName>({
  functionName,
  args,
  chainId,
  enabled = true,
  onSuccess,
  onError,
  waitForSubgraph,
}: UseHatContractWriteProps<T>) => {
  const currentChainId = useChainId();
  const config = useConfig();
  const [isLoading, setIsLoading] = useState(false);

  const { writeContract } = useWriteContract();

  const write = async () => {
    if (!enabled || !chainId || currentChainId !== chainId) return null;
    setIsLoading(true);

    try {
      // @ts-expect-error - wagmi types are not fully compatible
      const hash = await writeContract({
        address: HATS_V1[chainId as keyof typeof HATS_V1] as `0x${string}`,
        abi: HATS_ABI,
        functionName,
        args,
      });

      if (typeof hash === 'string') {
        const receipt = await waitForTransactionReceipt(config, { hash });
        if (onSuccess) onSuccess(receipt);
        if (waitForSubgraph) waitForSubgraph();
      }

      return hash;
    } catch (error: any) {
      if (onError) onError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { writeAsync: write, isLoading };
};

export default useHatContractWrite;
