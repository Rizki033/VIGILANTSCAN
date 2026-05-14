import { Suspense, lazy } from 'react';
import {
  ChartWrap,
  EmptyChart,
  InlineError,
  NewScanCard,
  ProgressBar,
  ProgressCard,
  ProgressHead,
  ProgressPct,
  ProgressTitle,
  ProgressWrap,
  ReportsCard,
  ScanRow,
  SectionLabel,
  StartButton,
  StatCard,
  StatLabel,
  StatNumber,
  StatRow,
  StatusPill,
  Table,
  TableAction,
  TableBody,
  TableHead,
  TableRow,
  Terminal,
  TerminalLine,
  UrlInput,
} from '../ui/shell.jsx';
import { IconRadar } from '../icons.jsx';
import { styled } from '../styles/theme.js';

const ActivityChart = lazy(() => import('../components/ActivityChart.jsx'));

const ProfileSelect = styled('select', {
  minHeight: '40px',
  borderRadius: '$sm',
  border: '1px solid rgba(77, 97, 252, 0.28)',
  background: '$bgMuted',
  color: '$text',
  padding: '0 $3',
  fontSize: '$2',
  outline: 'none',
  flexShrink: 0,
  '&:focus': {
    borderColor: '$brand',
    boxShadow: '0 0 0 2px rgba(77, 97, 252, 0.18)',
  },
});

function statusLabel(status) {
  if (status === 'critical') return 'Critical';
  if (status === 'warning') return 'Warning';
  return 'Clean';
}

function lineColor(text) {
  if (text.includes('[FAILED]')) return '#ff4d4d';
  if (text.includes('[PASSED]')) return '#33cc33';
  if (text.includes('[WARN]')) return '#ff9933';
  if (text.includes('[BUSY]')) return '#7c8cff';
  return '#a8b4d4';
}

function displayDomain(activeTarget) {
  if (!activeTarget) return 'DOMAIN.COM';
  try {
    return new URL(activeTarget).hostname.toUpperCase();
  } catch {
    return 'DOMAIN.COM';
  }
}

export default function DashboardView({
  target,
  setTarget,
  assetProfile,
  setAssetProfile,
  assetProfiles,
  status,
  progress,
  error,
  logs,
  summaryDisplay,
  reports,
  activeTarget,
  startScan,
  barPercent,
  onReportAction,
}) {
  return (
    <>
      <NewScanCard>
        <SectionLabel>New scan</SectionLabel>
        <ScanRow>
          <UrlInput
            aria-label="Target URL"
            placeholder="https://example.com"
            value={target}
            onChange={(event) => setTarget(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && status !== 'running') {
                startScan();
              }
            }}
          />
          <ProfileSelect
            aria-label="Asset profile"
            value={assetProfile}
            onChange={(event) => setAssetProfile(event.target.value)}
            disabled={status === 'running'}
          >
            {assetProfiles.map((profile) => (
              <option key={profile.value} value={profile.value}>
                {profile.label}
              </option>
            ))}
          </ProfileSelect>
          <StartButton type="button" disabled={status === 'running'} onClick={startScan}>
            <IconRadar />
            {status === 'running' ? 'Scanning…' : 'Start Scan'}
          </StartButton>
        </ScanRow>
        {error ? <InlineError>{error}</InlineError> : null}
      </NewScanCard>

      <ProgressCard>
        <ProgressHead>
          <div>
            <SectionLabel css={{ display: 'block', marginBottom: '$1' }}>
              Real-time scan progress
            </SectionLabel>
            <ProgressTitle>— {displayDomain(activeTarget)}</ProgressTitle>
          </div>
          <ProgressPct>{barPercent}%</ProgressPct>
        </ProgressHead>
        <ProgressWrap>
          <ProgressBar style={{ width: `${barPercent}%` }} />
        </ProgressWrap>
        <ChartWrap>
          <Suspense fallback={<EmptyChart>Loading chart…</EmptyChart>}>
            <ActivityChart height={120} />
          </Suspense>
        </ChartWrap>
        <Terminal>
          {logs.map((line, i) => (
            <TerminalLine key={`${i}-${line.slice(0, 24)}`} css={{ color: lineColor(line) }}>
              {line}
            </TerminalLine>
          ))}
        </Terminal>
      </ProgressCard>

      <StatRow>
        {[
          { key: 'critical', label: 'CRITICAL', color: '#ff4d4d' },
          { key: 'warning', label: 'WARNING', color: '#ff9933' },
          { key: 'info', label: 'INFO', color: '#33cc33' },
        ].map((s) => (
          <StatCard key={s.key} severity={s.key}>
            <StatLabel css={{ color: s.color }}>{s.label}</StatLabel>
            <StatNumber css={{ color: s.color }}>{summaryDisplay[s.key]}</StatNumber>
          </StatCard>
        ))}
      </StatRow>

      <ReportsCard>
        <SectionLabel>Recent reports</SectionLabel>
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
    </>
  );
}
