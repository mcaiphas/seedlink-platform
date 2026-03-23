import { useCallback, useEffect, useState } from "react";
import { procurementService } from "@/services/procurementService";

export function useProcurementDashboard(initialFilters = {}) {
  const [data, setData] = useState({
    summary: {
      activeSuppliers: 0,
      openPurchaseOrders: 0,
      pendingSupplierInvoices: 0,
      totalProcurementValue: 0,
      totalInvoiceExposure: 0,
      overdueSupplierInvoices: 0,
      receivedThisPeriod: 0,
      avgPoValue: 0,
    },
    purchaseOrderStatusBreakdown: [],
    supplierInvoiceStatusBreakdown: [],
    recentPurchaseOrders: [],
    recentSupplierInvoices: [],
    topSuppliersBySpend: [],
    monthlyProcurementTrend: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetch = useCallback(
    async (filters = {}) => {
      try {
        setLoading(true);
        setError(null);

        const result = await procurementService.getProcurementDashboard({
          ...initialFilters,
          ...filters,
        });

        setData(
          result || {
            summary: {
              activeSuppliers: 0,
              openPurchaseOrders: 0,
              pendingSupplierInvoices: 0,
              totalProcurementValue: 0,
              totalInvoiceExposure: 0,
              overdueSupplierInvoices: 0,
              receivedThisPeriod: 0,
              avgPoValue: 0,
            },
            purchaseOrderStatusBreakdown: [],
            supplierInvoiceStatusBreakdown: [],
            recentPurchaseOrders: [],
            recentSupplierInvoices: [],
            topSuppliersBySpend: [],
            monthlyProcurementTrend: [],
          }
        );

        return result;
      } catch (err) {
        console.error("Procurement dashboard fetch error:", err);
        setError(err?.message || "Failed to fetch procurement dashboard");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [initialFilters]
  );

  useEffect(() => {
    fetch();
  }, [fetch]);

  return {
    data,
    loading,
    error,
    refetch: fetch,
  };
}
