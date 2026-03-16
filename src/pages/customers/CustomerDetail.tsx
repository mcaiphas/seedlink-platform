import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { AdminPage } from '@/components/AdminPage';
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
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft, Edit2, DollarSign, CreditCard, Phone, Mail,
  FileText, Plus, Trash2, Users, MessageSquare,
} from 'lucide-react';
import { CustomerCommunicationTab } from '@/components/commerce/CustomerCommunicationTab';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

const CUSTOMER_CATEGORIES = ['commercial_farmer', 'smallholder_farmer', 'distributor', 'retailer', 'corporate_buyer'];
const CUSTOMER_TYPES = ['farmer', 'distributor', 'retailer', 'corporate'];
const PAYMENT_TERMS = ['immediate', 'net_7', 'net_14', 'net_30', 'net_60'];
const DOC_TYPES = ['id_document', 'registration', 'tax_certificate', 'credit_application', 'contract', 'compliance', 'general'];

export default function CustomerDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState<any[]>([]);

  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState<any>({});

  const [docOpen, setDocOpen] = useState(false);
  const [docForm, setDocForm] = useState({ document_name: '', document_type: 'general', file_url: '', notes: '' });

  const fetchAll = async () => {
    if (!id) return;
    setLoading(true);
    const [custRes, docRes] = await Promise.all([
      supabase.from('customers').select('*').eq('id', id).single(),
      supabase.from('customer_documents').select('*').eq('customer_id', id).order('created_at', { ascending: false }),
    ]);
    setCustomer(custRes.data);
    setDocuments(docRes.data || []);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, [id]);

  const openEdit = () => { setEditForm({ ...customer }); setEditOpen(true); };

  const saveEdit = async () => {
    const { error } = await supabase.from('customers').update({
      customer_name: editForm.customer_name,
      customer_code: editForm.customer_code,
      customer_type: editForm.customer_type,
      customer_category: editForm.customer_category,
      registration_number: editForm.registration_number,
      vat_number: editForm.vat_number,
      country: editForm.country,
      province: editForm.province,
      city: editForm.city,
      physical_address: editForm.physical_address,
      postal_address: editForm.postal_address,
      contact_name: editForm.contact_name,
      contact_email: editForm.contact_email,
      contact_phone: editForm.contact_phone,
      contact_mobile: editForm.contact_mobile,
      account_manager: editForm.account_manager,
      payment_terms: editForm.payment_terms,
      credit_limit: editForm.credit_limit ? parseFloat(editForm.credit_limit) : 0,
      currency_code: editForm.currency_code,
      account_status: editForm.account_status,
      is_active: editForm.is_active,
      notes: editForm.notes,
    }).eq('id', id);
    if (error) { toast.error(error.message); return; }
    toast.success('Customer updated');
    setEditOpen(false);
    fetchAll();
  };

  const saveDoc = async () => {
    if (!docForm.document_name) { toast.error('Document name required'); return; }
    const { error } = await supabase.from('customer_documents').insert({
      ...docForm,
      customer_id: id,
      uploaded_by: user?.id,
    });
    if (error) { toast.error(error.message); return; }
    toast.success('Document added');
    setDocOpen(false);
    setDocForm({ document_name: '', document_type: 'general', file_url: '', notes: '' });
    fetchAll();
  };

  const deleteDoc = async (docId: string) => {
    const { error } = await supabase.from('customer_documents').delete().eq('id', docId);
    if (error) { toast.error(error.message); return; }
    toast.success('Document removed');
    fetchAll();
  };

  const fmt = (t: string) => t?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || '—';

  if (loading) return <AdminPage><div className="space-y-4"><Skeleton className="h-8 w-64" /><Skeleton className="h-64 w-full rounded-xl" /></div></AdminPage>;
  if (!customer) return <AdminPage><div className="text-center py-12"><p className="text-muted-foreground">Customer not found</p><Button variant="outline" className="mt-4" onClick={() => navigate('/customers')}>Back</Button></div></AdminPage>;

  return (
    <AdminPage>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/customers')}><ArrowLeft className="h-4 w-4" /></Button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">{customer.customer_name}</h1>
              <Badge variant={customer.is_active ? 'default' : 'secondary'}>{customer.is_active ? 'Active' : 'Inactive'}</Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5 font-mono">{customer.customer_code || '—'} · {fmt(customer.customer_category)}</p>
          </div>
          <Button variant="outline" size="sm" onClick={openEdit}><Edit2 className="h-4 w-4 mr-1" />Edit</Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card><CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1"><Users className="h-3.5 w-3.5" />Type</div>
            <p className="text-sm font-semibold">{fmt(customer.customer_type)}</p>
          </CardContent></Card>
          <Card><CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1"><DollarSign className="h-3.5 w-3.5" />Credit Limit</div>
            <p className="text-lg font-semibold">{customer.currency_code} {(customer.credit_limit || 0).toLocaleString()}</p>
          </CardContent></Card>
          <Card><CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1"><CreditCard className="h-3.5 w-3.5" />Terms</div>
            <p className="text-sm font-semibold">{fmt(customer.payment_terms)}</p>
          </CardContent></Card>
          <Card><CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1"><FileText className="h-3.5 w-3.5" />Documents</div>
            <p className="text-lg font-semibold">{documents.length}</p>
          </CardContent></Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="documents">Documents ({documents.length})</TabsTrigger>
            <TabsTrigger value="communication">Communication</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader><CardTitle className="text-sm">Company Details</CardTitle></CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Type</span><span>{fmt(customer.customer_type)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Category</span><span>{fmt(customer.customer_category)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Registration #</span><span>{customer.registration_number || '—'}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">VAT #</span><span>{customer.vat_number || '—'}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Currency</span><span>{customer.currency_code}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Payment Terms</span><span>{fmt(customer.payment_terms)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Credit Limit</span><span>{customer.currency_code} {(customer.credit_limit || 0).toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Account Status</span><span>{fmt(customer.account_status)}</span></div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-sm">Contact & Location</CardTitle></CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Contact</span><span>{customer.contact_name || '—'}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span>{customer.contact_email || '—'}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Phone</span><span>{customer.contact_phone || '—'}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Mobile</span><span>{customer.contact_mobile || '—'}</span></div>
                  <Separator />
                  <div className="flex justify-between"><span className="text-muted-foreground">Country</span><span>{customer.country || '—'}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Province</span><span>{customer.province || '—'}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">City</span><span>{customer.city || '—'}</span></div>
                  {customer.physical_address && <div><span className="text-muted-foreground block mb-1">Physical Address</span><span>{customer.physical_address}</span></div>}
                </CardContent>
              </Card>
            </div>
            {customer.notes && <Card><CardHeader><CardTitle className="text-sm">Notes</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground whitespace-pre-wrap">{customer.notes}</p></CardContent></Card>}
          </TabsContent>

          <TabsContent value="documents" className="mt-4 space-y-4">
            <div className="flex justify-end">
              <Button size="sm" onClick={() => setDocOpen(true)}><Plus className="h-4 w-4 mr-1" />Add Document</Button>
            </div>
            {documents.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">No documents uploaded yet</div>
            ) : (
              <div className="rounded-lg border bg-card overflow-x-auto">
                <Table>
                  <TableHeader><TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow></TableHeader>
                  <TableBody>
                    {documents.map(d => (
                      <TableRow key={d.id}>
                        <TableCell className="font-medium">{d.document_name}</TableCell>
                        <TableCell><Badge variant="outline" className="text-xs">{fmt(d.document_type)}</Badge></TableCell>
                        <TableCell className="text-sm text-muted-foreground">{new Date(d.created_at).toLocaleDateString()}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{d.notes || '—'}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deleteDoc(d.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          <TabsContent value="orders" className="mt-4">
            <div className="text-center py-12 text-muted-foreground">Order history will be displayed here once orders are linked to this customer.</div>
          </TabsContent>

          <TabsContent value="invoices" className="mt-4">
            <div className="text-center py-12 text-muted-foreground">Invoice history will be displayed here once invoices are linked to this customer.</div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Customer Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Edit Customer</DialogTitle></DialogHeader>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label>Name *</Label><Input value={editForm.customer_name || ''} onChange={e => setEditForm({ ...editForm, customer_name: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Code</Label><Input value={editForm.customer_code || ''} onChange={e => setEditForm({ ...editForm, customer_code: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label>Type</Label>
                <Select value={editForm.customer_type || 'farmer'} onValueChange={v => setEditForm({ ...editForm, customer_type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{CUSTOMER_TYPES.map(t => <SelectItem key={t} value={t}>{fmt(t)}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5"><Label>Category</Label>
                <Select value={editForm.customer_category || 'commercial_farmer'} onValueChange={v => setEditForm({ ...editForm, customer_category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{CUSTOMER_CATEGORIES.map(c => <SelectItem key={c} value={c}>{fmt(c)}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label>Registration #</Label><Input value={editForm.registration_number || ''} onChange={e => setEditForm({ ...editForm, registration_number: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>VAT #</Label><Input value={editForm.vat_number || ''} onChange={e => setEditForm({ ...editForm, vat_number: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label>Contact Name</Label><Input value={editForm.contact_name || ''} onChange={e => setEditForm({ ...editForm, contact_name: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Email</Label><Input value={editForm.contact_email || ''} onChange={e => setEditForm({ ...editForm, contact_email: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label>Phone</Label><Input value={editForm.contact_phone || ''} onChange={e => setEditForm({ ...editForm, contact_phone: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Mobile</Label><Input value={editForm.contact_mobile || ''} onChange={e => setEditForm({ ...editForm, contact_mobile: e.target.value })} /></div>
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
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5"><Label>Payment Terms</Label>
                <Select value={editForm.payment_terms || 'net_30'} onValueChange={v => setEditForm({ ...editForm, payment_terms: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{PAYMENT_TERMS.map(t => <SelectItem key={t} value={t}>{fmt(t)}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5"><Label>Credit Limit</Label><Input type="number" value={editForm.credit_limit || ''} onChange={e => setEditForm({ ...editForm, credit_limit: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Currency</Label><Input value={editForm.currency_code || 'ZAR'} onChange={e => setEditForm({ ...editForm, currency_code: e.target.value })} /></div>
            </div>
            <div className="space-y-1.5"><Label>Account Manager</Label><Input value={editForm.account_manager || ''} onChange={e => setEditForm({ ...editForm, account_manager: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>Notes</Label><Textarea value={editForm.notes || ''} onChange={e => setEditForm({ ...editForm, notes: e.target.value })} rows={2} /></div>
            <div className="flex items-center gap-2">
              <Switch checked={editForm.is_active !== false} onCheckedChange={v => setEditForm({ ...editForm, is_active: v })} />
              <Label>Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={saveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Document Dialog */}
      <Dialog open={docOpen} onOpenChange={setDocOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Add Document</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5"><Label>Document Name *</Label><Input value={docForm.document_name} onChange={e => setDocForm({ ...docForm, document_name: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>Document Type</Label>
              <Select value={docForm.document_type} onValueChange={v => setDocForm({ ...docForm, document_type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{DOC_TYPES.map(t => <SelectItem key={t} value={t}>{fmt(t)}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5"><Label>File URL</Label><Input value={docForm.file_url} onChange={e => setDocForm({ ...docForm, file_url: e.target.value })} placeholder="https://..." /></div>
            <div className="space-y-1.5"><Label>Notes</Label><Textarea value={docForm.notes} onChange={e => setDocForm({ ...docForm, notes: e.target.value })} rows={2} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDocOpen(false)}>Cancel</Button>
            <Button onClick={saveDoc}>Add Document</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminPage>
  );
}
