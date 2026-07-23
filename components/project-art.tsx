/*
  Abstract placeholder art for project cards without real screenshots yet,
  ported 1:1 from the original static site (index.html). Swap for real
  screenshots when available — see design-brief-prompt.md.
*/

function PlaceholderLabel() {
  return (
    <span className="absolute bottom-2 left-2 rounded-full bg-foreground/70 px-2.5 py-1 text-[0.72rem] font-semibold text-white">
      Replace with real project image
    </span>
  );
}

export function LastActiveArt() {
  return (
    <svg
      viewBox="0 0 400 320"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Abstract representation of active, at risk, and inactive status states"
    >
      <defs>
        <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F2825C" />
          <stop offset="100%" stopColor="#FAF7F4" />
        </linearGradient>
      </defs>
      <rect width="400" height="320" fill="url(#g1)" />
      <circle cx="120" cy="120" r="46" fill="#1B1815" opacity="0.85" />
      <circle cx="230" cy="180" r="30" fill="#D4653C" opacity="0.9" />
      <circle cx="310" cy="90" r="18" fill="#1B1815" opacity="0.4" />
      <rect x="60" y="230" width="280" height="10" rx="5" fill="#1B1815" opacity="0.15" />
    </svg>
  );
}

export function FeatureTogglesArt() {
  return (
    <svg
      viewBox="0 0 400 320"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Abstract representation of layered organisation and group-level toggles"
    >
      <defs>
        <linearGradient id="g2" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1B1815" />
          <stop offset="100%" stopColor="#F2825C" />
        </linearGradient>
      </defs>
      <rect width="400" height="320" fill="#FAF7F4" />
      <rect x="40" y="60" width="320" height="60" rx="30" fill="url(#g2)" opacity="0.9" />
      <rect x="80" y="150" width="240" height="46" rx="23" fill="#F2825C" opacity="0.7" />
      <rect x="120" y="220" width="160" height="36" rx="18" fill="#1B1815" opacity="0.25" />
    </svg>
  );
}

export function AdminHomeArt() {
  return (
    <div className="relative h-full w-full">
      <svg
        viewBox="0 0 400 320"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Abstract sketch-style pattern representing an in-progress home page concept"
      >
        <rect width="400" height="320" fill="#F1ECE7" />
        <g stroke="#1B1815" strokeWidth="2" opacity="0.35" fill="none">
          <rect x="50" y="50" width="120" height="70" rx="8" />
          <rect x="190" y="50" width="160" height="70" rx="8" />
          <rect x="50" y="140" width="300" height="40" rx="8" />
          <rect x="50" y="200" width="140" height="70" rx="8" />
        </g>
        <circle cx="330" cy="230" r="34" fill="#F2825C" opacity="0.8" />
      </svg>
      <PlaceholderLabel />
    </div>
  );
}

export function AudioBubblesArt() {
  return (
    <svg
      viewBox="0 0 400 320"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Abstract representation of compact, high-contrast interface bubbles"
    >
      <rect width="400" height="320" fill="#FAF7F4" />
      <circle cx="150" cy="160" r="60" fill="none" stroke="#1B1815" strokeWidth="4" />
      <circle cx="150" cy="160" r="60" fill="#F2825C" opacity="0.15" />
      <line x1="210" y1="160" x2="270" y2="160" stroke="#1B1815" strokeWidth="1" />
      <circle cx="290" cy="160" r="34" fill="none" stroke="#D4653C" strokeWidth="4" />
    </svg>
  );
}

export function FiveWhysArt() {
  return (
    <div className="relative h-full w-full">
      <svg
        viewBox="0 0 400 320"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Abstract layered pattern representing progressive disclosure of ideas"
      >
        <rect width="400" height="320" fill="#1B1815" />
        <circle cx="200" cy="160" r="140" fill="none" stroke="#F2825C" strokeWidth="2" opacity="0.6" />
        <circle cx="200" cy="160" r="100" fill="none" stroke="#F2825C" strokeWidth="2" opacity="0.75" />
        <circle cx="200" cy="160" r="60" fill="none" stroke="#F2825C" strokeWidth="2" opacity="0.9" />
        <circle cx="200" cy="160" r="22" fill="#F2825C" />
      </svg>
      <PlaceholderLabel />
    </div>
  );
}

export function MemorArt() {
  return (
    <div className="relative h-full w-full">
      <svg
        viewBox="0 0 300 240"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Abstract calming gradient pattern for Memor"
      >
        <defs>
          <linearGradient id="memorG" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F2825C" />
            <stop offset="100%" stopColor="#1B1815" />
          </linearGradient>
        </defs>
        <rect width="300" height="240" fill="url(#memorG)" opacity="0.85" />
        <circle cx="150" cy="120" r="70" fill="#FAF7F4" opacity="0.15" />
        <text
          x="150"
          y="128"
          textAnchor="middle"
          fontFamily="sans-serif"
          fontSize="22"
          fill="#FAF7F4"
          fontWeight="700"
        >
          Memor
        </text>
      </svg>
      <PlaceholderLabel />
    </div>
  );
}

export function StoriArt() {
  return (
    <div className="relative h-full w-full">
      <svg
        viewBox="0 0 300 240"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Abstract soft wave pattern for Stori"
      >
        <rect width="300" height="240" fill="#F1ECE7" />
        <path
          d="M0,140 C60,110 100,170 150,140 C200,110 240,170 300,140 L300,240 L0,240 Z"
          fill="#F2825C"
          opacity="0.55"
        />
        <path
          d="M0,170 C60,150 100,190 150,170 C200,150 240,190 300,170 L300,240 L0,240 Z"
          fill="#1B1815"
          opacity="0.2"
        />
        <text
          x="150"
          y="80"
          textAnchor="middle"
          fontFamily="sans-serif"
          fontSize="22"
          fill="#1B1815"
          fontWeight="700"
        >
          Stori
        </text>
      </svg>
      <PlaceholderLabel />
    </div>
  );
}

export function DissertationArt() {
  return (
    <div className="relative h-full w-full">
      <svg
        viewBox="0 0 300 240"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Abstract geometric bar pattern representing gamification and progress"
      >
        <rect width="300" height="240" fill="#FAF7F4" />
        <rect x="40" y="160" width="30" height="50" fill="#1B1815" opacity="0.7" />
        <rect x="90" y="120" width="30" height="90" fill="#F2825C" opacity="0.85" />
        <rect x="140" y="80" width="30" height="130" fill="#1B1815" opacity="0.5" />
        <rect x="190" y="100" width="30" height="110" fill="#D4653C" opacity="0.85" />
        <rect x="240" y="60" width="30" height="150" fill="#1B1815" opacity="0.3" />
      </svg>
      <PlaceholderLabel />
    </div>
  );
}
