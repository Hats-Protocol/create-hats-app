# @hatsprotocol/react-sdk

React hooks and utilities for interacting with Hats Protocol.

## Installation

```bash
npm install @hatsprotocol/react-sdk
# or
yarn add @hatsprotocol/react-sdk
# or
pnpm add @hatsprotocol/react-sdk
```

## Core Hooks

### useHatContractWrite

Base hook for contract write operations:

```typescript
const { writeAsync, isLoading } = useHatContractWrite({
  functionName: 'mintHat',
  args: [hatId, wearer],
  chainId,
  onSuccess: (data) => {
    // Handle success
  },
  onError: (error) => {
    // Handle error
  },
});
```

### useHatMint

Specialized hook for minting hats:

```typescript
const { writeAsync, isLoading } = useHatMint({
  selectedHat,
  wearer,
  chainId,
});
```

### useHatBurn

Specialized hook for renouncing hats:

```typescript
const { writeAsync, isLoading } = useHatBurn({
  selectedHat,
  chainId,
});
```

## Framework Integration

### Next.js Example

```typescript
import { useHatMint } from '@hatsprotocol/react-sdk';

export function MintButton({ hatId, wearer }) {
  const { writeAsync, isLoading } = useHatMint({
    selectedHat: hatId,
    wearer,
    onSuccess: () => {
      toast.success('Hat minted successfully!');
    },
    onError: (error) => {
      toast.error('Failed to mint hat');
    }
  });

  return (
    <Button
      onClick={() => writeAsync?.()}
      disabled={isLoading}
    >
      {isLoading ? 'Minting...' : 'Mint Hat'}
    </Button>
  );
}
```

### Vite/Remix Example

Similar integration patterns work for Vite and Remix applications. The hooks are framework-agnostic and can be used with any React application.

## Best Practices

1. Always handle loading states and errors appropriately
2. Use the specialized hooks (`useHatMint`, `useHatBurn`) when possible
3. Implement proper error boundaries in your application
4. Consider using a toast library for user feedback

## Contributing

We welcome contributions! Please see our contributing guide for details.

## License

MIT
