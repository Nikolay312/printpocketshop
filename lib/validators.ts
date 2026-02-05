export function isRequired(value: string) {
  return value.trim().length > 0;
}

export function isPositiveNumber(value: number) {
  return !isNaN(value) && value > 0;
}

export function isValidPrice(value: number) {
  return isPositiveNumber(value) && value < 10000;
}

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function isValidSlug(value: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}
