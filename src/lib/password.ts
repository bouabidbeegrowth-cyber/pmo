const LABELS = ["Très faible", "Faible", "Moyen", "Bon", "Excellent"]

/** Score a password 0-4 based on length and character variety. */
export function passwordStrength(pwd: string): { score: number; label: string } {
  let score = 0
  if (pwd.length >= 8) score++
  if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++
  if (/\d/.test(pwd)) score++
  if (/[^A-Za-z0-9]/.test(pwd)) score++
  return { score, label: LABELS[score] }
}

/** Minimum accepted strength score (out of 4) for new admin passwords. */
export const MIN_PASSWORD_SCORE = 3

export function isStrongPassword(pwd: string): boolean {
  return pwd.length >= 8 && passwordStrength(pwd).score >= MIN_PASSWORD_SCORE
}
