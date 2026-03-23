import { useProcurementResource } from "@/hooks/useProcurementResource";
import { procurementService } from "@/services/procurementService";

export function useSupplierInvoices(options = {}) {
  return useProcurementResource(procurementService.getSupplierInvoices, options);
}
