import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { AdminPage } from '@/components/AdminPage';
import { StatusBadge, CurrencyDisplay, DateDisplay } from '@/components/commerce/StatusBadge';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import {
  ArrowLeft, Building2, Phone, Mail, Globe, Star, Plus, Edit2,
  Package, FileSpreadsheet, TrendingUp, Clock, DollarSign, CalendarDays,
  FileText, Trash2, Landmark,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

const SUPPLIER_CATEGORIES = [
  'seed_producer', 'fertilizer_manufacturer', 'crop_protection',
  'packaging_supplier', 'equipment_supplier', 'service_provider', 'logistics_supplier', 'general',
];

const DOC_TYPES = ['contract', 'agreement', 'compliance_certificate', 'tax_certificate', 'bank_confirmation', 'general'];

export default function SupplierDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [supplier, setSupplier] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState<any[]>([]);
  const [supplierProducts, setSupplierProducts] = useState<any[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<any[]>([]);
  const [receipts, setReceipts] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);

  // Edit dialog
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState<any>({});

  // Contact dialog
  const [contactOpen, setContactOpen] = useState(false);
  const [contactForm, setContactForm] = useState({ contact_name: '', role_title: '', email: '', phone: '', mobile: '', is_primary: false, notes: '' });

  // Product link dialog
  const [productLinkOpen, setProductLinkOpen] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [productLinkForm, setProductLinkForm] = useState({ product_id: '', supplier_product_code: '', standard_cost: '', minimum_order_qty: '', lead_time_days: '', is_preferred: false });

  // Document dialog
  const [docOpen, setDocOpen] = useState(false);
  const [docForm, setDocForm] = useState({ document_name: '', document_type: 'general', file_url: '', notes: '' });

  // Banking edit dialog
  const [bankOpen, setBankOpen] = useState(false);
  const [bankForm, setBankForm] = useState({ bank_name: '', bank_account_name: '', bank_account_number: '', bank_branch_code: '', bank_swift_code: '', bank_country: '' });
  const fetchAll = async () => {
    if (!id) return;
    setLoading(true);
    const [supRes, conRes, spRes, poRes, grRes, docRes] = await Promise.all([
      supabase.from('suppliers').select('*').eq('id', id).single(),
      supabase.from('supplier_contacts').select('*').eq('supplier_id', id).order('is_primary', { ascending: false }),
      supabase.from('supplier_products').select('*, products(name, sku)').eq('supplier_id', id).order('created_at', { ascending: false }),
      supabase.from('purchase_orders').select('*').eq('supplier_id', id).order('created_at', { ascending: false }).limit(50),
      supabase.from('goods_receipts').select('*, depots(name)').eq('supplier_id', id).order('created_at', { ascending: false }).limit(50),
      supabase.from('supplier_documents').select('*').eq('supplier_id', id).order('created_at', { ascending: false }),
    ]);
    setSupplier(supRes.data);
    setContacts(conRes.data || []);
    setSupplierProducts(spRes.data || []);
    setPurchaseOrders(poRes.data || []);
    setReceipts(grRes.data || []);
    setDocuments(docRes.data || []);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, [id]);

  // Performance metrics
  const metrics = useMemo(() => {
    const totalSpend = purchaseOrders.filter(p => p.status !== 'cancelled').reduce((s, p) => s + (p.total_amount || 0), 0);
    const poCount = purchaseOrders.length;
    const lastOrder = purchaseOrders[0]?.order_date || null;
    return { totalSpend, poCount, lastOrder };
  }, [purchaseOrders]);

  const openEdit = () => {
    setEditForm({ ...supplier });
    setEditOpen(true);
  };

  const saveEdit = async () => {
    const { error } = await supabase.from('suppliers').update({
      supplier_name: editForm.supplier_name,
      supplier_code: editForm.supplier_code,
      supplier_type: editForm.supplier_type,
      supplier_category: editForm.supplier_category,
      contact_name: editForm.contact_name,
      email: editForm.email,
      phone: editForm.phone,
      tax_number: editForm.tax_number,
      company_registration: editForm.company_registration,
      payment_terms: editForm.payment_terms,
      currency_code: editForm.currency_code,
      country: editForm.country,
      province: editForm.province,
      city: editForm.city,
      physical_address: editForm.physical_address,
      postal_address: editForm.postal_address,
      website: editForm.website,
      lead_time_days: editForm.lead_time_days ? parseInt(editForm.lead_time_days) : null,
      contract_status: editForm.contract_status,
      is_preferred: editForm.is_preferred,
      is_active: editForm.is_active,
      notes: editForm.notes,
    }).eq('id', id);
    if (error) { toast.error(error.message); return; }
    toast.success('Supplier updated');
    setEditOpen(false);
    fetchAll();
  };

  const saveContact = async () => {
    if (!contactForm.contact_name) { toast.error('Name required'); return; }
    const { error } = await supabase.from('supplier_contacts').insert({ ...contactForm, supplier_id: id });
    if (error) { toast.error(error.message); return; }
    toast.success('Contact added');
    setContactOpen(false);
    setContactForm({ contact_name: '', role_title: '', email: '', phone: '', mobile: '', is_primary: false, notes: '' });
    fetchAll();
  };

  const linkProduct = async () => {
    if (!productLinkForm.product_id) { toast.error('Select a product'); return; }
    const { error } = await supabase.from('supplier_products').insert({
      supplier_id: id,
      product_id: productLinkForm.product_id,
      supplier_product_code: productLinkForm.supplier_product_code || null,
      standard_cost: productLinkForm.standard_cost ? parseFloat(productLinkForm.standard_cost) : null,
      minimum_order_qty: productLinkForm.minimum_order_qty ? parseFloat(productLinkForm.minimum_order_qty) : null,
      lead_time_days: productLinkForm.lead_time_days ? parseInt(productLinkForm.lead_time_days) : null,
      is_preferred: productLinkForm.is_preferred,
    });
    if (error) { toast.error(error.message); return; }
    toast.success('Product linked');
    setProductLinkOpen(false);
    setProductLinkForm({ product_id: '', supplier_product_code: '', standard_cost: '', minimum_order_qty: '', lead_time_days: '', is_preferred: false });
    fetchAll();
  };

  const openProductLink = async () => {
    if (products.length === 0) {
      const { data } = await supabase.from('products').select('id, name, sku').eq('is_active', true).order('name').limit(500);
      setProducts(data || []);
    }
    setProductLinkOpen(true);
  };

  const saveDoc = async () => {
    if (!docForm.document_name) { toast.error('Document name required'); return; }
    const { error } = await supabase.from('supplier_documents').insert({ ...docForm, supplier_id: id, uploaded_by: user?.id });
    if (error) { toast.error(error.message); return; }
    toast.success('Document added');
    setDocOpen(false);
    setDocForm({ document_name: '', document_type: 'general', file_url: '', notes: '' });
    fetchAll();
  };

  const deleteDoc = async (docId: string) => {
    const { error } = await supabase.from('supplier_documents').delete().eq('id', docId);
    if (error) { toast.error(error.message); return; }
    toast.success('Document removed');
    fetchAll();
  };

  const openBankEdit = () => {
    setBankForm({
      bank_name: supplier?.bank_name || '',
      bank_account_name: supplier?.bank_account_name || '',
      bank_account_number: supplier?.bank_account_number || '',
      bank_branch_code: supplier?.bank_branch_code || '',
      bank_swift_code: supplier?.bank_swift_code || '',
      bank_country: supplier?.bank_country || '',
    });
    setBankOpen(true);
  };

  const saveBanking = async () => {
    const { error } = await supabase.from('suppliers').update(bankForm).eq('id', id);
    if (error) { toast.error(error.message); return; }
    toast.success('Banking details updated');
    setBankOpen(false);
    fetchAll();
  };

  if (!supplier) return <AdminPage><div className="text-center py-12"><p className="text-muted-foreground">Supplier not found</p><Button variant="outline" className="mt-4" onClick={() => navigate('/suppliers')}>Back</Button></div></AdminPage>;

  const fmt = (t: string) => t?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || '—';

  return (
    <AdminPage>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/suppliers')}><ArrowLeft className="h-4 w-4" /></Button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">{supplier.supplier_name}</h1>
              {supplier.is_preferred && <Star className="h-4 w-4 text-amber-500 fill-amber-500" />}
              <Badge variant={supplier.is_active ? 'default' : 'secondary'}>{supplier.is_active ? 'Active' : 'Inactive'}</Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5 font-mono">{supplier.supplier_code} · {fmt(supplier.supplier_category)}</p>
          </div>
          <Button variant="outline" size="sm" onClick={openEdit}><Edit2 className="h-4 w-4 mr-1" />Edit</Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card><CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1"><DollarSign className="h-3.5 w-3.5" />Total Spend</div>
            <p className="text-lg font-semibold"><CurrencyDisplay amount={metrics.totalSpend} currency={supplier.currency_code} /></p>
          </CardContent></Card>
          <Card><CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1"><FileSpreadsheet className="h-3.5 w-3.5" />Purchase Orders</div>
            <p className="text-lg font-semibold">{metrics.poCount}</p>
          </CardContent></Card>
          <Card><CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1"><Package className="h-3.5 w-3.5" />Products</div>
            <p className="text-lg font-semibold">{supplierProducts.length}</p>
          </CardContent></Card>
          <Card><CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1"><Clock className="h-3.5 w-3.5" />Lead Time</div>
            <p className="text-lg font-semibold">{supplier.lead_time_days ? `${supplier.lead_time_days}d` : '—'}</p>
          </CardContent></Card>
          <Card><CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1"><CalendarDays className="h-3.5 w-3.5" />Last Order</div>
            <p className="text-sm font-medium"><DateDisplay date={metrics.lastOrder} /></p>
          </CardContent></Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="contacts">Contacts ({contacts.length})</TabsTrigger>
            <TabsTrigger value="products">Products ({supplierProducts.length})</TabsTrigger>
            <TabsTrigger value="orders">Purchase Orders</TabsTrigger>
            <TabsTrigger value="receipts">Receipts</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader><CardTitle className="text-sm">Company Details</CardTitle></CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Type</span><span>{fmt(supplier.supplier_type)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Category</span><span>{fmt(supplier.supplier_category)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Registration #</span><span>{supplier.company_registration || '—'}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">VAT / Tax #</span><span>{supplier.tax_number || '—'}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Currency</span><span>{supplier.currency_code}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Payment Terms</span><span>{supplier.payment_terms || '—'}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Contract Status</span><span>{fmt(supplier.contract_status)}</span></div>
                  {supplier.website && (
                    <div className="flex justify-between"><span className="text-muted-foreground">Website</span><a href={supplier.website} target="_blank" rel="noreferrer" className="text-primary hover:underline">{supplier.website}</a></div>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-sm">Location & Contact</CardTitle></CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Country</span><span>{supplier.country || '—'}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Province</span><span>{supplier.province || '—'}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">City</span><span>{supplier.city || '—'}</span></div>
                  {supplier.physical_address && <div><span className="text-muted-foreground block mb-1">Physical Address</span><span>{supplier.physical_address}</span></div>}
                  {supplier.postal_address && <div><span className="text-muted-foreground block mb-1">Postal Address</span><span>{supplier.postal_address}</span></div>}
                  <Separator />
                  <div className="flex justify-between"><span className="text-muted-foreground">Primary Contact</span><span>{supplier.contact_name || '—'}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span>{supplier.email || '—'}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Phone</span><span>{supplier.phone || '—'}</span></div>
                </CardContent>
              </Card>
            </div>
            {supplier.notes && <Card><CardHeader><CardTitle className="text-sm">Notes</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground whitespace-pre-wrap">{supplier.notes}</p></CardContent></Card>}
          </TabsContent>

          {/* Contacts */}
          <TabsContent value="contacts" className="mt-4 space-y-4">
            <div className="flex justify-end">
              <Button size="sm" onClick={() => setContactOpen(true)}><Plus className="h-4 w-4 mr-1" />Add Contact</Button>
            </div>
            {contacts.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">No contacts yet</div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {contacts.map(c => (
                  <Card key={c.id}>
                    <CardContent className="p-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{c.contact_name}</span>
                        {c.is_primary && <Badge variant="outline" className="text-xs">Primary</Badge>}
                      </div>
                      {c.role_title && <p className="text-xs text-muted-foreground">{c.role_title}</p>}
                      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                        {c.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{c.email}</span>}
                        {c.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{c.phone}</span>}
                        {c.mobile && <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{c.mobile}</span>}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Products */}
          <TabsContent value="products" className="mt-4 space-y-4">
            <div className="flex justify-end">
              <Button size="sm" onClick={openProductLink}><Plus className="h-4 w-4 mr-1" />Link Product</Button>
            </div>
            <div className="rounded-lg border bg-card overflow-x-auto">
              <Table>
                <TableHeader><TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Supplier Code</TableHead>
                  <TableHead className="text-right">Standard Cost</TableHead>
                  <TableHead className="text-right">Min Order</TableHead>
                  <TableHead className="text-right">Lead Time</TableHead>
                  <TableHead>Preferred</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {supplierProducts.map(sp => (
                    <TableRow key={sp.id}>
                      <TableCell className="font-medium">{(sp as any).products?.name || '—'}</TableCell>
                      <TableCell className="font-mono text-xs">{sp.supplier_product_code || '—'}</TableCell>
                      <TableCell className="text-right"><CurrencyDisplay amount={sp.standard_cost} /></TableCell>
                      <TableCell className="text-right tabular-nums">{sp.minimum_order_qty || '—'}</TableCell>
                      <TableCell className="text-right tabular-nums">{sp.lead_time_days ? `${sp.lead_time_days}d` : '—'}</TableCell>
                      <TableCell>{sp.is_preferred ? <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" /> : '—'}</TableCell>
                    </TableRow>
                  ))}
                  {supplierProducts.length === 0 && <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No products linked</TableCell></TableRow>}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Purchase Orders */}
          <TabsContent value="orders" className="mt-4">
            <div className="rounded-lg border bg-card overflow-x-auto">
              <Table>
                <TableHeader><TableRow>
                  <TableHead>PO #</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Order Date</TableHead>
                  <TableHead>Expected</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {purchaseOrders.map(po => (
                    <TableRow key={po.id} className="cursor-pointer hover:bg-muted/50" onClick={() => navigate(`/purchase-orders/${po.id}/edit`)}>
                      <TableCell className="font-medium">{po.po_number}</TableCell>
                      <TableCell><StatusBadge type="document" value={po.status} /></TableCell>
                      <TableCell><DateDisplay date={po.order_date} /></TableCell>
                      <TableCell><DateDisplay date={po.expected_date} /></TableCell>
                      <TableCell className="text-right"><CurrencyDisplay amount={po.total_amount} currency={po.currency_code} /></TableCell>
                    </TableRow>
                  ))}
                  {purchaseOrders.length === 0 && <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No purchase orders</TableCell></TableRow>}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Receipts */}
          <TabsContent value="receipts" className="mt-4">
            <div className="rounded-lg border bg-card overflow-x-auto">
              <Table>
                <TableHeader><TableRow>
                  <TableHead>Receipt #</TableHead>
                  <TableHead>Depot</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {receipts.map(gr => (
                    <TableRow key={gr.id}>
                      <TableCell className="font-medium font-mono">{gr.receipt_number}</TableCell>
                      <TableCell>{(gr as any).depots?.name || '—'}</TableCell>
                      <TableCell><StatusBadge type="document" value={gr.status} /></TableCell>
                      <TableCell><DateDisplay date={gr.receipt_date} /></TableCell>
                    </TableRow>
                  ))}
                  {receipts.length === 0 && <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No receipts</TableCell></TableRow>}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Performance */}
          <TabsContent value="performance" className="mt-4">
            <div className="grid md:grid-cols-3 gap-6">
              <Card><CardContent className="p-6 text-center">
                <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold"><CurrencyDisplay amount={metrics.totalSpend} currency={supplier.currency_code} /></p>
                <p className="text-sm text-muted-foreground mt-1">Total Spend</p>
              </CardContent></Card>
              <Card><CardContent className="p-6 text-center">
                <FileSpreadsheet className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold">{metrics.poCount}</p>
                <p className="text-sm text-muted-foreground mt-1">Purchase Orders</p>
              </CardContent></Card>
              <Card><CardContent className="p-6 text-center">
                <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold">{supplier.lead_time_days ? `${supplier.lead_time_days} days` : '—'}</p>
                <p className="text-sm text-muted-foreground mt-1">Avg Lead Time</p>
              </CardContent></Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Supplier Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Edit Supplier</DialogTitle></DialogHeader>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label>Name *</Label><Input value={editForm.supplier_name || ''} onChange={e => setEditForm({ ...editForm, supplier_name: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Code</Label><Input value={editForm.supplier_code || ''} onChange={e => setEditForm({ ...editForm, supplier_code: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label>Type</Label>
                <Select value={editForm.supplier_type || 'general'} onValueChange={v => setEditForm({ ...editForm, supplier_type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="manufacturer">Manufacturer</SelectItem>
                    <SelectItem value="distributor">Distributor</SelectItem>
                    <SelectItem value="service">Service Provider</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5"><Label>Category</Label>
                <Select value={editForm.supplier_category || 'general'} onValueChange={v => setEditForm({ ...editForm, supplier_category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {SUPPLIER_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c.replace(/_/g, ' ').replace(/\b\w/g, x => x.toUpperCase())}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5"><Label>Contact Name</Label><Input value={editForm.contact_name || ''} onChange={e => setEditForm({ ...editForm, contact_name: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Email</Label><Input value={editForm.email || ''} onChange={e => setEditForm({ ...editForm, email: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Phone</Label><Input value={editForm.phone || ''} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5"><Label>Country</Label><Input value={editForm.country || ''} onChange={e => setEditForm({ ...editForm, country: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Province</Label><Input value={editForm.province || ''} onChange={e => setEditForm({ ...editForm, province: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>City</Label><Input value={editForm.city || ''} onChange={e => setEditForm({ ...editForm, city: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label>Physical Address</Label><Textarea value={editForm.physical_address || ''} onChange={e => setEditForm({ ...editForm, physical_address: e.target.value })} rows={2} /></div>
              <div className="space-y-1.5"><Label>Postal Address</Label><Textarea value={editForm.postal_address || ''} onChange={e => setEditForm({ ...editForm, postal_address: e.target.value })} rows={2} /></div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-1.5"><Label>Payment Terms</Label><Input value={editForm.payment_terms || ''} onChange={e => setEditForm({ ...editForm, payment_terms: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Currency</Label><Input value={editForm.currency_code || 'ZAR'} onChange={e => setEditForm({ ...editForm, currency_code: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Lead Time (days)</Label><Input type="number" value={editForm.lead_time_days || ''} onChange={e => setEditForm({ ...editForm, lead_time_days: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Tax / VAT #</Label><Input value={editForm.tax_number || ''} onChange={e => setEditForm({ ...editForm, tax_number: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label>Reg. #</Label><Input value={editForm.company_registration || ''} onChange={e => setEditForm({ ...editForm, company_registration: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Website</Label><Input value={editForm.website || ''} onChange={e => setEditForm({ ...editForm, website: e.target.value })} /></div>
            </div>
            <div className="space-y-1.5"><Label>Notes</Label><Textarea value={editForm.notes || ''} onChange={e => setEditForm({ ...editForm, notes: e.target.value })} rows={2} /></div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2"><Switch checked={editForm.is_preferred || false} onCheckedChange={v => setEditForm({ ...editForm, is_preferred: v })} /><Label>Preferred Supplier</Label></div>
              <div className="flex items-center gap-2"><Switch checked={editForm.is_active !== false} onCheckedChange={v => setEditForm({ ...editForm, is_active: v })} /><Label>Active</Label></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={saveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Contact Dialog */}
      <Dialog open={contactOpen} onOpenChange={setContactOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Add Contact</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5"><Label>Name *</Label><Input value={contactForm.contact_name} onChange={e => setContactForm({ ...contactForm, contact_name: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>Role / Title</Label><Input value={contactForm.role_title} onChange={e => setContactForm({ ...contactForm, role_title: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label>Email</Label><Input value={contactForm.email} onChange={e => setContactForm({ ...contactForm, email: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Phone</Label><Input value={contactForm.phone} onChange={e => setContactForm({ ...contactForm, phone: e.target.value })} /></div>
            </div>
            <div className="space-y-1.5"><Label>Mobile</Label><Input value={contactForm.mobile} onChange={e => setContactForm({ ...contactForm, mobile: e.target.value })} /></div>
            <div className="flex items-center gap-2"><Switch checked={contactForm.is_primary} onCheckedChange={v => setContactForm({ ...contactForm, is_primary: v })} /><Label>Primary Contact</Label></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setContactOpen(false)}>Cancel</Button>
            <Button onClick={saveContact}>Add Contact</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Link Product Dialog */}
      <Dialog open={productLinkOpen} onOpenChange={setProductLinkOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Link Product to Supplier</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5"><Label>Product *</Label>
              <Select value={productLinkForm.product_id} onValueChange={v => setProductLinkForm({ ...productLinkForm, product_id: v })}>
                <SelectTrigger><SelectValue placeholder="Select product" /></SelectTrigger>
                <SelectContent>{products.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5"><Label>Supplier Product Code</Label><Input value={productLinkForm.supplier_product_code} onChange={e => setProductLinkForm({ ...productLinkForm, supplier_product_code: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label>Standard Cost</Label><Input type="number" value={productLinkForm.standard_cost} onChange={e => setProductLinkForm({ ...productLinkForm, standard_cost: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Min Order Qty</Label><Input type="number" value={productLinkForm.minimum_order_qty} onChange={e => setProductLinkForm({ ...productLinkForm, minimum_order_qty: e.target.value })} /></div>
            </div>
            <div className="space-y-1.5"><Label>Lead Time (days)</Label><Input type="number" value={productLinkForm.lead_time_days} onChange={e => setProductLinkForm({ ...productLinkForm, lead_time_days: e.target.value })} /></div>
            <div className="flex items-center gap-2"><Switch checked={productLinkForm.is_preferred} onCheckedChange={v => setProductLinkForm({ ...productLinkForm, is_preferred: v })} /><Label>Preferred</Label></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProductLinkOpen(false)}>Cancel</Button>
            <Button onClick={linkProduct}>Link Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminPage>
  );
}
