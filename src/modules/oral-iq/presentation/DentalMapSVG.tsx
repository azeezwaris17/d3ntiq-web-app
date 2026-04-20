'use client';
import React from 'react';

import { Button, Group } from '@mantine/core';

export interface DentalMapSVGProps {
  selected: string[];
  onSelect: (id: string) => void;
  onClearAll: () => void;
  onGroupSelect: (groupName: string, ids: string[]) => void;
}

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

/** Returns the full anatomical name for a map ID (e.g. "tooth-18" -> "Lower Right 2nd Molar") */
export function getToothName(id: string): string {
  if (id === 'gum-upper') return 'Upper Gum';
  if (id === 'gum-lower') return 'Lower Gum';
  const num = parseInt(id.replace('tooth-', ''), 10);
  if (num >= 1 && num <= 32) return TOOTH_NAMES[num - 1];
  return id;
}

// Heights for upper teeth (index 0 = tooth-1)
const UPPER_HEIGHTS: number[] = [70, 70, 80, 80, 90, 95, 95, 95, 95, 95, 90, 80, 80, 70, 70, 70];
// Heights for lower teeth (index 0 = tooth-17)
const LOWER_HEIGHTS: number[] = [65, 65, 75, 75, 85, 90, 90, 90, 90, 90, 85, 75, 75, 65, 65, 65];

const TOOTH_WIDTH = 34;
const GAP = 2;
const START_X = 20;
const UPPER_BOTTOM = 130;
const LOWER_BOTTOM = 245;

function getToothX(index: number): number {
  return START_X + index * (TOOTH_WIDTH + GAP);
}

const COLOR_DEFAULT = '#E5E7EB';
const COLOR_SELECTED = '#2563EB';
const COLOR_GUM_DEFAULT = '#F9A8D4';
const COLOR_GUM_SELECTED = '#93C5FD';
const STROKE_DEFAULT = '#9CA3AF';
const STROKE_SELECTED = '#1D4ED8';

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

export const DentalMapSVG: React.FC<DentalMapSVGProps> = ({ selected, onSelect, onClearAll, onGroupSelect }) => {
  const isSelected = (id: string) => selected.includes(id);

  return (
    <div>
      <svg
        viewBox="0 0 600 280"
        width="100%"
        preserveAspectRatio="xMidYMid meet"
        aria-label="Dental map"
        role="img"
      >
        <style>{`
          .tooth-unit { cursor: pointer; }
          .tooth-unit:not(.tooth-selected):hover rect { fill: #BFDBFE; }
          .gum-unit { cursor: pointer; }
        `}</style>

        {/* Upper gum */}
        <g id="gum-upper" className="gum-unit" onClick={() => onSelect('gum-upper')} role="button" aria-label="Upper Gum">
          <title>Upper Gum</title>
          <rect x={START_X} y={10} width={580 - START_X} height={20} rx={4}
            fill={isSelected('gum-upper') ? COLOR_GUM_SELECTED : COLOR_GUM_DEFAULT}
            stroke={isSelected('gum-upper') ? STROKE_SELECTED : STROKE_DEFAULT} strokeWidth={1} />
        </g>

        {/* Upper teeth */}
        {UPPER_HEIGHTS.map((h, i) => {
          const id = `tooth-${i + 1}`;
          const sel = isSelected(id);
          const x = getToothX(i);
          const y = UPPER_BOTTOM - h;
          const labelY = y + h / 2 + 4;
          return (
            <g key={id} id={id} className={`tooth-unit${sel ? ' tooth-selected' : ''}`}
              onClick={() => onSelect(id)} role="button" aria-label={TOOTH_NAMES[i]} aria-pressed={sel}>
              <title>{TOOTH_NAMES[i]}</title>
              <rect x={x} y={y} width={TOOTH_WIDTH} height={h} rx={3}
                fill={sel ? COLOR_SELECTED : COLOR_DEFAULT}
                stroke={sel ? STROKE_SELECTED : STROKE_DEFAULT} strokeWidth={1} />
              <text x={x + TOOTH_WIDTH / 2} y={labelY} textAnchor="middle" fontSize={9}
                fill={sel ? '#ffffff' : '#374151'} fontFamily="sans-serif" pointerEvents="none">
                {i + 1}
              </text>
            </g>
          );
        })}

        {/* Gap line */}
        <line x1={START_X} y1={140} x2={580} y2={140} stroke="#D1D5DB" strokeWidth={1} strokeDasharray="4 2" />

        {/* Lower teeth */}
        {LOWER_HEIGHTS.map((h, i) => {
          const id = `tooth-${i + 17}`;
          const sel = isSelected(id);
          const x = getToothX(i);
          const y = LOWER_BOTTOM - h;
          const labelY = y + h / 2 + 4;
          return (
            <g key={id} id={id} className={`tooth-unit${sel ? ' tooth-selected' : ''}`}
              onClick={() => onSelect(id)} role="button" aria-label={TOOTH_NAMES[i + 16]} aria-pressed={sel}>
              <title>{TOOTH_NAMES[i + 16]}</title>
              <rect x={x} y={y} width={TOOTH_WIDTH} height={h} rx={3}
                fill={sel ? COLOR_SELECTED : COLOR_DEFAULT}
                stroke={sel ? STROKE_SELECTED : STROKE_DEFAULT} strokeWidth={1} />
              <text x={x + TOOTH_WIDTH / 2} y={labelY} textAnchor="middle" fontSize={9}
                fill={sel ? '#ffffff' : '#374151'} fontFamily="sans-serif" pointerEvents="none">
                {i + 17}
              </text>
            </g>
          );
        })}

        {/* Lower gum */}
        <g id="gum-lower" className="gum-unit" onClick={() => onSelect('gum-lower')} role="button" aria-label="Lower Gum">
          <title>Lower Gum</title>
          <rect x={START_X} y={250} width={580 - START_X} height={20} rx={4}
            fill={isSelected('gum-lower') ? COLOR_GUM_SELECTED : COLOR_GUM_DEFAULT}
            stroke={isSelected('gum-lower') ? STROKE_SELECTED : STROKE_DEFAULT} strokeWidth={1} />
        </g>
      </svg>

      {/* Quick select buttons */}
      <Group mt="sm" gap="xs" wrap="wrap">
        <Button size="xs" variant="light" onClick={() => onGroupSelect('Upper Jaw', UPPER_JAW)}>Upper Jaw</Button>
        <Button size="xs" variant="light" onClick={() => onGroupSelect('Lower Jaw', LOWER_JAW)}>Lower Jaw</Button>
        <Button size="xs" variant="light" onClick={() => onGroupSelect('Front Teeth', FRONT_TEETH)}>Front Teeth</Button>
        <Button size="xs" variant="light" onClick={() => onGroupSelect('Back Teeth', BACK_TEETH)}>Back Teeth</Button>
        <Button size="xs" variant="light" color="red" onClick={onClearAll} disabled={selected.length === 0}>Clear All</Button>
      </Group>
    </div>
  );
};
