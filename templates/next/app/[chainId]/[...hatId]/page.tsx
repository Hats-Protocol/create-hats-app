import Header from '@/components/header';
import MetaCard from '@/components/meta-card';
import ResponsibilitiesCard from '@/components/responsibilities-card';
import WearersListCard, {
  WearersListProps,
} from '@/components/wearers-list-card';
import { ipfsToHttp, resolveIpfsUri } from '@/lib/ipfs';
import { convertPrettyId } from '@/lib/utils';
import { Hat, HatsSubgraphClient } from '@hatsprotocol/sdk-v1-subgraph';
import { Suspense } from 'react';

const hatsSubgraphClient = new HatsSubgraphClient({});

interface HatDataProps {
  chainId: number;
  hatId: string;
}

interface ExtendedHat extends Hat {
  detailsDecoded: {
    name: string;
    description?: string;
  };
  imageUri: string;
  errorMessage?: string;
}

export default async function HatPage({
  params,
}: {
  params: { chainId: number; hatId: string };
}) {
  const hatData = await getHatData({
    chainId: params.chainId,
    hatId: params.hatId,
  });

  if (!hatData) return;

  return (
    <main className=" min-h-screen  gap-y-12 w-full">
      <Header />
      <div className="grid grid-cols-2 gap-4  py-8 px-16">
        <Suspense fallback={<p>Loading Meta...</p>}>
          <MetaCard
            prettyId={hatData.prettyId}
            details={hatData.detailsDecoded}
            imageUri={hatData.imageUri}
          />
        </Suspense>
        <ResponsibilitiesCard />
        <Suspense fallback={<p>Loading Wearers...</p>}>
          <WearersListCard
            wearers={hatData.wearers}
            maxSupply={Number(hatData.maxSupply) || 0} // Convert to number and provide default
          />
        </Suspense>
      </div>
    </main>
  );
}

const getHatData = async ({
  chainId,
  hatId,
}: HatDataProps): Promise<ExtendedHat | null> => {
  try {
    const hat = await hatsSubgraphClient.getHat({
      chainId: chainId,
      hatId: BigInt(hatId),
      props: {
        details: true, // get the hat details
        imageUri: true,
        status: true,
        eligibility: true,
        currentSupply: true,
        mutable: true,
        maxSupply: true, // get the maximum amount of wearers for the hat
        prettyId: true,
        wearers: {
          props: {},
        },
      },
    });

    let detailsContent = { name: '', description: '' }; // Default object structure
    let imageContent: string = '';

    if (hat.details) {
      const resolvedDetails = await resolveIpfsUri(hat.details);
      detailsContent = {
        name: resolvedDetails.name || '',
        description: resolvedDetails.description || '',
      };
    }

    if (hat.imageUri) {
      imageContent = (await ipfsToHttp(hat.imageUri)) || '';
    }

    console.log('hat', hat);
    return {
      ...hat,
      detailsDecoded: detailsContent,
      imageUri: imageContent,
    };
  } catch (error) {
    if (error) {
      console.error(
        `Hat with ID ${hatId} does not exist in the subgraph for chain ID ${chainId}.`
      );

      return null;
    } else {
      // Handle other errors or rethrow them
      throw error;
    }
  }
};
