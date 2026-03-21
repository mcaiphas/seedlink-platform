import { useFinanceResource } from "@/hooks/useFinanceResource";
import { financeService } from "@/services/financeService";

export function useSupplierCreditNotes(options = {}) {
  return useFinanceResource(financeService.getSupplierCreditNotes, options);
}
