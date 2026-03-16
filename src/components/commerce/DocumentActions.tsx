import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { logAudit } from '@/lib/audit';
import { Save, Printer, Mail, Eye, Send, FileDown, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DocumentActionsProps {
  documentType: string;
  documentId: string;
  documentNumber: string;
  recipientEmail?: string;
  recipientName?: string;
  recipientPhone?: string;
  onSave?: () => void | Promise<void>;
  onPrint?: () => void;
  onPreview?: () => void;
  saving?: boolean;
  children?: React.ReactNode;
}

export function DocumentActions({
  documentType, documentId, documentNumber,
  recipientEmail, recipientName, recipientPhone,
  onSave, onPrint, onPreview, saving, children,
}: DocumentActionsProps) {
  const [showEmail, setShowEmail] = useState(false);
  const [emailForm, setEmailForm] = useState({ to: '', subject: '', template: 'default' });
  const [sending, setSending] = useState(false);

  function openEmailDialog() {
    setEmailForm({
      to: recipientEmail || '',
      subject: `${documentType} ${documentNumber}`,
      template: 'default',
    });
    setShowEmail(true);
  }

  async function sendEmail() {
    if (!emailForm.to) { toast.error('Recipient email is required'); return; }
    setSending(true);
    try {
      // Log the dispatch
      const { error } = await supabase.from('document_delivery_logs').insert({
        document_type: documentType.toLowerCase().replace(/\s+/g, '_'),
        document_id: documentId,
        recipient_email: emailForm.to,
        recipient_phone: recipientPhone || null,
        delivery_channel: 'email',
        delivery_status: 'pending',
        subject: emailForm.subject,
        created_by: (await supabase.auth.getUser()).data.user?.id,
      });
      if (error) throw error;

      // Log communication for customers
      await logAudit('document_dispatch', documentType.toLowerCase(), documentId, null, {
        channel: 'email', recipient: emailForm.to, subject: emailForm.subject, document_number: documentNumber,
      });

      toast.success(`${documentType} queued for email delivery`);
      setShowEmail(false);
    } catch (e: any) {
      toast.error(e.message || 'Failed to send');
    } finally {
      setSending(false);
    }
  }

  function handlePrint() {
    if (onPrint) { onPrint(); return; }
    window.print();
  }

  return (
    <>
      <div className="flex items-center gap-2 flex-wrap">
        {children}
        {onSave && (
          <Button onClick={onSave} disabled={saving} size="sm">
            <Save className="h-4 w-4 mr-1" />{saving ? 'Saving...' : 'Save'}
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <MoreHorizontal className="h-4 w-4 mr-1" />Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onPreview && (
              <DropdownMenuItem onClick={onPreview}>
                <Eye className="h-4 w-4 mr-2" />Preview Document
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />Print
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={openEmailDialog}>
              <Mail className="h-4 w-4 mr-2" />Email to {recipientName ? recipientName : 'Recipient'}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={openEmailDialog}>
              <Send className="h-4 w-4 mr-2" />Save &amp; Email
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Email Dialog */}
      <Dialog open={showEmail} onOpenChange={setShowEmail}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Email {documentType}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground">Document</p>
              <p className="text-sm font-semibold">{documentType} {documentNumber}</p>
            </div>
            <div>
              <Label>Recipient Email *</Label>
              <Input value={emailForm.to} onChange={e => setEmailForm(f => ({ ...f, to: e.target.value }))} placeholder="customer@example.com" />
            </div>
            <div>
              <Label>Subject</Label>
              <Input value={emailForm.subject} onChange={e => setEmailForm(f => ({ ...f, subject: e.target.value }))} />
            </div>
            <div>
              <Label>Template</Label>
              <Select value={emailForm.template} onValueChange={v => setEmailForm(f => ({ ...f, template: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default Template</SelectItem>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-xs text-muted-foreground">
              The document PDF will be generated and attached automatically. Delivery status will be tracked in Dispatch History.
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEmail(false)}>Cancel</Button>
            <Button onClick={sendEmail} disabled={sending}>
              <Mail className="h-4 w-4 mr-1" />{sending ? 'Sending...' : 'Send Email'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Dispatch History component for embedding in document detail views
export function DispatchHistory({ documentType, documentId }: { documentType: string; documentId: string }) {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useState(() => {
    supabase.from('document_delivery_logs')
      .select('*')
      .eq('document_type', documentType)
      .eq('document_id', documentId)
      .order('created_at', { ascending: false })
      .then(({ data }) => { setLogs(data || []); setLoading(false); });
  });

  if (loading) return <div className="text-xs text-muted-foreground py-4">Loading dispatch history...</div>;
  if (logs.length === 0) return <div className="text-xs text-muted-foreground py-4">No dispatch history for this document.</div>;

  const statusColor: Record<string, string> = {
    pending: 'bg-amber-500/10 text-amber-700 border-amber-200',
    sent: 'bg-green-500/10 text-green-700 border-green-200',
    delivered: 'bg-blue-500/10 text-blue-700 border-blue-200',
    failed: 'bg-red-500/10 text-red-700 border-red-200',
  };

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Dispatch History</p>
      {logs.map(l => (
        <div key={l.id} className="flex items-center justify-between rounded-lg border border-border/50 p-3 text-sm">
          <div>
            <p className="font-medium">{l.subject || 'Document sent'}</p>
            <p className="text-xs text-muted-foreground">{l.recipient_email} · {l.delivery_channel} · {new Date(l.created_at).toLocaleString()}</p>
          </div>
          <Badge variant="outline" className={`text-[10px] ${statusColor[l.delivery_status] || ''}`}>
            {l.delivery_status}
          </Badge>
        </div>
      ))}
    </div>
  );
}
