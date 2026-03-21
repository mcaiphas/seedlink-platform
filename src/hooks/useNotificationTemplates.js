import { useFinanceResource } from "@/hooks/useFinanceResource";
import { financeService } from "@/services/financeService";

export function useNotificationTemplates(options = {}) {
  return useFinanceResource(financeService.getNotificationTemplates, options);
}
