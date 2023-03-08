export const requiredError = 'This field is required'
export const minLengthError = (length) => {
  if (length === 1) return 'This field must be at least 1 character'
  else return `This field must be at least ${length} characters`
}
export const emailError = 'Please enter a valid email'
export const phoneNumberError = 'Please enter a valid phone number'
export const passwordError = 'Password must be at least 8 characters and contain at least 1 uppercase, 1 lowercase, 1 special character'
export const confirmPasswordError = 'Password mismatch'
export const emailOrPhoneNumberError = 'Please enter a valid email or phone number'
