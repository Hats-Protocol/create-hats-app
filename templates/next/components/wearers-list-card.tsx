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

export interface WearersListProps {
  // exported for testing
  chainId: number;
  hatName: string;
  hatId: string;
  wearers: IHatWearer[];
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
      <CardHeader>Wearers</CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
}
