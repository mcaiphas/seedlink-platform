import { useFinanceResource } from "@/hooks/useFinanceResource";
import { financeService } from "@/services/financeService";

export function useOperationsFinance(options = {}) {
  return useFinanceResource(financeService.getOperationsFinance, options);
}
