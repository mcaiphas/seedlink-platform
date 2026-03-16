import { Button } from '@/components/ui/button';
import { Save, RotateCcw, Loader2 } from 'lucide-react';

interface Props {
  dirty: boolean;
  saving: boolean;
  onSave: () => void;
  onDiscard: () => void;
}

export function SettingsToolbar({ dirty, saving, onSave, onDiscard }: Props) {
  if (!dirty) return null;
  return (
    <div className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b border-border px-4 py-3 -mx-4 -mt-4 mb-4 flex items-center justify-between rounded-t-lg">
      <p className="text-sm text-muted-foreground font-medium">You have unsaved changes</p>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onDiscard} disabled={saving}>
          <RotateCcw className="h-3.5 w-3.5 mr-1" /> Discard
        </Button>
        <Button size="sm" onClick={onSave} disabled={saving}>
          {saving ? <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" /> : <Save className="h-3.5 w-3.5 mr-1" />}
          Save changes
        </Button>
      </div>
    </div>
  );
}
