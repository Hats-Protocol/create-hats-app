import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import ReactMarkdown from 'react-markdown';

interface HatsMetaCardProps {
  details: {
    name: string;
    description?: string;
  };
  imageUri: string;
}

export default function MetaCard({ details, imageUri }: HatsMetaCardProps) {
  return (
    <Card className="max-w-2xl shadow-xl">
      <CardHeader>
        <div className="flex items-baseline w-full justify-between">
          <Image
            src={imageUri ? imageUri : '/hats-logo.png'}
            alt={imageUri ? `${details.name} Hat Image` : 'Hats Logo'}
            width={64}
            height={64}
            placeholder="blur"
            blurDataURL={imageUri ? imageUri : '/hats-logo.png'}
          />
          <div className="align-baseline">
            <span className="font-semibold text-gray-500 ">#123.12.12</span>
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
