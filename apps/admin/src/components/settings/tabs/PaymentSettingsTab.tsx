import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SettingsSection } from '../SettingsSection';
import { SettingsField } from '../SettingsField';
import { SettingsToolbar } from '../SettingsToolbar';
import { useSystemSettings } from '@/hooks/useSystemSettings';
import { Skeleton } from '@/components/ui/skeleton';

export function PaymentSettingsTab() {
  const { settings: s, loading, saving, dirty, update, save, discard } = useSystemSettings('payment');

  if (loading) return <div className="space-y-4">{[1,2].map(i => <Skeleton key={i} className="h-32 w-full" />)}</div>;

  return (
    <div className="space-y-6">
      <SettingsToolbar dirty={dirty} saving={saving} onSave={save} onDiscard={discard} />

      <SettingsSection title="Payment Methods" description="Toggle which payment methods are available for customers.">
        {[
          { key: 'method_eft', label: 'EFT / Bank Transfer' },
          { key: 'method_card', label: 'Credit/Debit Card' },
          { key: 'method_cod', label: 'Cash on Delivery' },
          { key: 'method_credit', label: 'Credit Account' },
          { key: 'method_mobile', label: 'Mobile Money' },
        ].map(item => (
          <div key={item.key} className="flex items-center justify-between rounded-lg border border-border p-4">
            <p className="text-sm font-medium">{item.label}</p>
            <Switch checked={s[item.key] !== false} onCheckedChange={v => update(item.key, v)} />
          </div>
        ))}
      </SettingsSection>

      <SettingsSection title="Bank Details" description="Banking information displayed on invoices and payment instructions.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SettingsField label="Bank Name">
            <Input value={s.bank_name || ''} onChange={e => update('bank_name', e.target.value)} placeholder="FNB" />
          </SettingsField>
          <SettingsField label="Account Number">
            <Input value={s.account_number || ''} onChange={e => update('account_number', e.target.value)} />
          </SettingsField>
          <SettingsField label="Branch Code">
            <Input value={s.branch_code || ''} onChange={e => update('branch_code', e.target.value)} />
          </SettingsField>
          <SettingsField label="Account Type">
            <Select value={s.account_type || 'cheque'} onValueChange={v => update('account_type', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="cheque">Cheque/Current</SelectItem>
                <SelectItem value="savings">Savings</SelectItem>
              </SelectContent>
            </Select>
          </SettingsField>
        </div>
      </SettingsSection>

      <SettingsSection title="Invoice & Refund Rules">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SettingsField label="Default Invoice Terms (days)">
            <Input type="number" value={s.invoice_terms_days ?? 30} onChange={e => update('invoice_terms_days', parseInt(e.target.value))} />
          </SettingsField>
          <SettingsField label="Refund Policy">
            <Select value={s.refund_policy || 'manual'} onValueChange={v => update('refund_policy', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="manual">Manual approval</SelectItem>
                <SelectItem value="auto_under_limit">Auto-approve under limit</SelectItem>
                <SelectItem value="no_refunds">No refunds</SelectItem>
              </SelectContent>
            </Select>
          </SettingsField>
        </div>
        <SettingsField label="Payment Instructions" hint="Shown to customers on order confirmation.">
          <Textarea value={s.payment_instructions || ''} onChange={e => update('payment_instructions', e.target.value)} placeholder="Please use your order number as payment reference..." rows={3} />
        </SettingsField>
      </SettingsSection>
    </div>
  );
}
