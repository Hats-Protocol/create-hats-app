import { useQuery } from '@tanstack/react-query';
import _ from 'lodash';
import { FALLBACK_ADDRESS, hatIdIpToDecimal } from '@hatsprotocol/sdk-v1-core';
import { Hat, HatsSubgraphClient } from '@hatsprotocol/sdk-v1-subgraph';
import { ipfsToHttp, resolveIpfsUri } from '@/lib/ipfs';
import { IpfsDetails } from '@/types';
import { Hex, zeroAddress } from 'viem';

const hatsSubgraphClient = new HatsSubgraphClient({});

interface HatDataProps {
  chainId: number;
  hatId: string[];
}

interface ExtendedHat extends Hat {
  detailsDecoded: IpfsDetails;
  imageUri: string;
  errorMessage?: string;
}

// Moved outside of useHatData for better separation of concerns
async function getHatData({
  chainId,
  hatId,
}: HatDataProps): Promise<ExtendedHat | null> {
  const trueHatId = _.first(hatId);
  if (!trueHatId) return null;
  const localHatId = hatIdIpToDecimal(trueHatId);

  try {
    const hat = await hatsSubgraphClient.getHat({
      chainId,
      hatId: BigInt(localHatId),
      props: {
        details: true,
        imageUri: true,
        // Other props...
      },
    });

    let detailsContent: any = { name: '', description: '' }; // Default object structure
    let imageContent: string = '';
    console.log('hat.details', hat.details);

    if (hat.details) {
      const resolvedDetails = await resolveIpfsUri(hat.details);
      const criteriaDetails = resolvedDetails.eligibility?.criteria.map(
        (criterion) => {
          return {
            link: criterion.link,
            label: criterion.label,
          };
        }
      );

      console.log('criteria details', criteriaDetails);

      detailsContent = {
        name: resolvedDetails.name ?? '',
        description: resolvedDetails.description ?? '',
        guilds: resolvedDetails.guilds ?? [],
        spaces: resolvedDetails.spaces ?? [],
        responsibilities: resolvedDetails.responsibilities ?? [],
        authorities: resolvedDetails.authorities ?? [],
        eligibility: resolvedDetails.eligibility ?? {
          manual: false,
          criteria: criteriaDetails ?? [],
        },
        toggle: resolvedDetails.toggle ?? { manual: false, criteria: [] },
      };
    }

    if (hat.imageUri) {
      imageContent = (await ipfsToHttp(hat.imageUri)) || '';
    }

    return {
      ...hat,
      detailsDecoded: detailsContent,
      imageUri: imageContent,
    };
  } catch (error) {
    console.error(`Error fetching hat data: ${error}`);
    return null;
  }
}

const useHatData = ({
  address,
  chainId,
  enabled = true,
}: {
  address: Hex | undefined;
  chainId: number | undefined;
  enabled?: boolean;
}) => {
  const isEnabled =
    !!address &&
    address !== FALLBACK_ADDRESS &&
    address !== zeroAddress &&
    enabled;

  const { data, isLoading, fetchStatus } = useQuery({
    queryKey: ['hatData', chainId], // Assuming chainId is used to identify the query uniquely
    queryFn: () =>
      chainId !== undefined
        ? getHatData({ chainId, hatId: address ? [address] : [] })
        : Promise.resolve(null),
    enabled: isEnabled,
  });

  return {
    details: data?.detailsDecoded, // Adjusted based on the returned structure from fetchHatData
    isLoading: isLoading && fetchStatus !== 'idle',
  };
};

export default useHatData;
