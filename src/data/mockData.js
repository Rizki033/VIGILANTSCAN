export const navItems = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'scans', label: 'Scans' },
  { id: 'reports', label: 'Reports' },
  { id: 'settings', label: 'Settings' },
];

/** Shown on the dashboard cards until a scan produces real findings. */
export const designSummary = {
  critical: 17,
  warning: 29,
  info: 52,
};

export const monthActivity = [
  { month: 'Jan', scans: 4 },
  { month: 'Feb', scans: 7 },
  { month: 'Mar', scans: 5 },
  { month: 'Apr', scans: 9 },
  { month: 'May', scans: 12 },
  { month: 'Jun', scans: 8 },
  { month: 'Jul', scans: 14 },
  { month: 'Aug', scans: 11 },
];

export const featuredIdleFinding = {
  id: 'XSS-204',
  severity: 'critical',
  title: 'Critical: Cross-Site Scripting (XSS) at /search.php',
  detail:
    'User-controlled input in the search query is reflected in the HTML response without encoding, allowing script injection in victim browsers.',
  meta: 'Risk: Critical · Parameter: q · Method: GET',
  intel: { mitre: 'T1059.007', epss: 0.31, cve: 'CVE-2024-38473' },
  remediationCode: `<?php
// Sanitize output — never echo raw user input
echo htmlspecialchars($_GET['q'] ?? '', ENT_QUOTES, 'UTF-8');
?>`,
};

export const threatTickerItems = [
  'EPSS spike: CVE-2024-38473 now 0.31 in wild exploitation models',
  'CISA KEV: new vendor advisory on TLS renegotiation — patch within 48h',
  'MITRE T1190: internet-facing apps remain top initial access vector',
  'Honeytoken triggered: staging API key used from unexpected ASN',
  'Sigma rule hit: suspicious PowerShell encoded command (T1059.001)',
];

export const liveAlerts = [
  { id: 'a1', level: 'critical', text: 'New KEV entry matches your tech stack (OpenSSL)', ago: '3m' },
  { id: 'a2', level: 'warning', text: 'Certificate expiring in 9 days: api.partner.io', ago: '1h' },
  { id: 'a3', level: 'info', text: 'Policy sync completed — 12 controls unchanged', ago: '4h' },
];

export const scheduledScans = [
  { id: 'SCH-01', target: 'https://billing.internal', when: 'Daily · 02:00 UTC', mode: 'DAST' },
  { id: 'SCH-02', target: 'https://auth.service', when: 'Weekly · Mon', mode: 'SAST+SBOM' },
  { id: 'SCH-03', target: 'https://cdn.edge', when: 'On deploy', mode: 'Headers only' },
];

export const starterReports = [
  {
    id: 'RPT-8821',
    date: '2026-05-13',
    target: 'https://dans.com',
    status: 'critical',
    risk: 'High',
    score: 41,
  },
  {
    id: 'RPT-8820',
    date: '2026-05-12',
    target: 'https://api.partner.io',
    status: 'warning',
    risk: 'Medium',
    score: 68,
  },
  {
    id: 'RPT-8819',
    date: '2026-05-11',
    target: 'https://cdn.static.app',
    status: 'info',
    risk: 'Low',
    score: 91,
  },
];

export const stagedLogs = [
  '[BUSY] Resolving target and TLS metadata…',
  '[PASSED] DNS resolution stable',
  '[PASSED] Certificate chain valid',
  '[WARN] Missing Content-Security-Policy',
  '[FAILED] Critical! Reflected input at /search.php',
  '[BUSY] Correlating findings with CVE database…',
];

export const severityOrder = ['critical', 'warning', 'info', 'passed'];

export function buildFindings(targetUrl) {
  const url = new URL(targetUrl);
  const findings = [];
  const lowerTarget = targetUrl.toLowerCase();
  const suspiciousWords = ['login', 'verify', 'free', 'bank', 'secure'];

  if (url.protocol !== 'https:') {
    findings.push({
      id: 'TLS-001',
      severity: 'critical',
      title: 'Target is served without HTTPS',
      detail:
        'Requests travel without transport-layer encryption, which increases the chance of interception or tampering.',
      meta: 'Risk: Critical · Layer: Transport',
      remediationCode: `server {
  listen 443 ssl;
  return 301 https://$host$request_uri;
}`,
    });
  } else {
    findings.push({
      id: 'TLS-200',
      severity: 'passed',
      title: 'HTTPS is enabled',
      detail:
        'The scanner resolved the target over TLS and confirmed a secure scheme in the submitted URL.',
      meta: 'Risk: None · Layer: Transport',
      remediationCode: `# Maintain HSTS and automated cert renewal`,
    });
  }

  if (url.hostname.length > 24 || url.pathname.length > 20) {
    findings.push({
      id: 'URI-014',
      severity: 'warning',
      title: 'Long target shape deserves manual review',
      detail:
        'Unusually long hostnames or paths are common in phishing campaigns and can hide misleading strings.',
      meta: 'Risk: Medium · Pattern: URL shape',
      remediationCode: `# Review redirects and canonical hostnames`,
    });
  }

  suspiciousWords.forEach((word) => {
    if (lowerTarget.includes(word)) {
      findings.push({
        id: `KEY-${word.toUpperCase()}`,
        severity: word === 'bank' || word === 'verify' ? 'warning' : 'info',
        title: `Suspicious keyword detected: ${word}`,
        detail:
          'The keyword appears frequently in social-engineering pages and should be reviewed in context.',
        meta: `Risk: ${word === 'bank' ? 'Medium' : 'Low'} · Signal: keyword`,
        remediationCode: `# Validate branding and ownership out-of-band`,
      });
    }
  });

  if (url.pathname.includes('admin') || url.pathname.includes('backup')) {
    findings.push({
      id: 'PATH-031',
      severity: 'warning',
      title: 'Sensitive path naming pattern detected',
      detail:
        'Administrative or backup-like path names often expose attack surface that deserves stronger access controls.',
      meta: 'Risk: Medium · Path: sensitive naming',
      remediationCode: `# require auth + IP allowlist for admin routes`,
    });
  }

  if (findings.length < 3) {
    findings.push({
      id: 'HDR-101',
      severity: 'info',
      title: 'Security header audit recommended',
      detail:
        'This lightweight scan does not fetch headers deeply enough to confirm CSP, X-Frame-Options, or Referrer-Policy.',
      meta: 'Risk: Low · Coverage: headers',
      remediationCode: `add_header Content-Security-Policy "default-src 'self';" always;`,
    });
  }

  return findings.map((f) => ({
    ...f,
    intel: inferIntel(f),
  }));
}

function inferIntel(finding) {
  const id = finding.id;
  if (id.startsWith('TLS-0')) {
    return { mitre: 'T1071.001', epss: 0.62, cve: 'CVE-2023-44487' };
  }
  if (id.startsWith('TLS-2')) {
    return { mitre: 'M1041', epss: 0.02, cve: '—' };
  }
  if (id.startsWith('URI')) {
    return { mitre: 'T1566.002', epss: 0.18, cve: '—' };
  }
  if (id.startsWith('KEY')) {
    return { mitre: 'T1566.003', epss: 0.11, cve: '—' };
  }
  if (id.startsWith('PATH')) {
    return { mitre: 'T1190', epss: 0.27, cve: '—' };
  }
  if (id.startsWith('HDR')) {
    return { mitre: 'M1036', epss: 0.05, cve: '—' };
  }
  return { mitre: 'T1190', epss: 0.14, cve: '—' };
}

export function summarizeFindings(findings) {
  return findings.reduce(
    (summary, finding) => {
      summary[finding.severity] += 1;
      return summary;
    },
    { critical: 0, warning: 0, info: 0, passed: 0 }
  );
}

export function computeRisk(summary) {
  if (summary.critical > 0) {
    return 'High';
  }

  if (summary.warning > 1) {
    return 'Medium';
  }

  return 'Low';
}

export function riskToStatus(risk) {
  if (risk === 'High') return 'critical';
  if (risk === 'Medium') return 'warning';
  return 'info';
}

export function computeScore(summary) {
  const penalty =
    summary.critical * 25 + summary.warning * 12 + summary.info * 4;

  return Math.max(35, 100 - penalty);
}
