import { AlertCircle, ShieldOff, Database, Info } from 'lucide-react';
import { QueryStatus } from '@/lib/supabase-helpers';

interface QueryStatusBannerProps {
  status: QueryStatus;
  message?: string;
  tableName?: string;
}

const config: Record<string, { icon: typeof AlertCircle; bgClass: string; textClass: string; borderClass: string }> = {
  rls_denied: { icon: ShieldOff, bgClass: 'bg-amber-500/10', textClass: 'text-amber-700 dark:text-amber-400', borderClass: 'border-amber-500/30' },
  table_unavailable: { icon: Database, bgClass: 'bg-muted', textClass: 'text-muted-foreground', borderClass: 'border-border' },
  error: { icon: AlertCircle, bgClass: 'bg-destructive/10', textClass: 'text-destructive', borderClass: 'border-destructive/30' },
  empty: { icon: Info, bgClass: 'bg-muted/50', textClass: 'text-muted-foreground', borderClass: 'border-border' },
};

export function QueryStatusBanner({ status, message, tableName }: QueryStatusBannerProps) {
  if (status === 'success' || status === 'loading') return null;

  const c = config[status] || config.error;
  const Icon = c.icon;
  const isDev = import.meta.env.DEV;

  return (
    <div className={`flex items-start gap-2 rounded-lg border p-3 text-sm ${c.bgClass} ${c.textClass} ${c.borderClass}`}>
      <Icon className="h-4 w-4 shrink-0 mt-0.5" />
      <div className="min-w-0">
        <p>{message || getDefaultMessage(status, tableName)}</p>
        {isDev && tableName && status !== 'empty' && (
          <p className="text-xs mt-1 opacity-70 font-mono">table: {tableName} | status: {status}</p>
        )}
      </div>
    </div>
  );
}

function getDefaultMessage(status: QueryStatus, tableName?: string): string {
  switch (status) {
    case 'empty': return 'No records found';
    case 'rls_denied': return `Access restricted${tableName ? ` for "${tableName}"` : ''}. You may not have the required permissions.`;
    case 'table_unavailable': return `"${tableName || 'Resource'}" is not available in this environment.`;
    case 'error': return 'An error occurred while loading data.';
    default: return '';
  }
}
