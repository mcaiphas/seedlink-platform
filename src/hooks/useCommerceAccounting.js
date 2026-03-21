import { useFinanceResource } from "@/hooks/useFinanceResource";
import { financeService } from "@/services/financeService";

export function useCommerceAccounting(options = {}) {
  return useFinanceResource(financeService.getCommerceAccounting, options);
}
