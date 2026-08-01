/*
  Abstract placeholder art for project cards without real screenshots yet.
  Repainted to the "gradient folio" duotone — deep teal (#24A182) + coral
  (#ED2A03) on a near-black panel — so the cards sit in the same system as the
  rest of the site. Each is an on-brand abstract motif, NOT a real screenshot:
  swap for genuine product imagery when available (see design-brief-prompt.md).
*/

const INK = "#0F0F0F";
const PANEL = "#1A1A1A";
const TEAL = "#24A182";
const CORAL = "#ED2A03";
const LINE = "#2A2A2A";
const DIM = "#6B6A63";

export function LastActiveArt() {
  return (
    <svg viewBox="0 0 400 320" xmlns="http://www.w3.org/2000/svg" role="img"
      aria-label="Abstract representation of active, at risk, and inactive status states">
      <rect width="400" height="320" fill={INK} />
      <circle cx="120" cy="130" r="46" fill={TEAL} />
      <circle cx="230" cy="180" r="30" fill={CORAL} />
      <circle cx="310" cy="96" r="18" fill={DIM} />
      <rect x="60" y="240" width="280" height="8" rx="4" fill={LINE} />
      <rect x="60" y="240" width="150" height="8" rx="4" fill={TEAL} opacity="0.7" />
    </svg>
  );
}

export function FeatureTogglesArt() {
  return (
    <svg viewBox="0 0 400 320" xmlns="http://www.w3.org/2000/svg" role="img"
      aria-label="Abstract representation of layered organisation and group-level toggles">
      <defs>
        <linearGradient id="ft" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={TEAL} />
          <stop offset="100%" stopColor={CORAL} />
        </linearGradient>
      </defs>
      <rect width="400" height="320" fill={INK} />
      <rect x="46" y="70" width="308" height="52" rx="26" fill="url(#ft)" />
      <rect x="86" y="146" width="228" height="44" rx="22" fill={TEAL} opacity="0.4" />
      <rect x="126" y="214" width="148" height="36" rx="18" fill={LINE} />
      <circle cx="330" cy="96" r="10" fill={INK} />
    </svg>
  );
}

export function AdminHomeArt() {
  return (
    <svg viewBox="0 0 400 320" xmlns="http://www.w3.org/2000/svg" role="img"
      aria-label="Abstract sketch-style wireframe representing an in-progress home page concept">
      <rect width="400" height="320" fill={PANEL} />
      <g stroke={TEAL} strokeWidth="2" opacity="0.55" fill="none">
        <rect x="50" y="52" width="120" height="70" rx="8" />
        <rect x="190" y="52" width="160" height="70" rx="8" />
        <rect x="50" y="142" width="300" height="40" rx="8" />
        <rect x="50" y="202" width="140" height="70" rx="8" />
      </g>
      <circle cx="330" cy="232" r="30" fill={CORAL} />
    </svg>
  );
}

export function AudioBubblesArt() {
  return (
    <svg viewBox="0 0 400 320" xmlns="http://www.w3.org/2000/svg" role="img"
      aria-label="Abstract representation of compact, high-contrast interface bubbles">
      <rect width="400" height="320" fill={INK} />
      <circle cx="150" cy="160" r="60" fill="none" stroke={TEAL} strokeWidth="4" />
      <circle cx="150" cy="160" r="60" fill={TEAL} opacity="0.12" />
      <line x1="210" y1="160" x2="270" y2="160" stroke={DIM} strokeWidth="1" />
      <circle cx="290" cy="160" r="34" fill="none" stroke={CORAL} strokeWidth="4" />
    </svg>
  );
}

export function FiveWhysArt() {
  return (
    <svg viewBox="0 0 400 320" xmlns="http://www.w3.org/2000/svg" role="img"
      aria-label="Abstract concentric rings representing progressive disclosure of ideas">
      <rect width="400" height="320" fill={INK} />
      <circle cx="200" cy="160" r="132" fill="none" stroke={TEAL} strokeWidth="2" opacity="0.35" />
      <circle cx="200" cy="160" r="94" fill="none" stroke={TEAL} strokeWidth="2" opacity="0.6" />
      <circle cx="200" cy="160" r="56" fill="none" stroke={TEAL} strokeWidth="2" opacity="0.85" />
      <circle cx="200" cy="160" r="20" fill={CORAL} />
    </svg>
  );
}

export function MemorArt() {
  return (
    <svg viewBox="0 0 400 320" xmlns="http://www.w3.org/2000/svg" role="img"
      aria-label="Abstract calming gradient pattern for Memor">
      <defs>
        <linearGradient id="memor" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={TEAL} />
          <stop offset="100%" stopColor={CORAL} />
        </linearGradient>
      </defs>
      <rect width="400" height="320" fill={INK} />
      <circle cx="200" cy="160" r="110" fill="url(#memor)" opacity="0.85" />
      <circle cx="200" cy="160" r="66" fill={INK} opacity="0.55" />
    </svg>
  );
}

export function StoriArt() {
  return (
    <svg viewBox="0 0 400 320" xmlns="http://www.w3.org/2000/svg" role="img"
      aria-label="Abstract soft wave pattern for Stori">
      <rect width="400" height="320" fill={INK} />
      <path d="M0,180 C80,140 130,220 200,180 C270,140 320,220 400,180 L400,320 L0,320 Z"
        fill={TEAL} opacity="0.55" />
      <path d="M0,220 C80,190 130,250 200,220 C270,190 320,250 400,220 L400,320 L0,320 Z"
        fill={CORAL} opacity="0.4" />
    </svg>
  );
}

export function DissertationArt() {
  return (
    <svg viewBox="0 0 400 320" xmlns="http://www.w3.org/2000/svg" role="img"
      aria-label="Abstract geometric bar pattern representing gamification and progress">
      <rect width="400" height="320" fill={INK} />
      <rect x="60" y="200" width="40" height="60" rx="4" fill={DIM} />
      <rect x="128" y="150" width="40" height="110" rx="4" fill={TEAL} />
      <rect x="196" y="110" width="40" height="150" rx="4" fill={TEAL} opacity="0.7" />
      <rect x="264" y="80" width="40" height="180" rx="4" fill={CORAL} />
      <rect x="332" y="140" width="24" height="120" rx="4" fill={DIM} />
    </svg>
  );
}
