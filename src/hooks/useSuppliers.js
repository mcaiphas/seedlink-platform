import { useProcurementResource } from "@/hooks/useProcurementResource";
import { procurementService } from "@/services/procurementService";

export function useSuppliers(options = {}) {
  return useProcurementResource(procurementService.getSuppliers, options);
}
