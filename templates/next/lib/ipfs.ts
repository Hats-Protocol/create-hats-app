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

export const resolveIpfsUri = async (
  uri: string
): Promise<{ name: string; description: string }> => {
  const ipfsGateway = 'https://ipfs.io/ipfs/';
  const cid = uri.split('ipfs://')[1];
  const response = await fetch(`${ipfsGateway}${cid}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  console.log('data', data);
  return {
    name: data.data.name,
    description: data.data.description,
  };
};
