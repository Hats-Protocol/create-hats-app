// import { CONFIG } from '@hatsprotocol/constants';
// import { useQueryClient } from '@tanstack/react-query';
// import { useToast } from 'hooks';
import { HATS_V1, HATS_ABI } from '@hatsprotocol/sdk-v1-core';
import { useState } from 'react';
// import { HandlePendingTx } from 'types';
// import { formatFunctionName } from 'utils';
import { TransactionReceipt } from 'viem';
import { useChainId, useContractWrite, usePrepareContractWrite } from 'wagmi';

interface ContractInteractionProps {
  functionName: string;
  args: unknown[];
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

const useHatContractWrite = ({
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
}: ContractInteractionProps) => {
  // const toast = useToast();
  const userChainId = useChainId();
  // const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const { config, error: prepareError } = usePrepareContractWrite({
    address: HATS_V1,
    chainId: Number(chainId),
    abi: HATS_ABI,
    functionName: undefined, // DOOHHHHHHHL?L???????? 'renounceHat',
    args: args as [number, bigint],
    enabled: enabled && !!chainId && userChainId === chainId,
  });

  const {
    writeAsync,
    error: writeError,
    isLoading: writeLoading,
    // @ts-expect-error something with the missing function name above
  } = useContractWrite({
    ...config,
    onSuccess: async (data) => {
      setIsLoading(true);
      // toast.info({
      //   title: 'Transaction submitted',
      //   description: 'Waiting for your transaction to be accepted...',
      // });

      // await handlePendingTx?.({
      //   hash: data.hash,
      //   txChainId: chainId,
      //   txDescription: txDescription, // || formatFunctionName(functionName),
      //   toastData: onSuccessToastData,
      //   onSuccess: async (d?: TransactionReceipt) => {
      //     handleSuccess?.(d);
      //     await waitForSubgraph?.(d);

      //     // we can remove the timeout after we add waitForSubgraph everywhere
      //     setTimeout(() => {
      //       queryKeys.forEach((key) =>
      //         queryClient.invalidateQueries({
      //           queryKey: key,
      //         }),
      //       );
      //     }, transactionTimeout);
      //   },
      // });
      setIsLoading(false);
    },
    onError: (error) => {
      if (
        error.name === 'TransactionExecutionError' &&
        error.message.includes('User rejected the request')
      ) {
        console.log({
            title: 'Signature rejected!',
            description: 'Please accept the transaction in your wallet',
          })
        // toast.error({
        //   title: 'Signature rejected!',
        //   description: 'Please accept the transaction in your wallet',
        // });
      } else {
        console.log({
          title: 'Error occurred!',
          description:
            onErrorToastData?.description ??
            'An error occurred while processing the transaction.',
        })
        // toast.error({
        //   title: 'Error occurred!',
        //   description:
        //     onErrorToastData?.description ??
        //     'An error occurred while processing the transaction.',
        // });
      }
    },
  });

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
    isLoading: isLoading || writeLoading,
    prepareError,
    prepareErrorMessage: extractErrorMessage(prepareError),
    writeError,
  };
};

export default useHatContractWrite;
