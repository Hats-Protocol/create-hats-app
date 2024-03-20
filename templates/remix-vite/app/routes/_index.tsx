import MetaCard from '@/components/meta-card';
import Header from '@/components/header';

import type { MetaFunction } from '@remix-run/node';
import ResponsibilitiesCard from '@/components/responsibilities-card';

export const meta: MetaFunction = () => {
  return [
    { title: 'Hats App Template: Remix' },
    { name: 'description', content: 'Hats App Template: Remix' },
  ];
};

export default function Index() {
  return (
    <main className=" min-h-screen  gap-y-12 w-full">
      <Header />
      <div className="grid grid-cols-2 gap-4  py-8 px-16">
        <MetaCard />
        <ResponsibilitiesCard />
      </div>
    </main>
  );
}
