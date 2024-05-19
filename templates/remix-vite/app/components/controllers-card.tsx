import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import ReactMarkdown from 'react-markdown';
import { CopyButton } from './copy-button';
import { truncateAddress } from '../lib/utils';
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';

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
          <div className="flex flex-row justify-between items-baseline w-full">
            {eligibilityAddress && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-gray-600 hover:text-gray-800  transition-colors ease-in-out duration-300">
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
          <div className="flex flex-row justify-between items-baseline w-full ">
            {toggleAddress && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-gray-600 hover:text-gray-800  transition-colors ease-in-out duration-300">
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
