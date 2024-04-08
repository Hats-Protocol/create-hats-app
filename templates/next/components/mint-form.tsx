'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from './ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import { useHatBurn, useHatMint } from '@/hooks';
import {
  useAccount,
  useChainId,
  useNetwork,
  usePublicClient,
  useWalletClient,
} from 'wagmi';
import { HatsClient } from '@hatsprotocol/sdk-v1-core';
import { Hat } from '@hatsprotocol/sdk-v1-subgraph';
import { WriteContractResult } from 'wagmi/actions';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface MintFormProps {
  selectedHat: Hat;
}

const mintFormSchema = z.object({
  ethAddress: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address'),
});

export default function MintForm({ selectedHat }: MintFormProps) {
  const chainId = useChainId();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const { isConnected, address } = useAccount();
  const [ethAddress, setEthAddress] = useState<`0x${string}`>();
  const router = useRouter();

  interface UseHatMintResult {
    isLoading: boolean;
    writeAsync: (() => Promise<WriteContractResult>) | undefined;
  }

  const {
    isLoading: mintHatIsLoading,
    writeAsync: mintHatAsync,
  }: UseHatMintResult = useHatMint({
    selectedHat,
    chainId,
    wearer: ethAddress,
  });

  const handleMintHat = async () => {
    const hatsClient = walletClient
      ? new HatsClient({
          chainId,
          publicClient: publicClient,
          walletClient: walletClient,
        })
      : undefined;

    if (
      !mintHatIsLoading &&
      isConnected &&
      chainId !== undefined &&
      address &&
      hatsClient !== undefined
    ) {
      try {
        const mintResult = mintHatAsync?.();
        // if (mintResult) {
        //   router.refresh();
        // }
      } catch (error) {}
    }
  };

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
