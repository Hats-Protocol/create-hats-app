import { CONFIG, STATUS } from '@hatsprotocol/constants';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from 'hooks';
import { AppHat, HandlePendingTx } from 'types';
import { decimalId } from 'hats-utils';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { idToIp, toTreeId } from 'shared';
import { checkAddressIsContract } from 'utils';
import { Hex, TransactionReceipt } from 'viem';
import { useChainId, useContractWrite, usePrepareContractWrite } from 'wagmi';

const useHatStatusCheck = ({
  hatData,
  chainId,
  handlePendingTx,
}: {
  hatData?: AppHat;
  chainId?: number;
  handlePendingTx?: HandlePendingTx;
}) => {
  const toast = useToast();
  const currentNetworkId = useChainId();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [toggleIsContract, setToggleIsContract] = useState(false);
  const [testingToggle, setTestingToggle] = useState(false);

  useEffect(() => {
    const testToggle = async () => {
      setTestingToggle(true);
      const localData = await checkAddressIsContract(
        hatData?.toggle as Hex,
        chainId,
      );
      setToggleIsContract(localData);
      setTestingToggle(false);
    };
    testToggle();
  }, [hatData, chainId]);

  const { config, error: prepareError } = usePrepareContractWrite({
    address: CONFIG.hatsAddress,
    chainId,
    abi: CONFIG.hatsAbi,
    functionName: 'checkHatStatus',
    args: [decimalId(_.get(hatData, 'id'))],
    enabled:
      Boolean(decimalId(_.get(hatData, 'id'))) &&
      toggleIsContract &&
      currentNetworkId === chainId,
  });

  const {
    writeAsync,
    error: writeError,
    isLoading: writeLoading,
  } = useContractWrite({
    ...config,
    onSuccess: async (data) => {
      setIsLoading(true);

      const txDescription = `Check Hat Status for ${idToIp(
        _.get(hatData, 'id'),
      )}`;

      toast.info({
        title: 'Transaction submitted',
        description: 'Waiting for your transaction to be accepted...',
      });

      await handlePendingTx?.({
        hash: _.get(data, 'hash'),
        txChainId: chainId,
        txDescription,
        toastData: {
          title: 'Transaction Confirmed',
          description: 'Checking Hat Status...',
        },
        onSuccess: (d?: TransactionReceipt) => {
          const logs = _.get(d, 'logs');
          if (logs?.length === 0) {
            toast.success({
              title: txDescription,
              description: `No change: Hat Status remains ${
                hatData?.status ? STATUS.ACTIVE : STATUS.INACTIVE
              }`,
            });
          } else {
            const logData = _.get(_.first(logs), 'data');
            toast.success({
              title: txDescription,
              description: `Hat Status Changed to ${
                _.first(_.slice(logData, -1, _.size(logData))) === '1'
                  ? STATUS.ACTIVE
                  : STATUS.INACTIVE
              }`,
            });

            setTimeout(() => {
              queryClient.invalidateQueries({
                queryKey: ['hatDetails', { id: _.get(hatData, 'id'), chainId }],
              });
              queryClient.invalidateQueries({
                queryKey: ['treeDetails', toTreeId(_.get(hatData, 'id'))],
              });
            }, 4000);
          }
        },
      });
      setIsLoading(false);
    },
    onError: (error) => {
      if (error.name === 'UserRejectedRequestError') {
        toast.error({
          title: 'Signature rejected!',
          description: 'Please accept the transaction in your wallet',
        });
      } else {
        toast.error({
          title: 'Error occurred!',
          // description: 'Please accept the transaction in your wallet',
        });
      }
    },
  });

  return {
    writeAsync,
    prepareError,
    writeError,
    isLoading: isLoading || testingToggle || writeLoading,
    toggleIsContract,
  };
};

export default useHatStatusCheck;
