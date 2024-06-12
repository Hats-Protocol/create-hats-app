import { Module } from '@hatsprotocol/modules-sdk';
import _ from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { createHatsClient, createHatsModulesClient } from '@/lib/hats';
import { Hex, isAddress } from 'viem';
import { useAccount, useContractRead } from 'wagmi';
import { Hat } from '@hatsprotocol/sdk-v1-subgraph';
import { CLAIMS_HATTER_MODULE_NAME } from '@/lib/constants';

const useHatClaimFor = ({
  selectedHat,
  chainId,
  wearer,
}: {
  selectedHat?: Hat; // AppHat | null;
  chainId?: number; // SupportedChains;
  wearer: Hex | undefined;
}) => {
  const [claimsHatter, setClaimsHatter] = useState<Module | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const { address } = useAccount();

  const [canClaimForAccount, setCanClaimForAccount] = useState<boolean>();

  const claimableForAddress: Hex | undefined = useMemo(
    () => _.get(_.first(_.get(selectedHat, 'claimableForBy')), 'id') as Hex,
    [selectedHat]
  );

  const { data: isClaimableFor, isLoading: isLoadingClaimableFor } =
    useContractRead({
      address: claimableForAddress,
      abi: claimsHatter?.abi,
      chainId,
      functionName: 'isClaimableFor',
      args: [wearer || '0x', selectedHat?.id || '0x'],
      enabled: !!claimsHatter && !!selectedHat && (!!address || !!wearer),
    });

  useEffect(() => {
    const getCanClaimForAccount = async () => {
      const hatsClient = createHatsClient(chainId);
      if (!hatsClient || !wearer || !isAddress(wearer)) return;
      const canClaimFor = await hatsClient.canClaimForAccount({
        hatId: BigInt(selectedHat?.id || '0x'),
        account: wearer,
      });

      setCanClaimForAccount(canClaimFor);
    };
    getCanClaimForAccount();
  }, [chainId, selectedHat, wearer]);

  const claimHatFor = async (account: Hex) => {
    const hatsClient = createHatsClient(chainId);
    if (!hatsClient || !address) return;

    try {
      setIsLoading(true);

      await hatsClient.claimHatFor({
        account: address,
        hatId: BigInt(selectedHat?.id || '0x'),
        wearer: account,
      });

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  useEffect(() => {
    const getHatter = async () => {
      const moduleClient = await createHatsModulesClient(chainId);
      if (!moduleClient) return;
      const modules = moduleClient?.getAllModules();
      if (!modules) return;
      const moduleData = _.find(modules, {
        name: CLAIMS_HATTER_MODULE_NAME,
      });
      if (!moduleData) return;
      setClaimsHatter(moduleData);
    };
    getHatter();
  }, [chainId]);

  return {
    claimHatFor,
    isClaimableFor,
    canClaimForAccount,
    isLoading: isLoading || isLoadingClaimableFor,
  };
};

export default useHatClaimFor;
