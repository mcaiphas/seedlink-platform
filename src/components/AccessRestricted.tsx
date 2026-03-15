import { Lock, ShieldAlert } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface AccessRestrictedProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  variant?: 'locked' | 'admin';
}

export function AccessRestricted({
  title = 'Access Restricted',
  message = 'You do not have permission to view this content.',
  actionLabel,
  onAction,
  variant = 'locked',
}: AccessRestrictedProps) {
  const Icon = variant === 'admin' ? ShieldAlert : Lock;

  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center mb-4">
          <Icon className="h-7 w-7 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground max-w-md mb-4">{message}</p>
        {actionLabel && onAction && (
          <Button onClick={onAction}>{actionLabel}</Button>
        )}
      </CardContent>
    </Card>
  );
}
