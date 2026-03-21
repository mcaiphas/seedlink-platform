import { useFinanceResource } from "@/hooks/useFinanceResource";
import { financeService } from "@/services/financeService";

export function useSupplierStatements(options = {}) {
  return useFinanceResource(financeService.getSupplierStatements, options);
}
