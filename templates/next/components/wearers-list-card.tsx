import { IHatWearer } from '@/types';
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
  TooltipArrow,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Input } from './ui/input';
import { ChevronRight, Copy, Ellipsis } from 'lucide-react';
import { Button } from './ui/button';
import { CopyButton } from './copy-button';

export interface WearersListProps {
  // exported for testing
  chainId: number;
  hatName: string;
  hatId: string;
  wearers: any;
  maxSupply: number;
  prettyId: string;
  isAdminUser: boolean;
}

export default function WearersListCard({
  chainId,
  hatName,
  hatId,
  wearers,
  maxSupply,
  prettyId,
  isAdminUser,
}: WearersListProps) {
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
              {wearers.length} Wearer{wearers.length !== 1 ? 's' : ''} of this
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
                <TooltipContent className="bg-gray-900 text-gray-300">
                  {maxSupply}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          {wearers.length > 1 ? (
            <Input
              type="text"
              placeholder="Find by address (0x) or ENS (.eth)"
            />
          ) : null}
        </div>
        <ul className="py-4">
          {wearers.map((wearer) => (
            <li className="py-0.5" key={wearer.id}>
              <div className="flex flex-row justify-between w-full">
                <span className="text-gray-600 hover:text-gray-800 hover:cursor-pointer transition-colors ease-in-out duration-300">
                  {wearer.ensName ??
                    `${wearer.id.slice(0, 6)}...${wearer.id.slice(-4)}`}
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
