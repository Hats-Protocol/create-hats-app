import { hatIdDecimalToIp } from '@hatsprotocol/sdk-v1-core';
import { Hat } from '@hatsprotocol/sdk-v1-subgraph';
import _ from 'lodash';
import { useAccount, useChainId } from 'wagmi';

import useHatContractWrite, { ValidFunctionName } from './useHatContractWrite';

const useHatMint = ({
  selectedHat,
  chainId,
  wearer,
}: {
  selectedHat: Hat;
  chainId: number;
  wearer: `0x${string}`;
}) => {
  const currentNetworkId = useChainId();
  const { address } = useAccount();
  const hatId = selectedHat?.id;

  const wearers = selectedHat?.wearers || [];
  const currentlyWearing = _.findKey(wearers, ['id', _.toLower(address)]);
  console.log('currently wearing hat', currentlyWearing);

  const txDescription =
    hatId && `Minted hat ${hatIdDecimalToIp(BigInt(hatId))}`;

  const {
    writeAsync,
    isLoading,
    isSuccess: isSuccessTx,
    prepareErrorMessage,
  } = useHatContractWrite({
    functionName: 'mintHat' as ValidFunctionName,
    args: [BigInt(hatId), wearer],
    chainId,
    txDescription,
    enabled: Boolean(hatId) && chainId === currentNetworkId,
  });

  console.log('prepareErrorMessage', prepareErrorMessage);

  return { writeAsync, isLoading, isSuccessTx, prepareErrorMessage };
};

export default useHatMint;
