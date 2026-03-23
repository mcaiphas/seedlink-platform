import { useState } from "react";
import { procurementService } from "@/services/procurementService";

export function useSupplierInvoiceMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function createSupplierInvoice(payload) {
    try {
      setLoading(true);
      setError(null);
      return await procurementService.createSupplierInvoice(payload);
    } catch (err) {
      console.error("Create supplier invoice error:", err);
      setError(err?.message || "Failed to create supplier invoice");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function updateSupplierInvoice(invoiceId, payload) {
    try {
      setLoading(true);
      setError(null);
      return await procurementService.updateSupplierInvoice(invoiceId, payload);
    } catch (err) {
      console.error("Update supplier invoice error:", err);
      setError(err?.message || "Failed to update supplier invoice");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function postSupplierInvoice(invoiceId) {
    try {
      setLoading(true);
      setError(null);
      return await procurementService.postSupplierInvoice(invoiceId);
    } catch (err) {
      console.error("Post supplier invoice error:", err);
      setError(err?.message || "Failed to post supplier invoice");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return {
    createSupplierInvoice,
    updateSupplierInvoice,
    postSupplierInvoice,
    loading,
    error,
  };
}
