import { PageHeader } from '@/components/PageHeader';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
export default function PaymentGateways() {
  const [data, setData] = useState<any[]>([]); const [loading, setLoading] = useState(true);
  useEffect(() => { supabase.from('payment_gateways').select('*').order('name').limit(50).then(({data})=>{setData(data||[]);setLoading(false);}); }, []);
  return (<div><PageHeader title="Payment Gateways" description="Manage payment providers" />{loading?<p className="text-muted-foreground">Loading...</p>:<div className="rounded-lg border bg-card"><Table><TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Code</TableHead><TableHead>Type</TableHead><TableHead>Status</TableHead></TableRow></TableHeader><TableBody>{data.map(g=>(<TableRow key={g.id}><TableCell className="font-medium">{g.name}</TableCell><TableCell className="font-mono text-sm">{g.code}</TableCell><TableCell>{g.provider_type}</TableCell><TableCell><Badge variant={g.is_active?'default':'secondary'}>{g.is_active?'Active':'Inactive'}</Badge></TableCell></TableRow>))}{data.length===0&&<TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">No payment gateways configured</TableCell></TableRow>}</TableBody></Table></div>}</div>);
}
