import { IconClose } from '../icons.jsx';
import { styled } from '../styles/theme.js';

const Overlay = styled('div', {
  position: 'fixed',
  inset: 0,
  zIndex: 200,
  background: 'rgba(5, 6, 10, 0.72)',
  display: 'grid',
  placeItems: 'center',
  padding: '$4',
});

const Dialog = styled('div', {
  width: 'min(480px, 100%)',
  maxHeight: 'min(80vh, 560px)',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '$md',
  border: '1px solid $borderStrong',
  background: '$panel',
  boxShadow: '0 24px 80px rgba(0,0,0,0.55)',
});

const Head = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '$3',
  padding: '$3 $4',
  borderBottom: '1px solid $borderStrong',
});

const Title = styled('h2', {
  margin: 0,
  fontSize: '$3',
});

const CloseBtn = styled('button', {
  all: 'unset',
  boxSizing: 'border-box',
  cursor: 'pointer',
  color: '$textMuted',
  padding: '$2',
  borderRadius: '$sm',
  display: 'grid',
  placeItems: 'center',
  '&:hover': { color: '$text', background: 'rgba(255,255,255,0.06)' },
});

const Body = styled('div', {
  padding: '$4',
  overflowY: 'auto',
  display: 'grid',
  gap: '$3',
  fontSize: '$2',
});

const Row = styled('div', {
  display: 'grid',
  gap: '$1',
});

const Grid = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: '$2',
});

const List = styled('ul', {
  margin: 0,
  paddingLeft: '18px',
  display: 'grid',
  gap: '$1',
  color: '$textMuted',
  lineHeight: 1.5,
});

const Label = styled('span', {
  fontSize: '0.65rem',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  color: '$textMuted',
});

const Mono = styled('pre', {
  margin: 0,
  padding: '$3',
  borderRadius: '$sm',
  background: '#05060a',
  border: '1px solid $borderStrong',
  fontFamily: '$mono',
  fontSize: '0.72rem',
  overflowX: 'auto',
});

export default function ReportModal({ report, onClose }) {
  if (!report) return null;

  return (
    <Overlay
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-modal-title"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <Dialog>
        <Head>
          <Title id="report-modal-title">Report {report.id}</Title>
          <CloseBtn type="button" aria-label="Close" onClick={onClose}>
            <IconClose />
          </CloseBtn>
        </Head>
        <Body>
          <Row>
            <Label>Date</Label>
            <span>{report.date}</span>
          </Row>
          <Row>
            <Label>Target URL</Label>
            <span css={{ wordBreak: 'break-all' }}>{report.target}</span>
          </Row>
          <Row>
            <Label>Risk band</Label>
            <span>{report.risk ?? '—'}</span>
          </Row>
          <Row>
            <Label>Score</Label>
            <span>{report.score ?? '—'}</span>
          </Row>
          <Grid>
            <Row>
              <Label>Asset Profile</Label>
              <span>{report.assetLabel ?? report.assetProfile ?? '—'}</span>
            </Row>
            <Row>
              <Label>Workflow Status</Label>
              <span>{report.workflowStatus ?? 'needs-review'}</span>
            </Row>
          </Grid>
          {report.phishingRisk ? (
            <Row>
              <Label>Phishing Risk</Label>
              <span>
                {report.phishingRisk.score}/100
                {report.phishingRisk.signals?.length ? ` · ${report.phishingRisk.signals.length} signals` : ''}
              </span>
            </Row>
          ) : null}
          {report.inventory ? (
            <Row>
              <Label>Attack Surface</Label>
              <List>
                <li>
                  Host: {report.inventory.hostname} {'->'} {report.inventory.finalHostname}
                </li>
                <li>{report.inventory.internetExposed ? 'Internet exposed' : 'Private / internal scope'}</li>
                <li>{report.inventory.authSurface ? 'Authentication-like surface observed' : 'No auth-like surface observed'}</li>
                {report.inventory.sensitivePaths?.slice(0, 3).map((path) => (
                  <li key={path}>Sensitive path: {path}</li>
                ))}
              </List>
            </Row>
          ) : null}
          {report.storyline?.length ? (
            <Row>
              <Label>Attack Path Storyline</Label>
              <List>
                {report.storyline.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </List>
            </Row>
          ) : null}
          {report.drift ? (
            <Row>
              <Label>Drift Detection</Label>
              <List>
                {report.drift.changes?.slice(0, 6).map((change) => (
                  <li key={change}>{change}</li>
                ))}
              </List>
            </Row>
          ) : null}
          <Row>
            <Label>Raw snapshot</Label>
            <Mono>{JSON.stringify(report, null, 2)}</Mono>
          </Row>
        </Body>
      </Dialog>
    </Overlay>
  );
}
