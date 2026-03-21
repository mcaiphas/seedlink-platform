import { useFinanceResource } from "@/hooks/useFinanceResource";
import { financeService } from "@/services/financeService";

export function useInventoryValuation(options = {}) {
  return useFinanceResource(financeService.getInventoryValuation, options);
}
