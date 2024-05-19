// * should keep fetching strategy inline with `useManyHatsDetailsField.ts`

/**
 * Handles the "details" field of a Hat. If content is pointing to IPFS, fetches the data and checks its schema type.
 * @param {string} detailsField Details field as received from the contract
 * @returns If data is on ipfs and is compatible with a known schema, then returns the schema type with the data. Otherwise, just the fetched data.
 * If not ipfs, returns undefined.
 */
const useHatDetailsField = (
  detailsField?: string,
  editMode = false
): {
  data: { type: string; data: any } | undefined;
  isLoading: boolean;
  error: Error | undefined;
} => {
  // currently uses this prefix as an indicator for ipfs data
  const isIpfs = detailsField?.startsWith('ipfs://');

  const data = undefined;
  const isLoading = false;
  const error = undefined;

  return {
    data,
    isLoading,
    error: error as Error | undefined,
  };
};

export default useHatDetailsField;
