// import { CONFIG } from '@hatsprotocol/constants';
// import { useQueryClient } from '@tanstack/react-query';
// import { useToast } from 'hooks';
import { HATS_V1, HATS_ABI } from '@hatsprotocol/sdk-v1-core';
import { useRouter } from 'next/navigation';

import { useState } from 'react';
import { toast } from 'sonner';
// import { HandlePendingTx } from 'types';
// import { formatFunctionName } from 'utils';
import { TransactionReceipt } from 'viem';
import {
  useChainId,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi';

type ExtractFunctionNames<ABI> = ABI extends {
  name: infer N;
  type: 'function';
}[]
  ? N
  : never;

type ValidFunctionName = ExtractFunctionNames<typeof HATS_ABI>;

interface ContractInteractionProps<
  T extends ValidFunctionName
  // A extends any[]
> {
  functionName: T;

  args?: (string | number | bigint)[];
  value?: any;
  chainId?: number;
  onSuccessToastData?: { title: string; description?: string };
  txDescription?: string;
  onErrorToastData?: { title: string; description?: string };
  queryKeys?: (object | string | number)[][];
  transactionTimeout?: number;
  enabled: boolean;
  // handlePendingTx?: HandlePendingTx; // pass both handlePendingTx and handleSuccess to useHatContractWrite
  handleSuccess?: (data?: TransactionReceipt) => void; // passed with handlePendingTx
  waitForSubgraph?: (data?: TransactionReceipt) => void; // passed with handleSuccess
}

const useHatContractWrite = <T extends ValidFunctionName>({
  functionName,
  args,
  chainId,
  onSuccessToastData,
  txDescription,
  onErrorToastData,
  queryKeys = [],
  transactionTimeout = 500,
  enabled,
  // handlePendingTx,
  handleSuccess,
  waitForSubgraph,
}: ContractInteractionProps<T, A>) => {
  // const toast = useToast();
  const userChainId = useChainId();
  // const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [toastShown, setToastShown] = useState(false);

  const router = useRouter();

  console.log('functionName', functionName);
  console.log('args', args);
  const { config, error: prepareError } = usePrepareContractWrite({
    address: HATS_V1,
    chainId: Number(chainId),
    abi: HATS_ABI,

    functionName,
    args,
    enabled: enabled && !!chainId && userChainId === chainId,
  });

  const {
    data,
    writeAsync,
    error: writeError,
    isLoading: writeLoading,
  } = useContractWrite({
    ...config,
  });
  const { isLoading: txLoading, isSuccess: isSuccessTx } =
    useWaitForTransaction({
      hash: data?.hash,
      onSuccess(data) {
        console.log('Success', data);
        toast.success('Transaction successful.');
        router.refresh();
      },
    });
  if (txLoading && !toastShown) {
    toast.info('Waiting for your transaction to be accepted...');
    setToastShown(true);
  }

  const extractErrorMessage = (error: Error | null) => {
    if (!error) return '';

    let errorMessage = error.message || '';
    const errorMatch = errorMessage.match(/Error:\s*(.*)/);
    const [, errorMessageMatch] = errorMatch || [];
    errorMessage = errorMessageMatch || errorMessage;
    errorMessage = errorMessage.replace(/\(.*\)/, '').trim();

    return errorMessage || 'An unknown error occurred';
  };

  return {
    writeAsync,
    isLoading: isLoading || writeLoading || txLoading,
    isSuccess: isSuccessTx,
    prepareError,
    prepareErrorMessage: extractErrorMessage(prepareError),
    writeError,
  };
};

export default useHatContractWrite;
