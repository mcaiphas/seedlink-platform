import { useEffect, useState } from "react";
import { procurementService } from "@/services/procurementService";

export function usePurchaseOrderDetails(poId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(Boolean(poId));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!poId) return;

    let mounted = true;

    async function fetchDetails() {
      try {
        setLoading(true);
        setError(null);
        const result = await procurementService.getPurchaseOrderById(poId);
        if (mounted) setData(result);
      } catch (err) {
        console.error("Purchase order details fetch error:", err);
        if (mounted) setError(err?.message || "Failed to fetch purchase order");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchDetails();

    return () => {
      mounted = false;
    };
  }, [poId]);

  return { data, loading, error };
}
