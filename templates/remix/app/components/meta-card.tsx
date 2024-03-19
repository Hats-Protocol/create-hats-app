import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from './ui/card';
import hatsLogo from '@images/hats-logo.png';

export default function MetaCard() {
  return (
    <Card className="max-w-2xl shadow-xl">
      <CardHeader>
        <div className="flex items-baseline w-full justify-between">
          <img
            src={hatsLogo}
            alt="Hats Logo"
            className="h-16 w-16 align-baseline"
          />
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
