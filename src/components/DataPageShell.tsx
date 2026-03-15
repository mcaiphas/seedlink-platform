import { ReactNode } from 'react';
import { PageHeader } from './PageHeader';
import { Input } from '@/components/ui/input';
import { Search, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface DataPageShellProps {
  title: string;
  description?: string;
  action?: ReactNode;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  loading?: boolean;
  error?: string | null;
  children: ReactNode;
}

export function DataPageShell({
  title,
  description,
  action,
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  loading,
  error,
  children,
}: DataPageShellProps) {
  return (
    <div className="space-y-4">
      <PageHeader title={title} description={description} action={action} />

      {onSearchChange && (
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-3/4 rounded-lg" />
        </div>
      ) : (
        children
      )}
    </div>
  );
}

export function EmptyState({ message = 'No data found', colSpan = 1 }: { message?: string; colSpan?: number }) {
  return (
    <tr>
      <td colSpan={colSpan} className="text-center text-muted-foreground py-12">
        <div className="flex flex-col items-center gap-2">
          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
            <Search className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-sm">{message}</p>
        </div>
      </td>
    </tr>
  );
}
