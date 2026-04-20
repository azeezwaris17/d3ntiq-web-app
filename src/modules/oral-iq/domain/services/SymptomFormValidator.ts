/**
 * Symptom Form Validator Service
 * Single Responsibility: Validates symptom form data
 */
export class SymptomFormValidator {
  static validateSymptomType(symptomType: string): { isValid: boolean; error?: string } {
    if (!symptomType || !symptomType.trim()) {
      return { isValid: false, error: 'Symptom type is required' };
    }
    return { isValid: true };
  }

  static validatePainLevel(painLevel: number | null): { isValid: boolean; error?: string } {
    if (painLevel !== null) {
      if (painLevel < 1 || painLevel > 10) {
        return { isValid: false, error: 'Pain level must be between 1 and 10' };
      }
    }
    return { isValid: true };
  }

  static validateFormData(formData: {
    symptomType: string;
    painLevel: number | null;
    duration: string;
    specificSensations: string;
  }): { isValid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};

    const symptomTypeValidation = this.validateSymptomType(formData.symptomType);
    if (!symptomTypeValidation.isValid) {
      errors.symptomType = symptomTypeValidation.error || '';
    }

    const painLevelValidation = this.validatePainLevel(formData.painLevel);
    if (!painLevelValidation.isValid) {
      errors.painLevel = painLevelValidation.error || '';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }
}
