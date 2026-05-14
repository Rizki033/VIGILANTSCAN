import {
  Muted,
  ReportsCard,
  SectionLabel,
  Table,
  TableAction,
  TableBody,
  TableHead,
  TableRow,
  StatusPill,
  ViewShell,
  ViewTitle,
} from '../ui/shell.jsx';

function statusLabel(status) {
  if (status === 'critical') return 'Critical';
  if (status === 'warning') return 'Warning';
  return 'Clean';
}

export default function ReportsView({ reports, onReportAction }) {
  return (
    <ViewShell>
      <ViewTitle>Reports</ViewTitle>
      <Muted>Archive of generated assessments. Action opens the structured snapshot for sharing with owners.</Muted>
      <ReportsCard css={{ flex: '1 1 auto', minHeight: 0 }}>
        <SectionLabel>All reports</SectionLabel>
        <Table>
          <TableHead>
            <span>Date</span>
            <span>Target URL</span>
            <span>Status</span>
            <span>Action</span>
          </TableHead>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.id}>
                <span>{report.date}</span>
                <span css={{ wordBreak: 'break-all' }}>{report.target}</span>
                <StatusPill status={report.status}>{statusLabel(report.status)}</StatusPill>
                <TableAction type="button" onClick={() => onReportAction(report)}>
                  Action
                </TableAction>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ReportsCard>
    </ViewShell>
  );
}
