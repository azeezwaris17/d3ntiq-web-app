/**
 * SymptomFormValidator
 * Single Responsibility: Validates symptom form data before submission.
 */
export class SymptomFormValidator {
  /**
   * Validates that at least one symptom type has been selected.
   */
  static validateSymptomTypes(symptomTypes: string[]): { isValid: boolean; error?: string } {
    if (!symptomTypes || symptomTypes.length === 0) {
      return { isValid: false, error: 'Please select at least one symptom type' };
    }
    return { isValid: true };
  }

  /**
   * Validates pain level is within the 1–10 range (optional field).
   */
  static validatePainLevel(painLevel: number | null): { isValid: boolean; error?: string } {
    if (painLevel !== null && painLevel !== undefined) {
      if (painLevel < 1 || painLevel > 10) {
        return { isValid: false, error: 'Pain level must be between 1 and 10' };
      }
    }
    return { isValid: true };
  }

  /**
   * Validates the full form data object and returns all errors at once.
   */
  static validateFormData(formData: {
    symptomTypes: string[];
    painLevel: number | null;
    duration: string;
    specificSensations: string;
  }): { isValid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};

    const symptomTypesValidation = this.validateSymptomTypes(formData.symptomTypes);
    if (!symptomTypesValidation.isValid) {
      errors.symptomTypes = symptomTypesValidation.error ?? '';
    }

    const painLevelValidation = this.validatePainLevel(formData.painLevel);
    if (!painLevelValidation.isValid) {
      errors.painLevel = painLevelValidation.error ?? '';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }
}
