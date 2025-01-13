'use client';

import { Check, Copy } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

const handleCopy = (
  itemToCopy: any, // this is specifically any since it can accept any value
  onSuccess: () => void,
  onError: (error: Error) => void,
) => {
  if (itemToCopy !== null) {
    navigator.clipboard
      .writeText(itemToCopy)
      .then(() => {
        onSuccess();
      })
      .catch((err) => {
        console.error('Failed to copy text: ', err);
        onError(err);
      });
  }
};
export const CopyButton = ({ itemToCopy }: { itemToCopy: any }) => {
  const [hasCopied, setHasCopied] = useState(false);

  const onSuccess = () => {
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
    toast.success('Address copied to clipboard.');
  };

  const onError = () => {
    toast.error('Address unable to be copied to clipboard. Please try again.');
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => handleCopy(itemToCopy, onSuccess, onError)}
    >
      {hasCopied ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </Button>
  );
};
