import { useState, useEffect, useCallback } from "react";

const DEFAULT_PAGINATION = {
  page: 1,
  perPage: 20,
  totalItems: 0,
  totalPages: 0,
};

export function useFinanceResource(serviceMethod, initialOptions = {}) {
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);

  const fetch = useCallback(
    async (fetchOptions = {}) => {
      try {
        setLoading(true);
        setError(null);

        const result = await serviceMethod({
          ...initialOptions,
          ...fetchOptions,
        });

        setData(result?.items || []);
        setSummary(result?.summary || {});
        setPagination({
          page: result?.page ?? 1,
          perPage: result?.perPage ?? 20,
          totalItems: result?.totalItems ?? 0,
          totalPages: result?.totalPages ?? 0,
        });

        return result;
      } catch (err) {
        console.error("Finance hook fetch error:", err);
        setError(err?.message || "Failed to fetch data");
        setData([]);
        setSummary({});
        setPagination(DEFAULT_PAGINATION);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [serviceMethod, initialOptions]
  );

  useEffect(() => {
    fetch();
  }, [fetch]);

  return {
    data,
    summary,
    loading,
    error,
    pagination,
    refetch: fetch,
  };
}
