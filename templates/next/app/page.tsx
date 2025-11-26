import Link from 'next/link';

import Header from '@/components/header';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="min-h-screen w-full gap-y-12">
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
