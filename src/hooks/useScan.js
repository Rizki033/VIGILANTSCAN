import { useEffect, useMemo, useRef, useState } from 'react';
import {
  buildFindings,
  computeRisk,
  computeScore,
  riskToStatus,
  stagedLogs,
  starterReports,
  summarizeFindings,
} from '../data/mockData.js';

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

function createReport(normalizedUrl, summary) {
  const reportNumber = `RPT-${Math.floor(Date.now() / 1000)
    .toString()
    .slice(-4)}`;
  const risk = computeRisk(summary);

  return {
    id: reportNumber,
    date: new Date().toLocaleDateString('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }),
    target: normalizedUrl,
    status: riskToStatus(risk),
    risk,
    score: computeScore(summary),
  };
}

export function useScan() {
  const [target, setTarget] = useState('');
  const [status, setStatus] = useState('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [logs, setLogs] = useState([
    'Scanner ready. Submit a target to begin passive analysis.',
  ]);
  const [findings, setFindings] = useState([]);
  const [reports, setReports] = useState(starterReports);
  const [activeTarget, setActiveTarget] = useState('');
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, []);

  const summary = useMemo(() => summarizeFindings(findings), [findings]);

  const startScan = () => {
    let normalizedUrl;

    try {
      normalizedUrl = normalizeUrl(target);
    } catch (validationError) {
      setError(validationError.message);
      setStatus('error');
      return;
    }

    if (timerRef.current) {
      window.clearInterval(timerRef.current);
    }

    setError('');
    setStatus('running');
    setProgress(0);
    setFindings([]);
    setActiveTarget(normalizedUrl);
    setLogs([`Target queued: ${normalizedUrl}`]);

    const generatedFindings = buildFindings(normalizedUrl);
    const completedSummary = summarizeFindings(generatedFindings);
    const totalSteps = stagedLogs.length;
    let currentStep = 0;

    timerRef.current = window.setInterval(() => {
      const nextStep = stagedLogs[currentStep];

      setLogs((previousLogs) => [...previousLogs, nextStep]);
      currentStep += 1;
      setProgress(Math.round((currentStep / totalSteps) * 100));

      if (currentStep >= totalSteps) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;

        setTimeout(() => {
          setFindings(generatedFindings);
          setLogs((previousLogs) => [
            ...previousLogs,
            `Completed. ${generatedFindings.length} observations recorded.`,
          ]);
          setReports((previousReports) => [
            createReport(normalizedUrl, completedSummary),
            ...previousReports,
          ]);
          setStatus('complete');
        }, 250);
      }
    }, 450);
  };

  const resetScan = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setStatus('idle');
    setProgress(0);
    setError('');
    setActiveTarget('');
    setFindings([]);
    setLogs(['Scanner ready. Submit a target to begin passive analysis.']);
  };

  return {
    target,
    setTarget,
    status,
    progress,
    error,
    logs,
    findings,
    summary,
    reports,
    activeTarget,
    startScan,
    resetScan,
  };
}
