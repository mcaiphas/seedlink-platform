import { useState } from "react";
import { procurementService } from "@/services/procurementService";

export function useSupplierMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function createSupplier(payload) {
    try {
      setLoading(true);
      setError(null);
      return await procurementService.createSupplier(payload);
    } catch (err) {
      console.error("Create supplier error:", err);
      setError(err?.message || "Failed to create supplier");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function updateSupplier(supplierId, payload) {
    try {
      setLoading(true);
      setError(null);
      return await procurementService.updateSupplier(supplierId, payload);
    } catch (err) {
      console.error("Update supplier error:", err);
      setError(err?.message || "Failed to update supplier");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return {
    createSupplier,
    updateSupplier,
    loading,
    error,
  };
}
