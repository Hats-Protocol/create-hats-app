import { ZERO_ID } from "@hatsprotocol/sdk-v1-core";
import { Hat } from "@hatsprotocol/sdk-v1-subgraph";
import { useQuery } from "wagmi";

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
  // const { data, isLoading, error } = useQuery({
  //   queryKey: ['hatDetails', { id: hatId, chainId }],
  //   queryFn: () => fetchHatDetails(hatId, chainId),
  //   // ? why is hatId getting set to undefined string?
  //   enabled: !!hatId && hatId !== ZERO_ID && hatId !== 'undefined' && !!chainId,
  //   staleTime: editMode ? Infinity : 1000 * 60 * 15, // 15 minutes
  //   initialData,
  // });

  return { data, isLoading, error };
};

export default useHatDetails;
