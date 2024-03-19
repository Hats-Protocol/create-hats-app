import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardDescription,
} from './ui/card';

export default function ResponsibilitiesCard() {
  return (
    <Card className="max-w-2xl shadow-xl">
      <CardHeader>
        <CardTitle>Responsibilities</CardTitle>
        <CardDescription>Responsibilities & Authoirities</CardDescription>
      </CardHeader>
    </Card>
  );
}
