import { FALLBACK_ADDRESS, hatIdIpToDecimal } from '@hatsprotocol/sdk-v1-core';
import { Hat, HatsSubgraphClient } from '@hatsprotocol/sdk-v1-subgraph';
import { useQuery } from '@tanstack/react-query';
import _ from 'lodash';
import { Hex, zeroAddress } from 'viem';

import { ipfsToHttp, resolveIpfsUri } from '@/lib/ipfs';
import { IpfsDetails } from '@/types';

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

async function getHatData({
  chainId,
  hatId,
}: HatDataProps): Promise<ExtendedHat | null> {
  const trueHatId = _.first(hatId);
  if (!trueHatId) return null;
  const localHatId = hatIdIpToDecimal(trueHatId);

  try {
    const hat = await hatsSubgraphClient.getHat({
      chainId: chainId,
      hatId: BigInt(localHatId),
      props: {
        details: true, // get the hat details
        imageUri: true, // get the hat image uri
        status: true, //
        mutable: true,
        levelAtLocalTree: true,
        eligibility: true,
        toggle: true,
        currentSupply: true,
        maxSupply: true, // get the maximum amount of wearers for the hat
        prettyId: true,
        wearers: {
          props: {},
          filters: { first: 5 },
        },
      },
    });

    let detailsContent: any = { name: '', description: '' }; // Default object structure
    let imageContent: string = '';

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

  const { data, isLoading, fetchStatus, error } = useQuery({
    queryKey: ['hatData', chainId],
    queryFn: () =>
      chainId !== undefined
        ? getHatData({ chainId, hatId: address ? [address] : [] })
        : Promise.resolve(null),
    enabled: isEnabled,
  });

  return {
    hatData: data, // Adjusted based on the returned structure from fetchHatData
    isLoading: isLoading && fetchStatus !== 'idle',
    error, // Include the error in the returned object
  };
};

export default useHatData;
