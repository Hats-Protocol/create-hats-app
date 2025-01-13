'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@hatsprotocol/hats-ui';
import { useHatMint } from '@hatsprotocol/react-sdk';
import { hatIdDecimalToIp } from '@hatsprotocol/sdk-v1-core';
import { Hat } from '@hatsprotocol/sdk-v1-subgraph';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAccount, useChainId } from 'wagmi';

import { Input } from '@/components/ui/input';

interface MintFormProps {
  selectedHat: Hat;
}

export default function MintForm({ selectedHat }: MintFormProps) {
  const chainId = useChainId();
  const router = useRouter();
  const { isConnected, address } = useAccount();
  const [ethAddress, setEthAddress] = useState<`0x${string}`>();

  const {
    writeAsync: mintHatAsync,
    isLoading: mintHatIsLoading,
    isPending: mintHatIsPending,
  } = useHatMint({
    selectedHat,
    chainId,
    wearer: ethAddress!,
    onSubmitted: (hash) => {
      toast.info('Waiting for your transaction to be accepted...', {
        description: `Transaction hash: ${hash}`,
      });
    },
    onSuccess: () => {
      const hatId = selectedHat?.id;
      const txDescription =
        hatId && `Minted hat ${hatIdDecimalToIp(BigInt(hatId))}`;
      toast.success('Hat minted!', {
        description: txDescription,
      });
      router.refresh();
    },
    onError: (error) => {
      if (
        error.name === 'TransactionExecutionError' &&
        error.message.includes('User rejected the request')
      ) {
        toast.error('Please accept the transaction in your wallet.');
      } else {
        console.error('Contract write error:', error);
        toast.error('An error occurred while processing the transaction.');
      }
    },
  });

  const handleMintHat = async () => {
    if (
      !mintHatIsLoading &&
      !mintHatIsPending &&
      isConnected &&
      chainId !== undefined &&
      address
    ) {
      try {
        await mintHatAsync?.();
      } catch (error) {
        // Error handling is done in the hook's onError callback
      }
    }
  };

  const isWearingHat = (
    wearers: { id: string }[],
    connectedAddress: string | undefined,
  ): boolean => {
    return connectedAddress
      ? wearers.some(
          (wearer) =>
            wearer.id.toLowerCase() === connectedAddress.toLowerCase(),
        )
      : false;
  };

  const handleFillAddress = () => {
    if (address) {
      setEthAddress(address as `0x${string}`);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row justify-between gap-2">
        <Input
          placeholder="0x..."
          value={ethAddress as `0x${string}`}
          onChange={(e) => {
            setEthAddress(e.target.value as `0x${string}`);
          }}
        />
        <Button onClick={handleFillAddress} variant="outline">
          Me
        </Button>
      </div>

      <Button
        onClick={handleMintHat}
        disabled={
          mintHatIsLoading ||
          mintHatIsPending ||
          !isConnected ||
          isWearingHat(selectedHat.wearers || [], address)
        }
        variant="default"
      >
        {mintHatIsLoading || mintHatIsPending ? (
          <div className="flex items-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {mintHatIsPending ? 'Confirming...' : 'In Progress...'}
          </div>
        ) : (
          'Mint'
        )}
      </Button>
    </div>
  );
}
