import { ExternalLink, Key, SquareCheckBig } from 'lucide-react';

import { Authority, Responsibility } from '@/types';

import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';

interface AuthoritiesResponsibilitiesProps {
  authorities: Authority[];
  responsibilities: Responsibility[];
}

export default function ResponsibilitiesCard({
  authorities,
  responsibilities,
}: AuthoritiesResponsibilitiesProps) {
  return (
    <Card className="max-w-2xl shadow-xl">
      <CardHeader>
        <CardTitle>Responsibilities</CardTitle>
        <CardDescription>Responsibilities & Authorities</CardDescription>
      </CardHeader>
      <CardContent>
        <span className="text-md font-semibold text-gray-800">
          {authorities.length}{' '}
          {authorities.length !== 1 ? 'Authorities' : 'Authority'} granted by
          this Hat
        </span>
        {authorities.map((authority) => (
          <div className="flex flex-col gap-2" key={authority.label}>
            <div className="flex flex-row items-center justify-between gap-2">
              <div className="flex flex-row items-center gap-2">
                <Key className="h-4 w-4  text-violet-500" />
                <span className="text-md">{authority.label}</span>
              </div>
              {authority.link && (
                <div>
                  <Button variant="link">
                    <a
                      href={authority.link}
                      className="inline-flex items-center justify-center"
                    >
                      Link
                      <ExternalLink className="ml-1 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </CardContent>
      <CardContent>
        <div className="flex flex-col gap-2">
          <span className="text-md font-semibold text-gray-800">
            {responsibilities.length}{' '}
            {responsibilities.length !== 1
              ? 'Responsibilities'
              : 'Responsibility'}{' '}
            expected of Hat Wearers
          </span>
          {responsibilities.map((responsibility) => (
            <div className="flex flex-col gap-2" key={responsibility.label}>
              <div className="flex flex-row items-center gap-2">
                <SquareCheckBig className="h-4 w-4 bg-cyan-50 text-cyan-500" />
                <span className="text-md">{responsibility.label}</span>
              </div>
              {/* {responsibility.description && (
                <span className="text-sm">{responsibility.description}</span>
              )}
              {responsibility.link && <span>{responsibility.link}</span>} */}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
