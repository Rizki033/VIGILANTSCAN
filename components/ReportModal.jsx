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
          <Row>
            <Label>Raw snapshot</Label>
            <Mono>{JSON.stringify(report, null, 2)}</Mono>
          </Row>
        </Body>
      </Dialog>
    </Overlay>
  );
}
