import { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Download, Upload, FileText, CheckCircle, XCircle, AlertCircle, FileSpreadsheet, ArrowRight, Package } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const TEMPLATE_HEADERS = [
  'name', 'sku', 'sku_base', 'product_type', 'status', 'brand', 'category', 'description',
  'default_buying_price', 'default_selling_price', 'compare_at_price', 'currency_code', 'base_uom',
  'stock_quantity', 'is_active', 'requires_shipping', 'shipping_weight_kg',
  'length_cm', 'width_cm', 'height_cm',
];

const SAMPLE_ROW = [
  'Pioneer P3456 Maize', 'SD-MZ-P3456-60K', 'SD-MZ-P3456', 'physical', 'draft', 'Pioneer', 'Seeds', 'High-yield hybrid maize seed',
  '850.00', '1250.00', '', 'ZAR', 'kg',
  '500', 'true', 'true', '25',
  '40', '30', '20',
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
  status: 'valid' | 'warning' | 'error';
  errors: string[];
  warnings: string[];
}

export function ProductImportExport({ open, onOpenChange, onImportComplete, products }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);
  const [importResults, setImportResults] = useState<ImportRow[] | null>(null);
  const [importDone, setImportDone] = useState(false);
  const [successCount, setSuccessCount] = useState(0);
  const [importProgress, setImportProgress] = useState(0);
  const [step, setStep] = useState<'upload' | 'review' | 'done'>('upload');

  const downloadTemplate = () => {
    const csv = TEMPLATE_HEADERS.join(',') + '\n' + SAMPLE_ROW.join(',') + '\n';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'seedlink_products_template.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Template downloaded' });
  };

  const exportProducts = () => {
    if (!products.length) { toast({ title: 'No products to export' }); return; }
    const headers = TEMPLATE_HEADERS;
    const rows = products.map(p => headers.map(h => {
      const v = p[h];
      if (v === null || v === undefined) return '';
      if (typeof v === 'string' && (v.includes(',') || v.includes('"') || v.includes('\n'))) return `"${v.replace(/"/g, '""')}"`;
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
    toast({ title: `${products.length} products exported` });
  };

  const parseCSV = (text: string): Record<string, string>[] => {
    const lines = text.split('\n').filter(l => l.trim());
    if (lines.length < 2) return [];
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/^"|"$/g, ''));
    return lines.slice(1).map(line => {
      const vals: string[] = [];
      let current = '';
      let inQuotes = false;
      for (const char of line) {
        if (char === '"') { inQuotes = !inQuotes; }
        else if (char === ',' && !inQuotes) { vals.push(current.trim()); current = ''; }
        else { current += char; }
      }
      vals.push(current.trim());
      const obj: Record<string, string> = {};
      headers.forEach((h, i) => { obj[h] = vals[i] || ''; });
      return obj;
    });
  };

  const validateRow = (data: Record<string, string>, idx: number): ImportRow => {
    const errors: string[] = [];
    const warnings: string[] = [];
    if (!data.name?.trim()) errors.push('Name is required');
    const sell = data.default_selling_price || data.price;
    const buy = data.default_buying_price || data.buying_price;
    if (sell && isNaN(Number(sell))) errors.push('Invalid selling price');
    if (buy && isNaN(Number(buy))) errors.push('Invalid buying price');
    if (data.stock_quantity && isNaN(Number(data.stock_quantity))) errors.push('Invalid stock quantity');
    if (data.status && !['draft', 'published', 'archived'].includes(data.status)) warnings.push(`Unknown status "${data.status}", will default to draft`);
    if (!sell && !buy) warnings.push('No pricing set');
    if (sell && buy) {
      const margin = ((Number(sell) - Number(buy)) / Number(buy)) * 100;
      if (margin < 0) warnings.push('Negative margin detected');
      else if (margin < 5) warnings.push(`Very low margin: ${margin.toFixed(1)}%`);
    }
    const status = errors.length > 0 ? 'error' : warnings.length > 0 ? 'warning' : 'valid';
    return { row: idx + 2, data, status, errors, warnings };
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const parsed = parseCSV(text);
    if (parsed.length === 0) {
      toast({ title: 'Empty file', description: 'No data rows found.', variant: 'destructive' });
      return;
    }
    const validated = parsed.map((d, i) => validateRow(d, i));
    setImportResults(validated);
    setStep('review');
    if (fileRef.current) fileRef.current.value = '';
  };

  const executeImport = async () => {
    if (!importResults) return;
    const valid = importResults.filter(r => r.status !== 'error');
    if (valid.length === 0) { toast({ title: 'No valid rows', variant: 'destructive' }); return; }

    setImporting(true);
    setImportProgress(0);
    let success = 0;

    for (let i = 0; i < valid.length; i++) {
      const d = valid[i].data;
      const buy = d.default_buying_price || d.buying_price;
      const sell = d.default_selling_price || d.price;
      const buyNum = buy ? Number(buy) : null;
      const sellNum = sell ? Number(sell) : null;
      let margin: number | null = null;
      if (buyNum && sellNum && buyNum > 0) margin = Number((((sellNum - buyNum) / buyNum) * 100).toFixed(2));

      const insert: any = {
        name: d.name,
        sku: d.sku || null,
        sku_base: d.sku_base || null,
        product_type: ['physical', 'digital', 'service'].includes(d.product_type) ? d.product_type : 'physical',
        status: ['draft', 'published', 'archived'].includes(d.status) ? d.status : 'draft',
        brand: d.brand || null,
        category: d.category || null,
        description: d.description || null,
        default_buying_price: buyNum,
        default_selling_price: sellNum,
        default_margin_percent: margin,
        price: sellNum,
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
      };
      const { error } = await supabase.from('products').insert(insert);
      if (!error) success++;
      else valid[i].errors.push(error.message);
      setImportProgress(((i + 1) / valid.length) * 100);
    }

    setSuccessCount(success);
    setImportDone(true);
    setImporting(false);
    setStep('done');
    if (success > 0) onImportComplete();
  };

  const reset = () => { setImportResults(null); setImportDone(false); setStep('upload'); setImportProgress(0); };

  const errorCount = importResults?.filter(r => r.status === 'error').length || 0;
  const warningCount = importResults?.filter(r => r.status === 'warning').length || 0;
  const validCount = importResults?.filter(r => r.status !== 'error').length || 0;

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) reset(); }}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Package className="h-5 w-5 text-primary" />Import & Export Products</DialogTitle>
          <DialogDescription>Import products from CSV or export your catalog.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="import">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="import" className="gap-1.5"><Upload className="h-4 w-4" />Import</TabsTrigger>
            <TabsTrigger value="export" className="gap-1.5"><Download className="h-4 w-4" />Export</TabsTrigger>
          </TabsList>

          <TabsContent value="import" className="space-y-4 mt-4">
            {step === 'upload' && (
              <div className="space-y-4">
                <div className="rounded-lg border border-dashed border-border p-8 text-center space-y-4">
                  <FileSpreadsheet className="mx-auto h-12 w-12 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Upload a CSV file to import products</p>
                    <p className="text-xs text-muted-foreground mt-1">Download the template below for the correct format</p>
                  </div>
                  <div className="flex justify-center gap-2">
                    <Button variant="outline" size="sm" onClick={downloadTemplate}>
                      <Download className="mr-2 h-3.5 w-3.5" />Download Template
                    </Button>
                    <Button size="sm" onClick={() => fileRef.current?.click()}>
                      <Upload className="mr-2 h-3.5 w-3.5" />Choose CSV File
                    </Button>
                    <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleFile} />
                  </div>
                </div>

                <Card>
                  <CardContent className="p-4">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Template Fields</p>
                    <div className="flex flex-wrap gap-1.5">
                      {TEMPLATE_HEADERS.map(h => (
                        <Badge key={h} variant="outline" className="text-[10px] font-mono">{h}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {step === 'review' && importResults && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <Badge variant="default" className="gap-1"><CheckCircle className="h-3 w-3" />{validCount} valid</Badge>
                  {warningCount > 0 && <Badge variant="secondary" className="gap-1 text-accent-foreground"><AlertCircle className="h-3 w-3" />{warningCount} warnings</Badge>}
                  {errorCount > 0 && <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" />{errorCount} errors</Badge>}
                  <span className="text-xs text-muted-foreground tabular-nums">{importResults.length} total rows</span>
                </div>

                <div className="max-h-64 overflow-y-auto rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-14">Row</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead className="w-20">Status</TableHead>
                        <TableHead>Issues</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {importResults.map(r => (
                        <TableRow key={r.row} className={r.status === 'error' ? 'bg-destructive/5' : r.status === 'warning' ? 'bg-accent/5' : ''}>
                          <TableCell className="font-mono text-xs tabular-nums">{r.row}</TableCell>
                          <TableCell className="text-sm font-medium">{r.data.name || <span className="text-destructive italic">Missing</span>}</TableCell>
                          <TableCell className="text-xs font-mono text-muted-foreground">{r.data.sku || '—'}</TableCell>
                          <TableCell>
                            <Badge variant={r.status === 'error' ? 'destructive' : r.status === 'warning' ? 'secondary' : 'outline'} className="text-[10px] capitalize">{r.status}</Badge>
                          </TableCell>
                          <TableCell className="text-xs max-w-[200px]">
                            {r.errors.map((e, i) => <p key={i} className="text-destructive">{e}</p>)}
                            {r.warnings.map((w, i) => <p key={i} className="text-accent-foreground">{w}</p>)}
                            {r.errors.length === 0 && r.warnings.length === 0 && <span className="text-muted-foreground/40">—</span>}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex justify-between items-center">
                  <Button variant="outline" size="sm" onClick={reset}>← Back</Button>
                  <Button size="sm" onClick={executeImport} disabled={validCount === 0 || importing}>
                    {importing ? 'Importing...' : `Import ${validCount} product${validCount !== 1 ? 's' : ''}`}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>

                {importing && <Progress value={importProgress} className="h-2" />}
              </div>
            )}

            {step === 'done' && importResults && (
              <div className="space-y-4">
                <div className="rounded-lg border p-8 text-center space-y-3">
                  <CheckCircle className="mx-auto h-12 w-12 text-primary" />
                  <p className="text-lg font-semibold">Import Complete</p>
                  <div className="flex justify-center gap-3">
                    <Badge variant="default" className="gap-1 text-sm">{successCount} imported</Badge>
                    {errorCount > 0 && <Badge variant="outline" className="gap-1 text-sm">{errorCount} skipped</Badge>}
                  </div>
                </div>

                {importResults.filter(r => r.errors.length > 0).length > 0 && (
                  <div className="max-h-40 overflow-y-auto rounded-md border text-xs">
                    {importResults.filter(r => r.errors.length > 0).map(r => (
                      <div key={r.row} className="flex items-start gap-2 p-2 border-b last:border-0">
                        <AlertCircle className="h-3 w-3 text-destructive shrink-0 mt-0.5" />
                        <div><span className="font-medium">Row {r.row}:</span> {r.errors.join('; ')}</div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-center">
                  <Button variant="outline" size="sm" onClick={reset}>Import More</Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="export" className="space-y-4 mt-4">
            <div className="rounded-lg border p-8 text-center space-y-4">
              <FileSpreadsheet className="mx-auto h-12 w-12 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Export {products.length} product{products.length !== 1 ? 's' : ''}</p>
                <p className="text-xs text-muted-foreground mt-1">Downloads as CSV with all catalog fields including pricing and dimensions.</p>
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
