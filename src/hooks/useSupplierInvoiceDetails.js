import { useEffect, useState } from "react";
import { procurementService } from "@/services/procurementService";

export function useSupplierInvoiceDetails(invoiceId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(Boolean(invoiceId));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!invoiceId) return;

    let mounted = true;

    async function fetchDetails() {
      try {
        setLoading(true);
        setError(null);
        const result = await procurementService.getSupplierInvoiceById(invoiceId);
        if (mounted) setData(result);
      } catch (err) {
        console.error("Supplier invoice details fetch error:", err);
        if (mounted) setError(err?.message || "Failed to fetch supplier invoice");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchDetails();

    return () => {
      mounted = false;
    };
  }, [invoiceId]);

  return { data, loading, error };
}
