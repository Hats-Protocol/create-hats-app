import { Hat } from '@hatsprotocol/sdk-v1-subgraph';

const useHatDetails = ({
  hatId,
  chainId,
  initialData,
  editMode,
}: {
  hatId: string | undefined;
  chainId: number | undefined; // SupportedChains | undefined;
  initialData?: Hat | undefined; // AppHat | null;
  editMode?: boolean;
}) => {
  const data = undefined;
  const isLoading = false;
  const error = undefined;

  return { data, isLoading, error };
};

export default useHatDetails;
