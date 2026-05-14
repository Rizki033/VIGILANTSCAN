const SUSPICIOUS_KEYWORDS = ['login', 'verify', 'free', 'bank', 'secure', 'wallet', 'signin'];
const SENSITIVE_SEGMENTS = ['admin', 'backup', 'console', 'internal', 'auth', 'api', 'dashboard'];
const PRIVATE_HOST_PATTERNS = [
  /^localhost$/i,
  /^127\./,
  /^10\./,
  /^192\.168\./,
  /^172\.(1[6-9]|2\d|3[0-1])\./,
  /\.local$/i,
  /\.internal$/i,
];

const ASSET_PROFILES = {
  production: { label: 'Production', weight: 18 },
  staging: { label: 'Staging', weight: 8 },
  authentication: { label: 'Authentication', weight: 16 },
  payment: { label: 'Payment', weight: 20 },
  internal: { label: 'Internal', weight: 10 },
};

function makeFinding({
  id,
  severity,
  title,
  detail,
  meta,
  remediationCode,
  intel,
  workflow = 'needs-review',
}) {
  return {
    id,
    severity,
    title,
    detail,
    meta,
    remediationCode,
    intel: intel || { mitre: '—', epss: 0, cve: '—' },
    workflow,
  };
}

function inferIntel(id) {
  if (id.startsWith('HDR-CSP')) return { mitre: 'T1059.007', epss: 0.31, cve: '—' };
  if (id.startsWith('HDR-HSTS')) return { mitre: 'T1557', epss: 0.22, cve: '—' };
  if (id.startsWith('HDR-XFO')) return { mitre: 'T1185', epss: 0.17, cve: '—' };
  if (id.startsWith('TLS')) return { mitre: 'T1040', epss: 0.28, cve: '—' };
  if (id.startsWith('PHISH')) return { mitre: 'T1566.002', epss: 0.24, cve: '—' };
  if (id.startsWith('PATH')) return { mitre: 'T1190', epss: 0.27, cve: '—' };
  if (id.startsWith('COOKIE')) return { mitre: 'T1539', epss: 0.15, cve: '—' };
  if (id.startsWith('CORS')) return { mitre: 'T1190', epss: 0.1, cve: '—' };
  return { mitre: 'T1190', epss: 0.14, cve: '—' };
}

function isPrivateHost(hostname) {
  return PRIVATE_HOST_PATTERNS.some((pattern) => pattern.test(hostname));
}

function hasIpAddressHost(hostname) {
  return /^\d{1,3}(\.\d{1,3}){3}$/.test(hostname);
}

function normalizeHeaderValue(value) {
  if (!value) return '';
  return value.trim();
}

function severityPenalty(severity) {
  if (severity === 'critical') return 24;
  if (severity === 'warning') return 10;
  if (severity === 'info') return 4;
  return 0;
}

function summarizeFindings(findings) {
  return findings.reduce(
    (summary, finding) => {
      summary[finding.severity] += 1;
      return summary;
    },
    { critical: 0, warning: 0, info: 0, passed: 0 }
  );
}

function computeScore({ findings, assetProfile, phishingScore, internetExposed, authSurface }) {
  const basePenalty = findings.reduce((total, finding) => total + severityPenalty(finding.severity), 0);
  const assetWeight = ASSET_PROFILES[assetProfile]?.weight ?? 10;
  const contextPenalty =
    Math.round(phishingScore / 7) +
    assetWeight +
    (internetExposed ? 8 : 0) +
    (authSurface ? 10 : 0);

  return Math.max(18, 100 - basePenalty - contextPenalty);
}

function computeRiskBand({ findings, phishingScore, assetProfile, internetExposed, authSurface }) {
  const summary = summarizeFindings(findings);
  const assetWeight = ASSET_PROFILES[assetProfile]?.weight ?? 10;

  if (
    summary.critical > 0 ||
    phishingScore >= 75 ||
    (internetExposed && authSurface && assetWeight >= 16 && summary.warning > 1)
  ) {
    return 'High';
  }

  if (summary.warning > 1 || phishingScore >= 45 || assetWeight >= 16) {
    return 'Medium';
  }

  return 'Low';
}

function riskToStatus(risk) {
  if (risk === 'High') return 'critical';
  if (risk === 'Medium') return 'warning';
  return 'info';
}

function collectSuspiciousKeywords(text) {
  const lower = text.toLowerCase();
  return SUSPICIOUS_KEYWORDS.filter((word) => lower.includes(word));
}

function buildPhishingSignals(url, finalUrl, html) {
  const hostname = url.hostname.toLowerCase();
  const finalHostname = finalUrl.hostname.toLowerCase();
  const textCorpus = [url.toString(), finalUrl.toString(), html].filter(Boolean).join(' ').toLowerCase();
  const keywords = collectSuspiciousKeywords(textCorpus);
  const signals = [];
  let score = 0;

  if (hostname.includes('xn--') || finalHostname.includes('xn--')) {
    signals.push('Punycode / homoglyph-like hostname');
    score += 30;
  }

  if (hasIpAddressHost(hostname)) {
    signals.push('Direct IP address used as host');
    score += 22;
  }

  if ((hostname.match(/-/g) || []).length >= 3) {
    signals.push('Hostname contains many hyphens');
    score += 10;
  }

  if (url.pathname.length > 20 || hostname.length > 24) {
    signals.push('Long URL shape often used in phishing chains');
    score += 10;
  }

  if (keywords.length > 0) {
    signals.push(`Sensitive keywords detected: ${keywords.join(', ')}`);
    score += Math.min(26, keywords.length * 6);
  }

  if (finalHostname !== hostname) {
    signals.push(`Redirect chain changed host from ${hostname} to ${finalHostname}`);
    score += 14;
  }

  if (html && /type=["']password["']/i.test(html)) {
    signals.push('Password input present in accessible HTML');
    score += 10;
  }

  return {
    score: Math.min(100, score),
    signals,
    keywords,
  };
}

function inferAttackSurface(url, finalUrl, headers, html, phishing) {
  const pathSegments = url.pathname
    .split('/')
    .map((segment) => segment.trim())
    .filter(Boolean);

  const sensitivePaths = pathSegments.filter((segment) =>
    SENSITIVE_SEGMENTS.some((candidate) => segment.toLowerCase().includes(candidate))
  );

  const discoveredEndpoints = [];

  if (html) {
    const hrefMatches = html.match(/href=["']([^"'#?]+)["']/gi) || [];
    hrefMatches.slice(0, 8).forEach((match) => {
      const value = match.replace(/href=["']|["']/gi, '');
      if (value.startsWith('/')) {
        discoveredEndpoints.push(value);
      }
    });
  }

  return {
    hostname: url.hostname,
    finalHostname: finalUrl.hostname,
    internetExposed: !isPrivateHost(finalUrl.hostname),
    authSurface:
      phishing.keywords.includes('login') ||
      phishing.keywords.includes('signin') ||
      /auth|login|signin|account/i.test(`${url.pathname} ${html || ''}`),
    sensitivePaths,
    suspiciousKeywords: phishing.keywords,
    discoveredEndpoints: Array.from(new Set(discoveredEndpoints)).slice(0, 8),
    serverBanner: normalizeHeaderValue(headers.get('server')) || 'Unavailable',
  };
}

function buildStoryline(findings, context) {
  const steps = [];
  const has = (idStart) => findings.some((finding) => finding.id.startsWith(idStart));

  if (has('HDR-CSP')) {
    steps.push('Missing or weak CSP weakens browser-side script containment');
  }

  if (has('HDR-XFO')) {
    steps.push('Lack of frame protections increases clickjacking exposure');
  }

  if (has('PHISH')) {
    steps.push('Phishing-like URL signals can increase user trust abuse and credential capture risk');
  }

  if (context.authSurface) {
    steps.push('Authentication-like surface raises the blast radius of any client-side weakness');
  }

  if (has('PATH')) {
    steps.push('Sensitive path naming suggests higher-value endpoints for enumeration');
  }

  if (has('HDR-HSTS') || has('TLS')) {
    steps.push('Transport controls should be hardened to reduce downgrade and interception opportunities');
  }

  if (steps.length === 0) {
    steps.push('No clear exploit chain observed; continue hardening and monitor for drift.');
  } else {
    steps.push('Combined exposure points to session theft, account takeover, or recon-assisted follow-on abuse.');
  }

  return steps;
}

function diffHeaders(previousHeaders, nextHeaders) {
  const changes = [];
  const allKeys = new Set([...Object.keys(previousHeaders || {}), ...Object.keys(nextHeaders || {})]);

  allKeys.forEach((key) => {
    const prev = previousHeaders?.[key] || '';
    const next = nextHeaders?.[key] || '';

    if (prev && !next) {
      changes.push(`Header removed: ${key}`);
    } else if (!prev && next) {
      changes.push(`Header added: ${key}`);
    } else if (prev !== next) {
      changes.push(`Header changed: ${key}`);
    }
  });

  return changes;
}

export function diffReports(previousReport, nextReport) {
  if (!previousReport) {
    return {
      hasDrift: false,
      summary: 'No previous scan available for drift comparison.',
      changes: ['Baseline established with this first observed scan.'],
    };
  }

  const previousIds = new Set((previousReport.findings || []).map((finding) => finding.id));
  const nextIds = new Set((nextReport.findings || []).map((finding) => finding.id));
  const changes = [];

  (nextReport.findings || []).forEach((finding) => {
    if (!previousIds.has(finding.id)) {
      changes.push(`New finding: ${finding.id} ${finding.title}`);
    }
  });

  (previousReport.findings || []).forEach((finding) => {
    if (!nextIds.has(finding.id)) {
      changes.push(`Resolved finding: ${finding.id} ${finding.title}`);
    }
  });

  diffHeaders(previousReport.headersObserved, nextReport.headersObserved).forEach((change) => {
    changes.push(change);
  });

  if (previousReport.phishingRisk?.score !== nextReport.phishingRisk?.score) {
    changes.push(
      `Phishing score ${previousReport.phishingRisk?.score ?? 0} -> ${nextReport.phishingRisk?.score ?? 0}`
    );
  }

  if (changes.length === 0) {
    changes.push('No meaningful security drift detected between the last two scans.');
  }

  return {
    hasDrift: changes.some((change) => !change.startsWith('Resolved finding')),
    summary: changes[0],
    changes,
  };
}

export async function analyzeTarget(targetUrl, assetProfile = 'production') {
  const url = new URL(targetUrl);
  const findings = [];
  const logs = [
    `[BUSY] Resolving target ${url.hostname}`,
    `[BUSY] Inspecting HTTP response headers`,
  ];
  let response = null;
  let html = '';
  let finalUrl = url;
  let fetchError = null;

  try {
    response = await fetch(url.toString(), {
      method: 'GET',
      redirect: 'follow',
      headers: {
        Accept: 'text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8',
      },
    });
    finalUrl = new URL(response.url || url.toString());
    html = (await response.text()).slice(0, 12000);
    logs.push(`[PASSED] Response received with status ${response.status}`);
  } catch (error) {
    fetchError = error;
    logs.push('[WARN] Browser could not fetch the target directly (likely CORS or network policy)');
  }

  if (url.protocol !== 'https:') {
    findings.push(
      makeFinding({
        id: 'TLS-001',
        severity: 'critical',
        title: 'Target is submitted over HTTP',
        detail:
          'The requested URL is not using HTTPS. Credentials, session material, or content could be intercepted or modified in transit.',
        meta: 'Risk: Critical · Layer: Transport',
        remediationCode: `server {
  listen 80;
  return 301 https://$host$request_uri;
}`,
        intel: inferIntel('TLS-001'),
      })
    );
  } else {
    findings.push(
      makeFinding({
        id: 'TLS-200',
        severity: 'passed',
        title: 'HTTPS is enabled',
        detail: 'The target URL uses TLS for transport.',
        meta: 'Risk: None · Layer: Transport',
        remediationCode: '# Maintain certificate renewal and HSTS coverage',
        intel: inferIntel('TLS-200'),
        workflow: 'fixed',
      })
    );
  }

  const phishing = buildPhishingSignals(url, finalUrl, html);
  const authSurface =
    phishing.keywords.includes('login') ||
    phishing.keywords.includes('signin') ||
    phishing.keywords.includes('verify');

  if (phishing.score >= 45) {
    findings.push(
      makeFinding({
        id: 'PHISH-201',
        severity: phishing.score >= 75 ? 'critical' : 'warning',
        title: `Phishing / brand abuse score is elevated (${phishing.score}/100)`,
        detail:
          phishing.signals.join(' · ') ||
          'Multiple URL and content signals indicate a page that deserves manual brand-abuse review.',
        meta: `Risk: ${phishing.score >= 75 ? 'Critical' : 'Medium'} · Signals: ${phishing.signals.length}`,
        remediationCode: '# Review domain ownership, redirects, favicon, branding, and content provenance',
        intel: inferIntel('PHISH-201'),
      })
    );
  }

  SENSITIVE_SEGMENTS.forEach((segment) => {
    if (url.pathname.toLowerCase().includes(segment)) {
      findings.push(
        makeFinding({
          id: `PATH-${segment.toUpperCase()}`,
          severity: 'warning',
          title: `Sensitive path pattern detected: ${segment}`,
          detail:
            'Administrative, backup, API, or authentication path names increase the value of the endpoint for attackers and deserve stronger hardening.',
          meta: `Risk: Medium · Path segment: ${segment}`,
          remediationCode: '# Require auth, rate limiting, and route-specific monitoring for sensitive endpoints',
          intel: inferIntel('PATH-001'),
        })
      );
    }
  });

  const headersObserved = {};

  if (response) {
    response.headers.forEach((value, key) => {
      headersObserved[key] = value;
    });

    const headerChecks = [
      {
        key: 'content-security-policy',
        missingSeverity: 'warning',
        missingId: 'HDR-CSP-001',
        missingTitle: 'Content-Security-Policy header missing',
        missingDetail:
          'Without CSP, a script injection bug is more likely to become a working browser compromise path.',
        remediationCode: `Content-Security-Policy: default-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'`,
      },
      {
        key: 'strict-transport-security',
        missingSeverity: url.protocol === 'https:' ? 'warning' : 'info',
        missingId: 'HDR-HSTS-001',
        missingTitle: 'HSTS header missing',
        missingDetail:
          'HTTPS is present, but browsers are not instructed to pin secure transport for future visits.',
        remediationCode: 'Strict-Transport-Security: max-age=31536000; includeSubDomains; preload',
      },
      {
        key: 'x-frame-options',
        missingSeverity: 'warning',
        missingId: 'HDR-XFO-001',
        missingTitle: 'X-Frame-Options header missing',
        missingDetail:
          'Absent frame restrictions may increase clickjacking exposure on sensitive pages.',
        remediationCode: 'X-Frame-Options: DENY',
      },
      {
        key: 'referrer-policy',
        missingSeverity: 'info',
        missingId: 'HDR-REF-001',
        missingTitle: 'Referrer-Policy header missing',
        missingDetail:
          'Referrer leakage can disclose sensitive paths or tokens to third-party origins.',
        remediationCode: 'Referrer-Policy: strict-origin-when-cross-origin',
      },
      {
        key: 'permissions-policy',
        missingSeverity: 'info',
        missingId: 'HDR-PERM-001',
        missingTitle: 'Permissions-Policy header missing',
        missingDetail:
          'A missing policy leaves browser features more broadly available to application code than necessary.',
        remediationCode: 'Permissions-Policy: camera=(), microphone=(), geolocation=()',
      },
      {
        key: 'x-content-type-options',
        missingSeverity: 'info',
        missingId: 'HDR-CTO-001',
        missingTitle: 'X-Content-Type-Options header missing',
        missingDetail:
          'Absent nosniff protection can expand MIME confusion risk in some browser contexts.',
        remediationCode: 'X-Content-Type-Options: nosniff',
      },
    ];

    headerChecks.forEach((check) => {
      const value = normalizeHeaderValue(response.headers.get(check.key));
      if (!value) {
        findings.push(
          makeFinding({
            id: check.missingId,
            severity: check.missingSeverity,
            title: check.missingTitle,
            detail: check.missingDetail,
            meta: `Risk: ${check.missingSeverity === 'warning' ? 'Medium' : 'Low'} · Header: ${check.key}`,
            remediationCode: check.remediationCode,
            intel: inferIntel(check.missingId),
          })
        );
      } else {
        findings.push(
          makeFinding({
            id: `PASS-${check.key.toUpperCase()}`,
            severity: 'passed',
            title: `${check.key} observed`,
            detail: `Observed header value: ${value}`,
            meta: `Risk: None · Header: ${check.key}`,
            remediationCode: `# Keep ${check.key} under config management`,
            intel: inferIntel(`PASS-${check.key.toUpperCase()}`),
            workflow: 'fixed',
          })
        );
      }
    });

    if (!response.headers.get('set-cookie')) {
      findings.push(
        makeFinding({
          id: 'COOKIE-OBS-001',
          severity: 'info',
          title: 'Cookie flag analysis is limited in a browser-only scan',
          detail:
            'Fetch does not expose Set-Cookie to frontend JavaScript. To verify Secure / HttpOnly / SameSite on cross-origin apps, route traffic through a backend proxy or scanner worker.',
          meta: 'Risk: Low · Coverage gap: cookies',
          remediationCode: '# Add a backend collector to inspect Set-Cookie attributes server-side',
          intel: inferIntel('COOKIE-OBS-001'),
        })
      );
    }
  } else {
    findings.push(
      makeFinding({
        id: 'CORS-OBS-001',
        severity: 'info',
        title: 'Direct header collection was blocked',
        detail:
          'The browser could not fetch the target directly. This often means CORS, firewalling, or private-network access restrictions are in place.',
        meta: 'Risk: Low · Coverage gap: direct response inspection',
        remediationCode: '# Use a scanning backend, proxy, or same-origin worker for full header and certificate coverage',
        intel: inferIntel('CORS-OBS-001'),
      })
    );
  }

  const inventory = inferAttackSurface(url, finalUrl, response?.headers || new Headers(), html, phishing);
  const storyline = buildStoryline(findings, inventory);

  logs.push(
    inventory.internetExposed
      ? '[PASSED] Target appears internet-exposed'
      : '[WARN] Target looks private or internally scoped'
  );
  logs.push(
    phishing.score >= 45
      ? `[WARN] Phishing / brand-abuse heuristics elevated (${phishing.score}/100)`
      : `[PASSED] Phishing heuristics low (${phishing.score}/100)`
  );
  logs.push(`[BUSY] ${storyline[0]}`);
  logs.push(
    fetchError
      ? '[WARN] TLS certificate depth is unavailable from a browser-only scan'
      : '[INFO] TLS certificate expiry and weak cipher checks still require a backend scanner'
  );

  return {
    findings,
    logs,
    headersObserved,
    inventory,
    phishingRisk: phishing,
    storyline,
    network: {
      reachable: Boolean(response),
      finalUrl: finalUrl.toString(),
      statusCode: response?.status ?? null,
      fetchError: fetchError?.message || null,
    },
    assetProfile,
    authSurface,
  };
}

export function buildReport({
  previousReport,
  targetUrl,
  assetProfile,
  analysis,
}) {
  const id = `RPT-${Math.floor(Date.now() / 1000).toString().slice(-5)}`;
  const risk = computeRiskBand({
    findings: analysis.findings,
    phishingScore: analysis.phishingRisk.score,
    assetProfile,
    internetExposed: analysis.inventory.internetExposed,
    authSurface: analysis.authSurface,
  });
  const score = computeScore({
    findings: analysis.findings,
    assetProfile,
    phishingScore: analysis.phishingRisk.score,
    internetExposed: analysis.inventory.internetExposed,
    authSurface: analysis.authSurface,
  });

  const report = {
    id,
    date: new Date().toLocaleDateString('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }),
    generatedAt: new Date().toISOString(),
    target: targetUrl,
    assetProfile,
    assetLabel: ASSET_PROFILES[assetProfile]?.label ?? assetProfile,
    status: riskToStatus(risk),
    risk,
    score,
    summary: summarizeFindings(analysis.findings),
    findings: analysis.findings,
    headersObserved: analysis.headersObserved,
    phishingRisk: analysis.phishingRisk,
    inventory: analysis.inventory,
    storyline: analysis.storyline,
    network: analysis.network,
    workflowStatus: 'needs-review',
  };

  report.drift = diffReports(previousReport, report);
  return report;
}

export function createJsonExport(report) {
  return JSON.stringify(report, null, 2);
}

export function createSarifExport(report) {
  const sarif = {
    version: '2.1.0',
    $schema: 'https://json.schemastore.org/sarif-2.1.0.json',
    runs: [
      {
        tool: {
          driver: {
            name: 'VigilantScan',
            version: '1.0.0',
            informationUri: 'https://example.invalid/vigilantscan',
            rules: report.findings.map((finding) => ({
              id: finding.id,
              shortDescription: { text: finding.title },
              fullDescription: { text: finding.detail },
              properties: {
                severity: finding.severity,
                mitre: finding.intel?.mitre,
                epss: finding.intel?.epss,
              },
            })),
          },
        },
        results: report.findings
          .filter((finding) => finding.severity !== 'passed')
          .map((finding) => ({
            ruleId: finding.id,
            level:
              finding.severity === 'critical'
                ? 'error'
                : finding.severity === 'warning'
                  ? 'warning'
                  : 'note',
            message: {
              text: `${finding.title}. ${finding.detail}`,
            },
            locations: [
              {
                physicalLocation: {
                  artifactLocation: {
                    uri: report.target,
                  },
                },
              },
            ],
          })),
      },
    ],
  };

  return JSON.stringify(sarif, null, 2);
}

export function getAssetProfiles() {
  return Object.entries(ASSET_PROFILES).map(([value, config]) => ({
    value,
    label: config.label,
  }));
}
