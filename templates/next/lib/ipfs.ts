const IPFS_PREFIX = 'ipfs://';
const GATEWAY_URL = 'https://ipfs.io/ipfs/';

export const ipfsToHttp = (ipfsUrl: string) => {
  // Check if the URL is a valid IPFS URL.
  if (ipfsUrl === undefined) return;
  if (!ipfsUrl.startsWith(IPFS_PREFIX)) {
    return ipfsUrl;
  }

  // Split the URL into the CID and the path.
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
  const data = await response.json(); // Parse the response as JSON
  // Assuming the JSON structure is as you've mentioned, directly return the name and description
  console.log('data', data);
  return {
    name: data.data.name,
    description: data.data.description,
  };
};
