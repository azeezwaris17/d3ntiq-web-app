'use client';
import React from 'react';

import { useState } from 'react';
import {
  Box, Title, Text, Stack, TextInput, Button, Group, Notification,
  Select, Progress, Switch, Tooltip, FileButton, Image, ActionIcon,
  Divider, Checkbox, Modal,
} from '@mantine/core';
import { CheckCircle, XCircle, HelpCircle, Upload, X, AlertCircle } from 'lucide-react';
import { useSubmitInsuranceProfile } from '@/modules/dashboard/infrastructure/useDashboard';

// ─── Types ────────────────────────────────────────────────────────────────────

interface InsuranceFormData {
  insuranceProvider: string;
  memberId: string;
  groupNumber: string;
  policyHolderName: string;
  policyHolderDob: string;
  relationshipToHolder: string;
  planType: string;
  effectiveDate: string;
  isPrimary: boolean;
  preferredProvider: string;
  cardFrontFile: File | null;
  cardFrontPreview: string | null;
  cardBackFile: File | null;
  cardBackPreview: string | null;
  consentChecked: boolean;
}

const INITIAL: InsuranceFormData = {
  insuranceProvider: '',
  memberId: '',
  groupNumber: '',
  policyHolderName: '',
  policyHolderDob: '',
  relationshipToHolder: '',
  planType: '',
  effectiveDate: '',
  isPrimary: true,
  preferredProvider: '',
  cardFrontFile: null,
  cardFrontPreview: null,
  cardBackFile: null,
  cardBackPreview: null,
  consentChecked: false,
};

const RELATIONSHIP_OPTIONS = ['Self', 'Spouse', 'Child', 'Other'];
const PLAN_TYPE_OPTIONS    = ['PPO', 'HMO', 'DHMO', 'Indemnity'];
const INSURANCE_PROVIDERS  = [
  'Aetna', 'Cigna', 'Delta Dental', 'Guardian', 'Humana',
  'MetLife', 'Principal', 'United Healthcare', 'Other',
];

const MAX_MB   = 5;
const ACCEPTED = 'image/jpeg,image/png,application/pdf';

function validateFile(file: File): string | null {
  if (file.size > MAX_MB * 1024 * 1024) return `File must be under ${MAX_MB}MB.`;
  if (!['image/jpeg', 'image/png', 'application/pdf'].includes(file.type))
    return 'Only JPG, PNG, or PDF files are accepted.';
  return null;
}

function readPreview(file: File, cb: (url: string) => void) {
  if (file.type === 'application/pdf') { cb('pdf'); return; }
  const r = new FileReader();
  r.onload = () => cb(r.result as string);
  r.readAsDataURL(file);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StepProgress({ step }: { step: number }) {
  const labels = ['Basic Info', 'Coverage', 'Upload Card', 'Review'];
  return (
    <Box mb={28}>
      <Group justify="space-between" mb={6}>
        {labels.map((label, i) => (
          <Text key={label} size="xs" fw={i + 1 <= step ? 600 : 400} c={i + 1 <= step ? '#2d7d9a' : '#94a3b8'}>
            {i + 1}. {label}
          </Text>
        ))}
      </Group>
      <Progress value={(step / 4) * 100} color="#2d7d9a" size="sm" radius="xl" />
    </Box>
  );
}

interface UploadCardProps {
  label: string;
  file: File | null;
  preview: string | null;
  onFile: (f: File) => void;
  onRemove: () => void;
  error?: string;
}

function UploadCard({ label, file, preview, onFile, onRemove, error }: UploadCardProps) {
  return (
    <Box>
      <Text size="sm" fw={600} c="#1e293b" mb={8}>{label}</Text>
      {file ? (
        <Box p={12} style={{ border: '1px solid #e2e8f0', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 12 }}>
          {preview && preview !== 'pdf' ? (
            <Image src={preview} alt={label} w={64} h={48} fit="cover" radius={6} />
          ) : (
            <Box w={64} h={48} style={{ background: '#f1f5f9', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Text size="xs" c="#64748b">PDF</Text>
            </Box>
          )}
          <Box style={{ flex: 1 }}>
            <Text size="sm" fw={500} c="#1e293b" lineClamp={1}>{file.name}</Text>
            <Text size="xs" c="#64748b">{(file.size / 1024).toFixed(0)} KB</Text>
          </Box>
          <ActionIcon variant="subtle" color="red" size="sm" onClick={onRemove} aria-label="Remove">
            <X size={14} />
          </ActionIcon>
        </Box>
      ) : (
        <FileButton onChange={(f) => f && onFile(f)} accept={ACCEPTED}>
          {(props) => (
            <Box
              {...props}
              component="button"
              type="button"
              p={20}
              style={{ width: '100%', border: '2px dashed #cbd5e1', borderRadius: 10, background: '#f8fafc', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
            >
              <Upload size={22} color="#94a3b8" strokeWidth={1.5} />
              <Text size="sm" c="#64748b">Drag & drop or click to upload</Text>
              <Text size="xs" c="#94a3b8">JPG, PNG, PDF · Max {MAX_MB}MB</Text>
            </Box>
          )}
        </FileButton>
      )}
      {error && <Group gap={4} mt={4}><AlertCircle size={13} color="#ef4444" /><Text size="xs" c="red">{error}</Text></Group>}
    </Box>
  );
}

// ─── Wizard ───────────────────────────────────────────────────────────────────

export function InsuranceWizard({ onSkip }: { onSkip: () => void }) {
  const [step, setStep]             = useState(1);
  const [data, setData]             = useState<InsuranceFormData>(INITIAL);
  const [fileErrors, setFileErrors] = useState<{ front?: string; back?: string }>({});
  const [error, setError]           = useState('');
  const [success, setSuccess]       = useState(false);
  const [skipWarning, setSkipWarning] = useState(false);
  const { submitInsuranceProfile, loading } = useSubmitInsuranceProfile();

  const update = (patch: Partial<InsuranceFormData>) => setData((p) => ({ ...p, ...patch }));

  function validateStep1(): string | null {
    if (!data.insuranceProvider.trim()) return 'Insurance provider is required.';
    if (!data.memberId.trim())          return 'Member ID is required.';
    if (!data.policyHolderName.trim())  return 'Policy holder name is required.';
    if (!data.policyHolderDob)          return 'Policy holder date of birth is required.';
    if (!data.relationshipToHolder)     return 'Relationship to holder is required.';
    return null;
  }

  function handleNext() {
    setError('');
    if (step === 1) { const e = validateStep1(); if (e) { setError(e); return; } }
    setStep((s) => s + 1);
  }

  function handleFrontFile(file: File) {
    const e = validateFile(file);
    if (e) { setFileErrors((p) => ({ ...p, front: e })); return; }
    setFileErrors((p) => ({ ...p, front: undefined }));
    readPreview(file, (url) => update({ cardFrontFile: file, cardFrontPreview: url }));
  }

  function handleBackFile(file: File) {
    const e = validateFile(file);
    if (e) { setFileErrors((p) => ({ ...p, back: e })); return; }
    setFileErrors((p) => ({ ...p, back: undefined }));
    readPreview(file, (url) => update({ cardBackFile: file, cardBackPreview: url }));
  }

  async function handleSubmit() {
    if (!data.consentChecked) { setError('You must authorize D3NTIQ to share your insurance information.'); return; }
    setError('');
    try {
      await submitInsuranceProfile({
        insuranceProvider: data.insuranceProvider,
        memberId: data.memberId,
        groupNumber: data.groupNumber || undefined,
        policyHolderName: data.policyHolderName,
        policyHolderDob: data.policyHolderDob,
        relationshipToHolder: data.relationshipToHolder,
        planType: data.planType || undefined,
        effectiveDate: data.effectiveDate || undefined,
        isPrimary: data.isPrimary,
        preferredProvider: data.preferredProvider || undefined,
        // cardFrontUrl and cardBackUrl would come from S3 upload — omitted until file upload is wired
      });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed. Please try again.');
    }
  }

  if (success) {
    return (
      <Box maw={600}>
        <Notification icon={<CheckCircle size={18} />} color="teal" title="Insurance submitted!" withCloseButton={false} mb={24}>
          Your insurance information has been saved successfully.
        </Notification>
        <Box p={20} style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12 }}>
          <Group gap={8} mb={8}><CheckCircle size={18} color="#16a34a" /><Text fw={600} c="#15803d">Coverage Insight</Text></Group>
          <Text size="sm" c="#166534">Based on your plan, preventive care is typically covered at 100%. Schedule your next cleaning today!</Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box maw={600}>
      <StepProgress step={step} />

      {error && (
        <Notification icon={<XCircle size={18} />} color="red" title="Please fix the following" mb="md" onClose={() => setError('')}>
          {error}
        </Notification>
      )}

      {step === 1 && (
        <Stack gap="md">
          <Title order={5} fw={600} c="#1e293b">Basic Insurance Info</Title>
          <Select label="Insurance Provider" placeholder="Select your insurance provider" data={INSURANCE_PROVIDERS}
            value={data.insuranceProvider} onChange={(v) => update({ insuranceProvider: v ?? '' })} required size="md" searchable />
          <Box>
            <Group gap={6} mb={4}>
              <Text size="sm" fw={500}>Member ID <Text component="span" c="red">*</Text></Text>
              <Tooltip label="Your Member ID is printed on the front of your insurance card." withArrow>
                <HelpCircle size={14} color="#94a3b8" style={{ cursor: 'help' }} />
              </Tooltip>
            </Group>
            <TextInput placeholder="e.g. ABC123456789" value={data.memberId} onChange={(e) => update({ memberId: e.currentTarget.value })} size="md" />
          </Box>
          <TextInput label="Group Number (optional)" placeholder="e.g. GRP-00123" value={data.groupNumber} onChange={(e) => update({ groupNumber: e.currentTarget.value })} size="md" />
          <TextInput label="Policy Holder Name" placeholder="Full name as it appears on the card" value={data.policyHolderName} onChange={(e) => update({ policyHolderName: e.currentTarget.value })} required size="md" />
          <TextInput label="Policy Holder Date of Birth" type="date" value={data.policyHolderDob} onChange={(e) => update({ policyHolderDob: e.currentTarget.value })} required size="md" max={new Date().toISOString().split('T')[0]} />
          <Select label="Relationship to Policy Holder" placeholder="Select relationship" data={RELATIONSHIP_OPTIONS}
            value={data.relationshipToHolder} onChange={(v) => update({ relationshipToHolder: v ?? '' })} required size="md" />
        </Stack>
      )}

      {step === 2 && (
        <Stack gap="md">
          <Title order={5} fw={600} c="#1e293b">Coverage Details</Title>
          <Text size="sm" c="dimmed">Optional but recommended — helps us give you better insights.</Text>
          <Select label="Plan Type" placeholder="Select plan type" data={PLAN_TYPE_OPTIONS}
            value={data.planType} onChange={(v) => update({ planType: v ?? '' })} size="md" />
          <TextInput label="Effective Date" type="date" value={data.effectiveDate} onChange={(e) => update({ effectiveDate: e.currentTarget.value })} size="md" />
          <Box>
            <Text size="sm" fw={500} mb={8}>Primary Insurance?</Text>
            <Switch label={data.isPrimary ? 'Yes, this is my primary insurance' : 'No, this is secondary insurance'}
              checked={data.isPrimary} onChange={(e) => update({ isPrimary: e.currentTarget.checked })} color="#2d7d9a" />
          </Box>
          <TextInput label="Preferred Provider (optional)" placeholder="Name of your preferred dentist or practice"
            value={data.preferredProvider} onChange={(e) => update({ preferredProvider: e.currentTarget.value })} size="md" />
        </Stack>
      )}

      {step === 3 && (
        <Stack gap="lg">
          <Box>
            <Title order={5} fw={600} c="#1e293b" mb={4}>Upload Insurance Card</Title>
            <Text size="sm" c="dimmed">Upload the front and back of your insurance card.</Text>
          </Box>
          <UploadCard label="Front of Card" file={data.cardFrontFile} preview={data.cardFrontPreview}
            onFile={handleFrontFile} onRemove={() => update({ cardFrontFile: null, cardFrontPreview: null })} error={fileErrors.front} />
          <UploadCard label="Back of Card" file={data.cardBackFile} preview={data.cardBackPreview}
            onFile={handleBackFile} onRemove={() => update({ cardBackFile: null, cardBackPreview: null })} error={fileErrors.back} />
        </Stack>
      )}

      {step === 4 && (
        <Stack gap="md">
          <Title order={5} fw={600} c="#1e293b">Review & Consent</Title>
          <Box p={16} style={{ background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0' }}>
            <Stack gap={8}>
              {[
                ['Insurance Provider', data.insuranceProvider],
                ['Member ID', data.memberId],
                ['Group Number', data.groupNumber],
                ['Policy Holder', data.policyHolderName],
                ['Date of Birth', data.policyHolderDob],
                ['Relationship', data.relationshipToHolder],
                ['Plan Type', data.planType],
                ['Primary Insurance', data.isPrimary ? 'Yes' : 'No'],
                ['Card Front', data.cardFrontFile?.name],
                ['Card Back', data.cardBackFile?.name],
              ].map(([label, value], i, arr) => (
                <React.Fragment key={String(label)}>
                  <Group justify="space-between">
                    <Text size="sm" c="#64748b">{label}</Text>
                    <Text size="sm" fw={500}>{value || '—'}</Text>
                  </Group>
                  {i < arr.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </Stack>
          </Box>
          <Checkbox
            label="I authorize D3NTIQ to share my insurance information with selected providers."
            checked={data.consentChecked}
            onChange={(e) => update({ consentChecked: e.currentTarget.checked })}
            size="sm"
            required
          />
        </Stack>
      )}

      <Group justify="space-between" mt={28}>
        <Group gap={8}>
          {step > 1 && <Button variant="default" size="sm" onClick={() => { setError(''); setStep((s) => s - 1); }} disabled={loading}>Back</Button>}
          <Button variant="subtle" size="sm" c="#94a3b8" onClick={() => setSkipWarning(true)} disabled={loading}>Skip for now</Button>
        </Group>
        {step < 4
          ? <Button size="sm" style={{ backgroundColor: '#2d7d9a' }} onClick={handleNext}>Next</Button>
          : <Button size="sm" style={{ backgroundColor: '#2d7d9a' }} loading={loading} loaderProps={{ type: 'oval' }} onClick={handleSubmit}>{loading ? 'Submitting...' : 'Submit'}</Button>
        }
      </Group>

      <Modal opened={skipWarning} onClose={() => setSkipWarning(false)} title={<Text fw={600}>Skip Insurance Setup?</Text>} centered size="sm">
        <Stack gap={12}>
          <Text size="sm" c="#64748b">Without insurance information, we won&apos;t be able to provide coverage insights. You can always add it later.</Text>
          <Group justify="flex-end" gap={8}>
            <Button variant="default" size="sm" onClick={() => setSkipWarning(false)}>Continue Setup</Button>
            <Button size="sm" color="gray" onClick={onSkip}>Skip Anyway</Button>
          </Group>
        </Stack>
      </Modal>
    </Box>
  );
}
