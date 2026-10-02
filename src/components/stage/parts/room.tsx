import { FLOOR_Y, VIEW } from "../layout";

/**
 * The room the setup lives in: a villa wall, a window with a palm outside and
 * a timber floor. Colours come from CSS variables so the same drawing becomes
 * a night scene in dark mode.
 */
export function Room() {
  return (
    <g>
      <rect y={VIEW.top} width={VIEW.width} height={400 - VIEW.top} fill="var(--wall)" />

      {/* Rattan pendant hanging from the ceiling */}
      <path d={`M560 ${VIEW.top}v92`} stroke="var(--decor)" strokeWidth={2} />
      <path
        d="M520 46q40-50 80 0z"
        fill="var(--decor-fill)"
        stroke="var(--decor)"
        strokeWidth={2}
      />
      <path
        d="M532 34q28-26 56 0M546 18v28M560 12v34M574 18v28"
        fill="none"
        stroke="var(--decor)"
        strokeWidth={1.5}
        opacity={0.7}
      />

      {/* Window with a palm outside */}
      <rect x={84} y={52} width={180} height={180} rx={4} fill="var(--frame)" />
      <rect x={94} y={62} width={160} height={160} fill="url(#sky)" />
      <circle cx={208} cy={108} r={20} fill="var(--sun)" />
      <g fill="var(--palm)">
        <path d="M118 222c4-36 14-70 34-100l5 3c-18 30-27 62-30 97z" />
        <path d="M154 122c-20-10-44-8-62 6 20-4 38-2 56 6z" />
        <path d="M154 122c-6-18-22-30-40-32 14 8 24 20 30 36z" />
        <path d="M154 122c10-18 30-24 50-20-18 4-32 12-42 26z" />
        <path d="M154 122c22-4 42 6 54 24-16-10-32-14-50-14z" />
        <path d="M154 122c-12 12-18 30-16 48 4-18 10-32 22-44z" />
      </g>
      <rect x={172} y={62} width={4} height={160} fill="var(--frame)" />
      <rect x={94} y={140} width={160} height={4} fill="var(--frame)" />
      <rect x={76} y={230} width={196} height={8} rx={2} fill="var(--frame)" />

      {/* Sunlight falling across the wall */}
      <path d="M94 238h170l120 154H160z" fill="url(#window-light)" />

      {/* Woven rattan wall plate */}
      <g fill="none" stroke="var(--decor)" strokeWidth={2}>
        <circle cx={694} cy={118} r={44} fill="var(--decor-fill)" />
        <circle cx={694} cy={118} r={30} />
        <circle cx={694} cy={118} r={16} />
        <path d="M694 74v88M650 118h88M663 87l62 62M663 149l62-62" opacity={0.6} />
      </g>

      {/* Skirting and floor */}
      <rect y={392} width={VIEW.width} height={10} fill="var(--wall-shade)" />
      <rect y={400} width={VIEW.width} height={VIEW.height - 400} fill="var(--floor)" />
      <g stroke="var(--floor-line)" strokeWidth={1.5}>
        <path d="M0 416h800M0 440h800M0 468h800" />
        <path d="M120 400l-8 16M380 416l-6 24M640 440l-6 28M260 440l-5 28M540 400l-4 16" />
      </g>
      <ellipse cx={470} cy={FLOOR_Y + 12} rx={240} ry={22} fill="var(--rug)" />
    </g>
  );
}
