# Create Hats App

Create Hats App is a tool for bootstrapping a new Hats app. Running create-hats-app (or via npx create-hats-app) initializes a command line interface where builders can enter an app name, choose a supported framework, and then a boilerplate app will be created using the selected framework template. Each template is a functional, deployable application that builders can use to begin building in the Hats ecosystem.

## Prerequisites

Before you begin, ensure you have [Node.js](https://nodejs.org/en/) version 18 or later installed on your machine. Note that the Vite template may work best with 20+.

## Getting Started

Quickly bootstrap a Hats app with the following command:

```bash
npx create-hats-app
```

You'll be prompted to enter the name of your app, select a framework and then the app will be created in a new directory with that name.

Once the process finishes, navigate into your app directory and get started.

## Available Templates

The templates (and generated starter apps) focus on enabling core functionality and are designed to be forked and extended. The templates handle the scaffolding for each of the supported frameworks, and the data reads and writes are implemented by following the commonly accepted approaches specific to each framework. Each template leverages learnings and solves pain points of spinning up onchain projects. The Vite template includes minimal, lightweight polyfills that are required for building onchain apps using Vite whereas the Next.js template is structured to fully utilize React Server Components and the associated data loading strategies used in the Next.js app router paradigm.

- [Next App Template](./templates/next/)
- [Vite App Template](./templates/vite/)
- [Remix/Vite App Template](./templates/remix-vite/)

The README in each template contains more details and information.

### Common Tooling

Each template includes the same functionality and leverages the Hats Modules SDK, v1 Core SDK, and v1 Subgraph SDK to provide a “playground” for exploring commonly used Hats Protocol reads and writes.

Our goal is for each template to be as similar as possible, with complete feature parity while preserving the nuances of each framework. The templates strike a balance by being opinionated in their initial configuration setup while also remaining flexible and extendable, allowing them to grow into fully fledged independent apps within the Hats ecosystem.

- [Hats Core SDK](https://github.com/Hats-Protocol/sdk-v1-core)
- [Hats Subgraph SDK](https://github.com/Hats-Protocol/sdk-v1-core/tree/main/packages/subgraph)
- [Hats Modules SDK](https://github.com/Hats-Protocol/modules-sdk)
- [RainbowKit](https://www.rainbowkit.com/)
- [Wagmi](https://wagmi.sh/)
- [Viem](https://viem.sh/)
- [Tanstack Query](https://tanstack.com/query/latest/docs)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://github.com/colinhacks/zod)
- [Shadcn/UI](https://ui.shadcn.com/)
- [Tailwind](https://tailwindcss.com/)
- [RadixUI](https://www.radix-ui.com/)
- [Sonner](https://sonner.emilkowal.ski/getting-started)

### Choosing Your Template

The Next and Remix templates optimize for loading data on the server and passing to the client, whereas the Vite template is entirely client-side and can be deployed without a server. These options represent the extreme sides of a spectrum, allowing builders to decide which entry point aligns with their project goals.

## Community Resources

- [Hats Site](https://www.hatsprotocol.xyz/)
- [Hats Documentation](https://docs.hatsprotocol.xyz/)
