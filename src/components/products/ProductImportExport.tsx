import { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Download, Upload, FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const TEMPLATE_HEADERS = [
  'name', 'sku', 'product_type', 'status', 'brand', 'category', 'description',
  'price', 'compare_at_price', 'buying_price', 'currency_code', 'base_uom',
  'stock_quantity', 'is_active', 'requires_shipping', 'shipping_weight_kg',
  'length_cm', 'width_cm', 'height_cm',
];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportComplete: () => void;
  products: any[];
}

interface ImportRow {
  row: number;
  data: Record<string, string>;
  status: 'valid' | 'error';
  errors: string[];
}

export function ProductImportExport({ open, onOpenChange, onImportComplete, products }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);
  const [importResults, setImportResults] = useState<ImportRow[] | null>(null);
  const [importDone, setImportDone] = useState(false);
  const [successCount, setSuccessCount] = useState(0);

  const downloadTemplate = () => {
    const csv = TEMPLATE_HEADERS.join(',') + '\n';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'seedlink_products_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportProducts = () => {
    if (!products.length) { toast({ title: 'No products to export' }); return; }
    const headers = TEMPLATE_HEADERS;
    const rows = products.map(p => headers.map(h => {
      if (h === 'buying_price') return p.metadata?.buying_price ?? '';
      const v = p[h];
      if (v === null || v === undefined) return '';
      if (typeof v === 'string' && v.includes(',')) return `"${v}"`;
      return String(v);
    }).join(','));
    const csv = headers.join(',') + '\n' + rows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `seedlink_products_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const parseCSV = (text: string): Record<string, string>[] => {
    const lines = text.split('\n').filter(l => l.trim());
    if (lines.length < 2) return [];
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    return lines.slice(1).map(line => {
      const vals = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
      const obj: Record<string, string> = {};
      headers.forEach((h, i) => { obj[h] = vals[i] || ''; });
      return obj;
    });
  };

  const validateRow = (data: Record<string, string>, idx: number): ImportRow => {
    const errors: string[] = [];
    if (!data.name?.trim()) errors.push('Name is required');
    if (data.price && isNaN(Number(data.price))) errors.push('Invalid price');
    if (data.stock_quantity && isNaN(Number(data.stock_quantity))) errors.push('Invalid stock quantity');
    return { row: idx + 2, data, status: errors.length ? 'error' : 'valid', errors };
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    setImportDone(false);
    setSuccessCount(0);

    const text = await file.text();
    const parsed = parseCSV(text);
    const validated = parsed.map((d, i) => validateRow(d, i));
    setImportResults(validated);

    const valid = validated.filter(r => r.status === 'valid');
    if (valid.length === 0) { setImporting(false); return; }

    let success = 0;
    for (const row of valid) {
      const d = row.data;
      const insert: any = {
        name: d.name,
        sku: d.sku || null,
        product_type: d.product_type || 'physical',
        status: d.status || 'draft',
        brand: d.brand || null,
        category: d.category || null,
        description: d.description || null,
        price: d.price ? Number(d.price) : null,
        compare_at_price: d.compare_at_price ? Number(d.compare_at_price) : null,
        currency_code: d.currency_code || 'ZAR',
        base_uom: d.base_uom || 'kg',
        stock_quantity: d.stock_quantity ? Number(d.stock_quantity) : 0,
        is_active: d.is_active !== 'false',
        requires_shipping: d.requires_shipping !== 'false',
        shipping_weight_kg: d.shipping_weight_kg ? Number(d.shipping_weight_kg) : null,
        length_cm: d.length_cm ? Number(d.length_cm) : null,
        width_cm: d.width_cm ? Number(d.width_cm) : null,
        height_cm: d.height_cm ? Number(d.height_cm) : null,
        metadata: d.buying_price ? { buying_price: Number(d.buying_price) } : {},
      };
      const { error } = await supabase.from('products').insert(insert);
      if (!error) success++;
      else row.errors.push(error.message);
    }

    setSuccessCount(success);
    setImportDone(true);
    setImporting(false);
    if (success > 0) onImportComplete();
    if (fileRef.current) fileRef.current.value = '';
  };

  const reset = () => { setImportResults(null); setImportDone(false); };

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) reset(); }}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import & Export Products</DialogTitle>
          <DialogDescription>Import products from CSV or export your product catalog.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="import">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="import"><Upload className="mr-2 h-4 w-4" />Import</TabsTrigger>
            <TabsTrigger value="export"><Download className="mr-2 h-4 w-4" />Export</TabsTrigger>
          </TabsList>

          <TabsContent value="import" className="space-y-4 mt-4">
            <div className="rounded-lg border border-dashed border-border p-6 text-center space-y-3">
              <FileText className="mx-auto h-10 w-10 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Upload a CSV file</p>
                <p className="text-xs text-muted-foreground">Use the template for best results</p>
              </div>
              <div className="flex justify-center gap-2">
                <Button variant="outline" size="sm" onClick={downloadTemplate}>
                  <Download className="mr-2 h-3 w-3" />Download Template
                </Button>
                <Button size="sm" disabled={importing} onClick={() => fileRef.current?.click()}>
                  <Upload className="mr-2 h-3 w-3" />{importing ? 'Importing...' : 'Choose File'}
                </Button>
                <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleFile} />
              </div>
            </div>

            {importResults && (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  {importDone && (
                    <>
                      <Badge variant="default" className="gap-1"><CheckCircle className="h-3 w-3" />{successCount} imported</Badge>
                      {importResults.filter(r => r.errors.length > 0).length > 0 && (
                        <Badge variant="destructive" className="gap-1">
                          <XCircle className="h-3 w-3" />{importResults.filter(r => r.errors.length > 0).length} failed
                        </Badge>
                      )}
                    </>
                  )}
                </div>
                <div className="max-h-48 overflow-y-auto rounded-md border text-xs">
                  {importResults.filter(r => r.errors.length > 0).map(r => (
                    <div key={r.row} className="flex items-start gap-2 p-2 border-b last:border-0">
                      <AlertCircle className="h-3 w-3 text-destructive shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium">Row {r.row}:</span>{' '}
                        {r.errors.join('; ')}
                      </div>
                    </div>
                  ))}
                  {importResults.filter(r => r.errors.length > 0).length === 0 && importDone && (
                    <div className="p-4 text-center text-muted-foreground">All rows imported successfully</div>
                  )}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="export" className="space-y-4 mt-4">
            <div className="rounded-lg border p-6 text-center space-y-3">
              <Download className="mx-auto h-10 w-10 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Export {products.length} products</p>
                <p className="text-xs text-muted-foreground">Download as CSV file</p>
              </div>
              <Button onClick={exportProducts} disabled={!products.length}>
                <Download className="mr-2 h-4 w-4" />Export to CSV
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
