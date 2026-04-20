import { useMutation } from '@apollo/client/react';
import { REGISTER_PRACTICE } from '../services/practice-registration-queries';

export interface RegisterPracticeInput {
  workEmail: string;
  phone: string;
  specialty: string;
}

export interface PracticeRegistrationResult {
  id: string;
  workEmail: string;
  phone: string;
  specialty: string;
  status: string;
  createdAt: string;
}

export function useRegisterPractice() {
  const [mutate, { loading, error, data, reset }] = useMutation<
    { registerPractice: PracticeRegistrationResult },
    { input: RegisterPracticeInput }
  >(REGISTER_PRACTICE, { errorPolicy: 'all' });

  const register = async (input: RegisterPracticeInput): Promise<PracticeRegistrationResult> => {
    const result = await mutate({ variables: { input } });
    if (result.error) throw new Error(result.error.message);
    if (!result.data) throw new Error('No response from server');
    return result.data.registerPractice;
  };

  return { register, loading, error, data: data?.registerPractice, reset };
}
