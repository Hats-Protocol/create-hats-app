import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import ReactMarkdown from 'react-markdown';
import { hatIdDecimalToIp } from '@hatsprotocol/sdk-v1-core';
import { Hex } from 'viem';

interface ModuleDetailsCardProps {
  // id: Hex;
  // details: {
  //   name: string;
  //   description?: string;
  // };
  // imageUri: string;
}

export default function ModuleDetailsCard({
  id,
  details,
  imageUri,
}: ModuleDetailsCardProps) {
  const idDisplay = id && hatIdDecimalToIp(BigInt(id));

  // if (!details) return null;

  return (
    <Card className="max-w-2xl shadow-xl">
      <CardHeader>
        <CardTitle>Module Details</CardTitle>
      </CardHeader>
    </Card>
  );
}
