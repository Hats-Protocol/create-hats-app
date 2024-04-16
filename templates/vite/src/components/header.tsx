// import { Link } from 'react-router-dom';

import ConnectWallet from '@/components/connect-wallet';

export default function Header() {
  return (
    <div className="flex w-full items-center justify-between shadow-md px-8 py-2 ">
      <div className="flex flex-row items-center">
        {/* <Link to="/"> */}
        <div className="flex flex-row items-center">
          <img src="/hats-logo.png" alt="Hats Logo" className="w-16 h-16" />
          <div className="hidden md:flex items-center gap-4 text-xl">
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
