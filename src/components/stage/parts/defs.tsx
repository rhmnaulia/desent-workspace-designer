/**
 * Shared gradients and patterns. Rendered once inside the stage; product
 * thumbnails reference the same IDs, so nothing is defined twice.
 */
export function StageDefs() {
  return (
    <defs>
      <linearGradient id="sky" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="var(--sky-top)" />
        <stop offset="1" stopColor="var(--sky-bottom)" />
      </linearGradient>
      <linearGradient id="window-light" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stopColor="var(--sun)" stopOpacity="0.5" />
        <stop offset="1" stopColor="var(--sun)" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="lamp-cone" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="var(--glow)" />
        <stop offset="1" stopColor="var(--glow)" stopOpacity="0" />
      </linearGradient>
      <radialGradient id="lamp-pool">
        <stop offset="0" stopColor="var(--glow)" />
        <stop offset="1" stopColor="var(--glow)" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="floor-lamp-bar" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#f3d9e4" />
        <stop offset="1" stopColor="#f7e3c4" />
      </linearGradient>
      <radialGradient id="floor-lamp-halo">
        <stop offset="0" stopColor="rgb(255 170 150 / 0.75)" />
        <stop offset="0.5" stopColor="rgb(240 140 170 / 0.3)" />
        <stop offset="1" stopColor="rgb(240 140 170 / 0)" />
      </radialGradient>
      <pattern id="weave" width="8" height="8" patternUnits="userSpaceOnUse">
        <rect width="8" height="8" fill="#d8ac74" />
        <path d="M0 4h8M4 0v8" stroke="#9a6a35" strokeWidth="1" opacity="0.55" />
      </pattern>
      <pattern id="mesh-charcoal" width="6" height="6" patternUnits="userSpaceOnUse">
        <rect width="6" height="6" fill="#4b4d54" />
        <path d="M0 6L6 0" stroke="#26272b" strokeWidth="0.8" opacity="0.5" />
      </pattern>
      <pattern id="mesh-forest" width="6" height="6" patternUnits="userSpaceOnUse">
        <rect width="6" height="6" fill="#3f524b" />
        <path d="M0 6L6 0" stroke="#1f2a26" strokeWidth="0.8" opacity="0.5" />
      </pattern>
    </defs>
  );
}
