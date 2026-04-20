'use client';
import React from 'react';

import { useState, useCallback, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Box, Group, Button, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

export interface InteractiveMouthModelProps {
  onToothSelect?: (toothIndex: number, isUpper: boolean) => void;
  onMultiSelect?: (toothIndices: Array<{ index: number; isUpper: boolean }>) => void;
  selectedTooth?: { index: number; isUpper: boolean } | null;
  selectedTeeth?: Array<{ index: number; isUpper: boolean }>;
  showToggle?: boolean;
  defaultView?: 'image' | '3d';
  backgroundColor?: string;
  className?: string;
  interactive?: boolean;
  disabled?: boolean;
}

const LoadingState = () => (
  <Box
    className="flex h-full min-h-[240px] w-full items-center justify-center rounded-lg bg-slate-800"
    style={{ background: '#0f172a' }}
  >
    <Box className="flex flex-col items-center gap-2">
      <Box className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white" />
      <Text size="xs" fw={600} tt="uppercase" style={{ letterSpacing: '0.1em', color: 'white' }}>
        Loading 3D Model
      </Text>
    </Box>
  </Box>
);

// Using ThreeDDentalModel (procedural 3D model)
const ThreeDDentalModel = dynamic(
  () => import('./3DDentalModel').then((mod) => mod.ThreeDDentalModel),
  { ssr: false, loading: LoadingState }
);

export const InteractiveMouthModel: React.FC<InteractiveMouthModelProps> = ({
  onToothSelect,
  onMultiSelect,
  selectedTooth,
  selectedTeeth: propSelectedTeeth,
  showToggle: _showToggle = true,
  defaultView: _defaultView = '3d',
  className = '',
  interactive = true,
  disabled = false,
}) => {
  const isMobile = useMediaQuery('(max-width: 767px)');

  // Internal state for multi-selection (FDI strings)
  const [selectedFdis, setSelectedFdis] = useState<string[]>([]);

  // --- CONVERSION UTILITIES ---

  /**
   * Converts (index, jaw) to FDI String (e.g., 0, true -> "28")
   */
  const indexAndJawToFdi = useCallback((index: number, isUpper: boolean): string => {
    if (isUpper) {
      return index <= 7 ? `2${8 - index}` : `1${index - 7}`;
    } else {
      return index <= 7 ? `3${8 - index}` : `4${index - 7}`;
    }
  }, []);

  // Update selectedFdis when selectedTooth or propSelectedTeeth changes
  useEffect(() => {
    if (propSelectedTeeth && propSelectedTeeth.length > 0) {
      const fdis = propSelectedTeeth.map((t) => indexAndJawToFdi(t.index, t.isUpper));
      setSelectedFdis(fdis);
    } else if (selectedTooth && selectedTooth.index >= 0) {
      const fdi = indexAndJawToFdi(selectedTooth.index, selectedTooth.isUpper);
      setSelectedFdis([fdi]);
    } else {
      setSelectedFdis([]);
    }
  }, [selectedTooth, propSelectedTeeth, indexAndJawToFdi]);

  /**
   * Converts FDI String to (index, jaw) (e.g., "28" -> 0, true)
   */
  const fdiToIndexAndJaw = useCallback(
    (fdi: string): { index: number; isUpper: boolean } | null => {
      if (!fdi || fdi.length < 2) return null;
      const q = parseInt(fdi.charAt(0));
      const t = parseInt(fdi.charAt(1));
      const isUpper = q === 1 || q === 2;

      let index: number;
      if (q === 2) index = 8 - t;
      else if (q === 1) index = t + 7;
      else if (q === 3) index = 8 - t;
      else index = t + 7;

      return { index, isUpper };
    },
    []
  );

  // Compute current selected FDI for the 3D Model
  const selectedFdi = useMemo(() => {
    return selectedTooth ? indexAndJawToFdi(selectedTooth.index, selectedTooth.isUpper) : null;
  }, [selectedTooth, indexAndJawToFdi]);

  // --- HANDLERS ---

  // Handle single tooth selection from 3D model
  const handle3DToothSelect = useCallback(
    (fdi: string) => {
      const converted = fdiToIndexAndJaw(fdi);
      if (converted && onToothSelect) {
        onToothSelect(converted.index, converted.isUpper);
      }
    },
    [onToothSelect, fdiToIndexAndJaw]
  );

  // Handle multi-tooth selection from 3D model
  const handle3DMultiSelect = useCallback(
    (fdis: string[]) => {
      setSelectedFdis(fdis);
      if (onMultiSelect && fdis.length > 0) {
        const converted = fdis
          .map((fdi) => fdiToIndexAndJaw(fdi))
          .filter((t): t is { index: number; isUpper: boolean } => t !== null);
        if (converted.length > 0) {
          onMultiSelect(converted);
        }
      } else if (onMultiSelect && fdis.length === 0) {
        onMultiSelect([]);
      }
    },
    [onMultiSelect, fdiToIndexAndJaw]
  );

  // Clear selection handler
  const handleClearSelection = useCallback(() => {
    setSelectedFdis([]);
    if (onToothSelect) {
      onToothSelect(-1, false);
    }
    if (onMultiSelect) {
      onMultiSelect([]);
    }
  }, [onToothSelect, onMultiSelect]);

  return (
    <Box className={`w-full ${className}`}>
      {/* Viewport - Perfectly proportioned 3D model area */}
      <Box
        className="relative w-full"
        style={{
          minHeight: isMobile ? '220px' : '320px',
          height: isMobile ? '280px' : '380px',
          maxHeight: isMobile ? '320px' : '420px',
        }}
      >
        <ThreeDDentalModel
          onToothSelect={interactive && !disabled ? handle3DToothSelect : undefined}
          onMultiSelect={interactive && !disabled ? handle3DMultiSelect : undefined}
          selectedFdi={selectedFdi}
          selectedFdis={selectedFdis}
          disabled={disabled || !interactive}
        />
      </Box>

      {/* Selected Footer Info - Compact */}
      {(selectedTooth || selectedFdis.length > 0) && (
        <Box
          p="sm"
          mt={4}
          style={{
            borderTop: '1px solid rgba(255,255,255,0.05)',
            backgroundColor: 'rgba(0,0,0,0.3)',
            backdropFilter: 'blur(8px)',
            borderRadius: '0 0 8px 8px',
          }}
        >
          <Group justify="space-between" align="center">
            <Box>
              <Text size="xs" fw={700} tt="uppercase" c="red" style={{ letterSpacing: '0.1em' }} mb={1}>
                {selectedFdis.length > 1 ? `${selectedFdis.length} Selected` : 'Selected'}
              </Text>

              {selectedFdis.length > 1 ? (
                <>
                  <Text size="md" fw={700} c="white">
                    {selectedFdis.length} Teeth
                  </Text>
                  <Text size="xs" tt="uppercase" c="rgba(255,255,255,0.5)" style={{ letterSpacing: '0.05em' }}>
                    {selectedFdis.join(', ')}
                  </Text>
                </>
              ) : selectedTooth ? (
                (() => {
                  const fdi = indexAndJawToFdi(selectedTooth.index, selectedTooth.isUpper);
                  return (
                    <>
                      <Text size="md" fw={700} c="white">
                        Tooth {fdi}
                      </Text>
                      <Text size="xs" tt="uppercase" c="rgba(255,255,255,0.5)" style={{ letterSpacing: '0.05em' }}>
                        {selectedTooth.isUpper ? 'Upper' : 'Lower'} • Q{fdi.charAt(0)}
                      </Text>
                    </>
                  );
                })()
              ) : null}
            </Box>

            {interactive && !disabled && (
              <Button
                onClick={handleClearSelection}
                size="xs"
                variant="subtle"
                style={{
                  color: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  height: 26,
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  padding: '0 12px',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.15)',
                  },
                }}
              >
                Clear
              </Button>
            )}
          </Group>
        </Box>
      )}
    </Box>
  );
};