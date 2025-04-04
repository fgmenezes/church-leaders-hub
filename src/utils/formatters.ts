
/**
 * Formats a phone number as (XX) XXXXX-XXXX
 */
export const formatPhoneNumber = (value: string): string => {
  if (!value) return value;
  
  const phone = value.replace(/\D/g, '');
  
  if (phone.length <= 2) {
    return `(${phone}`;
  } 
  
  if (phone.length <= 7) {
    return `(${phone.substring(0, 2)}) ${phone.substring(2)}`;
  }
  
  if (phone.length <= 11) {
    return `(${phone.substring(0, 2)}) ${phone.substring(2, 7)}-${phone.substring(7)}`;
  }
  
  // For longer phone numbers, limit to 11 digits
  return `(${phone.substring(0, 2)}) ${phone.substring(2, 7)}-${phone.substring(7, 11)}`;
};

/**
 * Formats a date string as the user types in dd/mm/yyyy format
 */
export const formatDateInput = (value: string): string => {
  if (!value) return value;
  
  const numbers = value.replace(/\D/g, '');
  
  if (numbers.length <= 2) {
    return numbers;
  }
  
  if (numbers.length <= 4) {
    return `${numbers.substring(0, 2)}/${numbers.substring(2)}`;
  }
  
  return `${numbers.substring(0, 2)}/${numbers.substring(2, 4)}/${numbers.substring(4, 8)}`;
};

/**
 * Formats a CEP as 00000-000
 */
export const formatCep = (value: string): string => {
  if (!value) return value;
  
  const cep = value.replace(/\D/g, '');
  
  if (cep.length <= 5) {
    return cep;
  }
  
  return `${cep.substring(0, 5)}-${cep.substring(5, 8)}`;
};
