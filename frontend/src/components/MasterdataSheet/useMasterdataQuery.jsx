// components/masterdata/useMasterdataQuery.js
import { useQuery } from "@tanstack/react-query";
import { getBaseApiUrl } from "../../utils/apiConfig";

const useMasterdataQuery = (code) => {
  const fetchMetadataAndData = async () => {
    const BASE_API_URL = getBaseApiUrl();
    const [metaRes, dataRes] = await Promise.all([
      fetch(`${BASE_API_URL}/${code}/meta/`),
      fetch(`${BASE_API_URL}/${code}/`),
    ]);
    if (!metaRes.ok || !dataRes.ok) throw new Error("Fetch failed");

    const meta = await metaRes.json();
    const dataRaw = await dataRes.json();
    const data = Array.isArray(dataRaw)
      ? dataRaw
      : Array.isArray(dataRaw?.results)
        ? dataRaw.results
        : [];

    return { meta, data };
  };

  const {
    data: fetched,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["masterdata", code],
    queryFn: fetchMetadataAndData,
    enabled: !!code,
    staleTime: 5 * 60 * 1000,
  });

  return {
    meta: fetched?.meta,
    data: fetched?.data || [],
    isLoading,
    isError,
    refetch,
  };
};

export default useMasterdataQuery;
