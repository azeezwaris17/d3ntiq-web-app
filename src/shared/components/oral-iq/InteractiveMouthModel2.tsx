'use client';
import React from 'react';

import { useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Box } from '@mantine/core';
import { useMantineTheme } from '@mantine/core';
import { themeColors } from '@/shared/theme';

export interface InteractiveMouthModel2Props {
  /** Callback when a tooth is selected */
  onToothSelect?: (toothIndex: number, isUpper: boolean) => void;
  /** Currently selected tooth */
  selectedTooth?: { index: number; isUpper: boolean } | null;
  /** Display variant */
  variant?: 'default' | 'circular';
  /** Custom className for the wrapper */
  className?: string;
  /** Custom styles for the wrapper */
  style?: React.CSSProperties;
  /** Show 3D model controls (rotate, zoom) */
  showControls?: boolean;
  /** Initial camera view */
  initialView?: 'frontal' | 'occlusal' | 'lateral';
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const indexAndJawToFdi = (index: number, isUpper: boolean): string => {
  if (isUpper) return index <= 7 ? `2${8 - index}` : `1${index - 7}`;
  return index <= 7 ? `3${8 - index}` : `4${index - 7}`;
};

const fdiToIndexAndJaw = (fdi: string): { index: number; isUpper: boolean } | null => {
  if (!fdi || fdi.length < 2) return null;
  const q = parseInt(fdi.charAt(0), 10);
  const t = parseInt(fdi.charAt(1), 10);
  const isUpper = q === 1 || q === 2;
  let index: number;
  if (q === 2) index = 8 - t;
  else if (q === 1) index = t + 7;
  else if (q === 3) index = 8 - t;
  else index = t + 7;
  return { index, isUpper };
};

// ============================================================================
// LOADING PLACEHOLDER
// ============================================================================

const LoadingPlaceholder = () => (
  <Box
    style={{
      display: 'flex',
      height: '100%',
      minHeight: 320,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'transparent',
    }}
  >
    <Box
      style={{
        height: 40,
        width: 40,
        animation: 'spin 1s linear infinite',
        borderRadius: '50%',
        border: '2px solid #E5E7EB',
        borderTopColor: '#6B7280',
      }}
    />
  </Box>
);

// ============================================================================
// DYNAMIC IMPORT
// ============================================================================

const ThreeDDentalModel = dynamic(
  () => import('./3DDentalModel').then((mod) => mod.ThreeDDentalModel),
  { ssr: false, loading: LoadingPlaceholder }
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * InteractiveMouthModel2 - Unified 3D dental model component
 *
 * Features:
 * - Two display variants: default (plain) and circular (with gradient background)
 * - Interactive tooth selection
 * - Responsive sizing
 * - Optional controls
 * - Clean, minimal design
 * - Optimized with React.memo for performance
 *
 * Usage:
 *
 * // Default variant (plain)
 * <InteractiveMouthModel2
 *   selectedTooth={selectedTooth}
 *   onToothSelect={handleToothSelect}
 * />
 *
 * // Circular variant (with gradient background)
 * <InteractiveMouthModel2
 *   variant="circular"
 *   selectedTooth={selectedTooth}
 *   onToothSelect={handleToothSelect}
 * />
 */
export const InteractiveMouthModel2: React.FC<InteractiveMouthModel2Props> = React.memo(
  ({
    onToothSelect,
    selectedTooth,
    variant = 'default',
    className = '',
    style,
    showControls = false,
    initialView = 'frontal',
  }) => {
    const theme = useMantineTheme();
    const colors = themeColors(theme);

    // Convert selected tooth to FDI notation
    const selectedFdi = useMemo(
      () => (selectedTooth ? indexAndJawToFdi(selectedTooth.index, selectedTooth.isUpper) : null),
      [selectedTooth]
    );

    // Handle tooth selection from 3D model
    const handleFdiSelect = useCallback(
      (fdi: string) => {
        const converted = fdiToIndexAndJaw(fdi);
        if (converted && onToothSelect) {
          onToothSelect(converted.index, converted.isUpper);
        }
      },
      [onToothSelect]
    );

    // ──────────────────────────────────────────────────────────────────────────
    // CIRCULAR VARIANT
    // ──────────────────────────────────────────────────────────────────────────

    if (variant === 'circular') {
      return (
        <Box
          className={className}
          style={{
            position: 'relative',
            width: 'min(520px, 80vw)',
            height: 'min(520px, 80vw)',
            borderRadius: '50%',
            background: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.98) 0%, ${colors.neutral[0]} 25%, rgba(219,232,253,0.92) 50%, rgba(180,220,240,0.88) 100%)`,
            boxShadow:
              '0 24px 64px -16px rgba(70, 134, 157, 0.18), 0 12px 32px -12px rgba(0,0,0,0.06)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            padding: 36,
            flexShrink: 0,
            ...style,
          }}
        >
          <Box
            style={{
              width: '100%',
              height: '100%',
              minHeight: 300,
              maxWidth: 380,
            }}
          >
            <ThreeDDentalModel
              onToothSelect={onToothSelect ? handleFdiSelect : undefined}
              selectedFdi={selectedFdi}
              showControls={showControls}
              minimalContainer
              initialView={initialView}
            />
          </Box>
        </Box>
      );
    }

    // ──────────────────────────────────────────────────────────────────────────
    // DEFAULT VARIANT
    // ──────────────────────────────────────────────────────────────────────────

    return (
      <Box
        className={className}
        style={{
          width: '100%',
          minHeight: 360,
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
          ...style,
        }}
      >
        <ThreeDDentalModel
          onToothSelect={onToothSelect ? handleFdiSelect : undefined}
          selectedFdi={selectedFdi}
          showControls={showControls}
          minimalContainer
          initialView={initialView}
        />
      </Box>
    );
  }
);

InteractiveMouthModel2.displayName = 'InteractiveMouthModel2';
