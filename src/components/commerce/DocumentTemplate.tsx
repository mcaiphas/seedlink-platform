import { ReactNode } from 'react';
import { CurrencyDisplay, DateDisplay } from '@/components/commerce/StatusBadge';
import { Separator } from '@/components/ui/separator';

interface CompanyDetails {
  name: string;
  address: string;
  phone: string;
  email: string;
  vat: string;
  bankName: string;
  bankAccount: string;
  bankBranch: string;
  bankSwift: string;
}

interface CustomerDetails {
  name: string;
  address?: string;
  email?: string;
  phone?: string;
  vatNumber?: string;
}

interface DocumentLine {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface DocumentTemplateProps {
  documentType: string;
  documentNumber: string;
  issueDate: string;
  dueDate?: string;
  paymentTerms?: string;
  deliveryTerms?: string;
  company: CompanyDetails;
  customer: CustomerDetails;
  lines: DocumentLine[];
  subtotal: number;
  tax: number;
  total: number;
  notes?: string;
  currency?: string;
  children?: ReactNode;
}

const SEEDLINK_COMPANY: CompanyDetails = {
  name: 'Seedlink Commerce (Pty) Ltd',
  address: 'Unit 5, Agri Park, Stellenbosch, 7600, South Africa',
  phone: '+27 21 123 4567',
  email: 'accounts@seedlink.co.za',
  vat: '4123456789',
  bankName: 'First National Bank',
  bankAccount: '62345678901',
  bankBranch: '250655',
  bankSwift: 'FIRNZAJJ',
};

export { SEEDLINK_COMPANY };

export default function DocumentTemplate({
  documentType, documentNumber, issueDate, dueDate, paymentTerms, deliveryTerms,
  company, customer, lines, subtotal, tax, total, notes, currency = 'ZAR', children,
}: DocumentTemplateProps) {
  return (
    <div className="bg-card border rounded-xl shadow-sm p-8 max-w-3xl mx-auto print:shadow-none print:border-0 print:p-4" id="printable-document">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold text-primary">{company.name}</h1>
          <p className="text-xs text-muted-foreground mt-1 max-w-[250px]">{company.address}</p>
          <p className="text-xs text-muted-foreground">{company.phone} · {company.email}</p>
          <p className="text-xs text-muted-foreground">VAT: {company.vat}</p>
        </div>
        <div className="text-right">
          <h2 className="text-lg font-bold uppercase tracking-wide text-foreground">{documentType}</h2>
          <p className="text-lg font-mono font-semibold text-primary mt-1">{documentNumber}</p>
        </div>
      </div>

      <Separator className="mb-6" />

      {/* Customer & Document Details */}
      <div className="grid grid-cols-2 gap-8 mb-6">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Bill To</h3>
          <p className="font-semibold text-foreground">{customer.name}</p>
          {customer.address && <p className="text-sm text-muted-foreground">{customer.address}</p>}
          {customer.email && <p className="text-sm text-muted-foreground">{customer.email}</p>}
          {customer.phone && <p className="text-sm text-muted-foreground">{customer.phone}</p>}
          {customer.vatNumber && <p className="text-sm text-muted-foreground">VAT: {customer.vatNumber}</p>}
        </div>
        <div className="text-right space-y-1">
          <div><span className="text-xs text-muted-foreground">Issue Date:</span> <span className="text-sm font-medium"><DateDisplay date={issueDate} /></span></div>
          {dueDate && <div><span className="text-xs text-muted-foreground">Due Date:</span> <span className="text-sm font-medium"><DateDisplay date={dueDate} /></span></div>}
          {paymentTerms && <div><span className="text-xs text-muted-foreground">Payment Terms:</span> <span className="text-sm capitalize">{paymentTerms.replace(/_/g, ' ')}</span></div>}
          {deliveryTerms && <div><span className="text-xs text-muted-foreground">Delivery Terms:</span> <span className="text-sm">{deliveryTerms}</span></div>}
        </div>
      </div>

      {/* Line Items */}
      <table className="w-full mb-6">
        <thead>
          <tr className="border-b-2 border-primary/20">
            <th className="text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground py-2">Description</th>
            <th className="text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground py-2 w-20">Qty</th>
            <th className="text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground py-2 w-28">Unit Price</th>
            <th className="text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground py-2 w-28">Total</th>
          </tr>
        </thead>
        <tbody>
          {lines.map((line, i) => (
            <tr key={i} className="border-b border-border/50">
              <td className="py-2 text-sm text-foreground">{line.description || '—'}</td>
              <td className="py-2 text-sm text-right tabular-nums">{line.quantity}</td>
              <td className="py-2 text-sm text-right"><CurrencyDisplay amount={line.unitPrice} currency={currency} /></td>
              <td className="py-2 text-sm text-right font-medium"><CurrencyDisplay amount={line.total} currency={currency} /></td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end mb-6">
        <div className="w-64 space-y-1">
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><CurrencyDisplay amount={subtotal} currency={currency} /></div>
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Tax (VAT)</span><CurrencyDisplay amount={tax} currency={currency} /></div>
          <Separator className="my-2" />
          <div className="flex justify-between text-base font-bold"><span>Total Due</span><CurrencyDisplay amount={total} currency={currency} /></div>
        </div>
      </div>

      {/* Notes */}
      {notes && (
        <div className="mb-6">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Notes</h3>
          <p className="text-sm text-muted-foreground">{notes}</p>
        </div>
      )}

      {children}

      {/* Banking Details */}
      <Separator className="mb-4" />
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Banking Details</h3>
        <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
          <div><span className="text-muted-foreground">Bank:</span> <span className="font-medium">{company.bankName}</span></div>
          <div><span className="text-muted-foreground">Account:</span> <span className="font-mono">{company.bankAccount}</span></div>
          <div><span className="text-muted-foreground">Branch Code:</span> <span className="font-mono">{company.bankBranch}</span></div>
          <div><span className="text-muted-foreground">SWIFT:</span> <span className="font-mono">{company.bankSwift}</span></div>
        </div>
      </div>
    </div>
  );
}
