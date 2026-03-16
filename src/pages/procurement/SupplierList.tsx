import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { PageShell, EmptyState } from '@/components/commerce/PageShell';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Building2, Plus, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const SUPPLIER_CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'seed_producer', label: 'Seed Producer' },
  { value: 'fertilizer_manufacturer', label: 'Fertilizer Manufacturer' },
  { value: 'crop_protection', label: 'Crop Protection' },
  { value: 'packaging_supplier', label: 'Packaging' },
  { value: 'equipment_supplier', label: 'Equipment' },
  { value: 'service_provider', label: 'Service Provider' },
  { value: 'logistics_supplier', label: 'Logistics' },
  { value: 'general', label: 'General' },
];

export default function SupplierList() {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ supplier_name: '', supplier_code: '', contact_name: '', email: '', phone: '', tax_number: '', payment_terms: 'net_30', currency_code: 'ZAR', supplier_category: 'general' });

  useEffect(() => { load(); }, []);

  async function load() {
    const { data } = await supabase.from('suppliers').select('*').order('created_at', { ascending: false });
    setSuppliers(data || []);
    setLoading(false);
  }

  const filtered = useMemo(() =>
    suppliers.filter(s => {
      if (search && !(s.supplier_name || '').toLowerCase().includes(search.toLowerCase()) && !(s.supplier_code || '').toLowerCase().includes(search.toLowerCase())) return false;
      if (categoryFilter !== 'all' && s.supplier_category !== categoryFilter) return false;
      return true;
    }), [suppliers, search, categoryFilter]);

  async function createSupplier() {
    const { error } = await supabase.from('suppliers').insert(form);
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return; }
    toast({ title: 'Supplier created' });
    setShowCreate(false);
    setForm({ supplier_name: '', supplier_code: '', contact_name: '', email: '', phone: '', tax_number: '', payment_terms: 'net_30', currency_code: 'ZAR', supplier_category: 'general' });
    load();
  }

  const fmt = (t: string) => t?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || '—';

  return (
    <PageShell title="Suppliers" subtitle="Manage supplier directory" loading={loading} search={search} onSearchChange={setSearch} searchPlaceholder="Search suppliers..."
      actions={<Button size="sm" onClick={() => setShowCreate(true)}><Plus className="h-4 w-4 mr-1" /> Add Supplier</Button>}
      filters={
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[160px] bg-card"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>{SUPPLIER_CATEGORIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent>
        </Select>
      }
    >
      {filtered.length === 0 ? (
        <EmptyState icon={Building2} title="No suppliers" description="Add your first supplier to start procurement." action={<Button size="sm" onClick={() => setShowCreate(true)}>Add Supplier</Button>} />
      ) : (
        <Card className="shadow-sm"><CardContent className="p-0">
          <Table>
            <TableHeader><TableRow className="hover:bg-transparent">
              <TableHead className="pl-6">Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Terms</TableHead>
              <TableHead>Currency</TableHead>
              <TableHead className="pr-6">Status</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map(s => (
                <TableRow key={s.id} className="cursor-pointer hover:bg-muted/50" onClick={() => navigate(`/suppliers/${s.id}`)}>
                  <TableCell className="pl-6 font-mono text-xs">{s.supplier_code || '—'}</TableCell>
                  <TableCell className="font-medium">
                    <span className="flex items-center gap-1.5">
                      {s.supplier_name}
                      {s.is_preferred && <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm">{fmt(s.supplier_category)}</TableCell>
                  <TableCell className="text-sm">{s.contact_name || '—'}</TableCell>
                  <TableCell className="text-sm">{s.payment_terms || '—'}</TableCell>
                  <TableCell className="text-sm">{s.currency_code}</TableCell>
                  <TableCell className="pr-6">
                    <Badge variant={s.is_active !== false ? 'default' : 'secondary'} className={`text-xs ${s.is_active !== false ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : ''}`}>
                      {s.is_active !== false ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent></Card>
      )}

      {/* Create Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>New Supplier</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Name *</Label><Input value={form.supplier_name} onChange={e => setForm({ ...form, supplier_name: e.target.value })} /></div>
            <div><Label>Code</Label><Input value={form.supplier_code} onChange={e => setForm({ ...form, supplier_code: e.target.value })} /></div>
            <div><Label>Category</Label>
              <Select value={form.supplier_category} onValueChange={v => setForm({ ...form, supplier_category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{SUPPLIER_CATEGORIES.filter(c => c.value !== 'all').map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Contact</Label><Input value={form.contact_name} onChange={e => setForm({ ...form, contact_name: e.target.value })} /></div>
              <div><Label>Email</Label><Input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Phone</Label><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
              <div><Label>Tax #</Label><Input value={form.tax_number} onChange={e => setForm({ ...form, tax_number: e.target.value })} /></div>
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
              <Button onClick={createSupplier} disabled={!form.supplier_name}>Create</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
