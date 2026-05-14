import { liveAlerts } from '../data/mockData.js';
import { styled } from '../styles/theme.js';

const Pop = styled('div', {
  position: 'absolute',
  right: 0,
  top: 'calc(100% + 8px)',
  width: 'min(320px, 92vw)',
  maxHeight: 'min(360px, 50vh)',
  overflowY: 'auto',
  borderRadius: '$md',
  border: '1px solid $borderStrong',
  background: '$panel',
  boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
  zIndex: 50,
});

const Item = styled('div', {
  padding: '$3 $4',
  borderBottom: '1px solid $borderStrong',
  fontSize: '$2',
  '&:last-child': { borderBottom: 'none' },
});

const Level = styled('span', {
  fontSize: '0.65rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  marginRight: '$2',
  variants: {
    level: {
      critical: { color: '$critical' },
      warning: { color: '$warning' },
      info: { color: '$info' },
    },
  },
});

const Ago = styled('span', {
  float: 'right',
  fontSize: '$1',
  color: '$textMuted',
});

const AlertBody = styled('div', {
  marginTop: '$2',
  color: '$text',
  lineHeight: 1.45,
});

const CloseBtn = styled('button', {
  all: 'unset',
  display: 'block',
  width: '100%',
  textAlign: 'center',
  cursor: 'pointer',
  color: '$brand',
  fontSize: '$1',
  fontWeight: 600,
  padding: '$2',
  '&:hover': { textDecoration: 'underline' },
});

export default function NotificationPopover({ open, onClose }) {
  if (!open) return null;

  return (
    <Pop
      role="menu"
      aria-label="Notifications"
      onMouseDown={(e) => e.stopPropagation()}
    >
      {liveAlerts.map((a) => (
        <Item key={a.id}>
          <div>
            <Level level={a.level}>{a.level}</Level>
            <Ago>{a.ago}</Ago>
          </div>
          <AlertBody>{a.text}</AlertBody>
        </Item>
      ))}
      <Item>
        <CloseBtn type="button" onClick={onClose}>
          Close
        </CloseBtn>
      </Item>
    </Pop>
  );
}
