import { useFinanceResource } from "@/hooks/useFinanceResource";
import { financeService } from "@/services/financeService";

export function useSupplierAging(options = {}) {
  return useFinanceResource(financeService.getSupplierAging, options);
}
