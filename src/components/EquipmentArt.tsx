import type { ArtKind } from "@/lib/types";

// Vector stand-ins for product photography. Each product renders one of these
// until real photos are uploaded through the admin area.

const S = {
  body: "url(#steel)",
  dark: "#2a2f36",
  edge: "#9aa1aa",
  knob: "#1b1e23",
  glass: "url(#glass)",
  flame: "#ff5c1f",
};

function Knobs({ x, y, n, gap = 26 }: { x: number; y: number; n: number; gap?: number }) {
  return (
    <g>
      {Array.from({ length: n }).map((_, i) => (
        <g key={i}>
          <circle cx={x + i * gap} cy={y} r={7.5} fill={S.knob} />
          <rect x={x + i * gap - 1.2} y={y - 6} width={2.4} height={6} rx={1} fill="#e8eaed" />
        </g>
      ))}
    </g>
  );
}

function Feet({ x1, x2, y }: { x1: number; x2: number; y: number }) {
  return (
    <g fill={S.dark}>
      <rect x={x1} y={y} width={10} height={16} rx={2} />
      <rect x={x2 - 10} y={y} width={10} height={16} rx={2} />
    </g>
  );
}

function Art({ kind }: { kind: ArtKind }) {
  switch (kind) {
    case "range":
      return (
        <g>
          <rect x={50} y={92} width={220} height={20} rx={3} fill="#3a4048" />
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <ellipse cx={88 + i * 72} cy={98} rx={24} ry={6} fill="#14171b" />
              <ellipse cx={88 + i * 72} cy={97} rx={12} ry={3} fill={S.flame} opacity={0.85} />
            </g>
          ))}
          <rect x={46} y={110} width={228} height={150} rx={6} fill={S.body} stroke={S.edge} />
          <rect x={46} y={110} width={228} height={30} fill="#d5d9de" />
          <Knobs x={72} y={125} n={7} gap={29} />
          <rect x={64} y={152} width={192} height={94} rx={6} fill="#c9ced4" stroke={S.edge} />
          <rect x={80} y={160} width={160} height={10} rx={5} fill="#eef0f2" stroke={S.edge} />
          <rect x={92} y={180} width={136} height={52} rx={4} fill={S.glass} />
          <Feet x1={56} x2={264} y={260} />
        </g>
      );
    case "fryer":
      return (
        <g>
          <rect x={70} y={80} width={180} height={180} rx={6} fill={S.body} stroke={S.edge} />
          <rect x={80} y={88} width={76} height={50} rx={4} fill="#1b1e23" />
          <rect x={164} y={88} width={76} height={50} rx={4} fill="#1b1e23" />
          <rect x={86} y={96} width={64} height={30} rx={2} fill="#c88a1a" opacity={0.85} />
          <rect x={170} y={96} width={64} height={30} rx={2} fill="#c88a1a" opacity={0.85} />
          <path d="M100 70 h24 v40 h-24z M184 70 h24 v40 h-24z" fill="none" stroke="#596069" strokeWidth={3} />
          <rect x={96} y={62} width={32} height={8} rx={4} fill={S.dark} />
          <rect x={180} y={62} width={32} height={8} rx={4} fill={S.dark} />
          <rect x={70} y={146} width={180} height={26} fill="#d5d9de" />
          <Knobs x={104} y={159} n={2} gap={112} />
          <rect x={82} y={180} width={74} height={70} rx={4} fill="#c9ced4" stroke={S.edge} />
          <rect x={164} y={180} width={74} height={70} rx={4} fill="#c9ced4" stroke={S.edge} />
          <rect x={112} y={186} width={14} height={4} rx={2} fill={S.dark} />
          <rect x={194} y={186} width={14} height={4} rx={2} fill={S.dark} />
          <Feet x1={78} x2={242} y={260} />
        </g>
      );
    case "griddle":
      return (
        <g>
          <rect x={44} y={120} width={232} height={14} rx={2} fill="#6f7782" />
          <path d="M44 120 L60 96 H260 L276 120 Z" fill="#b9bfc6" />
          <path d="M56 116 L68 100 H252 L264 116 Z" fill="url(#chrome)" />
          <rect x={44} y={134} width={232} height={64} rx={6} fill={S.body} stroke={S.edge} />
          <Knobs x={92} y={166} n={2} gap={136} />
          <rect x={136} y={150} width={48} height={32} rx={4} fill="#c9ced4" stroke={S.edge} />
          <rect x={150} y={164} width={20} height={4} rx={2} fill={S.dark} />
          <rect x={60} y={198} width={200} height={60} rx={4} fill="#d5d9de" />
          <rect x={60} y={222} width={200} height={4} fill={S.edge} />
          <Feet x1={60} x2={260} y={258} />
        </g>
      );
    case "combi":
      return (
        <g>
          <rect x={62} y={58} width={196} height={196} rx={10} fill={S.body} stroke={S.edge} />
          <rect x={76} y={72} width={130} height={168} rx={8} fill="#2b3037" />
          <rect x={84} y={80} width={114} height={152} rx={6} fill={S.glass} />
          {[0, 1, 2, 3, 4].map((i) => (
            <rect key={i} x={92} y={98 + i * 28} width={98} height={3} rx={1.5} fill="#ffb020" opacity={0.55} />
          ))}
          <rect x={196} y={130} width={6} height={48} rx={3} fill="#d5d9de" />
          <rect x={216} y={76} width={32} height={46} rx={6} fill="#14171b" />
          <rect x={220} y={80} width={24} height={22} rx={3} fill="#1f6feb" opacity={0.75} />
          <circle cx={232} cy={140} r={11} fill={S.knob} />
          <circle cx={232} cy={140} r={4} fill={S.flame} />
          <Feet x1={70} x2={250} y={254} />
        </g>
      );
    case "kettle":
      return (
        <g>
          <rect x={60} y={130} width={18} height={130} rx={4} fill="#c3c8ce" stroke={S.edge} />
          <rect x={242} y={130} width={18} height={130} rx={4} fill="#c3c8ce" stroke={S.edge} />
          <path d="M84 110 h152 v60 a76 76 0 0 1 -152 0 z" fill={S.body} stroke={S.edge} />
          <ellipse cx={160} cy={110} rx={76} ry={14} fill="#3a4048" />
          <ellipse cx={160} cy={110} rx={64} ry={9} fill="#d4a148" opacity={0.85} />
          <circle cx={251} cy={150} r={14} fill={S.knob} />
          <rect x={248} y={136} width={6} height={28} rx={3} fill="#e8eaed" />
          <rect x={52} y={256} width={216} height={8} rx={4} fill={S.dark} />
        </g>
      );
    case "fridge":
      return (
        <g>
          <rect x={70} y={30} width={180} height={230} rx={8} fill={S.body} stroke={S.edge} />
          <rect x={70} y={30} width={180} height={26} rx={8} fill="#2b3037" />
          <rect x={82} y={38} width={34} height={10} rx={2} fill="#38d39f" opacity={0.9} />
          <line x1={160} y1={60} x2={160} y2={252} stroke={S.edge} strokeWidth={2} />
          <rect x={146} y={110} width={5} height={70} rx={2.5} fill="#f2f3f5" stroke={S.edge} />
          <rect x={169} y={110} width={5} height={70} rx={2.5} fill="#f2f3f5" stroke={S.edge} />
          <rect x={78} y={64} width={74} height={188} rx={4} fill="none" stroke="#bcc2c9" />
          <rect x={168} y={64} width={74} height={188} rx={4} fill="none" stroke="#bcc2c9" />
          <Feet x1={80} x2={240} y={260} />
        </g>
      );
    case "undercounter":
      return (
        <g>
          <rect x={30} y={112} width={260} height={12} rx={2} fill="url(#chrome)" stroke={S.edge} />
          <rect x={36} y={124} width={248} height={124} rx={4} fill={S.body} stroke={S.edge} />
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <rect x={46 + i * 80} y={134} width={70} height={104} rx={4} fill="#d0d5db" stroke={S.edge} />
              <rect x={56 + i * 80} y={142} width={50} height={5} rx={2.5} fill="#f2f3f5" stroke={S.edge} />
            </g>
          ))}
          <rect x={36} y={232} width={248} height={16} fill="#2b3037" />
          <rect x={44} y={237} width={22} height={6} rx={1} fill="#38d39f" opacity={0.9} />
          <Feet x1={44} x2={276} y={248} />
        </g>
      );
    case "chest":
      return (
        <g>
          <path d="M44 128 L60 108 H260 L276 128 Z" fill="#d5d9de" stroke={S.edge} />
          <rect x={44} y={128} width={232} height={120} rx={6} fill={S.body} stroke={S.edge} />
          <rect x={136} y={136} width={48} height={8} rx={4} fill={S.dark} />
          <rect x={56} y={160} width={30} height={10} rx={2} fill="#2b3037" />
          <rect x={60} y={163} width={14} height={4} rx={1} fill="#38d39f" />
          <rect x={44} y={236} width={232} height={12} fill="#2b3037" />
          <circle cx={70} cy={256} r={8} fill={S.dark} />
          <circle cx={250} cy={256} r={8} fill={S.dark} />
        </g>
      );
    case "mixer":
      return (
        <g>
          <rect x={96} y={236} width={140} height={22} rx={6} fill={S.dark} />
          <rect x={186} y={70} width={40} height={168} rx={10} fill={S.body} stroke={S.edge} />
          <rect x={94} y={52} width={146} height={48} rx={18} fill={S.body} stroke={S.edge} />
          <rect x={210} y={64} width={18} height={6} rx={3} fill={S.flame} />
          <rect x={137} y={100} width={10} height={40} fill="#596069" />
          <path d="M98 140 h86 l-10 70 a10 10 0 0 1 -10 9 h-46 a10 10 0 0 1 -10 -9 z" fill="url(#chrome)" stroke={S.edge} />
          <ellipse cx={141} cy={140} rx={43} ry={8} fill="#7c838c" />
          <path d="M132 140 q9 30 18 0" fill="none" stroke="#e8eaed" strokeWidth={3} />
          <circle cx={206} cy={130} r={8} fill={S.knob} />
        </g>
      );
    case "slicer":
      return (
        <g>
          <path d="M60 224 h200 l-16 30 h-168z" fill={S.dark} />
          <rect x={56} y={196} width={208} height={30} rx={8} fill={S.body} stroke={S.edge} />
          <circle cx={130} cy={150} r={66} fill="url(#chrome)" stroke={S.edge} />
          <circle cx={130} cy={150} r={56} fill="none" stroke="#7c838c" strokeWidth={1.5} />
          <circle cx={130} cy={150} r={16} fill="#b9bfc6" stroke={S.edge} />
          <path d="M68 128 a64 64 0 0 1 124 -10" fill="none" stroke={S.body} strokeWidth={16} strokeLinecap="round" />
          <rect x={178} y={148} width={76} height={50} rx={6} fill="#c9ced4" stroke={S.edge} />
          <rect x={210} y={110} width={12} height={42} rx={6} fill={S.dark} />
          <circle cx={78} cy={210} r={6} fill={S.flame} />
        </g>
      );
    case "processor":
      return (
        <g>
          <rect x={92} y={170} width={136} height={86} rx={10} fill={S.body} stroke={S.edge} />
          <rect x={104} y={202} width={20} height={10} rx={3} fill="#2fb36f" />
          <rect x={104} y={218} width={20} height={10} rx={3} fill="#e5484d" />
          <path d="M102 74 h116 v96 h-116z" fill="url(#chrome)" stroke={S.edge} />
          <ellipse cx={160} cy={74} rx={58} ry={10} fill="#7c838c" />
          <rect x={176} y={36} width={34} height={44} rx={4} fill="#d5d9de" stroke={S.edge} />
          <rect x={186} y={20} width={14} height={20} rx={4} fill={S.dark} />
          <path d="M218 140 h30 v16 h-30" fill="#b9bfc6" stroke={S.edge} />
          <rect x={86} y={254} width={148} height={8} rx={4} fill={S.dark} />
        </g>
      );
    case "dishwasher":
      return (
        <g>
          <rect x={72} y={40} width={176} height={130} rx={8} fill="url(#chrome)" stroke={S.edge} />
          <rect x={72} y={40} width={176} height={18} rx={8} fill="#c3c8ce" />
          <rect x={136} y={64} width={48} height={8} rx={4} fill={S.dark} />
          {[0, 1, 2, 3].map((i) => (
            <line key={i} x1={84} y1={90 + i * 18} x2={236} y2={90 + i * 18} stroke="#bcc2c9" />
          ))}
          <rect x={40} y={170} width={240} height={10} rx={2} fill="#d5d9de" stroke={S.edge} />
          <rect x={72} y={180} width={176} height={70} rx={4} fill={S.body} stroke={S.edge} />
          <rect x={86} y={192} width={46} height={16} rx={3} fill="#14171b" />
          <rect x={90} y={196} width={20} height={8} rx={1} fill="#3aa0ff" opacity={0.85} />
          <circle cx={150} cy={200} r={5} fill="#2fb36f" />
          <Feet x1={80} x2={240} y={250} />
        </g>
      );
    case "sink":
      return (
        <g>
          <rect x={30} y={70} width={260} height={50} rx={3} fill="#d5d9de" stroke={S.edge} />
          <path d="M150 54 v-20 q0 -12 14 -12 h28 v10" fill="none" stroke="#7c838c" strokeWidth={6} strokeLinecap="round" />
          <rect x={144} y={54} width={14} height={20} rx={3} fill="#7c838c" />
          <rect x={26} y={118} width={268} height={16} rx={3} fill="url(#chrome)" stroke={S.edge} />
          <rect x={44} y={134} width={92} height={64} rx={6} fill={S.body} stroke={S.edge} />
          <rect x={146} y={134} width={92} height={64} rx={6} fill={S.body} stroke={S.edge} />
          <path d="M248 126 l40 0" stroke="#bcc2c9" strokeWidth={2} />
          {[0, 1, 2, 3, 4].map((i) => (
            <line key={i} x1={248} y1={124 - i * 0.1} x2={290} y2={124} stroke="#a6adb5" />
          ))}
          <rect x={44} y={226} width={232} height={6} rx={3} fill="#bcc2c9" />
          {[48, 154, 266].map((x) => (
            <rect key={x} x={x} y={134} width={8} height={124} rx={3} fill="#c3c8ce" stroke={S.edge} />
          ))}
        </g>
      );
    case "espresso":
      return (
        <g>
          <rect x={52} y={60} width={216} height={20} rx={4} fill="#c3c8ce" stroke={S.edge} />
          {[0, 1, 2].map((i) => (
            <rect key={i} x={84 + i * 56} y={50} width={36} height={12} rx={4} fill="#eef0f2" stroke={S.edge} />
          ))}
          <rect x={52} y={80} width={216} height={120} rx={10} fill={S.body} stroke={S.edge} />
          <rect x={52} y={100} width={216} height={40} fill="#14171b" />
          <rect x={68} y={110} width={42} height={18} rx={3} fill={S.flame} opacity={0.9} />
          <rect x={210} y={110} width={42} height={18} rx={3} fill={S.flame} opacity={0.9} />
          {[116, 188].map((x) => (
            <g key={x}>
              <rect x={x - 14} y={140} width={28} height={16} rx={4} fill="#596069" />
              <rect x={x - 6} y={156} width={12} height={10} fill="#2b3037" />
              <rect x={x - 30} y={156} width={30} height={6} rx={3} fill={S.dark} />
            </g>
          ))}
          <path d="M80 140 l-8 44" stroke="#9aa1aa" strokeWidth={4} strokeLinecap="round" />
          <path d="M240 140 l8 44" stroke="#9aa1aa" strokeWidth={4} strokeLinecap="round" />
          <rect x={52} y={200} width={216} height={14} rx={3} fill="#2b3037" />
          <rect x={58} y={214} width={204} height={44} rx={8} fill="#d5d9de" stroke={S.edge} />
        </g>
      );
    case "blender":
      return (
        <g>
          <rect x={104} y={196} width={112} height={60} rx={14} fill="#1b1e23" />
          <circle cx={160} cy={226} r={12} fill="#2b3037" stroke="#596069" />
          <rect x={130} y={240} width={60} height={6} rx={3} fill={S.flame} />
          <path d="M116 60 h88 l-12 136 h-64 z" fill={S.glass} stroke="#9aa1aa" strokeWidth={2} />
          <path d="M126 130 h68 l-6 66 h-56 z" fill="#ff8a4c" opacity={0.7} />
          <rect x={112} y={46} width={96} height={18} rx={6} fill="#2b3037" />
          <path d="M204 80 q26 6 20 50 q-4 20 -18 20" fill="none" stroke="#9aa1aa" strokeWidth={6} />
        </g>
      );
    case "icemaker":
      return (
        <g>
          <rect x={70} y={44} width={180} height={214} rx={8} fill={S.body} stroke={S.edge} />
          <rect x={70} y={44} width={180} height={70} rx={8} fill="#d5d9de" />
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <rect key={i} x={86 + i * 22} y={60} width={12} height={36} rx={2} fill="#9aa1aa" opacity={0.6} />
          ))}
          <rect x={86} y={130} width={148} height={96} rx={6} fill="#c9ced4" stroke={S.edge} />
          <rect x={140} y={138} width={40} height={6} rx={3} fill={S.dark} />
          {[[110, 180], [130, 190], [150, 178], [172, 192], [194, 182], [120, 204], [160, 204], [200, 206]].map(([x, y], i) => (
            <rect key={i} x={x} y={y} width={16} height={14} rx={3} fill="#e6f3ff" stroke="#9ec9ec" />
          ))}
          <circle cx={226} cy={242} r={4} fill="#3aa0ff" />
          <Feet x1={80} x2={240} y={258} />
        </g>
      );
    case "deckoven":
      return (
        <g>
          <rect x={50} y={34} width={220} height={100} rx={6} fill="#2b3037" stroke="#3d434b" />
          <rect x={50} y={140} width={220} height={100} rx={6} fill="#2b3037" stroke="#3d434b" />
          {[34, 140].map((y) => (
            <g key={y}>
              <rect x={64} y={y + 18} width={144} height={66} rx={4} fill={S.body} stroke={S.edge} />
              <rect x={82} y={y + 30} width={108} height={34} rx={3} fill="#120c09" />
              <rect x={86} y={y + 52} width={100} height={8} rx={3} fill={S.flame} opacity={0.75} />
              <rect x={86} y={y + 34} width={100} height={4} rx={2} fill="#ffb020" opacity={0.6} />
              <rect x={92} y={y + 70} width={88} height={6} rx={3} fill="#eef0f2" stroke={S.edge} />
              <rect x={218} y={y + 18} width={40} height={66} rx={4} fill="#1b1e23" />
              <rect x={224} y={y + 26} width={28} height={12} rx={2} fill={S.flame} opacity={0.9} />
              <circle cx={238} cy={y + 60} r={8} fill="#3d434b" />
            </g>
          ))}
          <rect x={60} y={240} width={200} height={10} fill="#1b1e23" />
          <Feet x1={62} x2={258} y={250} />
        </g>
      );
    case "proofer":
      return (
        <g>
          <rect x={80} y={30} width={160} height={226} rx={8} fill={S.body} stroke={S.edge} />
          <rect x={92} y={56} width={120} height={186} rx={6} fill={S.glass} stroke={S.edge} />
          {Array.from({ length: 8 }).map((_, i) => (
            <g key={i}>
              <rect x={100} y={70 + i * 21} width={104} height={3} fill="#9aa1aa" />
              {[0, 1, 2, 3].map((j) => (
                <ellipse key={j} cx={114 + j * 26} cy={66 + i * 21} rx={10} ry={4} fill="#e2b57a" />
              ))}
            </g>
          ))}
          <rect x={92} y={38} width={60} height={12} rx={2} fill="#14171b" />
          <rect x={96} y={41} width={22} height={6} rx={1} fill={S.flame} />
          <rect x={220} y={120} width={6} height={56} rx={3} fill="#eef0f2" stroke={S.edge} />
          <Feet x1={90} x2={230} y={256} />
        </g>
      );
  }
}

const TONES = ["#eef0f2", "#f3eee9", "#ebeff2", "#eeeef3"];

export default function EquipmentArt({
  kind,
  className = "",
  tone = 0,
  zoom = 1,
  plain = false,
}: {
  kind: ArtKind;
  className?: string;
  tone?: number;
  zoom?: number;
  plain?: boolean;
}) {
  return (
    <svg viewBox="0 0 320 290" className={className} role="img" aria-label={`${kind} illustration`}>
      {!plain && (
        <>
          <rect width="320" height="290" fill={TONES[tone % TONES.length]} />
          <rect width="320" height="290" fill="url(#art-glow)" />
        </>
      )}
      <ellipse cx="160" cy="268" rx="122" ry="9" fill="#0f1114" opacity="0.12" />
      <g transform={zoom !== 1 ? `translate(160 150) scale(${zoom}) translate(-160 -150)` : undefined}>
        <Art kind={kind} />
      </g>
    </svg>
  );
}

/** Shared gradients, rendered once in the root layout. */
export function ArtDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" style={{ position: "absolute" }}>
      <defs>
        <linearGradient id="steel" x1="0" x2="1">
          <stop offset="0" stopColor="#c7ccd2" />
          <stop offset="0.45" stopColor="#f4f5f7" />
          <stop offset="0.7" stopColor="#dde1e5" />
          <stop offset="1" stopColor="#b8bec5" />
        </linearGradient>
        <linearGradient id="chrome" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#e9ecef" />
          <stop offset="0.5" stopColor="#aeb5bd" />
          <stop offset="1" stopColor="#eef0f2" />
        </linearGradient>
        <linearGradient id="glass" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#3a4250" />
          <stop offset="0.5" stopColor="#1d2229" />
          <stop offset="1" stopColor="#2f3640" />
        </linearGradient>
        <radialGradient id="art-glow" cx="0.5" cy="0.45" r="0.6">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}
