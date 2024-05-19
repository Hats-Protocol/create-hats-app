import { z } from 'zod';

const schema = z.object({
  PUBLIC_ENABLE_TESTNETS: z.string() || 'true',
  WALLETCONNECT_PROJECT_ID: z.string(),
  ALCHEMY_RPC_URL: z.string(),
  ALCHEMY_ID: z.string(),
});

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof schema> {}
  }
}

export function init() {
  const parsed = schema.safeParse(process.env);

  if (parsed.success === false) {
    console.error(
      'Invalid environment variables:',
      parsed.error.flatten().fieldErrors
    );

    throw new Error('Invalid environment variables');
  }
}

/**
 * This is used in both `entry.server.ts` and `root.tsx` to ensure that
 * the environment variables are set and globally available before the app is
 * started.
 *
 * NOTE: Do *not* add any environment variables in here that you do not wish to
 * be included in the client.
 * @returns all public ENV variables
 */
export function getEnv() {
  return {
    PUBLIC_ENABLE_TESTNETS: process.env.PUBLIC_ENABLE_TESTNETS,
    WALLETCONNECT_PROJECT_ID: process.env.WALLETCONNECT_PROJECT_ID,
    ALCHEMY_RPC_URL: process.env.ALCHEMY_MAINNET_RPC_URL,
    ALCHEMY_ID: process.env.ALCHEMY_ID,
  };
}

type ENV = ReturnType<typeof getEnv>;

declare global {
  var ENV: ENV;
  interface Window {
    ENV: ENV;
  }
}
