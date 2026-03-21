import { useFinanceResource } from "@/hooks/useFinanceResource";
import { financeService } from "@/services/financeService";

export function useCustomerCreditNotes(options = {}) {
  return useFinanceResource(financeService.getCustomerCreditNotes, options);
}
