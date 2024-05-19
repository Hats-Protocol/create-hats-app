'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent } from './ui/card';
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
import { WriteContractResult } from 'wagmi/actions';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import Modal from './modal';
import MintForm from './mint-form';

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
  const [isMintModalOpen, setMintModalIsOpen] = useState(false);
  const chainId = useChainId();

  const openMintModal = () => setMintModalIsOpen(true);
  const closeMintModal = () => setMintModalIsOpen(false);

  interface UseHatBurnResult {
    isLoading: boolean;
    isSuccess: boolean;
    writeAsync: (() => Promise<WriteContractResult>) | undefined;
    prepareErrorMessage: string;
  }

  const {
    isLoading: burnHatIsLoading,
    writeAsync: burnHatAsync,
  }: UseHatBurnResult = useHatBurn({
    selectedHat,
    chainId,
  });

  const handleBurnHat = async () => {
    if (
      !burnHatIsLoading &&
      isConnected &&
      chainId !== undefined &&
      address &&
      burnHatAsync !== undefined
    ) {
      try {
        await burnHatAsync?.();
        // success handled in the hook's onSuccess
      } catch (error) {
        // handled in the hook's onError
      }
    }
  };

  return (
    <Card className="max-w-2xl shadow-xl">
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4 py-8 px-4 md:px-16">
          <Button
            disabled={
              !isConnected || isWearingHat(selectedHat.wearers || [], address)
            }
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
              isWearingHat(selectedHat.wearers || [], address) === false
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
          {/* <Button variant="default">Deactivate</Button> */}
          {/* <Button variant="default">Test Hat Status</Button> */}
          {/* <Button variant="default">Make Immutable</Button> */}
        </div>
      </CardContent>
    </Card>
  );
}
