'use client';

import { Hat } from '@hatsprotocol/sdk-v1-subgraph';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useAccount, useChainId } from 'wagmi';

import { Input } from '@/components/ui/input';
import { useHatMint } from '@/hooks';

import { Button } from './ui/button';

interface MintFormProps {
  selectedHat: Hat;
}

// const mintFormSchema = z.object({
//   ethAddress: z
//     .string()
//     .regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address'),
// });

export default function MintForm({ selectedHat }: MintFormProps) {
  const chainId = useChainId();
  const { isConnected, address } = useAccount();
  const [ethAddress, setEthAddress] = useState<`0x${string}`>();

  const { isLoading: mintHatIsLoading, writeAsync: mintHatAsync } = useHatMint({
    selectedHat,
    chainId,
    wearer: ethAddress!,
  });

  const handleMintHat = async () => {
    if (!mintHatIsLoading && isConnected && chainId !== undefined && address) {
      mintHatAsync?.();
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
          !isConnected ||
          isWearingHat(selectedHat.wearers || [], address)
        }
        variant="default"
      >
        {mintHatIsLoading ? (
          <div className="flex items-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            In Progress...
          </div>
        ) : (
          'Mint'
        )}
      </Button>
    </div>
  );
}
