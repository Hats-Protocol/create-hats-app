import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { truncateAddress } from '../lib/utils';
import { CopyButton } from './copy-button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface ControllersCardProps {
  eligibilityAddress?: `0x${string}`;
  toggleAddress?: `0x${string}`;
}

export default function ControllersCard({
  eligibilityAddress,
  toggleAddress,
}: ControllersCardProps) {
  return (
    <Card className="max-w-2xl shadow-xl">
      <CardHeader>
        <CardTitle>Controllers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <div className="flex w-full flex-row items-baseline justify-between">
            {eligibilityAddress && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-gray-600 transition-colors  duration-300 ease-in-out hover:text-gray-800">
                      Eligibility Address: {truncateAddress(eligibilityAddress)}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="bg-gray-900 text-gray-300"
                  >
                    {eligibilityAddress}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <div className="flex flex-row items-center gap-2">
              <CopyButton itemToCopy={eligibilityAddress} />
            </div>
          </div>
          <div className="flex w-full flex-row items-baseline justify-between ">
            {toggleAddress && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-gray-600 transition-colors  duration-300 ease-in-out hover:text-gray-800">
                      Toggle Address: {truncateAddress(toggleAddress)}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    className="bg-gray-900 text-gray-300"
                  >
                    {toggleAddress}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <div className="flex flex-row items-center gap-2">
              <CopyButton itemToCopy={toggleAddress} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
