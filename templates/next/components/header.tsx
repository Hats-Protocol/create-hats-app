import Image from 'next/image';
import Link from 'next/link';
import ConnectWallet from './connect-wallet';

export default function Header() {
  return (
    <div className="flex w-full items-center justify-between shadow-md px-8 py-2 ">
      <div className="flex flex-row items-center">
        <Link href="/">
          <div className="flex flex-row items-center">
            <Image
              src="/hats-logo.png"
              alt="Hats Logo"
              width={64}
              height={64}
            />
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
