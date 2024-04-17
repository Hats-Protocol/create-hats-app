// import { CONFIG } from '@hatsprotocol/constants';

import { HATS_V1, HATS_ABI } from '@hatsprotocol/sdk-v1-core';
import { config } from 'process';
import { useState } from 'react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

import { TransactionReceipt } from 'viem';
import {
  useChainId,
  useContractWrite,
  usePrepareContractWrite,
  // useQueryClient,
  useWaitForTransaction,
} from 'wagmi';

type ExtractFunctionNames<ABI> = ABI extends {
  name: infer N;
  type: 'function';
}[]
  ? N
  : never;

export type ValidFunctionName = ExtractFunctionNames<typeof HATS_ABI>;

interface ContractInteractionProps<T extends ValidFunctionName> {
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

  onErrorToastData,

  enabled,
}: // handlePendingTx,

ContractInteractionProps<T>) => {
  // const toast = useToast();
  const userChainId = useChainId();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [toastShown, setToastShown] = useState(false);

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
    onError(error) {
      if (
        error.name === 'TransactionExecutionError' &&
        error.message.includes('User rejected the request')
      ) {
        console.log({
          title: 'Signature rejected!',
          description: 'Please accept the transaction in your wallet',
        });
        toast.error('Please accept the transaction in your wallet.');
      } else {
        console.log({
          title: 'Error occurred!',
          description:
            onErrorToastData?.description ??
            'An error occurred while processing the transaction.',
        });
        toast.error('An error occurred while processing the transaction.');
      }
    },
  });
  const { isLoading: txLoading, isSuccess: isSuccessTx } =
    useWaitForTransaction({
      hash: data?.hash,
      onSuccess(data) {
        toast.success('Transaction successful.');
        queryClient.invalidateQueries({ queryKey: ['hatData', chainId] });

        // router.refresh();
      },
      onError(error) {
        console.log('error!!', error);
        if (
          error.name === 'TransactionExecutionError' &&
          error.message.includes('User rejected the request')
        ) {
          console.log({
            title: 'Signature rejected!',
            description: 'Please accept the transaction in your wallet',
          });
          toast.error('Please accept the transaction in your wallet.');
        } else {
          console.log({
            title: 'Error occurred!',
            description:
              onErrorToastData?.description ??
              'An error occurred while processing the transaction.',
          });
          toast.error('An error occurred while processing the transaction.');
        }
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
