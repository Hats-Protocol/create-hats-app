'use client';

import { useModuleDetails } from '@/hooks';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from './ui/card';

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

  if (!moduleDetails) {
    return <div>Loading or error...</div>;
  }

  const { details, isLoading } = moduleDetails;

  if (isLoading)
    return (
      <Card className="max-w-2xl shadow-xl">
        <div>Loading</div>
      </Card>
    );

  console.log('details', details);
  return (
    <Card className="max-w-2xl shadow-xl">
      <CardHeader>
        <CardTitle>Module Details</CardTitle>
        <CardDescription>
          Eligibility Address: {eligibilityAddress?.slice(0, 6)}...
          {eligibilityAddress?.slice(-4)}
        </CardDescription>
        <CardContent className="px-0">
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
      </CardHeader>
    </Card>
  );
}
