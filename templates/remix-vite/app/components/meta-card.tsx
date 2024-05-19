import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { hatIdDecimalToIp } from '@hatsprotocol/sdk-v1-core';
import { Hex } from 'viem';
import { Badge } from '@/components/ui/badge';
import ReactMarkdown from 'react-markdown';
import HatsLogo from '@images/hats-logo.png';

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

  console.log('details', details);
  if (!details) return null;

  return (
    <Card className="max-w-2xl shadow-xl">
      <CardHeader>
        <div className="flex items-baseline w-full justify-between">
          <img
            src={imageUri ? imageUri : HatsLogo}
            alt={imageUri ? `${details.name} Hat Image` : 'Hats Logo'}
            className="w-16 h-16 rounded-sm"
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
