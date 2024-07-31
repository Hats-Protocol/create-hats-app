import { hatIdIpToDecimal } from '@hatsprotocol/sdk-v1-core';
import { Hat, HatsSubgraphClient } from '@hatsprotocol/sdk-v1-subgraph';
import { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData, useParams } from '@remix-run/react';
import { Suspense } from 'react';

import ContractInteractionsCard from '@/components/contract-interactions-card';
import ControllersCard from '@/components/controllers-card';
import Header from '@/components/header';
import MetaCard from '@/components/meta-card';
import ModuleDetailsCard from '@/components/module-details-card';
import ResponsibilitiesCard from '@/components/responsibilities-card';
import { Skeleton } from '@/components/ui/skeleton';
import WearersListCard from '@/components/wearers-list-card';
import { ipfsToHttp, resolveIpfsUri } from '@/lib/ipfs';
import { IpfsDetails } from '@/types';

const hatsSubgraphClient = new HatsSubgraphClient({});

// interface HatDataProps {
//   chainId: string;
//   hatId: string[];
// }

interface ExtendedHat extends Hat {
  detailsDecoded: IpfsDetails;
  imageUri: string;
  errorMessage?: string;
}

// interface DetailsContent {
//   name: string;
//   description: string;
//   guilds?: string[];
//   spaces?: string[];
//   responsibilities?: string[];
//   authorities?: string[];
//   eligibility?: {
//     manual: boolean;
//     criteria: { link: string; label: string }[];
//   };
//   toggle?: {
//     manual: boolean;
//     criteria: any[]; // Define more specific type if possible
//   };
// }

export async function loader({
  // request,
  params,
}: LoaderFunctionArgs): Promise<ExtendedHat | null> {
  const chainId = params.chainId;
  const hatId = params.hatId;

  if (!chainId) {
    throw new Error('chainId is not provided.');
  }

  if (!hatId) {
    throw new Error('hatId is not provided.');
  }

  if (!hatId) return null;
  const localHatId = hatIdIpToDecimal(hatId);

  try {
    const hat = await hatsSubgraphClient.getHat({
      chainId: Number(chainId),
      hatId: BigInt(localHatId),
      props: {
        details: true, // get the hat details
        imageUri: true, // get the hat image uri
        status: true, //
        mutable: true,
        levelAtLocalTree: true,
        eligibility: true,
        toggle: true,
        currentSupply: true,
        maxSupply: true, // get the maximum amount of wearers for the hat
        prettyId: true,
        wearers: {
          props: {},
          filters: { first: 5 },
        },
      },
    });

    let detailsContent: any = { name: '', description: '' }; // Default object structure
    let imageContent: string = '';

    if (hat.details) {
      const resolvedDetails = await resolveIpfsUri(hat.details);
      const criteriaDetails = resolvedDetails.eligibility?.criteria.map(
        (criterion) => {
          return {
            link: criterion.link,
            label: criterion.label,
          };
        },
      );

      detailsContent = {
        name: resolvedDetails.name ?? '',
        description: resolvedDetails.description ?? '',
        guilds: resolvedDetails.guilds ?? [],
        spaces: resolvedDetails.spaces ?? [],
        responsibilities: resolvedDetails.responsibilities ?? [],
        authorities: resolvedDetails.authorities ?? [],
        eligibility: resolvedDetails.eligibility ?? {
          manual: false,
          criteria: criteriaDetails ?? [],
        },
        toggle: resolvedDetails.toggle ?? { manual: false, criteria: [] },
      };
    }

    if (hat.imageUri) {
      imageContent = (await ipfsToHttp(hat.imageUri)) || '';
    }

    return {
      ...hat,
      detailsDecoded: detailsContent,
      imageUri: imageContent,
    };
  } catch (error) {
    if (error) {
      console.error(
        `Hat with ID ${hatId} does not exist in the subgraph for chain ID ${chainId}.`,
      );
      return null;
    } else {
      throw error;
    }
  }
}

export default function HatPageLayout() {
  const { chainId } = useParams<{ chainId: string; hatId: string }>();
  const hatData = useLoaderData<ExtendedHat>();

  return (
    <main className=" min-h-screen w-full gap-y-12">
      <Header />
      <div className="grid gap-4 px-4 py-8 md:grid-cols-2 md:px-16">
        <Suspense
          fallback={
            <>
              <div className="h-10">
                <Skeleton className="h-30 w-full" />
              </div>
            </>
          }
        >
          <MetaCard
            id={hatData.id}
            details={hatData.detailsDecoded}
            imageUri={hatData.imageUri}
            status={hatData.status}
            mutable={hatData.mutable}
            levelAtLocalTree={hatData.levelAtLocalTree}
          />
        </Suspense>

        <Suspense fallback={<p>Loading...</p>}>
          <ResponsibilitiesCard
            authorities={hatData.detailsDecoded.authorities}
            responsibilities={hatData.detailsDecoded.responsibilities}
          />
        </Suspense>

        <Suspense fallback={<p>Loading...</p>}>
          <WearersListCard
            wearers={hatData.wearers}
            currentSupply={Number(hatData.currentSupply)}
            maxSupply={Number(hatData.maxSupply) || 0} // Convert to number and provide default
          />
        </Suspense>
        <Suspense fallback={<p>Loading...</p>}>
          <ContractInteractionsCard selectedHat={hatData} />
        </Suspense>
        <Suspense fallback={<p>Loading...</p>}>
          <ControllersCard
            eligibilityAddress={hatData.eligibility}
            toggleAddress={hatData.toggle}
          />
        </Suspense>
        <Suspense fallback={<p>Loading...</p>}>
          <ModuleDetailsCard
            chainId={Number(chainId)}
            eligibilityAddress={hatData.eligibility}
          />
        </Suspense>
      </div>
    </main>
  );
}
