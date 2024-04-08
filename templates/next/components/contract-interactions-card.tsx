'use client';

import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { useHatBurn } from '@/hooks';
import {
  useAccount,
  useChainId,
  useNetwork,
  usePublicClient,
  useWalletClient,
} from 'wagmi';
import { Hat } from '@hatsprotocol/sdk-v1-subgraph';
// import { createHatsClient, viemPublicClient } from '@/lib/hats';
import { HatsClient } from '@hatsprotocol/sdk-v1-core';
import { chain } from 'lodash';
import { createWalletClient, custom } from 'viem';
import { WriteContractResult } from 'wagmi/actions';

// const claimHatResult = await hatsClient.claimHat({
//   account,
//   hatId,
// });

interface ContractInteractionProps {
  selectedHat: Hat;
}

const isWearingHat = (
  wearers: { id: string }[],
  connectedAddress: string | undefined
): boolean => {
  return connectedAddress
    ? wearers.some(
        (wearer) => wearer.id.toLowerCase() === connectedAddress.toLowerCase()
      )
    : false;
};

export default function ContractInteractionsCard({
  selectedHat,
}: ContractInteractionProps) {
  const { isConnected, address } = useAccount();

  const chainId = useChainId();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  // const hatsClient = createHatsClient(chainId);
  // console.log('hats client', hatsClient);
  interface UseHatBurnResult {
    isLoading: boolean;
    writeAsync: (() => Promise<WriteContractResult>) | undefined;
  }

  const { isLoading, writeAsync: burnHatAsync }: UseHatBurnResult = useHatBurn({
    selectedHat,
    chainId,
  });

  const handleBurnHat = async () => {
    const hatsClient = walletClient
      ? new HatsClient({
          chainId,
          publicClient: publicClient,
          walletClient: walletClient,
        })
      : undefined;

    if (
      !isLoading &&
      isConnected &&
      chainId !== undefined &&
      address &&
      hatsClient !== undefined
      // burnHatAsync !== undefined
    ) {
      try {
        console.log('try block');

        // await burnHatAsync?.();
        const burnResult = burnHatAsync?.();
        // const renounceHatResult = await hatsClient.renounceHat({
        //   account: address,
        //   hatId: BigInt(selectedHat.id),
        // });

        // console.log('renounceHatResult', renounceHatResult);
      } catch (error) {}
    }
  };

  return (
    <Card className="max-w-2xl shadow-xl">
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4 py-8 px-4 md:px-16">
          <Button variant="default">Mint</Button>
          <Button variant="default">Claim</Button>
          <Button
            onClick={handleBurnHat}
            disabled={
              !isConnected ||
              isWearingHat(selectedHat.wearers || [], address) === false
            }
            variant="default"
          >
            Renounce
          </Button>
          <Button variant="default">Deactivate</Button>
          <Button variant="default">Test Hat Status</Button>
          <Button variant="default">Make Immutable</Button>
        </div>
      </CardContent>
    </Card>
  );
}
