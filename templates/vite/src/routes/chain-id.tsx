import { CircleAlert } from 'lucide-react';
import { useParams } from 'react-router-dom';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const supportedChains = [1, 10, 42161, 137, 100, 11155111, 8453, 42220];

export default function ChainIdLayout() {
  const { chainId } = useParams<{ chainId: string }>();

  const isChainSupported = supportedChains.includes(Number(chainId));

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div>
        {isChainSupported ? (
          <div>Chain: {chainId}</div>
        ) : (
          <Alert className="shadow-xl">
            <CircleAlert className="h-4 w-4" />
            <AlertTitle>Unsupported chain!</AlertTitle>
            <AlertDescription>
              <div className="flex flex-col">
                <p>Chain ID {chainId} is not supported.</p>
                <p>Supported chains are: {supportedChains.join(', ')}</p>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
