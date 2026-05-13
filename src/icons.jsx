export function IconShield(props) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <path
        d="M12 2.5l7 3.2v5.1c0 4.5-2.9 8.7-7 10.2-4.1-1.5-7-5.7-7-10.2V5.7l7-3.2z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M9.2 12.3l1.7 1.7 4.1-4.2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconBell(props) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <path
        d="M12 22a2 2 0 002-2H10a2 2 0 002 2zm6-6V11a6 6 0 10-12 0v5l-2 2h16l-2-2z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconRadar(props) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12 12l5.2-3M12 12V3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconClose(props) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

const stroke = { stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' };

export function NavIcon({ id }) {
  switch (id) {
    case 'dashboard':
      return (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M4 10.5L12 4l8 6.5V20H4v-9.5z" {...stroke} strokeLinejoin="round" />
        </svg>
      );
    case 'scans':
      return (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="11" cy="11" r="7" {...stroke} />
          <path d="M16 16l4 4" {...stroke} />
        </svg>
      );
    case 'reports':
      return (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M8 6h11M8 12h11M8 18h7" {...stroke} />
          <path d="M5 6h.01M5 12h.01M5 18h.01" {...stroke} strokeWidth={2} />
        </svg>
      );
    case 'settings':
      return (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="3" {...stroke} />
          <path
            d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
            {...stroke}
          />
        </svg>
      );
    default:
      return null;
  }
}
