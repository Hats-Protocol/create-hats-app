import { hatIdDecimalToIp } from '@hatsprotocol/sdk-v1-core';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { Hex } from 'viem';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface HatsMetaCardProps {
  id: Hex;
  details: {
    name: string;
    description?: string;
  };
  imageUri?: string;
  status?: boolean;
  mutable?: boolean;
  levelAtLocalTree?: number;
}

export default function MetaCard({
  id,
  details,
  imageUri,
  status,
  mutable,
  levelAtLocalTree,
}: HatsMetaCardProps) {
  const idDisplay = id && hatIdDecimalToIp(BigInt(id));

  if (!details) return null;

  return (
    <Card className="max-w-2xl shadow-xl">
      <CardHeader>
        <div className="flex w-full items-baseline justify-between">
          <Image
            src={imageUri ? imageUri : '/hats-logo.png'}
            alt={imageUri ? `${details.name} Hat Image` : 'Hats Logo'}
            width={100}
            height={100}
            placeholder="blur"
            blurDataURL={imageUri ? imageUri : '/hats-logo.png'}
            className="rounded-sm"
          />
          <div className="align-baseline">
            <span className="font-semibold text-gray-500 ">#{idDisplay}</span>
          </div>
        </div>
        <CardTitle>{details.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <div className="flex flex-row gap-1">
            {mutable && (
              <Badge>{mutable === true ? 'Mutable' : 'Immutable'}</Badge>
            )}
            {status && <Badge>{status === true ? 'Active' : 'Inactive'}</Badge>}
            {levelAtLocalTree && <Badge>Level {levelAtLocalTree}</Badge>}
          </div>
          {details.description && (
            <ReactMarkdown className="prose">
              {details.description}
            </ReactMarkdown>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
