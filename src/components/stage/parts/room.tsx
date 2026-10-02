import { FLOOR_Y, VIEW } from "../layout";

/**
 * The room the setup lives in: a lime-washed villa wall, a window onto a palm,
 * a teak floor. The sky, sun, moon and window light follow the time of day
 * through CSS variables (see app/scene.css).
 */
export function Room() {
  return (
    <g>
      <rect y={VIEW.top} width={VIEW.width} height={400 - VIEW.top} fill="var(--wall)" />

      {/* Window: sky, sun or moon and stars, a palm outside */}
      <rect x={84} y={52} width={180} height={180} rx={4} fill="var(--frame)" />
      <rect x={94} y={62} width={160} height={160} fill="url(#sky)" />
      <g className="stars" fill="#f6f1dc">
        {STARS.map(([x, y, r]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={r} />
        ))}
      </g>
      <g className="moon">
        <circle cx={214} cy={98} r={14} fill="var(--sun)" />
        <circle cx={220} cy={93} r={12} fill="var(--sky-top)" />
      </g>
      <g className="sun">
        <circle cx={208} cy={108} r={20} fill="var(--sun)" />
      </g>
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

      {/* Light falling through the window */}
      <path className="shaft" d="M94 238h170l120 154H160z" fill="url(#window-light)" />

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

      {/* Woven rattan wall plate */}
      <g fill="none" stroke="var(--decor)" strokeWidth={2}>
        <circle cx={704} cy={86} r={38} fill="var(--decor-fill)" />
        <circle cx={704} cy={86} r={26} />
        <circle cx={704} cy={86} r={13} />
        <path d="M704 48v76M666 86h76M677 59l54 54M677 113l54-54" opacity={0.6} />
      </g>

      {/* Floating teak shelf: books, a succulent, a little speaker */}
      <g>
        <rect x={628} y={150} width={14} height={44} rx={1.5} fill="#2f5d62" />
        <rect x={643} y={156} width={11} height={38} rx={1.5} fill="#d9a441" />
        <rect x={655} y={147} width={13} height={47} rx={1.5} fill="#b5543c" />
        <rect
          x={669}
          y={160}
          width={10}
          height={34}
          rx={1.5}
          transform="rotate(12 674 194)"
          fill="#5d6b7a"
        />
        <path d="M702 194h24l-3-18h-18z" fill="#c9b8a0" />
        <path
          d="M714 176c-10-4-14-12-10-18 4 6 8 9 10 18zM714 176c10-4 14-12 10-18-4 6-8 9-10 18zM714 176c0-8 2-14 0-20-2 6 0 12 0 20z"
          fill="#5f8a6c"
        />
        <rect x={738} y={170} width={22} height={24} rx={5} fill="#3b4245" />
        <circle cx={749} cy={182} r={6} fill="#596267" />
        <rect x={616} y={194} width={156} height={7} rx={2} fill="#9c7046" />
      </g>

      {/* Skirting and floor */}
      <rect y={392} width={VIEW.width} height={10} fill="var(--wall-shade)" />
      <rect y={400} width={VIEW.width} height={VIEW.height - 400} fill="var(--floor)" />
      <g stroke="var(--floor-line)" strokeWidth={1.5}>
        <path d="M0 416h800M0 440h800M0 468h800" />
        <path d="M120 400l-8 16M380 416l-6 24M640 440l-6 28M260 440l-5 28M540 400l-4 16" />
      </g>
      <ellipse cx={470} cy={FLOOR_Y + 12} rx={240} ry={22} fill="var(--rug)" />
      <ellipse
        cx={470}
        cy={FLOOR_Y + 12}
        rx={222}
        ry={16}
        fill="none"
        stroke="var(--decor)"
        strokeWidth={1.5}
        strokeDasharray="6 5"
        opacity={0.5}
      />
    </g>
  );
}

/** [x, y, radius] for the night sky, inside the window. */
const STARS: Array<[number, number, number]> = [
  [106, 76, 1.2],
  [128, 92, 0.9],
  [150, 70, 1.4],
  [188, 80, 1],
  [236, 74, 1.1],
  [244, 120, 0.8],
  [112, 118, 1],
  [196, 126, 0.9],
  [230, 156, 1.1],
  [104, 160, 0.8],
];
