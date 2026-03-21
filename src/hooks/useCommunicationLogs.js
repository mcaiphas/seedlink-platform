import { useFinanceResource } from "@/hooks/useFinanceResource";
import { financeService } from "@/services/financeService";

export function useCommunicationLogs(options = {}) {
  return useFinanceResource(financeService.getCommunicationLogs, options);
}
