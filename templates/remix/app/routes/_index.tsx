import Header from '@/components/header';
import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
  return [
    { title: 'Hats App Template: Remix' },
    { name: 'description', content: 'Hats App Template: Remix' },
  ];
};

export default function Index() {
  return (
    <div className="w-full ">
      <Header />
    </div>
  );
}
