import { useEffect, useMemo, useState } from 'react';
import { designSummary, starterReports } from '../data/mockData.js';
import { analyzeTarget, buildReport } from '../lib/securityAnalysis.js';

const STORAGE_KEY = 'vigilantscan:reports';

function normalizeUrl(rawValue) {
  const value = rawValue.trim();

  if (!value) {
    throw new Error('Please enter a URL to analyze.');
  }

  try {
    return new URL(value).toString();
  } catch {
    try {
      return new URL(`https://${value}`).toString();
    } catch {
      throw new Error('The target URL is invalid. Example: https://example.com');
    }
  }
}

function delay(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function hydrateReports() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return starterReports;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : starterReports;
  } catch {
    return starterReports;
  }
}

export function useScan() {
  const [target, setTarget] = useState('');
  const [assetProfile, setAssetProfile] = useState('production');
  const [status, setStatus] = useState('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [logs, setLogs] = useState([
    'Scanner ready. Submit a target to begin a browser-based security analysis.',
  ]);
  const [findings, setFindings] = useState([]);
  const [reports, setReports] = useState([]);
  const [activeReport, setActiveReport] = useState(null);
  const [activeTarget, setActiveTarget] = useState('');
  const [storyline, setStoryline] = useState([]);
  const [inventory, setInventory] = useState(null);
  const [phishingRisk, setPhishingRisk] = useState(null);
  const [scanDiff, setScanDiff] = useState(null);

  useEffect(() => {
    setReports(hydrateReports());
  }, []);

  useEffect(() => {
    if (reports.length > 0) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
    }
  }, [reports]);

  const summary = useMemo(() => {
    if (findings.length === 0) {
      return designSummary;
    }

    return findings.reduce(
      (acc, finding) => {
        acc[finding.severity] += 1;
        return acc;
      },
      { critical: 0, warning: 0, info: 0, passed: 0 }
    );
  }, [findings]);

  const startScan = async () => {
    let normalizedUrl;

    try {
      normalizedUrl = normalizeUrl(target);
    } catch (validationError) {
      setError(validationError.message);
      setStatus('error');
      return;
    }

    setError('');
    setStatus('running');
    setProgress(6);
    setFindings([]);
    setStoryline([]);
    setInventory(null);
    setPhishingRisk(null);
    setScanDiff(null);
    setActiveReport(null);
    setActiveTarget(normalizedUrl);
    setLogs([`Target queued: ${normalizedUrl}`, `Asset profile: ${assetProfile}`]);

    try {
      const previousReport = reports.find((report) => report.target === normalizedUrl) || null;
      const analysis = await analyzeTarget(normalizedUrl, assetProfile);

      const totalLogs = analysis.logs.length;
      for (let i = 0; i < totalLogs; i += 1) {
        setLogs((previousLogs) => [...previousLogs, analysis.logs[i]]);
        setProgress(Math.min(78, Math.round(((i + 1) / totalLogs) * 78) + 8));
        await delay(220);
      }

      const report = buildReport({
        previousReport,
        targetUrl: normalizedUrl,
        assetProfile,
        analysis,
      });

      setProgress(92);
      await delay(180);

      setFindings(report.findings);
      setStoryline(report.storyline);
      setInventory(report.inventory);
      setPhishingRisk(report.phishingRisk);
      setScanDiff(report.drift);
      setActiveReport(report);
      setReports((previousReports) => [report, ...previousReports].slice(0, 18));
      setLogs((previousLogs) => [
        ...previousLogs,
        `Completed. Risk ${report.risk} · Score ${report.score} · ${report.findings.length} observations.`,
      ]);
      setProgress(100);
      setStatus('complete');
    } catch (scanError) {
      setError(scanError.message || 'Unable to complete the scan.');
      setLogs((previousLogs) => [
        ...previousLogs,
        `[FAILED] ${scanError.message || 'Unexpected scan failure'}`,
      ]);
      setProgress(0);
      setStatus('error');
    }
  };

  const resetScan = () => {
    setStatus('idle');
    setProgress(0);
    setError('');
    setActiveTarget('');
    setFindings([]);
    setStoryline([]);
    setInventory(null);
    setPhishingRisk(null);
    setScanDiff(null);
    setActiveReport(null);
    setLogs(['Scanner ready. Submit a target to begin a browser-based security analysis.']);
  };

  return {
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
  };
}
