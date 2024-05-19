'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Input } from './ui/input';
import { Ellipsis } from 'lucide-react';
import { Button } from './ui/button';
import { CopyButton } from './copy-button';
import { Wearer } from '@hatsprotocol/sdk-v1-subgraph';
import _ from 'lodash';

import React from 'react';
import useDebounce from '@/lib/useDebounce';
import { truncateAddress } from '@/lib/utils';
import { useAccount } from 'wagmi';

interface HatWearer extends Wearer {
  ensName?: string;
}

export interface WearersListProps {
  wearers: HatWearer[] | undefined;
  maxSupply: number | undefined;
  currentSupply: number | undefined;
}

export default function WearersListCard({
  wearers,
  maxSupply,
  currentSupply,
}: WearersListProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const debouncedSearch = useDebounce(searchTerm, 100);

  const { address } = useAccount();

  const filteredWearers = wearers?.filter((wearer) => {
    const idMatch = wearer.id
      .toLowerCase()
      .includes(debouncedSearch.toLowerCase());
    const ensMatch = wearer.ensName
      ? wearer.ensName.toLowerCase().includes(debouncedSearch.toLowerCase())
      : false;

    return idMatch;
  });

  return (
    <Card className="max-w-2xl shadow-xl">
      <CardHeader>
        <CardTitle>Wearers</CardTitle>
        <CardDescription>Hat Wearers List</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col  gap-4">
          <div className="flex flex-row items-baseline">
            <span className="text-lg text-gray-800">
              {currentSupply} Wearer{currentSupply !== 1 ? 's' : ''} of this
              Hat&nbsp;
            </span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-gray-400 text-sm">
                    {' '}
                    of {maxSupply} max
                  </span>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="bg-gray-900 text-gray-300"
                >
                  {maxSupply}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          {wearers && wearers.length > 1 ? (
            <Input
              type="text"
              placeholder="Find by address (0x) or ENS (.eth)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          ) : null}
        </div>

        <ul className="py-4">
          {filteredWearers?.map((wearer: HatWearer) => (
            <li className="py-0.5" key={wearer.id}>
              <div className="flex flex-row justify-between w-full items-baseline">
                <span
                  className={`hover:text-gray-800 transition-colors ease-in-out duration-300 ${
                    wearer.id.toLowerCase() === address?.toLowerCase()
                      ? 'text-green-600 bg-green-100 py-0.5 px-1'
                      : 'text-gray-600'
                  }`}
                >
                  {wearer?.ensName ?? truncateAddress(wearer.id)}
                </span>
                <div className="flex flex-row items-center gap-2">
                  <CopyButton itemToCopy={wearer.id} />
                  <Button variant="outline" size="icon">
                    <Ellipsis className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
