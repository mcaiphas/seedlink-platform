import { useFinanceResource } from "@/hooks/useFinanceResource";
import { financeService } from "@/services/financeService";

export function useSupplierPayments(options = {}) {
  return useFinanceResource(financeService.getSupplierPayments, options);
}
