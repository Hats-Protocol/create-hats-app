import { Link } from '@remix-run/react';
import hatsLogo from '../../src/images/hats-logo.png';
import ConnectWallet from './connect-wallet';

export default function Header() {
  return (
    <div className="flex w-full items-center justify-between shadow-md px-8 py-2 ">
      <div className="flex flex-row items-center">
        <Link to="/">
          <div className="flex flex-row items-center">
            <img src={hatsLogo} alt="Hats Logo" className="h-16 w-16" />
            <div className="flex items-center gap-4 text-xl">
              Create Hats App
            </div>
          </div>
        </Link>
      </div>
      <div className="h-12">
        <ConnectWallet />
      </div>
    </div>
  );
}
