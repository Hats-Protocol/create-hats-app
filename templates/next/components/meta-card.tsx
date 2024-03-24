import Image from 'next/image';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from './ui/card';

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
        {details.description && (
          <CardDescription>{details.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <p>Hat Markdown Content</p>
      </CardContent>
    </Card>
  );
}
