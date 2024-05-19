'use client';

import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { CircleAlert } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <Alert className="shadow-xl">
        <CircleAlert className="h-4 w-4" />
        <AlertTitle>Error fetching Hat Details.</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    </div>
  );
}
