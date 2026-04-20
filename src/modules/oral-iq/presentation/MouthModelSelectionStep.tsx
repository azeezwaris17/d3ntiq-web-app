'use client';
import React from 'react';

import { Stack, Button, Alert, Text, Box } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { AlertTriangle } from 'lucide-react';
import { InteractiveMouthModel2 } from '@/shared/components/oral-iq';

export interface SelectedToothState {
  index: number;
  isUpper: boolean;
}

export interface MouthModelSelectionStepProps {
  selectedTooth: SelectedToothState | null;
  onToothSelect: (toothIndex: number, isUpper: boolean) => void;
  onProceed: () => void;
  loading: boolean;
  showAlert: boolean;
  onCloseAlert: () => void;
  alertMessage?: string;
  maxWidth?: number;
  disableProceedWithoutSelection?: boolean;
}

export const MouthModelSelectionStep: React.FC<MouthModelSelectionStepProps> = ({
  selectedTooth,
  onToothSelect,
  onProceed,
  loading,
  showAlert,
  onCloseAlert,
  alertMessage = 'Please select a tooth or area before proceeding.',
  maxWidth = 900,
  disableProceedWithoutSelection = true,
}) => {
  const isMobile = useMediaQuery('(max-width: 767px)');

  return (
    <Stack gap="md" align="center">
      {showAlert && (
        <Alert icon={<AlertTriangle size={16} />} title="Selection Required" color="warning"
          onClose={onCloseAlert} withCloseButton mb="md" style={{ maxWidth, width: '100%' }}>
          {alertMessage}
        </Alert>
      )}

      <Box style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 24, width: '100%', marginBottom: 40 }}>
        <InteractiveMouthModel2 variant="circular" selectedTooth={selectedTooth} onToothSelect={onToothSelect} />

        {!selectedTooth && (
          <Box style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <Box bg="#000" style={{
              position: 'relative', color: 'white',
              padding: isMobile ? '14px 14px 14px 18px' : '24px',
              clipPath: 'polygon(12% 0%, 100% 0%, 100% 100%, 12% 100%, 0% 50%)',
              boxShadow: '0 15px 40px rgba(0,0,0,0.12)', pointerEvents: 'auto',
              minWidth: isMobile ? '160px' : '220px', maxWidth: isMobile ? 200 : undefined,
            }}>
              <Text style={{ fontSize: isMobile ? 13 : 16, fontWeight: 500, lineHeight: isMobile ? 1.25 : 1.3, textAlign: 'left', whiteSpace: isMobile ? 'normal' : 'nowrap' }}>
                <Text component="span" inherit c="white">Click any tooth</Text>{' '}
                <Text component="span" inherit c="white" fw={700}>or</Text>
                <br />
                <Text component="span" inherit c="white" fw={700}>area to begin</Text>
              </Text>
            </Box>
          </Box>
        )}
      </Box>

      <Button size="md" onClick={onProceed} px={60} radius="md" color="primary"
        disabled={loading || (disableProceedWithoutSelection && !selectedTooth)} loading={loading}>
        {loading ? 'Processing...' : 'Proceed'}
      </Button>
    </Stack>
  );
};
