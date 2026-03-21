import { useFinanceResource } from "@/hooks/useFinanceResource";
import { financeService } from "@/services/financeService";

export function useCustomerAging(options = {}) {
  return useFinanceResource(financeService.getCustomerAging, options);
}
