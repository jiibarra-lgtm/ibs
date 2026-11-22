"use client";

/** Íconos de línea (estilo lucide) + piezas de UI del panel */
const P: Record<string, string> = {
  box: "M21 8 12 3 3 8v8l9 5 9-5V8ZM3 8l9 5 9-5M12 13v8",
  list: "M4 6h16M4 12h10M4 18h7",
  gift: "M20 12v9H4v-9M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7Zm0 0h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7Z",
  dollar: "M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
  tag: "M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L2 12V2h10l8.6 8.6a2 2 0 0 1 0 2.8ZM7 7h.01",
  home: "M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5Z",
  megaphone: "M3 11v2a1 1 0 0 0 1 1h3l5 4V6L7 10H4a1 1 0 0 0-1 1ZM16 8a5 5 0 0 1 0 8M19 5a9 9 0 0 1 0 14",
  window: "M3 5h18v14H3zM3 9h18M7 13h6",
  star: "m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1L12 2Z",
  palette: "M12 22a10 10 0 1 1 10-10c0 2.8-2.2 4-4 4h-2a2 2 0 0 0-1.5 3.3A2 2 0 0 1 12 22ZM7.5 10.5h.01M10.5 6.5h.01M15.5 7.5h.01M17.5 11.5h.01",
  users: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8",
  quote: "M3 21c3 0 7-1 7-8V5H3v8h4c0 4-2 6-4 6v2Zm11 0c3 0 7-1 7-8V5h-7v8h4c0 4-2 6-4 6v2Z",
  image: "M3 3h18v18H3zM8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM21 15l-5-5L5 21",
  receipt: "M4 2v20l3-2 3 2 3-2 3 2 3-2 1 1V2l-1 1-3-2-3 2-3-2-3 2-3-2ZM8 7h8M8 11h8M8 15h5",
  chart: "M3 3v18h18M7 16v-5M12 16V8M17 16v-3",
  user: "M20 21a8 8 0 1 0-16 0M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z",
  gear: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z",
  grid: "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z",
  menu: "M4 6h16M4 12h16M4 18h16",
  x: "M18 6 6 18M6 6l12 12",
  download: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3",
  external: "M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",
  plus: "M12 5v14M5 12h14",
  trash: "M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6",
  up: "m18 15-6-6-6 6",
  down: "m6 9 6 6 6-6",
  help: "M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z",
};

export function Icon({ n, size = 20 }: { n: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={P[n] ?? P.box} />
    </svg>
  );
}

export function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} className={`ad-sw ${on ? "on" : ""}`} onClick={() => onChange(!on)}><i /></button>
  );
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="ad-field">
      <span>{label}</span>
      {children}
      {hint && <small>{hint}</small>}
    </label>
  );
}

export function Card({ title, desc, right, children }: { title?: string; desc?: string; right?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="ad-card">
      {(title || right) && (
        <header className="ad-card-h">
          <div>{title && <h3>{title}</h3>}{desc && <p>{desc}</p>}</div>
          {right}
        </header>
      )}
      {children}
    </section>
  );
}

export function Row({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="ad-row">
      <div><b>{label}</b>{desc && <small>{desc}</small>}</div>
      {children}
    </div>
  );
}

export function PageHead({ title, desc, children }: { title: string; desc?: string; children?: React.ReactNode }) {
  return (
    <header className="ad-head">
      <div><h1>{title}</h1>{desc && <p>{desc}</p>}</div>
      {children && <div className="ad-head-act">{children}</div>}
    </header>
  );
}
