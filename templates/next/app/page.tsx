import Header from '@/components/header';
import MetaCard from '@/components/meta-card';
import ResponsibilitiesCard from '@/components/responsibilities-card';
import WearersListCard, {
  WearersListProps,
} from '@/components/wearers-list-card';

const mockWearersList: WearersListProps = {
  chainId: 1,
  hatName: 'Magic Fedora',
  hatId: 'hat_123',
  wearers: [
    {
      id: '0x25709998B542f1Be27D19Fa0B3A9A67302bc1b94',
      ensName: 'jpbuilds.eth',
    },
    {
      id: '0x04EA475026a0AB3e280F749b206fC6332E6939F1',
      ensName: 'jpDevAlt.eth',
    },
    {
      id: '0x7b006Eb0BB77d36dF3Ac3f86941a9953d2968188',
    },
  ],
  maxSupply: 500,
  prettyId: 'magic-fedora-123',
  isAdminUser: true,
};

export default function Home() {
  return (
    <main className=" min-h-screen  gap-y-12 w-full">
      <Header />
      <div className="grid grid-cols-2 gap-4  py-8 px-16">
        <MetaCard />
        <ResponsibilitiesCard />
        <WearersListCard
          chainId={mockWearersList.chainId}
          hatName={mockWearersList.hatName}
          hatId={mockWearersList.hatId}
          wearers={mockWearersList.wearers}
          maxSupply={mockWearersList.maxSupply}
          prettyId={mockWearersList.prettyId}
          isAdminUser={mockWearersList.isAdminUser}
        />
      </div>
    </main>
  );
}
