'use client';
import React from 'react';

import { useState } from 'react';
import { Box, Stack, Group, Text, Button, Badge, Alert } from '@mantine/core';
import { AlertTriangle } from 'lucide-react';
import { DentalMapSVG } from './DentalMapSVG';
// import { DentalMapSVG2 } from './DentalMapSVG2';
import { DentalMapSVG3 } from './DentalMapSVG3';

// Swap between maps by commenting/uncommenting:
// const ActiveDentalMap = DentalMapSVG;
// const ActiveDentalMap = DentalMapSVG2;
const ActiveDentalMap = DentalMapSVG3;

void DentalMapSVG; void DentalMapSVG3; // keep imports live for easy swapping
import type {
  MouthModelSelection,
  FDINumber,
  Quadrant,
  ToothType,
} from '@/modules/oral-iq/domain/oral-iq.types';

export interface DentalMapSelectionStepProps {
  onProceed: (
    selection: MouthModelSelection,
    selectedIds: string[],
    displayLabels: string[],
    groups: Record<string, string[]>
  ) => void;
  loading?: boolean;
  initialSelected?: string[];
  initialGroups?: Record<string, string[]>;
}

const UPPER_FDI: Record<number, number> = {
  1: 18,
  2: 17,
  3: 16,
  4: 15,
  5: 14,
  6: 13,
  7: 12,
  8: 11,
  9: 21,
  10: 22,
  11: 23,
  12: 24,
  13: 25,
  14: 26,
  15: 27,
  16: 28,
};
const LOWER_FDI: Record<number, number> = {
  17: 38,
  18: 37,
  19: 36,
  20: 35,
  21: 34,
  22: 33,
  23: 32,
  24: 31,
  25: 41,
  26: 42,
  27: 43,
  28: 44,
  29: 45,
  30: 46,
  31: 47,
  32: 48,
};

function getToothType(fdiPosition: number): ToothType {
  if (fdiPosition === 1 || fdiPosition === 2) return 'incisor';
  if (fdiPosition === 3) return 'canine';
  if (fdiPosition === 4 || fdiPosition === 5) return 'premolar';
  return 'molar';
}

function buildSelection(id: string): MouthModelSelection {
  if (id.startsWith('gum-')) {
    return { regionType: 'gum', jaw: id === 'gum-upper' ? 'upper' : 'lower', regionId: id };
  }
  const toothNum = parseInt(id.replace('tooth-', ''), 10);
  const isUpper = toothNum <= 16;
  const fdiNumber = isUpper ? UPPER_FDI[toothNum] : LOWER_FDI[toothNum];
  const quadrant = Math.floor(fdiNumber / 10) as Quadrant;
  const fdiPosition = fdiNumber % 10;
  return {
    regionType: 'tooth',
    regionId: fdiNumber.toString(),
    jaw: isUpper ? 'upper' : 'lower',
    quadrant,
    fdiNumber: fdiNumber as FDINumber,
    toothType: getToothType(fdiPosition),
  };
}

function getLabel(id: string): string {
  if (id === 'gum-upper') return 'Upper Gum';
  if (id === 'gum-lower') return 'Lower Gum';
  return `Tooth ${id.replace('tooth-', '')}`;
}

export const DentalMapSelectionStep: React.FC<DentalMapSelectionStepProps> = ({
  onProceed,
  loading = false,
  initialSelected = [],
  initialGroups = {},
}) => {
  // individual tooth/gum selections (not part of a group)
  const [selected, setSelected] = useState<string[]>(initialSelected);
  // group selections: { "Upper Jaw": ["tooth-1", ...], ... }
  const [groups, setGroups] = useState<Record<string, string[]>>(initialGroups);
  const [error, setError] = useState<string | null>(null);

  // all highlighted IDs for the SVG (individual + all group members)
  const allHighlighted = [...selected, ...Object.values(groups).flat()];

  const handleSelect = (id: string) => {
    setError(null);
    // if this tooth belongs to an active group, remove the group and add remaining teeth individually
    const owningGroup = Object.entries(groups).find(([, ids]) => ids.includes(id));
    if (owningGroup) {
      const [groupName, groupIds] = owningGroup;
      const remaining = groupIds.filter((gid) => gid !== id);
      setGroups((prev) => {
        const next = { ...prev };
        delete next[groupName];
        return next;
      });
      setSelected((prev) => [...new Set([...prev, ...remaining])]);
    } else {
      setSelected((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
    }
  };

  const handleGroupSelect = (groupName: string, ids: string[]) => {
    setError(null);
    // if group already active → remove it and deselect its teeth from individual too
    if (groups[groupName]) {
      setGroups((prev) => {
        const next = { ...prev };
        delete next[groupName];
        return next;
      });
      setSelected((prev) => prev.filter((id) => !ids.includes(id)));
    } else {
      // add group, remove any individual selections that overlap
      setGroups((prev) => ({ ...prev, [groupName]: ids }));
      setSelected((prev) => prev.filter((id) => !ids.includes(id)));
    }
  };

  const handleClearAll = () => {
    setSelected([]);
    setGroups({});
    setError(null);
  };

  const hasSelection = selected.length > 0 || Object.keys(groups).length > 0;

  const handleProceed = () => {
    if (!hasSelection) {
      setError('Please select at least one tooth or gum area');
      return;
    }
    // first item: prefer first group member, else first individual
    const firstId = Object.values(groups)[0]?.[0] ?? selected[0];
    const selection = buildSelection(firstId);

    // display labels: group names + individual labels
    const displayLabels = [...Object.keys(groups), ...selected.map(getLabel)];

    onProceed(selection, allHighlighted, displayLabels, groups);
  };

  // badges to show
  const groupBadges = Object.keys(groups);
  const individualBadges = selected;

  return (
    <Stack gap="md">
      <ActiveDentalMap
        selected={allHighlighted}
        onSelect={handleSelect}
        onClearAll={handleClearAll}
        onGroupSelect={handleGroupSelect}
      />

      <Group gap="xs" align="center">
        <Text size="sm" fw={500} c="dimmed">
          Selected:
        </Text>
        <Badge variant="light" color="blue">
          {groupBadges.length + individualBadges.length} area(s) selected
        </Badge>
      </Group>

      {hasSelection && (
        <Group gap="xs" wrap="wrap">
          {groupBadges.map((name) => (
            <Badge
              key={name}
              variant="filled"
              color="blue"
              style={{ cursor: 'pointer' }}
              rightSection={
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    handleGroupSelect(name, groups[name]);
                  }}
                  style={{ marginLeft: 4, fontWeight: 700 }}
                  aria-label={`Remove ${name}`}
                >
                  ×
                </span>
              }
            >
              {name}
            </Badge>
          ))}
          {individualBadges.map((id) => (
            <Badge
              key={id}
              variant="filled"
              color="blue"
              style={{ cursor: 'pointer' }}
              rightSection={
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(id);
                  }}
                  style={{ marginLeft: 4, fontWeight: 700 }}
                  aria-label={`Remove ${getLabel(id)}`}
                >
                  ×
                </span>
              }
            >
              {getLabel(id)}
            </Badge>
          ))}
        </Group>
      )}

      {error && (
        <Alert
          icon={<AlertTriangle size={16} />}
          color="red"
          title="Selection Required"
          withCloseButton
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      <Box style={{ display: 'flex', justifyContent: 'flex-end' }} mt={{ base: 'lg', sm: 'md' }}>
        <Button
          size="md"
          radius="md"
          color="primary"
          px={60}
          onClick={handleProceed}
          loading={loading}
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Next'}
        </Button>
      </Box>
    </Stack>
  );
};
