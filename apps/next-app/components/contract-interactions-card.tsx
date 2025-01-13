'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@hatsprotocol/hats-ui';
import { useHatBurn } from '@hatsprotocol/react-sdk';
import { hatIdDecimalToIp } from '@hatsprotocol/sdk-v1-core';
import { Hat } from '@hatsprotocol/sdk-v1-subgraph';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAccount, useChainId } from 'wagmi';

import { Card, CardContent } from './ui/card';
import MintForm from './mint-form';
import Modal from './modal';

interface ContractInteractionProps {
  selectedHat: Hat;
}

const isWearingHat = (
  wearers: { id: string }[],
  connectedAddress: string | undefined,
): boolean => {
  console.log('Checking isWearingHat:', {
    wearers,
    connectedAddress,
  });
  const result = connectedAddress
    ? wearers.some(
        (wearer) => wearer.id.toLowerCase() === connectedAddress.toLowerCase(),
      )
    : false;
  console.log('isWearingHat result:', result);
  return result;
};

export default function ContractInteractionsCard({
  selectedHat,
}: ContractInteractionProps) {
  const { isConnected, address } = useAccount();
  const [isMintModalOpen, setMintModalIsOpen] = useState(false);
  const chainId = useChainId();
  const router = useRouter();

  console.log('ContractInteractionsCard state:', {
    isConnected,
    address,
    selectedHat,
    chainId,
  });

  const openMintModal = () => setMintModalIsOpen(true);
  const closeMintModal = () => setMintModalIsOpen(false);

  const {
    writeAsync: burnHatAsync,
    isLoading: burnHatIsLoading,
    isPending: burnHatIsPending,
  } = useHatBurn({
    selectedHat,
    chainId,
    onSubmitted: (hash: `0x${string}`) => {
      toast.info('Waiting for your transaction to be accepted...', {
        description: `Transaction hash: ${hash}`,
        duration: 0,
      });
    },
    onSuccess: () => {
      const hatId = selectedHat?.id;
      const txDescription =
        hatId && `Renounced hat ${hatIdDecimalToIp(BigInt(hatId))}`;
      toast.success('Hat removed!', {
        description: txDescription,
      });
      toast.dismiss();
      router.refresh();
    },
    onError: (error: Error) => {
      if (
        error.name === 'TransactionExecutionError' &&
        error.message.includes('User rejected the request')
      ) {
        toast.error('Please accept the transaction in your wallet.');
      } else {
        console.error('Contract write error:', error);
        toast.error('An error occurred while processing the transaction.');
      }
      toast.dismiss();
    },
    waitForSubgraph: () => {
      // We don't need to wait for subgraph since we refresh the page
    },
  });

  const handleBurnHat = async () => {
    if (
      !burnHatIsLoading &&
      !burnHatIsPending &&
      isConnected &&
      chainId !== undefined &&
      address &&
      burnHatAsync !== undefined
    ) {
      try {
        toast.loading('Please confirm the transaction in your wallet...', {
          duration: 0,
        });
        await burnHatAsync?.();
      } catch (error) {
        // Error handling is done in the hook's onError callback
        toast.dismiss();
      }
    }
  };

  return (
    <Card className="max-w-2xl shadow-xl">
      <CardContent>
        <div className="grid gap-4 px-4 py-8 md:grid-cols-2 md:px-16">
          <Button
            disabled={!isConnected || (selectedHat.wearers || []).length > 0}
            onClick={openMintModal}
            variant="default"
          >
            Mint
          </Button>
          <Modal
            title="Add a Wearer by minting a Hat"
            isOpen={isMintModalOpen}
            onClose={closeMintModal}
          >
            <MintForm selectedHat={selectedHat} />
          </Modal>
          <Button variant="default" disabled>
            Claim
          </Button>
          <Button
            onClick={handleBurnHat}
            disabled={
              burnHatIsLoading ||
              !isConnected ||
              !isWearingHat(selectedHat.wearers || [], address)
            }
            variant="default"
          >
            {burnHatIsLoading ? (
              <div className="flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                In Progress...
              </div>
            ) : (
              'Renounce'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
