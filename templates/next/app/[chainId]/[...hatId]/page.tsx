import Header from '@/components/header';
import MetaCard from '@/components/meta-card';
import ResponsibilitiesCard from '@/components/responsibilities-card';
import WearersListCard from '@/components/wearers-list-card';
import { ipfsToHttp, resolveIpfsUri } from '@/lib/ipfs';
import { IpfsDetails } from '@/types';
import { hatIdIpToDecimal } from '@hatsprotocol/sdk-v1-core';
import { Hat, HatsSubgraphClient } from '@hatsprotocol/sdk-v1-subgraph';
import { Suspense } from 'react';
import _ from 'lodash';
import { Skeleton } from '@/components/ui/skeleton';
import ControllersCard from '@/components/controllers-card';
import ModuleDetailsCard from '@/components/module-details-card';
import ContractInteractionsCard from '@/components/contract-interactions-card';

const hatsSubgraphClient = new HatsSubgraphClient({});

interface HatDataProps {
  chainId: number;
  hatId: string[];
}

interface ExtendedHat extends Hat {
  detailsDecoded: IpfsDetails;
  imageUri: string;
  errorMessage?: string;
}

export default async function HatPage({
  params,
}: {
  params: { chainId: number; hatId: any }; // this is potentially an array?
}) {
  const hatData = await getHatData({
    chainId: params.chainId,
    hatId: params.hatId,
  });

  console.log('hatData', hatData);

  if (!hatData) return;

  return (
    <main className=" min-h-screen gap-y-12 w-full">
      <Header />
      <div className="grid md:grid-cols-2 gap-4 py-8 px-4 md:px-16">
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
            currentSupply={_.toNumber(hatData.currentSupply)}
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
            chainId={params.chainId}
            eligibilityAddress={hatData.eligibility}
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
  const trueHatId = _.first(hatId);
  if (!trueHatId) return null;
  console.log('hatId', hatId);
  console.log('trueHatId', trueHatId);
  const localHatId = hatIdIpToDecimal(trueHatId);
  console.log('localHatId', localHatId);

  try {
    const hat = await hatsSubgraphClient.getHat({
      chainId: chainId,
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
    console.log('hat.details', hat.details);

    if (hat.details) {
      const resolvedDetails = await resolveIpfsUri(hat.details);
      console.log('resolvedDetails', resolvedDetails);

      const criteriaDetails = resolvedDetails.eligibility?.criteria.map(
        (criterion) => {
          return {
            link: criterion.link,
            label: criterion.label,
          };
        }
      );

      console.log('criteria details', criteriaDetails);

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
      console.log(error);
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
