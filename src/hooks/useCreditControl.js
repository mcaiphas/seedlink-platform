import { useFinanceResource } from "@/hooks/useFinanceResource";
import { financeService } from "@/services/financeService";

export function useCreditControl(options = {}) {
  return useFinanceResource(financeService.getCreditControl, options);
}
