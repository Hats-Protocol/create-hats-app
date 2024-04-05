import { createHatsModulesClient } from '@/lib/hats';
import { Module, ModuleParameter } from '@hatsprotocol/modules-sdk';
import { FALLBACK_ADDRESS } from '@hatsprotocol/sdk-v1-core';
import { Hex, zeroAddress } from 'viem';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';

const useModuleDetails = ({
  address,
  chainId,
  enabled = true,
  editMode,
}: {
  address: Hex | undefined;
  chainId: number | undefined; // SupportedChains | undefined;
  enabled?: boolean;
  editMode?: boolean;
}) => {
  const getModuleData = async () => {
    if (!chainId || !address) return null;

    const moduleClient = await createHatsModulesClient(chainId);

    if (!moduleClient) return null;

    const promises = [
      moduleClient.getModuleByInstance(address),
      moduleClient.getInstanceParameters(address),
    ];
    const [moduleData, localModuleParameters] = await Promise.all(promises);

    console.log('module detais', moduleData);

    if (!moduleData) return null;

    return {
      details: moduleData as Module,
      parameters: localModuleParameters as ModuleParameter[],
    };
  };

  if (!address && address === FALLBACK_ADDRESS && address === zeroAddress)
    return;

  const { data, isLoading, fetchStatus } = useQuery({
    queryKey: ['moduleDetails', address],
    queryFn: getModuleData,
    enabled:
      !!address &&
      address !== FALLBACK_ADDRESS &&
      address !== zeroAddress &&
      enabled,
    staleTime: editMode ? Infinity : 1000 * 60 * 15, // 15 minutes
  });

  return {
    details: data?.details,
    parameters: data?.parameters,
    isLoading: isLoading && fetchStatus !== 'idle',
  };
};

export default useModuleDetails;
