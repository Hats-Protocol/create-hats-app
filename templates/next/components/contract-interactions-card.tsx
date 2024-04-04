import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import ReactMarkdown from 'react-markdown';
import { hatIdDecimalToIp } from '@hatsprotocol/sdk-v1-core';
import { Hex } from 'viem';
import { Button } from './ui/button';

interface ContractInteractionsCardProps {
  // id: Hex;
  // details: {
  //   name: string;
  //   description?: string;
  // };
  // imageUri: string;
}

export default function ContractInteractionsCard({}: ContractInteractionsCardProps) {
  return (
    <Card className="max-w-2xl shadow-xl">
      <CardContent>
        <div className="grid grid-cols-2 gap-4 py-8 px-16">
          <Button variant="default">Mint</Button>
          <Button variant="default">Claim</Button>
          <Button variant="default">Burn</Button>
          <Button variant="default">Deactivate</Button>
          <Button variant="default">Test Hat Status</Button>
          <Button variant="default">Make Immutable</Button>
        </div>
      </CardContent>
    </Card>
  );
}
