import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SettingsSection } from '../SettingsSection';
import { SettingsField } from '../SettingsField';
import { SettingsToolbar } from '../SettingsToolbar';
import { useSystemSettings } from '@/hooks/useSystemSettings';
import { Skeleton } from '@/components/ui/skeleton';

export function GeneralSettingsTab() {
  const { settings: s, loading, saving, dirty, update, save, discard } = useSystemSettings('general');

  if (loading) return <div className="space-y-4">{[1,2,3].map(i => <Skeleton key={i} className="h-32 w-full" />)}</div>;

  return (
    <div className="space-y-6">
      <SettingsToolbar dirty={dirty} saving={saving} onSave={save} onDiscard={discard} />

      <SettingsSection title="Business Identity" description="Core company information displayed across invoices, emails, and documents.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SettingsField label="Business Name" hint="Legal registered name of your company.">
            <Input value={s.business_name || ''} onChange={e => update('business_name', e.target.value)} placeholder="Seedlink Agri (Pty) Ltd" />
          </SettingsField>
          <SettingsField label="Trading Name" hint="The name your customers know you by.">
            <Input value={s.trading_name || ''} onChange={e => update('trading_name', e.target.value)} placeholder="Seedlink" />
          </SettingsField>
          <SettingsField label="Registration Number" hint="Company registration / CIPC number.">
            <Input value={s.registration_number || ''} onChange={e => update('registration_number', e.target.value)} placeholder="2024/123456/07" />
          </SettingsField>
          <SettingsField label="VAT Number" hint="Tax registration number for invoicing.">
            <Input value={s.vat_number || ''} onChange={e => update('vat_number', e.target.value)} placeholder="4123456789" />
          </SettingsField>
          <SettingsField label="Company Email">
            <Input type="email" value={s.company_email || ''} onChange={e => update('company_email', e.target.value)} placeholder="info@seedlink.co.za" />
          </SettingsField>
          <SettingsField label="Support Phone">
            <Input value={s.support_phone || ''} onChange={e => update('support_phone', e.target.value)} placeholder="+27 11 000 0000" />
          </SettingsField>
          <SettingsField label="Website">
            <Input value={s.website || ''} onChange={e => update('website', e.target.value)} placeholder="https://seedlink.co.za" />
          </SettingsField>
          <SettingsField label="Company Logo URL" hint="URL to your logo for invoices and emails.">
            <Input value={s.logo_url || ''} onChange={e => update('logo_url', e.target.value)} placeholder="https://..." />
          </SettingsField>
        </div>
      </SettingsSection>

      <SettingsSection title="Regional Defaults" description="Default locale settings for the platform.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SettingsField label="Default Currency">
            <Select value={s.default_currency || 'ZAR'} onValueChange={v => update('default_currency', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ZAR">ZAR — South African Rand</SelectItem>
                <SelectItem value="USD">USD — US Dollar</SelectItem>
                <SelectItem value="EUR">EUR — Euro</SelectItem>
                <SelectItem value="GBP">GBP — British Pound</SelectItem>
                <SelectItem value="KES">KES — Kenyan Shilling</SelectItem>
                <SelectItem value="NGN">NGN — Nigerian Naira</SelectItem>
              </SelectContent>
            </Select>
          </SettingsField>
          <SettingsField label="Language">
            <Select value={s.language || 'en'} onValueChange={v => update('language', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="af">Afrikaans</SelectItem>
                <SelectItem value="zu">isiZulu</SelectItem>
              </SelectContent>
            </Select>
          </SettingsField>
          <SettingsField label="Timezone">
            <Select value={s.timezone || 'Africa/Johannesburg'} onValueChange={v => update('timezone', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Africa/Johannesburg">Africa/Johannesburg (SAST)</SelectItem>
                <SelectItem value="Africa/Nairobi">Africa/Nairobi (EAT)</SelectItem>
                <SelectItem value="Africa/Lagos">Africa/Lagos (WAT)</SelectItem>
                <SelectItem value="UTC">UTC</SelectItem>
              </SelectContent>
            </Select>
          </SettingsField>
          <SettingsField label="Country">
            <Select value={s.country || 'ZA'} onValueChange={v => update('country', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ZA">South Africa</SelectItem>
                <SelectItem value="KE">Kenya</SelectItem>
                <SelectItem value="NG">Nigeria</SelectItem>
                <SelectItem value="ZM">Zambia</SelectItem>
                <SelectItem value="MW">Malawi</SelectItem>
              </SelectContent>
            </Select>
          </SettingsField>
        </div>
      </SettingsSection>
    </div>
  );
}
