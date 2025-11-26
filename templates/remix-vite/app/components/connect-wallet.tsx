'use client';

import { ConnectButton as RainbowConnectButton } from '@rainbow-me/rainbowkit';
import blockies from 'blockies-ts';
import { useEffect, useState } from 'react';
import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Button } from './ui/button';

const ConnectWallet = () => {
  const [blockie, setBlockie] = useState<string | undefined>();
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address, chainId: 1 });
  const { data: ensAvatar } = useEnsAvatar({
    name: ensName as string,
    chainId: 1,
  });

  useEffect(() => {
    if (address) {
      setBlockie(blockies.create({ seed: address.toLowerCase() }).toDataURL());
    }
  }, [address]);

  return (
    <RainbowConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
        authenticationStatus,
      }) => {
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === 'authenticated');

        return !ready ? (
          <div className="pointer-events-none hidden select-none opacity-0" />
        ) : (
          (() => {
            if (!connected) {
              return (
                <Button onClick={openConnectModal} variant="outline">
                  Connect Wallet
                </Button>
              );
            }

            if (chain.unsupported) {
              return (
                <Button onClick={openChainModal} variant="outline">
                  Unsupported network
                </Button>
              );
            }

            return (
              <div className="flex gap-2 rounded-full p-1">
                <Button
                  className="flex items-center px-2"
                  variant="outline"
                  onClick={openChainModal}
                >
                  {chain.hasIcon && chain.iconUrl && (
                    <img
                      alt={chain.name ?? 'Chain icon'}
                      src={chain.iconUrl}
                      className="h-6 w-6"
                    />
                  )}
                </Button>
                {connected ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        <div className="flex flex-row items-center  gap-2">
                          {ensAvatar || blockie ? (
                            <div
                              className={
                                'h-5 w-5 overflow-hidden rounded-xl border-blue-500'
                              }
                            >
                              <img
                                className="h-6 w-6"
                                src={ensAvatar || blockie}
                                alt="User Avatar"
                              />
                            </div>
                          ) : (
                            <div className="h-7 w-7 rounded-md bg-blue-500" />
                          )}

                          <div>{ensName || account.displayName}</div>
                        </div>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={openAccountModal}>
                        Wallet
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => disconnect()}>
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : null}
              </div>
            );
          })()
        );
      }}
    </RainbowConnectButton.Custom>
  );
};

export default ConnectWallet;
