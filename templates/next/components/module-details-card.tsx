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
  console.log('eligibilityAddress', eligibilityAddress);
  const { details, isLoading } = useModuleDetails({
    address: eligibilityAddress,
    chainId,
  });

  if (isLoading)
    return (
      <Card className="max-w-2xl shadow-xl">
        <CardHeader>
          <CardTitle>Loading</CardTitle>
        </CardHeader>
      </Card>
    );

  return (
    <Card className="max-w-2xl shadow-xl">
      <CardHeader>
        <CardTitle>Module Details</CardTitle>
        <CardDescription>
          Eligibility Address: {eligibilityAddress?.slice(0, 6)}...
          {eligibilityAddress?.slice(-4)}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
