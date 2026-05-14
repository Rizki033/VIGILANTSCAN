import { useEffect, useMemo, useState } from 'react';
import { designSummary, featuredIdleFinding, navItems } from './data/mockData.js';
import { useScan } from './hooks/useScan.js';
import { createJsonExport, createSarifExport, getAssetProfiles } from './lib/securityAnalysis.js';
import { styled } from './styles/theme.js';
import { IconBell, IconShield, NavIcon } from './icons.jsx';
import ThreatIntelBar from './components/ThreatIntelBar.jsx';
import ReportModal from './components/ReportModal.jsx';
import NotificationPopover from './components/NotificationPopover.jsx';
import DashboardView from './views/DashboardView.jsx';
import ScansView from './views/ScansView.jsx';
import ReportsView from './views/ReportsView.jsx';
import SettingsView from './views/SettingsView.jsx';

const Page = styled('main', {
  position: 'relative',
  height: '100%',
  overflow: 'hidden',
  width: '100%',
});

const AppFrame = styled('div', {
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  minHeight: 0,
});

const TopBar = styled('header', {
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '$3',
  height: '48px',
  padding: '0 $4',
  borderBottom: '1px solid $borderStrong',
  background: 'linear-gradient(180deg, rgba(26, 28, 46, 0.96), rgba(15, 16, 26, 0.98))',
});

const BrandRow = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '$2',
});

const BrandMark = styled('div', {
  width: '34px',
  height: '34px',
  borderRadius: '$sm',
  background: 'linear-gradient(145deg, rgba(77, 97, 252, 0.32), rgba(77, 97, 252, 0.08))',
  border: '1px solid rgba(77, 97, 252, 0.3)',
  display: 'grid',
  placeItems: 'center',
  color: '#a8b4ff',
});

const BrandTitle = styled('span', {
  fontWeight: 700,
  fontSize: '$4',
  letterSpacing: '0.04em',
});

const TopBarRight = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '$3',
});

const BellWrap = styled('div', {
  position: 'relative',
});

const IconButton = styled('button', {
  width: '36px',
  height: '36px',
  borderRadius: '$sm',
  border: '1px solid $borderStrong',
  background: 'rgba(255,255,255,0.03)',
  color: '$textMuted',
  display: 'grid',
  placeItems: 'center',
  cursor: 'pointer',
  '&:hover': {
    background: 'rgba(77, 97, 252, 0.12)',
    color: '$text',
  },
});

const UserPill = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '$2',
  padding: '2px 10px 2px 2px',
  borderRadius: '$pill',
  border: '1px solid $borderStrong',
  background: 'rgba(18, 20, 31, 0.92)',
});

const UserAvatar = styled('div', {
  width: '30px',
  height: '30px',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #4d61fc, #7c8cff)',
  color: '#fff',
  display: 'grid',
  placeItems: 'center',
  fontWeight: 700,
  fontSize: '$1',
});

const UserName = styled('div', {
  fontWeight: 600,
  fontSize: '$2',
  lineHeight: 1.15,
});

const UserSub = styled('div', {
  fontSize: '0.68rem',
  color: '$textMuted',
  lineHeight: 1.15,
});

const Fill = styled('div', {
  flex: 1,
  minHeight: 0,
  overflow: 'hidden',
  display: 'grid',
  gridTemplateColumns: '196px minmax(0, 1fr)',
});

const Sidebar = styled('aside', {
  borderRight: '1px solid $borderStrong',
  background: 'linear-gradient(180deg, #12141f 0%, #0e1018 100%)',
  padding: '$3 $2',
  display: 'flex',
  flexDirection: 'column',
  gap: '$2',
  minHeight: 0,
});

const NavList = styled('nav', {
  display: 'grid',
  gap: '$2',
});

const NavItem = styled('button', {
  all: 'unset',
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'center',
  gap: '$2',
  padding: '$2 $2',
  borderRadius: '$sm',
  color: '$textMuted',
  cursor: 'pointer',
  fontSize: '$2',
  fontWeight: 500,
  border: '1px solid transparent',
  '&:hover': {
    background: 'rgba(77, 97, 252, 0.08)',
    color: '$text',
  },
  '&[data-active="true"]': {
    background: 'rgba(77, 97, 252, 0.18)',
    color: '$text',
    borderColor: 'rgba(77, 97, 252, 0.2)',
    boxShadow: 'inset 3px 0 0 $brand',
  },
});

const MainColumn = styled('div', {
  display: 'grid',
  gridTemplateRows: 'auto 1fr',
  minWidth: 0,
  minHeight: 0,
  overflow: 'hidden',
});

const WorkspaceMain = styled('div', {
  display: 'grid',
  minHeight: 0,
  overflow: 'hidden',
  variants: {
    aside: {
      true: { gridTemplateColumns: 'minmax(0, 1fr) 272px' },
      false: { gridTemplateColumns: '1fr' },
    },
  },
  defaultVariants: {
    aside: false,
  },
});

const Content = styled('div', {
  padding: '$3 $4',
  display: 'flex',
  flexDirection: 'column',
  gap: '$2',
  minWidth: 0,
  minHeight: 0,
  overflow: 'hidden',
});

const FindingsAside = styled('aside', {
  borderLeft: '1px solid $borderStrong',
  background: 'linear-gradient(180deg, #12141f 0%, #0a0b14 100%)',
  padding: '$3',
  display: 'flex',
  flexDirection: 'column',
  gap: '$2',
  minWidth: 0,
  minHeight: 0,
  overflow: 'hidden',
});

const AsideTitle = styled('h2', {
  margin: 0,
  fontSize: '$3',
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  flexShrink: 0,
});

const FindingBlock = styled('div', {
  display: 'grid',
  gap: '$2',
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
});

const FindingTitle = styled('h3', {
  margin: 0,
  fontSize: '$2',
  fontWeight: 700,
  lineHeight: 1.35,
});

const CodeBlock = styled('pre', {
  margin: 0,
  padding: '$3',
  borderRadius: '$sm',
  background: '#05060a',
  border: '1px solid $borderStrong',
  fontFamily: '$mono',
  fontSize: '0.68rem',
  lineHeight: 1.55,
  color: '#b8c4e8',
  overflowX: 'auto',
});

const DownloadBtn = styled('button', {
  flexShrink: 0,
  width: '100%',
  minHeight: '40px',
  border: 'none',
  borderRadius: '$sm',
  fontWeight: 700,
  fontSize: '$2',
  cursor: 'pointer',
  color: '#fff',
  background: 'linear-gradient(135deg, $accent, #636eff)',
  boxShadow: '0 4px 16px rgba(77, 97, 252, 0.35)',
  '&:hover': { filter: 'brightness(1.05)' },
});

const IntelRow = styled('div', {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '$2',
});

const Chip = styled('span', {
  fontSize: '0.65rem',
  fontWeight: 600,
  padding: '2px 8px',
  borderRadius: '$pill',
  border: '1px solid $borderStrong',
  background: 'rgba(77,97,252,0.1)',
  color: '$text',
});

const CarouselNav = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '$2',
  flexShrink: 0,
});

const CarouselBtn = styled('button', {
  border: '1px solid $borderStrong',
  background: 'rgba(255,255,255,0.04)',
  color: '$text',
  borderRadius: '$sm',
  padding: '$1 $2',
  fontSize: '$1',
  cursor: 'pointer',
  '&:disabled': { opacity: 0.35, cursor: 'not-allowed' },
});

const Dots = styled('div', {
  display: 'flex',
  gap: '6px',
  alignItems: 'center',
});

const Dot = styled('button', {
  width: '7px',
  height: '7px',
  borderRadius: '50%',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
  variants: {
    active: {
      true: { background: '$brand', boxShadow: '0 0 8px $brandGlow' },
      false: { background: 'rgba(255,255,255,0.22)' },
    },
  },
  defaultVariants: { active: false },
});

const Muted = styled('p', {
  margin: 0,
  color: '$textMuted',
  fontSize: '$1',
  lineHeight: 1.5,
});

const SectionCard = styled('div', {
  display: 'grid',
  gap: '$1',
  padding: '$2',
  borderRadius: '$sm',
  border: '1px solid $borderStrong',
  background: 'rgba(255,255,255,0.03)',
});

const MiniList = styled('ul', {
  margin: 0,
  paddingLeft: '18px',
  display: 'grid',
  gap: '$1',
  color: '$textMuted',
  fontSize: '$1',
  lineHeight: 1.5,
});

function titleColor(severity) {
  if (severity === 'critical') return '#ff4d4d';
  if (severity === 'warning') return '#ff9933';
  if (severity === 'info' || severity === 'passed') return '#33cc33';
  return '#f0f2fa';
}

function downloadTextReport(text, target, extension) {
  const blob = new Blob(
    [text],
    { type: extension === 'sarif' ? 'application/sarif+json' : 'application/json' }
  );
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `vigilantscan-report-${target || 'scan'}-${Date.now()}.${extension}`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function App() {
  const [view, setView] = useState('dashboard');
  const [notifOpen, setNotifOpen] = useState(false);
  const [reportModal, setReportModal] = useState(null);
  const [findingIndex, setFindingIndex] = useState(0);

  const {
    target,
    setTarget,
    assetProfile,
    setAssetProfile,
    status,
    progress,
    error,
    logs,
    findings,
    summary,
    reports,
    activeReport,
    activeTarget,
    storyline,
    inventory,
    phishingRisk,
    scanDiff,
    startScan,
    resetScan,
  } = useScan();

  const assetProfiles = useMemo(() => getAssetProfiles(), []);

  const summaryDisplay = findings.length > 0 ? summary : designSummary;

  const findingList = useMemo(
    () => (findings.length > 0 ? findings : [featuredIdleFinding]),
    [findings]
  );

  useEffect(() => {
    setFindingIndex(0);
  }, [findings]);

  const safeIndex = Math.min(findingIndex, Math.max(findingList.length - 1, 0));
  const featured = findingList[safeIndex] || featuredIdleFinding;

  const barPercent =
    status === 'running'
      ? progress
      : status === 'complete'
        ? 100
        : findings.length > 0
          ? 100
          : 72;

  const showAside = view === 'dashboard' || view === 'scans';

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setNotifOpen(false);
        setReportModal(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const queueScan = (url) => {
    setTarget(url);
    setView('dashboard');
  };

  const intel = featured.intel || { mitre: '—', epss: 0, cve: '—' };
  const reportForExport = activeReport || reportModal;

  return (
    <Page>
      <AppFrame>
        <TopBar>
          <BrandRow>
            <BrandMark>
              <IconShield />
            </BrandMark>
            <BrandTitle>VIGILANTSCAN</BrandTitle>
          </BrandRow>

          <TopBarRight>
            <BellWrap>
              <IconButton
                type="button"
                aria-label="Notifications"
                aria-expanded={notifOpen}
                onClick={() => setNotifOpen((o) => !o)}
              >
                <IconBell />
              </IconButton>
              <NotificationPopover open={notifOpen} onClose={() => setNotifOpen(false)} />
            </BellWrap>
            <UserPill>
              <UserAvatar>P</UserAvatar>
              <div>
                <UserName>0xRizki</UserName>
                <UserSub>Standard Plan</UserSub>
              </div>
            </UserPill>
          </TopBarRight>
        </TopBar>

        <Fill>
          <Sidebar>
            <NavList>
              {navItems.map((item) => (
                <NavItem
                  key={item.id}
                  type="button"
                  data-active={view === item.id}
                  onClick={() => setView(item.id)}
                >
                  <NavIcon id={item.id} />
                  {item.label}
                </NavItem>
              ))}
            </NavList>
          </Sidebar>

          <MainColumn>
            <ThreatIntelBar />
            <WorkspaceMain aside={showAside}>
              <Content>
                {view === 'dashboard' && (
                  <DashboardView
                    target={target}
                    setTarget={setTarget}
                    assetProfile={assetProfile}
                    setAssetProfile={setAssetProfile}
                    assetProfiles={assetProfiles}
                    status={status}
                    progress={progress}
                    error={error}
                    logs={logs}
                    summaryDisplay={summaryDisplay}
                    reports={reports}
                    activeTarget={activeTarget}
                    startScan={startScan}
                    barPercent={barPercent}
                    onReportAction={(r) => setReportModal(r)}
                  />
                )}
                {view === 'scans' && (
                  <ScansView
                    onQueueScan={queueScan}
                    onOpenDashboard={() => setView('dashboard')}
                  />
                )}
                {view === 'reports' && (
                  <ReportsView reports={reports} onReportAction={(r) => setReportModal(r)} />
                )}
                {view === 'settings' && (
                  <SettingsView
                    onResetSession={() => {
                      resetScan();
                      setView('dashboard');
                    }}
                  />
                )}
              </Content>

              {showAside ? (
                <FindingsAside>
                  <AsideTitle>Detailed findings</AsideTitle>
                  <IntelRow>
                    <Chip>MITRE {intel.mitre}</Chip>
                    <Chip>EPSS {typeof intel.epss === 'number' ? intel.epss.toFixed(2) : intel.epss}</Chip>
                    <Chip>{intel.cve}</Chip>
                    {inventory?.internetExposed !== undefined ? (
                      <Chip>{inventory.internetExposed ? 'Internet exposed' : 'Private scope'}</Chip>
                    ) : null}
                  </IntelRow>
                  {findingList.length > 1 ? (
                    <CarouselNav>
                      <CarouselBtn
                        type="button"
                        disabled={safeIndex <= 0}
                        onClick={() => setFindingIndex((i) => Math.max(0, i - 1))}
                      >
                        Prev
                      </CarouselBtn>
                      <Dots>
                        {findingList.map((f, i) => (
                          <Dot
                            key={f.id}
                            type="button"
                            aria-label={`Finding ${i + 1}`}
                            active={i === safeIndex}
                            onClick={() => setFindingIndex(i)}
                          />
                        ))}
                      </Dots>
                      <CarouselBtn
                        type="button"
                        disabled={safeIndex >= findingList.length - 1}
                        onClick={() => setFindingIndex((i) => Math.min(findingList.length - 1, i + 1))}
                      >
                        Next
                      </CarouselBtn>
                    </CarouselNav>
                  ) : null}
                  <FindingBlock>
                    <FindingTitle css={{ color: titleColor(featured.severity) }}>{featured.title}</FindingTitle>
                    {featured.meta ? (
                      <Muted css={{ color: '$text' }}>{featured.meta}</Muted>
                    ) : null}
                    <Muted>{featured.detail}</Muted>
                    <CodeBlock>{featured.remediationCode || featured.remediation || ''}</CodeBlock>
                    {storyline.length > 0 ? (
                      <SectionCard>
                        <SectionLabel>Attack Path Storyline</SectionLabel>
                        <MiniList>
                          {storyline.map((step) => (
                            <li key={step}>{step}</li>
                          ))}
                        </MiniList>
                      </SectionCard>
                    ) : null}
                    {inventory ? (
                      <SectionCard>
                        <SectionLabel>Attack Surface</SectionLabel>
                        <Muted>
                          Host {inventory.hostname} {'->'} {inventory.finalHostname}
                        </Muted>
                        <Muted>
                          {inventory.authSurface ? 'Authentication-like surface detected' : 'No auth-like surface observed'}
                        </Muted>
                        {inventory.sensitivePaths.length > 0 ? (
                          <MiniList>
                            {inventory.sensitivePaths.map((item) => (
                              <li key={item}>Sensitive path signal: {item}</li>
                            ))}
                          </MiniList>
                        ) : null}
                      </SectionCard>
                    ) : null}
                    {phishingRisk ? (
                      <SectionCard>
                        <SectionLabel>Phishing / Brand Abuse</SectionLabel>
                        <Muted>Score {phishingRisk.score}/100</Muted>
                        {phishingRisk.signals.length > 0 ? (
                          <MiniList>
                            {phishingRisk.signals.slice(0, 4).map((signal) => (
                              <li key={signal}>{signal}</li>
                            ))}
                          </MiniList>
                        ) : (
                          <Muted>No strong phishing-style signals observed in this scan.</Muted>
                        )}
                      </SectionCard>
                    ) : null}
                    {scanDiff ? (
                      <SectionCard>
                        <SectionLabel>Drift Detection</SectionLabel>
                        <Muted>{scanDiff.summary}</Muted>
                        <MiniList>
                          {scanDiff.changes.slice(0, 4).map((change) => (
                            <li key={change}>{change}</li>
                          ))}
                        </MiniList>
                      </SectionCard>
                    ) : null}
                  </FindingBlock>
                  <DownloadBtn
                    type="button"
                    onClick={() => {
                      if (!reportForExport) {
                        downloadTextReport(
                          JSON.stringify(
                            {
                              generated: new Date().toISOString(),
                              target: activeTarget || target,
                              findings: findings.length ? findings : [featured],
                            },
                            null,
                            2
                          ),
                          activeTarget || target || 'scan',
                          'json'
                        );
                        return;
                      }

                      downloadTextReport(
                        createJsonExport(reportForExport),
                        reportForExport.target || activeTarget || target || 'scan',
                        'json'
                      );
                    }}
                  >
                    Download JSON Report
                  </DownloadBtn>
                  {reportForExport ? (
                    <DownloadBtn
                      type="button"
                      onClick={() =>
                        downloadTextReport(
                          createSarifExport(reportForExport),
                          reportForExport.target || activeTarget || target || 'scan',
                          'sarif'
                        )
                      }
                    >
                      Export SARIF
                    </DownloadBtn>
                  ) : null}
                </FindingsAside>
              ) : null}
            </WorkspaceMain>
          </MainColumn>
        </Fill>
      </AppFrame>

      <ReportModal report={reportModal} onClose={() => setReportModal(null)} />
    </Page>
  );
}
