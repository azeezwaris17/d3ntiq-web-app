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
      createdAt
      updatedAt
    }
  }
`;
