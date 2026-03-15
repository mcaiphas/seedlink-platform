/**
 * Supabase query helpers with granular error classification for dev hardening.
 */

export type QueryStatus = 'loading' | 'success' | 'empty' | 'rls_denied' | 'table_unavailable' | 'error';

export interface QueryResult<T = any> {
  data: T[];
  status: QueryStatus;
  error: string | null;
  count: number | null;
}

const isDev = import.meta.env.DEV;

/**
 * Classify a Supabase error into a specific QueryStatus.
 */
export function classifyError(error: { code?: string; message?: string; details?: string; hint?: string } | null): { status: QueryStatus; message: string } {
  if (!error) return { status: 'success', message: '' };

  const code = error.code || '';
  const msg = error.message || '';
  const details = error.details || '';

  // RLS denied — typically 42501 or "permission denied" or empty result from policy
  if (code === '42501' || msg.includes('permission denied') || msg.includes('row-level security')) {
    return { status: 'rls_denied', message: isDev ? `RLS denied: ${msg}` : 'Access denied' };
  }

  // Table/relation does not exist
  if (code === '42P01' || msg.includes('relation') && msg.includes('does not exist')) {
    return { status: 'table_unavailable', message: isDev ? `Table unavailable: ${msg}` : 'Resource unavailable' };
  }

  // Ambiguous relationship (PGRST201) — common with multiple FKs
  if (code === 'PGRST201' || msg.includes('Could not embed')) {
    return { status: 'error', message: isDev ? `Ambiguous join: ${error.hint || msg}` : 'Query configuration error' };
  }

  // Function not found
  if (code === '42883' || msg.includes('function') && msg.includes('does not exist')) {
    return { status: 'table_unavailable', message: isDev ? `Function unavailable: ${msg}` : 'Feature unavailable' };
  }

  // Generic error
  return { status: 'error', message: isDev ? `${code}: ${msg}` : 'An error occurred loading data' };
}

/**
 * Status display helpers
 */
export function getStatusMessage(status: QueryStatus, tableName?: string): string {
  switch (status) {
    case 'empty': return 'No records found';
    case 'rls_denied': return isDev ? `Access denied by RLS${tableName ? ` on ${tableName}` : ''}` : 'Access denied';
    case 'table_unavailable': return isDev ? `Table "${tableName}" is not available` : 'This feature is not available';
    case 'error': return 'Failed to load data';
    default: return '';
  }
}

export function getStatusVariant(status: QueryStatus): 'default' | 'destructive' | 'secondary' | 'outline' {
  switch (status) {
    case 'rls_denied': return 'secondary';
    case 'table_unavailable': return 'outline';
    case 'error': return 'destructive';
    default: return 'default';
  }
}
