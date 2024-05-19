import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import type { MetaFunction } from '@remix-run/node';
import { NavLink } from '@remix-run/react';

export const meta: MetaFunction = () => {
  return [
    { title: 'Hats App Template -  Remix/Vite' },
    { name: 'description', content: 'Hats App Template - Remix/Vite' },
  ];
};
export default function Index() {
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
              src/routes/_app+/index.tsx
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
              <NavLink to="/10/1.3.2.2">Explore a Hat</NavLink>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
