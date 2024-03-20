import Header from '@/components/header';
import MetaCard from '@/components/meta-card';
import ResponsibilitiesCard from '@/components/responsibilities-card';

export default function Home() {
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
