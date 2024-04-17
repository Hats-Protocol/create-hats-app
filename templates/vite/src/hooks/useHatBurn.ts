import { hatIdToTreeId, hatIdDecimalToIp } from '@hatsprotocol/sdk-v1-core';
import { Hat } from '@hatsprotocol/sdk-v1-subgraph';
import _ from 'lodash';
// import { AppHat, HandlePendingTx, SupportedChains } from 'types';
import { useAccount, useChainId } from 'wagmi';

import useHatContractWrite, { ValidFunctionName } from './useHatContractWrite';

const useHatBurn = ({
  selectedHat,
  chainId,
}: // handlePendingTx,
// waitForSubgraph,
{
  selectedHat: Hat; // AppHat;
  chainId: number; // SupportedChains;
  // handlePendingTx?: HandlePendingTx;
  waitForSubgraph?: () => void | undefined;
}) => {
  const currentNetworkId = useChainId();
  const { address } = useAccount();

  const hatId = selectedHat?.id;
  const wearers = selectedHat?.wearers || [];
  const currentlyWearing = _.findKey(wearers, ['id', _.toLower(address)]);

  const txDescription =
    hatId && `Renounced hat ${hatIdDecimalToIp(BigInt(hatId))}`;

  const { writeAsync, isLoading, isSuccess, prepareErrorMessage } =
    useHatContractWrite({
      functionName: 'renounceHat' as ValidFunctionName,
      args: [BigInt(hatId)],
      chainId: Number(chainId),
      txDescription,
      onSuccessToastData: {
        title: 'Hat removed!',
        description: txDescription,
      },
      // handlePendingTx,
      // waitForSubgraph,
      // queryKeys: [
      //   ['hatDetails', { id: hatId, chainId }],
      //   ['treeDetails', hatIdToTreeId(BigInt(hatId || '')), chainId || ''],
      //   ['orgChartTree'],
      // ],
      // enabled: true,
      enabled: Boolean(hatId) && chainId === currentNetworkId,
    });

  return { writeAsync, isLoading, isSuccess, prepareErrorMessage };
};

export default useHatBurn;
