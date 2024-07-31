import { IpfsDetails } from '@/types';

const IPFS_PREFIX = 'ipfs://';
const GATEWAY_URL = 'https://ipfs.io/ipfs/';

export const ipfsToHttp = (ipfsUrl: string) => {
  if (ipfsUrl === undefined) return;
  if (!ipfsUrl.startsWith(IPFS_PREFIX)) {
    return ipfsUrl;
  }

  const cid = ipfsUrl.split('://')[1];
  return `${GATEWAY_URL}${cid}`;
};

export const resolveIpfsUri = async (uri: string): Promise<IpfsDetails> => {
  const ipfsGateway = 'https://ipfs.io/ipfs/';
  const cid = uri.split('ipfs://')[1];
  const response = await fetch(`${ipfsGateway}${cid}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  return {
    name: data.data.name ?? '',
    description: data.data.description ?? '',
    guilds: data.data.guilds ?? [],
    spaces: data.data.spaces ?? [],
    responsibilities: data.data.responsibilities ?? [],
    authorities: data.data.authorities ?? [],
    eligibility: data.data.eligibility ?? { manual: false, criteria: [] },
    toggle: data.data.toggle ?? { manual: false, criteria: [] },
  };
};
