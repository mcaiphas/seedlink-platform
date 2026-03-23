import { useProcurementResource } from "@/hooks/useProcurementResource";
import { procurementService } from "@/services/procurementService";

export function usePurchaseOrders(options = {}) {
  return useProcurementResource(procurementService.getPurchaseOrders, options);
}
