# VigilantScan — Website Security Scanner

> Production-grade DAST (Dynamic Application Security Testing) dashboard

---

## Screenshots

### Dashboard

![Dashboard preview](assets/images/Dashboard.png)

### Scans

![Scans preview](assets/images/Scans.png)

### Reports

![Reports preview](assets/images/Reports.png)

### Settings

![Settings preview](assets/images/Settings.png)

---

##  Project Structure

```
vigilantscan/
├── assets/
│   └── images/
│       ├── Dashboard.png
│       ├── Reports.png
│       ├── Scans.png
│       └── Settings.png
│
├── index.html
├── main.jsx                  ← ReactDOM entry point
├── App.jsx                   ← Root component + layout composition
├── styles/
│   └── theme.js              ← Design tokens and global styles
├── data/
│   └── mockData.js           ← Simulated dashboard data
├── hooks/
│   └── useScan.js            ← Scan simulation logic
├── components/
│   ├── ActivityChart.jsx
│   ├── NotificationPopover.jsx
│   ├── ReportModal.jsx
│   └── ThreatIntelBar.jsx
├── views/
│   ├── DashboardView.jsx
│   ├── ReportsView.jsx
│   ├── ScansView.jsx
│   └── SettingsView.jsx
├── ui/
│   └── shell.jsx             ← Shared shell layout
├── icons.jsx                 ← SVG icon set
├── package.json
└── vite.config.js
```

---

##  Vulnerability Severity System

| Level    | Use Case                           |
|----------|------------------------------------|
| CRITICAL | SQL Injection, RCE, exposed files  |
| WARNING  | Weak TLS, outdated versions        |
| INFO     | Best practice, missing headers     |
| PASSED   | Clean test result                  |

---

## License
MIT — Built with VigilantScan design system
