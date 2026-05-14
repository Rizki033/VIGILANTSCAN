import { threatTickerItems } from '../data/mockData.js';
import { styled, tickerMarquee } from '../styles/theme.js';

const Bar = styled('div', {
  borderBottom: '1px solid $borderStrong',
  background: 'rgba(10, 11, 20, 0.85)',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  minHeight: '28px',
  flexShrink: 0,
});

const Track = styled('div', {
  display: 'flex',
  gap: '$7',
  whiteSpace: 'nowrap',
  paddingLeft: '$4',
  animation: `${tickerMarquee} 42s linear infinite`,
});

const Item = styled('span', {
  fontSize: '0.68rem',
  color: '$textMuted',
  letterSpacing: '0.02em',
  '& strong': {
    color: '$brand',
    fontWeight: 600,
    marginRight: '6px',
  },
});

export default function ThreatIntelBar() {
  const doubled = [...threatTickerItems, ...threatTickerItems];
  return (
    <Bar role="status" aria-live="polite">
      <Track>
        {doubled.map((text, i) => (
          <Item key={`${i}-${text.slice(0, 12)}`}>
            <strong>LIVE INTEL</strong>
            {text}
          </Item>
        ))}
      </Track>
    </Bar>
  );
}
