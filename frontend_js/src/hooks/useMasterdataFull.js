// hooks/useMasterdataFull.js
import { useQuery } from '@tanstack/react-query';
import { getBaseApiUrl } from '../utils/apiConfig';

const useMasterdataFull = (code) => {
  const fetchFull = async () => {
    const BASE_API_URL = getBaseApiUrl();
    const res = await fetch(`${BASE_API_URL}/${code}/full/`);
    if (!res.ok) throw new Error(`Failed to fetch ${code}/full`);
    const json = await res.json();
    return {
      meta: json.meta,
      data: Array.isArray(json.data) ? json.data : [],
    };
  };

  const {
    data: result,
    isLoading,
    isError,
    refetch,
    error,
  } = useQuery({
    queryKey: ['masterdata', code, 'full'],
    queryFn: fetchFull,
    enabled: !!code,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  return {
    meta: result?.meta,
    data: result?.data || [],
    isLoading,
    isError,
    error,
    refetch,
  };
};

export default useMasterdataFull;
