// import { Link } from 'react-router-dom';

import ConnectWallet from '@/components/connect-wallet';

export default function Header() {
  return (
    <div className="flex w-full items-center justify-between px-8 py-2 shadow-md ">
      <div className="flex flex-row items-center">
        {/* <Link to="/"> */}
        <div className="flex flex-row items-center">
          <img src="/hats-logo.png" alt="Hats Logo" className="h-16 w-16" />
          <div className="hidden items-center gap-4 text-xl md:flex">
            Create Hats App
          </div>
        </div>
        {/* </Link> */}
      </div>
      <div className="h-12">
        <ConnectWallet />
      </div>
    </div>
  );
}
