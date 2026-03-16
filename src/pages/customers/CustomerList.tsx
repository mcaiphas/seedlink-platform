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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Users, Plus } from 'lucide-react';

const CUSTOMER_CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'commercial_farmer', label: 'Commercial Farmer' },
  { value: 'smallholder_farmer', label: 'Smallholder Farmer' },
  { value: 'distributor', label: 'Distributor' },
  { value: 'retailer', label: 'Retailer' },
  { value: 'corporate_buyer', label: 'Corporate Buyer' },
];

const CUSTOMER_TYPES = [
  { value: 'farmer', label: 'Farmer' },
  { value: 'distributor', label: 'Distributor' },
  { value: 'retailer', label: 'Retailer' },
  { value: 'corporate', label: 'Corporate' },
];

const PAYMENT_TERMS = [
  { value: 'immediate', label: 'Immediate' },
  { value: 'net_7', label: '7 Days' },
  { value: 'net_14', label: '14 Days' },
  { value: 'net_30', label: '30 Days' },
  { value: 'net_60', label: '60 Days' },
];

export default function CustomerList() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    customer_name: '', customer_code: '', customer_type: 'farmer', customer_category: 'commercial_farmer',
    contact_name: '', contact_email: '', contact_phone: '', contact_mobile: '',
    registration_number: '', vat_number: '', country: 'ZA', province: '', city: '',
    physical_address: '', postal_address: '', payment_terms: 'net_30', credit_limit: '',
    currency_code: 'ZAR', notes: '',
  });

  useEffect(() => { load(); }, []);

  async function load() {
    const { data } = await supabase.from('customers').select('*').order('created_at', { ascending: false });
    setCustomers(data || []);
    setLoading(false);
  }

  const filtered = useMemo(() =>
    customers.filter(c => {
      if (search && !(c.customer_name || '').toLowerCase().includes(search.toLowerCase()) && !(c.customer_code || '').toLowerCase().includes(search.toLowerCase())) return false;
      if (categoryFilter !== 'all' && c.customer_category !== categoryFilter) return false;
      return true;
    }), [customers, search, categoryFilter]);

  async function createCustomer() {
    if (!form.customer_name) { toast.error('Customer name is required'); return; }
    const { error } = await supabase.from('customers').insert({
      ...form,
      credit_limit: form.credit_limit ? parseFloat(form.credit_limit) : 0,
    });
    if (error) { toast.error(error.message); return; }
    toast.success('Customer created');
    setShowCreate(false);
    load();
  }

  const fmt = (t: string) => t?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || '—';

  return (
    <PageShell title="Customers" subtitle="Manage customer directory" loading={loading} search={search} onSearchChange={setSearch} searchPlaceholder="Search customers..."
      actions={<Button size="sm" onClick={() => setShowCreate(true)}><Plus className="h-4 w-4 mr-1" /> Add Customer</Button>}
      filters={
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[170px] bg-card"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>{CUSTOMER_CATEGORIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent>
        </Select>
      }
    >
      {filtered.length === 0 ? (
        <EmptyState icon={Users} title="No customers" description="Add your first customer to start managing accounts." action={<Button size="sm" onClick={() => setShowCreate(true)}>Add Customer</Button>} />
      ) : (
        <Card className="shadow-sm"><CardContent className="p-0">
          <Table>
            <TableHeader><TableRow className="hover:bg-transparent">
              <TableHead className="pl-6">Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Terms</TableHead>
              <TableHead className="text-right">Credit Limit</TableHead>
              <TableHead className="pr-6">Status</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map(c => (
                <TableRow key={c.id} className="cursor-pointer hover:bg-muted/50" onClick={() => navigate(`/customers/${c.id}`)}>
                  <TableCell className="pl-6 font-mono text-xs">{c.customer_code || '—'}</TableCell>
                  <TableCell className="font-medium">{c.customer_name}</TableCell>
                  <TableCell className="text-sm">{fmt(c.customer_type)}</TableCell>
                  <TableCell className="text-sm">{fmt(c.customer_category)}</TableCell>
                  <TableCell className="text-sm">{c.contact_name || '—'}</TableCell>
                  <TableCell className="text-sm">{c.payment_terms || '—'}</TableCell>
                  <TableCell className="text-right text-sm tabular-nums">{c.currency_code} {(c.credit_limit || 0).toLocaleString()}</TableCell>
                  <TableCell className="pr-6">
                    <Badge variant={c.is_active ? 'default' : 'secondary'} className={`text-xs ${c.is_active ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : ''}`}>
                      {c.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent></Card>
      )}

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>New Customer</DialogTitle></DialogHeader>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Name *</Label><Input value={form.customer_name} onChange={e => setForm({ ...form, customer_name: e.target.value })} /></div>
              <div><Label>Code</Label><Input value={form.customer_code} onChange={e => setForm({ ...form, customer_code: e.target.value })} placeholder="AUTO or manual" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Type</Label>
                <Select value={form.customer_type} onValueChange={v => setForm({ ...form, customer_type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{CUSTOMER_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Category</Label>
                <Select value={form.customer_category} onValueChange={v => setForm({ ...form, customer_category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{CUSTOMER_CATEGORIES.filter(c => c.value !== 'all').map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Registration #</Label><Input value={form.registration_number} onChange={e => setForm({ ...form, registration_number: e.target.value })} /></div>
              <div><Label>VAT #</Label><Input value={form.vat_number} onChange={e => setForm({ ...form, vat_number: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Contact Name</Label><Input value={form.contact_name} onChange={e => setForm({ ...form, contact_name: e.target.value })} /></div>
              <div><Label>Contact Email</Label><Input value={form.contact_email} onChange={e => setForm({ ...form, contact_email: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Contact Phone</Label><Input value={form.contact_phone} onChange={e => setForm({ ...form, contact_phone: e.target.value })} /></div>
              <div><Label>Mobile</Label><Input value={form.contact_mobile} onChange={e => setForm({ ...form, contact_mobile: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div><Label>Country</Label><Input value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} /></div>
              <div><Label>Province</Label><Input value={form.province} onChange={e => setForm({ ...form, province: e.target.value })} /></div>
              <div><Label>City</Label><Input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div><Label>Payment Terms</Label>
                <Select value={form.payment_terms} onValueChange={v => setForm({ ...form, payment_terms: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{PAYMENT_TERMS.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Credit Limit</Label><Input type="number" value={form.credit_limit} onChange={e => setForm({ ...form, credit_limit: e.target.value })} /></div>
              <div><Label>Currency</Label><Input value={form.currency_code} onChange={e => setForm({ ...form, currency_code: e.target.value })} /></div>
            </div>
            <div><Label>Notes</Label><Textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button onClick={createCustomer} disabled={!form.customer_name}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
