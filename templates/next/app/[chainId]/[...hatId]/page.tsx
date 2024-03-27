import Header from '@/components/header';
import MetaCard from '@/components/meta-card';
import ResponsibilitiesCard from '@/components/responsibilities-card';
import WearersListCard from '@/components/wearers-list-card';
import { ipfsToHttp, resolveIpfsUri } from '@/lib/ipfs';
import { IpfsDetails } from '@/types';
import { Hat, HatsSubgraphClient } from '@hatsprotocol/sdk-v1-subgraph';
import { Suspense } from 'react';
import Loading from '../../../components/loading';
import { Skeleton } from '@/components/ui/skeleton';

const hatsSubgraphClient = new HatsSubgraphClient({});

interface HatDataProps {
  chainId: number;
  hatId: string;
}

interface ExtendedHat extends Hat {
  detailsDecoded: IpfsDetails;
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
        {/* <Suspense fallback={<Loading />}> */}
        <Suspense
          fallback={
            <>
              <div className="h-10">
                <Skeleton className="w-full h-30" />
              </div>
            </>
          }
        >
          <MetaCard
            prettyId={hatData.prettyId}
            details={hatData.detailsDecoded}
            imageUri={hatData.imageUri}
          />
        </Suspense>
        {/* <Suspense fallback={<Loading />}> */}
        <Suspense fallback={<p>Loading...</p>}>
          <ResponsibilitiesCard
            authorities={hatData.detailsDecoded.authorities}
            responsibilities={hatData.detailsDecoded.responsibilities}
          />
        </Suspense>
        {/* <Suspense fallback={<Loading />}> */}
        <Suspense fallback={<p>Loading...</p>}>
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
  await new Promise((resolve) => setTimeout(resolve, 3000));

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
      console.log('hat details', resolvedDetails);
      detailsContent = {
        name: resolvedDetails.name ?? '',
        description: resolvedDetails.description ?? '',
        guilds: resolvedDetails.guilds ?? [],
        spaces: resolvedDetails.spaces ?? [],
        responsibilities: resolvedDetails.responsibilities ?? [],
        authorities: resolvedDetails.authorities ?? [],
        eligibility: resolvedDetails.eligibility ?? {
          manual: false,
          criteria: [],
        },
        toggle: resolvedDetails.toggle ?? { manual: false, criteria: [] },
      };
    }

    if (hat.imageUri) {
      imageContent = (await ipfsToHttp(hat.imageUri)) || '';
    }

    // console.log('hat', hat);
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
