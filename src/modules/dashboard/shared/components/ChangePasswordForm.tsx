'use client';

/**
 * ChangePasswordForm
 *
 * A reusable form for changing the logged-in user's password.
 * Used inside both the patient and provider profile pages under a "Security" tab.
 *
 * What it does:
 *   - Asks for the current password (to verify identity)
 *   - Asks for a new password + confirmation
 *   - Validates that new passwords match and meet minimum length
 *   - Calls the changePassword mutation on submit
 *   - Shows success or error feedback inline
 */

import { useState } from 'react';
import {
  Box, Stack, Button, Notification, Text, PasswordInput,
} from '@mantine/core';
import { CheckCircle, XCircle, Lock } from 'lucide-react';
import { useChangePassword } from '@/modules/dashboard/infrastructure/useDashboard';

export function ChangePasswordForm() {
  const { changePassword, loading } = useChangePassword();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword,     setNewPassword]     = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error,           setError]           = useState('');
  const [success,         setSuccess]         = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Client-side validation before hitting the server
    if (!currentPassword) return setError('Please enter your current password.');
    if (newPassword.length < 8) return setError('New password must be at least 8 characters.');
    if (newPassword !== confirmPassword) return setError('New passwords do not match.');

    try {
      await changePassword(currentPassword, newPassword);
      setSuccess(true);
      // Clear the form after a successful change
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      // Auto-hide the success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to change password. Please try again.');
    }
  }

  return (
    <Box maw={480}>

      {/* Section heading */}
      <Box mb={20}>
        <Text fw={600} size="sm" c="#1e293b">Change Password</Text>
        <Text size="xs" c="dimmed" mt={4}>
          Enter your current password to verify your identity, then set a new one.
        </Text>
      </Box>

      {/* Success message */}
      {success && (
        <Notification
          icon={<CheckCircle size={18} />}
          color="teal"
          title="Password changed!"
          mb="md"
          withCloseButton={false}
        >
          Your password has been updated successfully.
        </Notification>
      )}

      {/* Error message */}
      {error && (
        <Notification
          icon={<XCircle size={18} />}
          color="red"
          title="Could not change password"
          mb="md"
          onClose={() => setError('')}
        >
          {error}
        </Notification>
      )}

      <form onSubmit={handleSubmit}>
        <Stack gap="md">

          {/* Current password — required to prove identity */}
          <PasswordInput
            label="Current Password"
            placeholder="Enter your current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.currentTarget.value)}
            leftSection={<Lock size={15} strokeWidth={1.8} />}
            required
            size="md"
            disabled={loading}
          />

          {/* New password */}
          <PasswordInput
            label="New Password"
            placeholder="At least 8 characters"
            value={newPassword}
            onChange={(e) => setNewPassword(e.currentTarget.value)}
            leftSection={<Lock size={15} strokeWidth={1.8} />}
            required
            size="md"
            disabled={loading}
          />

          {/* Confirm new password */}
          <PasswordInput
            label="Confirm New Password"
            placeholder="Re-enter your new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.currentTarget.value)}
            leftSection={<Lock size={15} strokeWidth={1.8} />}
            required
            size="md"
            disabled={loading}
            // Inline hint when the two new passwords don't match yet
            error={
              confirmPassword && newPassword !== confirmPassword
                ? 'Passwords do not match'
                : undefined
            }
          />

          <Box mt={4}>
            <Button
              type="submit"
              size="md"
              loading={loading}
              loaderProps={{ type: 'oval' }}
              style={{ backgroundColor: '#2d7d9a', minWidth: 160 }}
            >
              {loading ? 'Updating...' : 'Update Password'}
            </Button>
          </Box>
        </Stack>
      </form>
    </Box>
  );
}
