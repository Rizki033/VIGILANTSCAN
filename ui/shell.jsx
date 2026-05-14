import { pulse, styled } from '../styles/theme.js';

export const Panel = styled('div', {
  background: 'linear-gradient(180deg, rgba(34, 36, 54, 0.92), rgba(26, 28, 46, 0.96))',
  border: '1px solid $borderStrong',
  borderRadius: '$md',
  boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
});

export const SectionLabel = styled('span', {
  fontSize: '0.68rem',
  fontWeight: 600,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: '$textMuted',
});

export const Muted = styled('p', {
  margin: 0,
  color: '$textMuted',
  fontSize: '$2',
  lineHeight: 1.55,
});

export const ViewTitle = styled('h1', {
  margin: 0,
  fontSize: '$4',
  fontWeight: 700,
});

export const ViewShell = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$3',
  minHeight: 0,
  flex: 1,
  overflow: 'hidden',
});

export const ScrollBox = styled('div', {
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
  overflowX: 'hidden',
});

export const NewScanCard = styled(Panel, {
  padding: '$3 $4',
  display: 'grid',
  gap: '$3',
  flexShrink: 0,
});

export const ScanRow = styled('div', {
  display: 'flex',
  gap: '$2',
  alignItems: 'stretch',
});

export const UrlInput = styled('input', {
  flex: 1,
  minWidth: 0,
  minHeight: '40px',
  borderRadius: '$sm',
  border: '1px solid rgba(77, 97, 252, 0.28)',
  background: '$bgMuted',
  color: '$text',
  padding: '0 $3',
  fontSize: '$2',
  outline: 'none',
  '&::placeholder': {
    color: '#5c6378',
  },
  '&:focus': {
    borderColor: '$brand',
    boxShadow: '0 0 0 2px rgba(77, 97, 252, 0.18)',
  },
});

export const StartButton = styled('button', {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '$2',
  minHeight: '40px',
  padding: '0 $4',
  border: 'none',
  borderRadius: '$sm',
  fontWeight: 700,
  fontSize: '$2',
  cursor: 'pointer',
  color: '#fff',
  background: 'linear-gradient(135deg, $accent, #636eff)',
  boxShadow: '0 4px 18px rgba(77, 97, 252, 0.4)',
  animation: `${pulse} 2.6s infinite`,
  transition: 'transform 0.15s, filter 0.15s',
  flexShrink: 0,
  '&:hover': {
    transform: 'translateY(-1px)',
    filter: 'brightness(1.05)',
  },
  '&:disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
    transform: 'none',
    animation: 'none',
  },
});

export const InlineError = styled('p', {
  margin: 0,
  color: '$critical',
  fontSize: '$1',
});

export const ProgressCard = styled(Panel, {
  padding: '$3 $4',
  display: 'grid',
  gridTemplateRows: 'auto auto auto minmax(0, 1fr) auto',
  gap: '$2',
  flex: 1,
  minHeight: 0,
  overflow: 'hidden',
});

export const ProgressHead = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'baseline',
  gap: '$2',
  flexShrink: 0,
});

export const ProgressTitle = styled('h2', {
  margin: 0,
  fontSize: '$3',
  fontWeight: 700,
});

export const ProgressPct = styled('span', {
  fontWeight: 700,
  color: '$brand',
  fontSize: '$5',
});

export const ProgressWrap = styled('div', {
  height: '6px',
  borderRadius: '$pill',
  background: 'rgba(255,255,255,0.06)',
  overflow: 'hidden',
  flexShrink: 0,
});

export const ProgressBar = styled('div', {
  height: '100%',
  borderRadius: '$pill',
  background: 'linear-gradient(90deg, #4d61fc, #7c8cff)',
  transition: 'width 240ms ease',
  boxShadow: '0 0 10px rgba(77, 97, 252, 0.5)',
});

export const ChartWrap = styled('div', {
  height: '120px',
  flexShrink: 0,
  minHeight: 0,
});

export const Terminal = styled('div', {
  minHeight: 0,
  flex: 1,
  overflowY: 'auto',
  padding: '$3',
  borderRadius: '$sm',
  background: '#05060a',
  border: '1px solid rgba(255,255,255,0.06)',
  fontFamily: '$mono',
  fontSize: '0.72rem',
  lineHeight: 1.65,
});

export const TerminalLine = styled('div', {
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
});

export const StatRow = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: '$2',
  flexShrink: 0,
});

export const StatCard = styled('div', {
  padding: '$3',
  borderRadius: '$md',
  background: '$panel',
  border: '1px solid $borderStrong',
  display: 'grid',
  gap: '$1',
  textAlign: 'center',
  variants: {
    severity: {
      critical: {
        borderColor: 'rgba(255, 77, 77, 0.4)',
        boxShadow: '0 0 16px rgba(255, 77, 77, 0.08)',
      },
      warning: {
        borderColor: 'rgba(255, 153, 51, 0.4)',
        boxShadow: '0 0 14px rgba(255, 153, 51, 0.06)',
      },
      info: {
        borderColor: 'rgba(51, 204, 51, 0.35)',
        boxShadow: '0 0 14px rgba(51, 204, 51, 0.06)',
      },
    },
  },
});

export const StatLabel = styled('div', {
  fontSize: '0.65rem',
  fontWeight: 700,
  letterSpacing: '0.1em',
});

export const StatNumber = styled('div', {
  fontSize: '1.45rem',
  fontWeight: 800,
  lineHeight: 1,
});

export const ReportsCard = styled(Panel, {
  padding: '$3 $4',
  display: 'flex',
  flexDirection: 'column',
  minHeight: 0,
  flex: '0 0 min(30vh, 200px)',
  overflow: 'hidden',
});

export const Table = styled('div', {
  marginTop: '$2',
  borderRadius: '$sm',
  border: '1px solid $borderStrong',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: 0,
});

export const TableHead = styled('div', {
  display: 'grid',
  gridTemplateColumns: '0.9fr 1.6fr 0.75fr 72px',
  gap: '$2',
  padding: '$2 $3',
  background: 'rgba(0,0,0,0.28)',
  fontSize: '0.65rem',
  fontWeight: 600,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: '$textMuted',
  flexShrink: 0,
});

export const TableBody = styled('div', {
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
});

export const TableRow = styled('div', {
  display: 'grid',
  gridTemplateColumns: '0.9fr 1.6fr 0.75fr 72px',
  gap: '$2',
  padding: '$2 $3',
  alignItems: 'center',
  fontSize: '$1',
  borderTop: '1px solid $borderStrong',
  background: 'rgba(18, 20, 31, 0.45)',
});

export const StatusPill = styled('span', {
  display: 'inline-flex',
  justifyContent: 'center',
  padding: '2px 8px',
  borderRadius: '$pill',
  fontSize: '0.65rem',
  fontWeight: 600,
  width: 'fit-content',
  variants: {
    status: {
      critical: {
        background: 'rgba(255, 77, 77, 0.15)',
        color: '$critical',
      },
      warning: {
        background: 'rgba(255, 153, 51, 0.15)',
        color: '$warning',
      },
      info: {
        background: 'rgba(51, 204, 51, 0.12)',
        color: '$info',
      },
    },
  },
});

export const TableAction = styled('button', {
  padding: '4px 10px',
  borderRadius: '$pill',
  border: 'none',
  fontWeight: 600,
  fontSize: '0.65rem',
  cursor: 'pointer',
  color: '#fff',
  background: '$brand',
  boxShadow: '0 2px 10px rgba(77, 97, 252, 0.35)',
  '&:hover': {
    filter: 'brightness(1.08)',
  },
});

export const EmptyChart = styled('div', {
  padding: '$4',
  textAlign: 'center',
  color: '$textMuted',
  fontSize: '$2',
});
