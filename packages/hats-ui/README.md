# @hatsprotocol/hats-ui

Reusable UI components and shared styling for Hats Protocol applications.

## Installation

```bash
npm install @hatsprotocol/hats-ui
# or
yarn add @hatsprotocol/hats-ui
# or
pnpm add @hatsprotocol/hats-ui
```

## Features

- 🎨 Shared Tailwind configuration
- 📚 Storybook integration
- 🧩 Framework-agnostic components
- 🎯 Focus on reusability and consistency

## Components

### Button

Basic button component with variants:

```tsx
import { Button } from '@hatsprotocol/hats-ui';

function MyComponent() {
  return (
    <Button onClick={() => console.log('Clicked!')} disabled={false}>
      Click Me
    </Button>
  );
}
```

## Tailwind Configuration

To use the shared Tailwind configuration in your project:

```js
// tailwind.config.js
const baseConfig = require('@hatsprotocol/hats-ui/tailwind.config');

module.exports = {
  ...baseConfig,
  // Add your custom configuration here
};
```

## Development

### Running Storybook

```bash
pnpm dev
```

Visit `http://localhost:6006` to view the component library.

## Contributing

We welcome contributions! Please see our contributing guide for details.

## License

MIT
