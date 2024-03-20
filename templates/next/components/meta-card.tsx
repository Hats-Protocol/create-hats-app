import Image from 'next/image';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from './ui/card';

export default function MetaCard() {
  return (
    <Card className="max-w-2xl shadow-xl">
      <CardHeader>
        <div className="flex items-baseline w-full justify-between">
          <Image src="/hats-logo.png" alt="Hats Logo" width={25} height={25} />
          <div className="align-baseline">
            <span className="font-semibold text-gray-500 ">#123.12.12</span>
          </div>
        </div>
        <CardTitle>Hat Name</CardTitle>
        <CardDescription>Hat Short Description</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Hat Markdown Content</p>
      </CardContent>
    </Card>
  );
}
