import { useState } from 'react';
import { styled } from '../styles/theme.js';
import { Muted, Panel, ViewShell, ViewTitle } from '../ui/shell.jsx';

const Row = styled('label', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '$3',
  padding: '$3',
  borderRadius: '$sm',
  border: '1px solid $borderStrong',
  background: 'rgba(0,0,0,0.2)',
  cursor: 'pointer',
  fontSize: '$2',
});

const Danger = styled('button', {
  marginTop: '$2',
  width: '100%',
  padding: '$3',
  borderRadius: '$sm',
  border: '1px solid rgba(255,77,77,0.35)',
  background: 'rgba(255,77,77,0.08)',
  color: '$critical',
  fontWeight: 700,
  cursor: 'pointer',
  '&:hover': { background: 'rgba(255,77,77,0.14)' },
});

export default function SettingsView({ onResetSession }) {
  const [blockRisky, setBlockRisky] = useState(true);
  const [telemetry, setTelemetry] = useState(false);

  return (
    <ViewShell>
      <ViewTitle>Settings</ViewTitle>
      <Muted>Workspace preferences for this demo console. Changes stay in the browser session only.</Muted>
      <Panel css={{ padding: '$3', display: 'grid', gap: '$2' }}>
        <Row>
          <span>Block risky host patterns client-side</span>
          <input
            type="checkbox"
            checked={blockRisky}
            onChange={(e) => setBlockRisky(e.target.checked)}
          />
        </Row>
        <Row>
          <span>Share anonymised telemetry</span>
          <input
            type="checkbox"
            checked={telemetry}
            onChange={(e) => setTelemetry(e.target.checked)}
          />
        </Row>
      </Panel>
      <Panel css={{ padding: '$3' }}>
        <Muted css={{ fontSize: '$1', marginBottom: '$2' }}>API key (mock)</Muted>
        <code css={{ fontSize: '$1', color: '$brand', wordBreak: 'break-all' }}>vs_live_••••••••••••9f2a</code>
      </Panel>
      <Danger type="button" onClick={onResetSession}>
        Clear session & reset scanner
      </Danger>
    </ViewShell>
  );
}
