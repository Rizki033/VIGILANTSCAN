# VigilantScan — Website Security Scanner

> Production-grade DAST (Dynamic Application Security Testing) dashboard

---

##  Project Structure

```
vigilantscan/
├── public/
│   ├── index.html
│   └── favicon.svg           # Shield icon
│
├── src/
│   ├── App.jsx               ← Root component + layout composition
│   ├── main.jsx              ← ReactDOM.createRoot entry point
│   │
│   ├── styles/
│   │   └── theme.js          ← Design tokens (colors, space, radii, fonts)
│   │
│   ├── data/
│   │   └── mockData.js       ← All static/simulated data (logs, vulns, reports)
│   │
│   ├── hooks/
│   │   └── useScan.js        ← Scan simulation + terminal scroll hooks
│   │
│   ├── lib/
│   │   └── utils.js          ← Helpers (formatDate, severityColor, etc.)
│   │
│   └── components/
│       ├── layout/
│       │   ├── Sidebar.jsx   ← Left navigation + system status
│       │   └── TopBar.jsx    ← Header: logo, search, bell, avatar
│       │
│       ├── dashboard/
│       │   ├── NewScanHero.jsx          ← URL input + START SCAN button
│       │   ├── VulnerabilitySummary.jsx ← Critical/Warning/Info score cards
│       │   └── RecentReports.jsx        ← Paginated reports table
│       │
│       ├── scan/
│       │   ├── Terminal.jsx      ← Live log window with progress bar
│       │   └── ActivityChart.jsx ← 24h bar chart (recharts)
│       │
│       ├── findings/
│       │   ├── FindingsPanel.jsx ← Right sidebar panel wrapper
│       │   └── FindingCard.jsx   ← Accordion card: probe + remediation
│       │
│       └── ui/
│           ├── Badge.jsx         ← Severity badge (Critical/Warning/Info/Passed)
│           ├── Card.jsx          ← Surface container with border
│           └── Icons.jsx         ← All SVG icon components
│
├── package.json
└── vite.config.js
```

---

##  Dependencies

| Package            | Purpose                          |
|--------------------|----------------------------------|
| `react`            | UI framework                     |
| `@stitches/react`  | CSS-in-JS with design tokens     |
| `recharts`         | Bar chart (Scan Activity 24H)    |
| `vite`             | Build tool + HMR dev server      |

---

## Design System (Stitches Tokens)

```js
// src/styles/theme.js
createStitches({
  theme: {
    colors: {
      bg:       '#080f1a',    // page background
      surface:  '#0f1c2e',    // card background
      brand:    '#3b82f6',    // primary blue
      critical: '#ef4444',    // red severity
      warning:  '#f59e0b',    // amber severity
      info:     '#10b981',    // green severity
    }
  }
})
```

---

## Key Components

### `<NewScanHero>`
- URL input with focus glow (`box-shadow: $brandGlow`)
- Animated radar icon during scan
- Calls `useScan()` hook on submit

### `<Terminal>`
- Scrolling monospace log window
- Color-coded statuses: PASSED/FAILED/WARN/BUSY
- Animated progress bar with glow

### `<FindingCard>`
- Expandable accordion
- Shows CVE id, description, probe payload, remediation
- Severity-based left border color

### `<ActivityChart>`
- Recharts `BarChart` with custom Cell colors
- Active hour highlighted in brand blue

---

##  Vulnerability Severity System

| Level    | Color     | Use Case                    |
|----------|-----------|-----------------------------|
| CRITICAL | `#ef4444` | SQL Injection, RCE, exposed files |
| WARNING  | `#f59e0b` | Weak TLS, outdated versions |
| INFO     | `#10b981` | Best practice, missing headers |
| PASSED   | `#10b981` | Clean test result           |

---

## License
MIT — Built with VigilantScan design system