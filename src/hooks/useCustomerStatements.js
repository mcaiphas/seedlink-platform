import { useFinanceResource } from "@/hooks/useFinanceResource";
import { financeService } from "@/services/financeService";

export function useCustomerStatements(options = {}) {
  return useFinanceResource(financeService.getCustomerStatements, options);
}
