import { ReactNode } from 'react';
import { Label } from '@/components/ui/label';

interface Props {
  label: string;
  hint?: string;
  children: ReactNode;
  htmlFor?: string;
}

export function SettingsField({ label, hint, children, htmlFor }: Props) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={htmlFor} className="text-sm font-medium text-foreground">{label}</Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
