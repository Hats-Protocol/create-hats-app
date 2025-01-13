import { getHatsContract } from '@hatsprotocol/sdk-v1-core';
import { useContractWrite, useNetwork, usePrepareContractWrite } from 'wagmi';

export type ValidFunctionName = 'mintHat' | 'renounceHat';

interface UseHatContractWriteProps {
  functionName: ValidFunctionName;
  args: any[];
  chainId: number;
  txDescription?: string;
  onSuccessToastData?: {
    title: string;
    description: string;
  };
  enabled?: boolean;
}

const useHatContractWrite = ({
  functionName,
  args,
  chainId,
  txDescription,
  onSuccessToastData,
  enabled = true,
}: UseHatContractWriteProps) => {
  const { chain } = useNetwork();

  const hatsContract = getHatsContract(chainId);

  const { config } = usePrepareContractWrite({
    address: hatsContract.address,
    abi: hatsContract.abi,
    functionName,
    args,
    enabled: enabled && chain?.id === chainId,
  });

  const { writeAsync, isLoading } = useContractWrite(config);

  return { writeAsync, isLoading };
};

export default useHatContractWrite;
