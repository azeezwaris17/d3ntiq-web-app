'use client';
import React from 'react';

import { Button, Group } from '@mantine/core';
import type { DentalMapSVGProps } from './DentalMapSVG';

// Re-export the same prop type so DentalMapSelectionStep can swap easily
export type { DentalMapSVGProps };

// ─── Tooth shape definitions ────────────────────────────────────────────────
// Each symbol is defined in a 16×16 (or normalised) viewBox and scaled via transform.
// Upper teeth: rendered upright (root up, crown down toward bite line).
// Lower teeth: rendered flipped vertically (crown up toward bite line, root down).

// Premolar path (original viewBox 16×16) — outer outline only
const PREMOLAR_PATH =
  'M11.3 16c-1.2 0-1.7-3.9-1.7-4.1-0.1-1.3-1-2.1-1.6-2.2-0.6 0-1.4 0.9-1.6 2.2 0 0.2-0.5 4.1-1.7 4.1s-1.8-4.4-1.9-4.4c-0.2-1.4 0.1-3.4 0.2-4-0.4-1.2-1.8-5.6-0.5-7 0.5-0.4 1.1-0.6 1.9-0.6 0.6 0 1.3 0.1 2 0.3 0.6 0.1 1.1 0.2 1.6 0.2s1-0.1 1.6-0.2c0.7-0.2 1.4-0.3 2-0.3 0.8 0 1.4 0.2 1.8 0.7 1.3 1.4-0.1 5.8-0.5 7 0.1 0.5 0.4 2.5 0.2 3.9 0.1 0-0.5 4.4-1.8 4.4z';

// Premolar FLIPPED — outer outline only
const PREMOLAR_PATH_FLIPPED =
  'M11.3 0c-1.2 0-1.7 3.9-1.7 4.1-0.1 1.3-1 2.1-1.6 2.2-0.6 0-1.4-0.9-1.6-2.2 0-0.2-0.5-4.1-1.7-4.1s-1.8 4.4-1.9 4.4c-0.2 1.4 0.1 3.4 0.2 4-0.4 1.2-1.8 5.6-0.5 7 0.5 0.4 1.1 0.6 1.9 0.6 0.6 0 1.3-0.1 2-0.3 0.6-0.1 1.1-0.2 1.6-0.2s1 0.1 1.6 0.2c0.7 0.2 1.4 0.3 2 0.3 0.8 0 1.4-0.2 1.8-0.7 1.3-1.4-0.1-5.8-0.5-7 0.1-0.5 0.4-2.5 0.2-3.9 0.1 0-0.5-4.4-1.8-4.4z';

// Molar path (original viewBox 407.504×407.504)
const MOLAR_PATH =
  'M376.328,45.601c-21.131-23.658-50.213-36.686-81.891-36.686c-24.766,0-51.477,14.735-70.994,25.501c-7.105,3.922-16.821,9.284-19.693,9.637c-2.859-0.347-12.525-5.695-19.613-9.616C164.67,23.666,138.009,8.915,113.068,8.915c-31.679,0-60.762,13.028-81.894,36.686C11.071,68.108,0,97.734,0,129.021c0,44.695,16.05,108.255,42.933,170.029c11.96,27.484,24.691,51.233,36.816,68.68c14.432,20.766,26.817,30.859,37.864,30.859c4.902,0,13.878-2.079,18.914-16.007c4.894-13.534,9.296-29.069,13.964-45.547c12.354-43.606,27.728-97.878,52.48-97.878h1.563c11.005,0,20.856,9.426,30.115,28.818c9.172,19.209,16.145,44.752,22.898,69.485c4.463,16.351,8.68,31.792,13.416,45.085c4.934,13.842,13.809,15.912,18.666,15.915c10.992-0.001,23.365-10.249,37.828-31.329c12.094-17.626,24.852-41.611,36.895-69.361c27.02-62.271,43.152-125.354,43.152-168.75C407.504,97.733,396.432,68.107,376.328,45.601z';

// Molar FLIPPED — y → (407.504 - y)
const MOLAR_PATH_FLIPPED =
  'M376.328,361.903c-21.131,23.658-50.213,36.686-81.891,36.686c-24.766,0-51.477-14.735-70.994-25.501c-7.105-3.922-16.821-9.284-19.693-9.637c-2.859,0.347-12.525,5.695-19.613,9.616C164.67,383.838,138.009,398.589,113.068,398.589c-31.679,0-60.762-13.028-81.894-36.686C11.071,339.396,0,309.77,0,278.483c0-44.695,16.05-108.255,42.933-170.029c11.96-27.484,24.691-51.233,36.816-68.68c14.432-20.766,26.817-30.859,37.864-30.859c4.902,0,13.878,2.079,18.914,16.007c4.894,13.534,9.296,29.069,13.964,45.547c12.354,43.606,27.728,97.878,52.48,97.878h1.563c11.005,0,20.856-9.426,30.115-28.818c9.172-19.209,16.145-44.752,22.898-69.485c4.463-16.351,8.68-31.792,13.416-45.085c4.934-13.842,13.809-15.912,18.666-15.915c10.992,0.001,23.365,10.249,37.828,31.329c12.094,17.626,24.852,41.611,36.895,69.361c27.02,62.271,43.152,125.354,43.152,168.75C407.504,309.771,396.432,339.397,376.328,361.903z';

// Incisor path kept for reference — not currently rendered
// const _INCISOR_PATH = '...'
// const _INCISOR_PATH_FLIPPED = '...'

// Canine — new multi-path SVG (viewBox 0 0 100 240)
// crown: pointed cusp shape; root: tapered single root
const CANINE_CROWN = 'M 50,10 C 35,25 20,40 22,65 C 23,85 30,95 32,100 L 68,100 C 70,95 77,85 78,65 C 80,40 65,25 50,10 Z';
const CANINE_ROOT  = 'M 32,95 C 35,150 45,210 50,230 C 55,210 65,150 68,95 L 32,95 Z';
const CANINE_SRC   = { w: 100, h: 240 }; void CANINE_SRC;

// Canine FLIPPED (y → 240 - y)
const CANINE_CROWN_F = 'M 50,230 C 35,215 20,200 22,175 C 23,155 30,145 32,140 L 68,140 C 70,145 77,155 78,175 C 80,200 65,215 50,230 Z';
const CANINE_ROOT_F  = 'M 32,145 C 35,90 45,30 50,10 C 55,30 65,90 68,145 L 32,145 Z';

// Incisor — new multi-path SVG (viewBox 0 0 100 240)
const INCISOR_CROWN = 'M 30,15 C 40,12 60,12 70,15 C 82,18 85,45 80,75 C 78,90 70,105 65,110 L 35,110 C 30,105 22,90 20,75 C 15,45 18,18 30,15 Z';
const INCISOR_ROOT  = 'M 35,100 C 38,150 46,210 50,235 C 54,210 62,150 65,100 Z';
const INCISOR_SRC   = { w: 100, h: 240 }; void INCISOR_SRC;

// Incisor FLIPPED (y → 240 - y)
const INCISOR_CROWN_F = 'M 30,225 C 40,228 60,228 70,225 C 82,222 85,195 80,165 C 78,150 70,135 65,130 L 35,130 C 30,135 22,150 20,165 C 15,195 18,222 30,225 Z';
const INCISOR_ROOT_F  = 'M 35,140 C 38,90 46,30 50,5 C 54,30 62,90 65,140 Z';

// ─── Layout constants ────────────────────────────────────────────────────────
const TOOTH_NAMES: string[] = [
  'Upper Right 3rd Molar', 'Upper Right 2nd Molar', 'Upper Right 1st Molar',
  'Upper Right 2nd Premolar', 'Upper Right 1st Premolar', 'Upper Right Canine',
  'Upper Right Lateral Incisor', 'Upper Right Central Incisor',
  'Upper Left Central Incisor', 'Upper Left Lateral Incisor', 'Upper Left Canine',
  'Upper Left 1st Premolar', 'Upper Left 2nd Premolar',
  'Upper Left 1st Molar', 'Upper Left 2nd Molar', 'Upper Left 3rd Molar',
  'Lower Right 3rd Molar', 'Lower Right 2nd Molar', 'Lower Right 1st Molar',
  'Lower Right 2nd Premolar', 'Lower Right 1st Premolar', 'Lower Right Canine',
  'Lower Right Lateral Incisor', 'Lower Right Central Incisor',
  'Lower Left Central Incisor', 'Lower Left Lateral Incisor', 'Lower Left Canine',
  'Lower Left 1st Premolar', 'Lower Left 2nd Premolar',
  'Lower Left 1st Molar', 'Lower Left 2nd Molar', 'Lower Left 3rd Molar',
];

export function getToothName(id: string): string {
  if (id === 'gum-upper') return 'Upper Gum';
  if (id === 'gum-lower') return 'Lower Gum';
  if (id === 'gum-upper-right') return 'Upper Right Gum';
  if (id === 'gum-upper-center') return 'Upper Center Gum';
  if (id === 'gum-upper-left') return 'Upper Left Gum';
  if (id === 'gum-lower-right') return 'Lower Right Gum';
  if (id === 'gum-lower-center') return 'Lower Center Gum';
  if (id === 'gum-lower-left') return 'Lower Left Gum';
  const num = parseInt(id.replace('tooth-', ''), 10);
  if (num >= 1 && num <= 32) return TOOTH_NAMES[num - 1];
  return id;
}

type ToothType = 'molar' | 'premolar' | 'canine' | 'incisor';

// Shape per tooth index (0 = tooth-1)
const TOOTH_TYPES: ToothType[] = Array(16).fill('molar') as ToothType[];

// Rendered width per type (px in SVG coords)
const TYPE_W: Record<ToothType, number> = { molar: 34, premolar: 28, canine: 28, incisor: 28 };
// Rendered height per type
const UPPER_H: Record<ToothType, number> = { molar: 72, premolar: 82, canine: 82, incisor: 82 };
const LOWER_H: Record<ToothType, number> = { molar: 68, premolar: 76, canine: 76, incisor: 76 };

// Source viewBox dimensions for each shape
const SRC_VB: Record<ToothType, { w: number; h: number }> = {
  molar:    { w: 407.504, h: 407.504 },
  premolar: { w: 16,      h: 16      },
  canine:   { w: 100,     h: 240     },
  incisor:  { w: 100,     h: 240     },
};

const GAP = 3;
const START_X = 10;

// Pre-compute x positions
function computeXPositions(): number[] {
  const xs: number[] = [];
  let x = START_X;
  for (let i = 0; i < 16; i++) {
    xs.push(x);
    x += TYPE_W[TOOTH_TYPES[i]] + GAP;
  }
  return xs;
}
const X_POS = computeXPositions();
const SVG_W = X_POS[15] + TYPE_W[TOOTH_TYPES[15]] + START_X;

// Vertical layout
const GUM_H = 20;
const UPPER_GUM_Y = 0;
const UPPER_TEETH_BOTTOM = UPPER_GUM_Y + GUM_H + Math.max(...Object.values(UPPER_H));
const BITE_Y = UPPER_TEETH_BOTTOM + 6;
const LOWER_TEETH_TOP = BITE_Y + 6;
const LOWER_GUM_Y = LOWER_TEETH_TOP + Math.max(...Object.values(LOWER_H));
const SVG_H = LOWER_GUM_Y + GUM_H;

const COLOR_DEFAULT = '#F3F4F6';
const COLOR_SELECTED = '#2563EB';
const STROKE_DEFAULT = '#9CA3AF';
const STROKE_SELECTED = '#1D4ED8';
const GUM_DEFAULT = '#F9A8D4'; void GUM_DEFAULT;
const GUM_SELECTED = '#93C5FD';

const UPPER_JAW = Array.from({ length: 16 }, (_, i) => `tooth-${i + 1}`);
const LOWER_JAW = Array.from({ length: 16 }, (_, i) => `tooth-${i + 17}`);
const FRONT_TEETH = [
  ...Array.from({ length: 6 }, (_, i) => `tooth-${i + 6}`),
  ...Array.from({ length: 6 }, (_, i) => `tooth-${i + 22}`),
];
const BACK_TEETH = [
  ...Array.from({ length: 5 }, (_, i) => `tooth-${i + 1}`),
  ...Array.from({ length: 5 }, (_, i) => `tooth-${i + 12}`),
  ...Array.from({ length: 5 }, (_, i) => `tooth-${i + 17}`),
  ...Array.from({ length: 5 }, (_, i) => `tooth-${i + 28}`),
];

// Render a single tooth scaled to (tw × th)
// Upper teeth (flipped=false) use flipped paths; lower teeth (flipped=true) use original paths
function ToothShape({
  type, tw, th, fill, stroke, flipped,
}: {
  type: ToothType; tw: number; th: number;
  fill: string; stroke: string; flipped: boolean; uid: string;
}) {
  const src = SRC_VB[type];
  const sx = tw / src.w;
  const sy = th / src.h;
  const sw = 1 / Math.min(sx, sy);

  if (type === 'molar' || type === 'premolar') {
    const path = flipped
      ? (type === 'molar' ? MOLAR_PATH : PREMOLAR_PATH)
      : (type === 'molar' ? MOLAR_PATH_FLIPPED : PREMOLAR_PATH_FLIPPED);
    return (
      <path d={path} transform={`scale(${sx}, ${sy})`}
        fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
    );
  }

  if (type === 'canine') {
    const [crown, root] = flipped
      ? [CANINE_CROWN, CANINE_ROOT]
      : [CANINE_CROWN_F, CANINE_ROOT_F];
    return (
      <g transform={`scale(${sx}, ${sy})`}>
        <path d={root}  fill={fill} stroke={stroke} strokeWidth={sw * 0.5} strokeLinejoin="round" />
        <path d={crown} fill={fill} stroke={stroke} strokeWidth={sw * 0.5} strokeLinejoin="round" />
      </g>
    );
  }

  // incisor
  const [crown, root] = flipped
    ? [INCISOR_CROWN, INCISOR_ROOT]
    : [INCISOR_CROWN_F, INCISOR_ROOT_F];
  return (
    <g transform={`scale(${sx}, ${sy})`}>
      <path d={root}  fill={fill} stroke={stroke} strokeWidth={sw * 0.5} strokeLinejoin="round" />
      <path d={crown} fill={fill} stroke={stroke} strokeWidth={sw * 0.5} strokeLinejoin="round" />
    </g>
  );
}

export const DentalMapSVG3: React.FC<DentalMapSVGProps> = ({ selected, onSelect, onClearAll, onGroupSelect }) => {
  const isSel = (id: string) => selected.includes(id);

  return (
    <div>
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        width="100%"
        preserveAspectRatio="xMidYMid meet"
        aria-label="Dental map"
        role="img"
        style={{ display: 'block' }}
      >
        <defs>
          <linearGradient id="gumGrad3upper" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f7a8b8" />
            <stop offset="100%" stopColor="#e38194" />
          </linearGradient>
          <linearGradient id="gumGrad3lower" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e38194" />
            <stop offset="100%" stopColor="#f7a8b8" />
          </linearGradient>
        </defs>

        <style>{`
          .tooth3-unit { cursor: pointer; }
          .tooth3-unit:not(.tooth3-selected):hover path { fill: #54D1ED !important; }
          .tooth3-unit.tooth3-selected path { fill: #2563EB !important; }
          .gum3-unit { cursor: pointer; }
          .gum3-unit:not(.gum3-selected):hover rect { fill: #54D1ED !important; }
          .gum3-unit:not(.gum3-selected):hover path { fill: #54D1ED !important; }
        `}</style>

        {/* ── Upper gum — 3 segments ── */}
        {(['gum-upper-right', 'gum-upper-center', 'gum-upper-left'] as const).map((segId, si) => {
          const segW = SVG_W / 3;
          const segX = si * segW;
          const labels = ['Upper Right Gum', 'Upper Center Gum', 'Upper Left Gum'];
          const sel = isSel(segId);
          // Scale the gum path to this segment's width
          const scaleX = segW / 200;
          const scaleY = (GUM_H + 10) / 40;
          return (
            <g
              key={segId}
              id={segId}
              className={`gum3-unit${sel ? ' gum3-selected' : ''}`}
              onClick={() => onSelect(segId)}
              role="button"
              aria-label={labels[si]}
            >
              <title>{labels[si]}</title>
              <rect x={segX} y={UPPER_GUM_Y} width={segW} height={GUM_H + 4} fill="transparent" />
              <g transform={`translate(${segX}, ${UPPER_GUM_Y}) scale(${scaleX}, ${scaleY}) translate(0, -18)`}>
                <path
                  d="M 0,30 C 20,18 80,18 100,22 C 120,18 180,18 200,30 L 200,58 C 180,44 160,44 150,54 C 140,44 130,44 120,54 C 110,44 100,44 90,54 C 80,44 70,44 60,54 C 50,44 40,44 30,54 C 20,44 10,44 0,58 Z"
                  fill={sel ? GUM_SELECTED : 'url(#gumGrad3upper)'}
                  stroke={sel ? STROKE_SELECTED : '#d1a0b0'}
                  strokeWidth={sel ? 1 : 0.5}
                />
              </g>
              {/* Segment divider line */}
              {si < 2 && (
                <line
                  x1={segX + segW} y1={UPPER_GUM_Y} x2={segX + segW} y2={UPPER_GUM_Y + GUM_H}
                  stroke="#c084a0" strokeWidth={1} strokeDasharray="2 2"
                />
              )}
            </g>
          );
        })}

        {/* ── Upper teeth (hang down from gum — root near gum, crown toward bite) ── */}
        {TOOTH_TYPES.map((type, i) => {
          const id = `tooth-${i + 1}`;
          const sel = isSel(id);
          const tw = TYPE_W[type];
          const th = UPPER_H[type];
          const x = X_POS[i];
          const y = UPPER_TEETH_BOTTOM - th;
          const _labelY = y + th * 0.5 + 4; void _labelY;
          return (
            <g
              key={id} id={id}
              className={`tooth3-unit${sel ? ' tooth3-selected' : ''}`}
              onClick={() => onSelect(id)}
              role="button"
              aria-label={TOOTH_NAMES[i]}
              aria-pressed={sel}
              transform={`translate(${x}, ${y})`}
            >
              <title>{TOOTH_NAMES[i]}</title>
              {/* hit area */}
              <rect x={0} y={0} width={tw} height={th} fill="transparent" />
              <ToothShape
                type={type} tw={tw} th={th}
                fill={sel ? COLOR_SELECTED : COLOR_DEFAULT}
                stroke={sel ? STROKE_SELECTED : STROKE_DEFAULT}
                flipped={false}
                uid={`u${i}`}
              />
              <text
                x={tw / 2} y={th * 0.77}
                textAnchor="middle" fontSize={6.5}
                fill={sel ? '#ffffff' : '#6B7280'}
                fontFamily="sans-serif" pointerEvents="none"
              >
                {i + 1}
              </text>
            </g>
          );
        })}

        {/* ── Bite gap line ── */}
        <line
          x1={0} y1={BITE_Y} x2={SVG_W} y2={BITE_Y}
          stroke="#D1D5DB" strokeWidth={1} strokeDasharray="4 3"
        />

        {/* ── Lower teeth (grow up from gum — crown toward bite, root down) ── */}
        {TOOTH_TYPES.map((type, i) => {
          const id = `tooth-${i + 17}`;
          const sel = isSel(id);
          const tw = TYPE_W[type];
          const th = LOWER_H[type];
          const x = X_POS[i];
          const y = LOWER_TEETH_TOP;
          return (
            <g
              key={id} id={id}
              className={`tooth3-unit${sel ? ' tooth3-selected' : ''}`}
              onClick={() => onSelect(id)}
              role="button"
              aria-label={TOOTH_NAMES[i + 16]}
              aria-pressed={sel}
              transform={`translate(${x}, ${y})`}
            >
              <title>{TOOTH_NAMES[i + 16]}</title>
              <rect x={0} y={0} width={tw} height={th} fill="transparent" />
              <ToothShape
                type={type} tw={tw} th={th}
                fill={sel ? COLOR_SELECTED : COLOR_DEFAULT}
                stroke={sel ? STROKE_SELECTED : STROKE_DEFAULT}
                flipped={true}
                uid={`l${i}`}
              />
              <text
                x={tw / 2} y={th * 0.23}
                textAnchor="middle" fontSize={6.5}
                fill={sel ? '#ffffff' : '#6B7280'}
                fontFamily="sans-serif" pointerEvents="none"
              >
                {i + 17}
              </text>
            </g>
          );
        })}

        {/* ── Lower gum — 3 segments ── */}
        {(['gum-lower-right', 'gum-lower-center', 'gum-lower-left'] as const).map((segId, si) => {
          const segW = SVG_W / 3;
          const segX = si * segW;
          const labels = ['Lower Right Gum', 'Lower Center Gum', 'Lower Left Gum'];
          const sel = isSel(segId);
          const scaleX = segW / 200;
          const scaleY = (GUM_H + 10) / 40;
          return (
            <g
              key={segId}
              id={segId}
              className={`gum3-unit${sel ? ' gum3-selected' : ''}`}
              onClick={() => onSelect(segId)}
              role="button"
              aria-label={labels[si]}
            >
              <title>{labels[si]}</title>
              <rect x={segX} y={LOWER_GUM_Y - 4} width={segW} height={GUM_H + 4} fill="transparent" />
              <g transform={`translate(${segX}, ${LOWER_GUM_Y - 10}) scale(${scaleX}, ${scaleY}) translate(0, 0)`}>
                <path
                  d="M 0,0 C 10,14 20,14 30,4 C 40,14 50,14 60,4 C 70,14 80,14 90,4 C 100,14 110,14 120,4 C 130,14 140,14 150,4 C 160,14 180,14 200,0 L 200,22 C 120,40 80,40 0,22 Z"
                  fill={sel ? GUM_SELECTED : 'url(#gumGrad3lower)'}
                  stroke={sel ? STROKE_SELECTED : '#d1a0b0'}
                  strokeWidth={sel ? 1 : 0.5}
                />
              </g>
              {si < 2 && (
                <line
                  x1={segX + segW} y1={LOWER_GUM_Y} x2={segX + segW} y2={LOWER_GUM_Y + GUM_H}
                  stroke="#c084a0" strokeWidth={1} strokeDasharray="2 2"
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* Quick select buttons */}
      <Group mt="sm" gap="xs" wrap="wrap">
        <Button size="xs" variant="light" onClick={() => onGroupSelect('Upper Jaw', UPPER_JAW)}>Upper Jaw</Button>
        <Button size="xs" variant="light" onClick={() => onGroupSelect('Lower Jaw', LOWER_JAW)}>Lower Jaw</Button>
        <Button size="xs" variant="light" onClick={() => onGroupSelect('Front Teeth', FRONT_TEETH)}>Front Teeth</Button>
        <Button size="xs" variant="light" onClick={() => onGroupSelect('Back Teeth', BACK_TEETH)}>Back Teeth</Button>
        <Button size="xs" variant="light" color="pink" onClick={() => onGroupSelect('Upper Gum', ['gum-upper-right', 'gum-upper-center', 'gum-upper-left'])}>Upper Gum</Button>
        <Button size="xs" variant="light" color="pink" onClick={() => onGroupSelect('Lower Gum', ['gum-lower-right', 'gum-lower-center', 'gum-lower-left'])}>Lower Gum</Button>
        <Button size="xs" variant="light" color="red" onClick={onClearAll} disabled={selected.length === 0}>Clear All</Button>
      </Group>
    </div>
  );
};
