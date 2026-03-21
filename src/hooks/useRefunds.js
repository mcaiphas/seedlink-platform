import { useFinanceResource } from "@/hooks/useFinanceResource";
import { financeService } from "@/services/financeService";

export function useRefunds(options = {}) {
  return useFinanceResource(financeService.getRefunds, options);
}
