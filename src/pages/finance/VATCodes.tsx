import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { logAudit } from '@/lib/audit';

interface VATCode {
  id: string;
  code_name: string;
  rate_percent: number;
  vat_direction: string;
  gl_account_id: string | null;
  is_active: boolean;
  description: string | null;
}

const emptyForm = { code_name: '', rate_percent: 15, vat_direction: 'both', gl_account_id: '', is_active: true, description: '' };

export default function VATCodes() {
  const [codes, setCodes] = useState<VATCode[]>([]);
  const [glAccounts, setGlAccounts] = useState<{ id: string; account_code: string; account_name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  async function load() {
    setLoading(true);
    const [{ data: c }, { data: gl }] = await Promise.all([
      supabase.from('vat_codes').select('*').order('code_name'),
      supabase.from('gl_accounts').select('id,account_code,account_name').eq('is_active', true).order('account_code'),
    ]);
    setCodes((c as any) || []);
    setGlAccounts(gl || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openCreate() { setEditId(null); setForm(emptyForm); setOpen(true); }
  function openEdit(c: VATCode) {
    setEditId(c.id);
    setForm({ code_name: c.code_name, rate_percent: c.rate_percent, vat_direction: c.vat_direction, gl_account_id: c.gl_account_id || '', is_active: c.is_active, description: c.description || '' });
    setOpen(true);
  }

  async function save() {
    const payload: any = { code_name: form.code_name, rate_percent: form.rate_percent, vat_direction: form.vat_direction, is_active: form.is_active, description: form.description || null, gl_account_id: form.gl_account_id || null };
    if (editId) {
      const { error } = await supabase.from('vat_codes').update(payload).eq('id', editId);
      if (error) { toast.error(error.message); return; }
      logAudit({ action: 'update', entity_type: 'vat_code', entity_id: editId, new_values: payload });
      toast.success('VAT code updated');
    } else {
      const { error } = await supabase.from('vat_codes').insert(payload);
      if (error) { toast.error(error.message); return; }
      logAudit({ action: 'create', entity_type: 'vat_code', new_values: payload });
      toast.success('VAT code created');
    }
    setOpen(false);
    load();
  }

  if (loading) return <div className="space-y-6"><Skeleton className="h-8 w-48" /><Skeleton className="h-64 w-full rounded-xl" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">VAT Codes</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage VAT rates and GL account mappings</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button size="sm" onClick={openCreate}><Plus className="h-4 w-4 mr-1" />Add VAT Code</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editId ? 'Edit' : 'New'} VAT Code</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Code Name</Label><Input value={form.code_name} onChange={e => setForm({ ...form, code_name: e.target.value })} /></div>
              <div><Label>Rate %</Label><Input type="number" step="0.01" value={form.rate_percent} onChange={e => setForm({ ...form, rate_percent: parseFloat(e.target.value) || 0 })} /></div>
              <div><Label>Direction</Label>
                <Select value={form.vat_direction} onValueChange={v => setForm({ ...form, vat_direction: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="input">Input</SelectItem>
                    <SelectItem value="output">Output</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>GL Account</Label>
                <Select value={form.gl_account_id} onValueChange={v => setForm({ ...form, gl_account_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Select account" /></SelectTrigger>
                  <SelectContent>{glAccounts.map(a => <SelectItem key={a.id} value={a.id}>{a.account_code} — {a.account_name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Description</Label><Input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
              <div className="flex items-center gap-2"><Switch checked={form.is_active} onCheckedChange={v => setForm({ ...form, is_active: v })} /><Label>Active</Label></div>
              <Button onClick={save} className="w-full">Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-sm"><CardContent className="p-0">
        <Table>
          <TableHeader><TableRow>
            <TableHead className="pl-6">Code Name</TableHead>
            <TableHead>Rate %</TableHead>
            <TableHead>Direction</TableHead>
            <TableHead>GL Account</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="pr-6"></TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {codes.map(c => (
              <TableRow key={c.id}>
                <TableCell className="pl-6 font-medium">{c.code_name}</TableCell>
                <TableCell>{c.rate_percent}%</TableCell>
                <TableCell><Badge variant="outline" className="capitalize">{c.vat_direction}</Badge></TableCell>
                <TableCell className="text-sm text-muted-foreground">{glAccounts.find(a => a.id === c.gl_account_id)?.account_code || '—'}</TableCell>
                <TableCell><Badge variant={c.is_active ? 'default' : 'secondary'}>{c.is_active ? 'Active' : 'Inactive'}</Badge></TableCell>
                <TableCell className="pr-6 text-right"><Button variant="ghost" size="icon" onClick={() => openEdit(c)}><Pencil className="h-4 w-4" /></Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent></Card>
    </div>
  );
}
