import { supabase } from '@/integrations/supabase/client';

type DocType = 'po' | 'gr' | 'si' | 'ci' | 'sa' | 'je' | 'qt' | 'pi' | 'pr';

const fnMap: Record<DocType, string> = {
  po: 'generate_po_number',
  gr: 'generate_gr_number',
  si: 'generate_si_number',
  ci: 'generate_ci_number',
  sa: 'generate_sa_number',
  je: 'generate_je_number',
  qt: 'generate_qt_number',
  pi: 'generate_pi_number',
  pr: 'generate_pr_number',
};

const prefixMap: Record<DocType, string> = {
  po: 'PO', gr: 'GR', si: 'SI', ci: 'INV', sa: 'SA', je: 'JE',
  qt: 'QT', pi: 'PI', pr: 'PR',
};

export async function generateDocNumber(type: DocType): Promise<string> {
  const { data, error } = await supabase.rpc(fnMap[type] as any);
  if (error || !data) {
    return `${prefixMap[type]}-${Date.now().toString().slice(-6)}`;
  }
  return data as string;
}
