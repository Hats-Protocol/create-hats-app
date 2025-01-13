// import { HatsSubgraphClient } from '@hatsprotocol/sdk-v1-subgraph';
import { CircleAlert } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const supportedChains = [1, 10, 42161, 137, 100, 11155111, 8453, 42220];
// const hatsSubgraphClient = new HatsSubgraphClient({});

export default async function ChainIdPage({
  params,
}: {
  params: { chainId: number };
}) {
  const isChainSupported = supportedChains.includes(params.chainId);

  return (
    <div>
      {isChainSupported ? (
        <div>Chain: {params.chainId}</div>
      ) : (
        <Alert className="shadow-xl">
          <CircleAlert className="h-4 w-4" />
          <AlertTitle>Unsupported chain!</AlertTitle>
          <AlertDescription>
            <div className="flex flex-col">
              <p>Chain ID {params.chainId} is not supported.</p>
              <p>Supported chains are: {supportedChains.join(', ')}</p>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

// const getHatData = async ({ chainId }: { chainId: number }) => {
//   const hat = await hatsSubgraphClient.getHat({
//     chainId: chainId,
//     hatId: BigInt(172),
//     props: {
//       maxSupply: true, // get the maximum amount of wearers for the hat
//       wearers: {
//         // get the hat's wearers
//         props: {}, // for each wearer, include only its ID (address)
//       },
//       events: {
//         // get the hat's events
//         props: {
//           transactionID: true, // for each event, include the transaction ID
//         },
//         filters: {
//           first: 10, // fetch only the latest 10 events
//         },
//       },
//     },
//   });

//   return hat;
// };
