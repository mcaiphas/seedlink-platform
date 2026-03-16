import { supabase } from '@/integrations/supabase/client';

export async function generateDocNumber(type: 'po' | 'gr' | 'si' | 'ci'): Promise<string> {
  const fnMap = { po: 'generate_po_number', gr: 'generate_gr_number', si: 'generate_si_number', ci: 'generate_ci_number' };
  const { data, error } = await supabase.rpc(fnMap[type] as any);
  if (error || !data) {
    // Fallback if RPC fails
    const prefixMap = { po: 'PO', gr: 'GR', si: 'SI', ci: 'INV' };
    return `${prefixMap[type]}-${Date.now().toString().slice(-6)}`;
  }
  return data as string;
}
