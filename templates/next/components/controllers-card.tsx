import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import ReactMarkdown from 'react-markdown';
import { Button } from './ui/button';

interface ControllersCardProps {
  // id: Hex;
  // details: {
  //   name: string;
  //   description?: string;
  // };
  // imageUri: string;
}

export default function ControllersCard({}: ControllersCardProps) {
  return (
    <Card className="max-w-2xl shadow-xl">
      <CardHeader>
        <CardTitle>Controllers</CardTitle>
      </CardHeader>
    </Card>
  );
}
