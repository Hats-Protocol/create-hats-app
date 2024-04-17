import { useParams } from 'react-router-dom';
import useHatData from '../hooks/useHatData'; // Adjust the import path as necessary
import Header from '@/components/header';
import MetaCard from '@/components/meta-card';
import ResponsibilitiesCard from '@/components/responsibilities-card';
import WearersListCard from '@/components/wearers-list-card';
import { ipfsToHttp, resolveIpfsUri } from '@/lib/ipfs';
import { IpfsDetails } from '@/types';
import { hatIdDecimalToHex, hatIdIpToDecimal } from '@hatsprotocol/sdk-v1-core';
import { Hat, HatsSubgraphClient } from '@hatsprotocol/sdk-v1-subgraph';
import { Suspense } from 'react';
import _ from 'lodash';
import Loading from '../../../components/loading';
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

export default function HatPage() {
  const { chainId, hatId } = useParams<{ chainId: string; hatId: string }>();
  console.log('params', chainId, hatId);

  const { hatData, isLoading, error } = useHatData({
    address: hatId,
    chainId: parseInt(chainId),
    enabled: true,
  });

  if (isLoading) return <p>Loading...</p>;
  if (!hatData) return <p>Could not fetch hat data.</p>;

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
            maxSupply={Number(hatData.maxSupply) || 0}
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
            chainId={chainId}
            eligibilityAddress={hatData.eligibility}
          />
        </Suspense>
      </div>
    </main>
  );
}
