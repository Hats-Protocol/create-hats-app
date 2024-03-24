import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import ReactMarkdown from 'react-markdown';
import { convertPrettyId } from '@/lib/utils';

interface HatsMetaCardProps {
  prettyId: string;
  details: {
    name: string;
    description?: string;
  };
  imageUri: string;
}

export default function MetaCard({
  prettyId,
  details,
  imageUri,
}: HatsMetaCardProps) {
  const prettyIdDisplay = convertPrettyId(prettyId);

  return (
    <Card className="max-w-2xl shadow-xl">
      <CardHeader>
        <div className="flex items-baseline w-full justify-between">
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
            <span className="font-semibold text-gray-500 ">
              #{prettyIdDisplay}
            </span>
          </div>
        </div>
        <CardTitle>{details.name}</CardTitle>
      </CardHeader>
      {details.description && (
        <CardContent>
          <ReactMarkdown className="prose">{details.description}</ReactMarkdown>
        </CardContent>
      )}
    </Card>
  );
}
