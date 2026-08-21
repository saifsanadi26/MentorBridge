export const NAME_REGEX = /^[A-Za-z ]{2,50}$/;
export const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export function isValidEmail(email) {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidName(name) {
  if (!name) return false;
  return NAME_REGEX.test(name);
}

export function isValidPassword(password) {
  if (!password) return false;
  return PASSWORD_REGEX.test(password);
}
