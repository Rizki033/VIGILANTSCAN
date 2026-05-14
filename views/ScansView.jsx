import { scheduledScans } from '../data/mockData.js';
import { styled } from '../styles/theme.js';
import { Muted, Panel, ScrollBox, SectionLabel, ViewShell, ViewTitle } from '../ui/shell.jsx';

const Row = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '$3',
  padding: '$3',
  borderBottom: '1px solid $borderStrong',
  fontSize: '$2',
  '&:last-child': { borderBottom: 'none' },
});

const Meta = styled('div', {
  display: 'grid',
  gap: '$1',
  minWidth: 0,
});

const Actions = styled('div', {
  display: 'flex',
  gap: '$2',
  flexShrink: 0,
});

const Btn = styled('button', {
  border: '1px solid $borderStrong',
  background: 'rgba(77,97,252,0.12)',
  color: '$text',
  borderRadius: '$sm',
  padding: '$2 $3',
  fontSize: '$1',
  fontWeight: 600,
  cursor: 'pointer',
  '&:hover': { background: 'rgba(77,97,252,0.22)' },
});

const Primary = styled('button', {
  border: 'none',
  background: '$brand',
  color: '#fff',
  borderRadius: '$sm',
  padding: '$2 $3',
  fontSize: '$1',
  fontWeight: 600,
  cursor: 'pointer',
  boxShadow: '0 2px 10px rgba(77,97,252,0.35)',
  '&:hover': { filter: 'brightness(1.06)' },
});

export default function ScansView({ onQueueScan, onOpenDashboard }) {
  return (
    <ViewShell>
      <ViewTitle>Scans</ViewTitle>
      <Muted>Manage recurring assessments and jump back to the live scanner when you need an ad-hoc run.</Muted>
      <SectionLabel css={{ marginTop: '$1' }}>Scheduled</SectionLabel>
      <Panel css={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <ScrollBox>
          {scheduledScans.map((row) => (
            <Row key={row.id}>
              <Meta>
                <strong>{row.id}</strong>
                <span css={{ color: '$textMuted', fontSize: '$1', wordBreak: 'break-all' }}>{row.target}</span>
                <span css={{ color: '$textMuted', fontSize: '$1' }}>
                  {row.when} · {row.mode}
                </span>
              </Meta>
              <Actions>
                <Btn type="button" onClick={() => onQueueScan(row.target)}>
                  Queue URL
                </Btn>
                <Primary type="button" onClick={onOpenDashboard}>
                  Open scanner
                </Primary>
              </Actions>
            </Row>
          ))}
        </ScrollBox>
      </Panel>
    </ViewShell>
  );
}
