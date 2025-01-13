'use client';

import { get } from 'lodash';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useModuleDetails } from '@/hooks';
import { truncateAddress } from '@/lib/utils';

interface ModuleDetailsCardProps {
  eligibilityAddress?: `0x${string}`;
  chainId: number;
}

export default function ModuleDetailsCard({
  eligibilityAddress,
  chainId,
}: ModuleDetailsCardProps) {
  const moduleDetails = useModuleDetails({
    address: eligibilityAddress,
    chainId,
  });
  const { details, isLoading } = moduleDetails;

  if (!get(moduleDetails, 'details') && !isLoading) {
    return (
      <Card className="max-w-2xl shadow-xl">
        <div className="flex h-full w-full items-center justify-center">
          No Module Found
        </div>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="max-w-2xl shadow-xl">
        <div>Loading...</div>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl shadow-xl">
      <CardHeader>
        <CardTitle>Module Details</CardTitle>
        {eligibilityAddress && (
          <CardDescription>
            Eligibility Address: {truncateAddress(eligibilityAddress)}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <span className="text-md font-semibold text-gray-800">
            {details?.name}
          </span>
          {details?.details !== undefined &&
            details?.details.map((detail, index) => (
              <p key={index}>{detail}</p>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
