import { useState } from "react";
import { procurementService } from "@/services/procurementService";

export function usePurchaseOrderMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function createPurchaseOrder(payload) {
    try {
      setLoading(true);
      setError(null);
      return await procurementService.createPurchaseOrder(payload);
    } catch (err) {
      console.error("Create purchase order error:", err);
      setError(err?.message || "Failed to create purchase order");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function updatePurchaseOrder(poId, payload) {
    try {
      setLoading(true);
      setError(null);
      return await procurementService.updatePurchaseOrder(poId, payload);
    } catch (err) {
      console.error("Update purchase order error:", err);
      setError(err?.message || "Failed to update purchase order");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function submitPurchaseOrder(poId) {
    try {
      setLoading(true);
      setError(null);
      return await procurementService.submitPurchaseOrder(poId);
    } catch (err) {
      console.error("Submit purchase order error:", err);
      setError(err?.message || "Failed to submit purchase order");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function approvePurchaseOrder(poId) {
    try {
      setLoading(true);
      setError(null);
      return await procurementService.approvePurchaseOrder(poId);
    } catch (err) {
      console.error("Approve purchase order error:", err);
      setError(err?.message || "Failed to approve purchase order");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function receivePurchaseOrder(poId, payload) {
    try {
      setLoading(true);
      setError(null);
      return await procurementService.receivePurchaseOrder(poId, payload);
    } catch (err) {
      console.error("Receive purchase order error:", err);
      setError(err?.message || "Failed to receive purchase order");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return {
    createPurchaseOrder,
    updatePurchaseOrder,
    submitPurchaseOrder,
    approvePurchaseOrder,
    receivePurchaseOrder,
    loading,
    error,
  };
}
