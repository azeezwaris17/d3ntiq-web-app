/**
 * GraphQL queries and mutations for appointments
 */

import { gql } from '@apollo/client';

export const CREATE_APPOINTMENT = gql`
  mutation CreateAppointment($input: CreateAppointmentInput!) {
    createAppointment(input: $input) {
      id
      patientId
      providerId
      appointmentDate
      appointmentTime
      type
      status
      providerName
      providerSpecialty
      providerAddress
      providerPhone
      oralIQData
      reminderPreference
      patientNotes
      createdAt
      updatedAt
    }
  }
`;

export const SAVE_APPOINTMENT_DRAFT = gql`
  mutation SaveAppointmentDraft($input: SaveAppointmentDraftInput!) {
    saveAppointmentDraft(input: $input) {
      id
      patientId
      oralIQData
      selectedProvider
      providerSearchQuery
      providerSearchResults
      bookingData
      currentStep
      createdAt
      updatedAt
    }
  }
`;

export const GET_MY_APPOINTMENTS = gql`
  query MyAppointments {
    myAppointments {
      id
      patientId
      providerId
      appointmentDate
      appointmentTime
      type
      status
      providerName
      providerSpecialty
      providerAddress
      providerPhone
      oralIQData
      reminderPreference
      reminderSent
      patientNotes
      providerNotes
      cancellationReason
      cancelledBy
      cancelledAt
      createdAt
      updatedAt
    }
  }
`;

export const GET_MY_APPOINTMENT_DRAFT = gql`
  query MyAppointmentDraft {
    myAppointmentDraft {
      id
      patientId
      oralIQData
      selectedProvider
      providerSearchQuery
      providerSearchResults
      bookingData
      currentStep
      createdAt
      updatedAt
    }
  }
`;

export const CANCEL_APPOINTMENT = gql`
  mutation CancelAppointment($input: UpdateAppointmentStatusInput!) {
    cancelAppointment(input: $input) {
      id
      status
      cancellationReason
      cancelledBy
      cancelledAt
    }
  }
`;

export const RESCHEDULE_APPOINTMENT = gql`
  mutation RescheduleAppointment($input: RescheduleAppointmentInput!) {
    rescheduleAppointment(input: $input) {
      id
      appointmentDate
      appointmentTime
      type
      status
      providerName
      providerSpecialty
      providerAddress
      providerPhone
      updatedAt
    }
  }
`;

export const GET_PROVIDER_APPOINTMENTS = gql`
  query MyProviderAppointments($filter: GetProviderAppointmentsInput) {
    myProviderAppointments(filter: $filter) {
      id
      patientId
      providerId
      appointmentDate
      appointmentTime
      type
      status
      providerName
      providerSpecialty
      providerAddress
      providerPhone
      oralIQData
      patientNotes
      providerNotes
      cancellationReason
      cancelledBy
      cancelledAt
      createdAt
      updatedAt
    }
  }
`;

/** Provider accepts a pending appointment → status becomes CONFIRMED */
export const ACCEPT_APPOINTMENT = gql`
  mutation AcceptAppointment($appointmentId: String!) {
    acceptAppointment(appointmentId: $appointmentId) {
      id
      status
      updatedAt
    }
  }
`;

/** Provider declines a pending appointment → status becomes CANCELLED */
export const DECLINE_APPOINTMENT = gql`
  mutation DeclineAppointment($input: DeclineAppointmentInput!) {
    declineAppointment(input: $input) {
      id
      status
      cancellationReason
      cancelledBy
      cancelledAt
    }
  }
`;

/** Provider marks a confirmed appointment as completed */
export const COMPLETE_APPOINTMENT = gql`
  mutation CompleteAppointment($appointmentId: String!) {
    completeAppointment(appointmentId: $appointmentId) {
      id
      status
      updatedAt
    }
  }
`;

/** Provider marks a confirmed appointment as no-show */
export const MARK_APPOINTMENT_NO_SHOW = gql`
  mutation MarkAppointmentNoShow($appointmentId: String!) {
    markAppointmentNoShow(appointmentId: $appointmentId) {
      id
      status
      updatedAt
    }
  }
`;
