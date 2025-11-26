import _ from 'lodash';
import { Suspense } from 'react';
import { useParams } from 'react-router-dom';

import ContractInteractionsCard from '@/components/contract-interactions-card';
import ControllersCard from '@/components/controllers-card';
import Header from '@/components/header';
import MetaCard from '@/components/meta-card';
import ModuleDetailsCard from '@/components/module-details-card';
import ResponsibilitiesCard from '@/components/responsibilities-card';
import { Skeleton } from '@/components/ui/skeleton';
import WearersListCard from '@/components/wearers-list-card';

import useHatData from '../hooks/useHatData'; // Adjust the import path as necessary

export default function HatPage() {
  const { chainId, hatId } = useParams<{ chainId: string; hatId: string }>();

  const { hatData, isLoading } = useHatData({
    address: hatId as `0x${string}`,
    chainId: chainId !== undefined ? parseInt(chainId) : 10,
    enabled: true,
  });

  if (isLoading) return <p>Loading...</p>;
  if (!hatData) return <p>Could not fetch hat data.</p>;

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
            chainId={chainId !== undefined ? parseInt(chainId) : 10}
            eligibilityAddress={hatData.eligibility}
          />
        </Suspense>
      </div>
    </main>
  );
}
