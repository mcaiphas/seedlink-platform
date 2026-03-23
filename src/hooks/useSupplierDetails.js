import { useEffect, useState } from "react";
import { procurementService } from "@/services/procurementService";

export function useSupplierDetails(supplierId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(Boolean(supplierId));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!supplierId) return;

    let mounted = true;

    async function fetchDetails() {
      try {
        setLoading(true);
        setError(null);
        const result = await procurementService.getSupplierById(supplierId);
        if (mounted) setData(result);
      } catch (err) {
        console.error("Supplier details fetch error:", err);
        if (mounted) setError(err?.message || "Failed to fetch supplier");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchDetails();

    return () => {
      mounted = false;
    };
  }, [supplierId]);

  return { data, loading, error };
}
