import { useQueryClient } from '@tanstack/react-query';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useChainId } from 'wagmi';

const useHatStatusCheck = ({
  hatData,
  chainId,
  handlePendingTx,
}: {
  hatData?: any; // AppHat;
  chainId?: number;
  handlePendingTx?: any; // HandlePendingTx;
}) => {
  const [toggleIsContract, setToggleIsContract] = useState(false);
  const [testingToggle, setTestingToggle] = useState(false);

  useEffect(() => {
    const testToggle = async () => {
      setTestingToggle(true);
      const localData = false;

      setToggleIsContract(localData);
      setTestingToggle(false);
    };
    testToggle();
  }, [hatData, chainId]);

  return {
    // TODO revert
    writeAsync: undefined,
    prepareError: undefined,
    writeError: undefined,
    isLoading: false, // isLoading || testingToggle || writeLoading,
    toggleIsContract,
  };
};

export default useHatStatusCheck;
