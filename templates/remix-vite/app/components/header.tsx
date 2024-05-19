import { NavLink } from '@remix-run/react';
import ConnectWallet from '@/components/connect-wallet';
import HatsLogo from '@images/hats-logo.png';

export default function Header() {
  return (
    <div className="flex w-full items-center justify-between shadow-md px-8 py-2 ">
      <div className="flex flex-row items-center">
        <NavLink to="/">
          <div className="flex flex-row items-center">
            <img src={HatsLogo} alt="Hats Logo" className="w-16 h-16" />
            <div className="hidden md:flex items-center gap-4 text-xl">
              Create Hats App
            </div>
          </div>
        </NavLink>
      </div>
      <div className="h-12">
        <ConnectWallet />
      </div>
    </div>
  );
}
