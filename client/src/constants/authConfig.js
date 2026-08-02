/**
 * Hackspora 2.0 Auth & Admin Configuration
 */
export const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'abisri024@gmail.com';

/**
 * Checks if the given email matches administrator credentials
 * @param {string} email
 * @returns {boolean}
 */
export function isAdminUser(email) {
  if (!email) return false;
  return email.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase().trim();
}
