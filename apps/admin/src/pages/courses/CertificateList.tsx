import { AdminListPage } from '@/components/AdminListPage';

export default function CertificateList() {
  return (
    <AdminListPage title="Certificates" tableName="certificates" selectQuery="*, courses(title), profiles(full_name)" searchPlaceholder="Search certificates..." searchFields={['certificate_number']}
      columns={[
        { label: 'Certificate #', key: 'certificate_number', sortable: true, render: r => <span className="font-medium font-mono">{r.certificate_number}</span> },
        { label: 'Student', key: 'user_id', render: r => (r.profiles as any)?.full_name || '—' },
        { label: 'Course', key: 'course_id', render: r => (r.courses as any)?.title || '—' },
        { label: 'Issued', key: 'issued_at', sortable: true, render: r => new Date(r.issued_at).toLocaleDateString() },
      ]} />
  );
}
