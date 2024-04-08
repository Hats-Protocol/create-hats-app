import Header from '@/components/header';
<<<<<<< HEAD
import { Button } from '@/components/ui/button';
import Link from 'next/link';
=======
import MetaCard from '@/components/meta-card';
import ResponsibilitiesCard from '@/components/responsibilities-card';
import WearersListCard, {
  WearersListProps,
} from '@/components/wearers-list-card';

// const mockWearersList: WearersListProps = {
//   chainId: 1,
//   hatName: 'Magic Fedora',
//   hatId: 'hat_123',
//   wearers: [
//     {
//       id: '0x25709998B542f1Be27D19Fa0B3A9A67302bc1b94',
//       ensName: 'jpbuilds.eth',
//     },
//     {
//       id: '0x04EA475026a0AB3e280F749b206fC6332E6939F1',
//       ensName: 'jpDevAlt.eth',
//     },
//     {
//       id: '0x7b006Eb0BB77d36dF3Ac3f86941a9953d2968188',
//     },
//   ],
//   maxSupply: 500,
//   prettyId: 'magic-fedora-123',
//   isAdminUser: true,
// };
>>>>>>> 8da2ef09760b66f237a1fce150824a93ce35a70d

export default function Home() {
  return (
    <main className="min-h-screen gap-y-12 w-full">
      <Header />
      <div className="flex h-full flex-col items-center  pt-[20vh]">
        <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Welcome Hacker!
        </h2>
        <div>
          <p className="flex w-full justify-center">
            Get started by editing &nbsp;
            <code className="font-mono font-bold text-cyan-500">
              src/app/page.tsx
            </code>
          </p>
        </div>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          This template is a playground and launchpad for exploring what is
          possible with Hats.
        </p>
        <div className="flex flex-col items-center space-y-12">
          <div>
            <Button
              asChild
              variant="link"
              className="font-semibold text-cyan-500"
            >
              <Link href="/10/1.3.2.2">Explore a Hat</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
