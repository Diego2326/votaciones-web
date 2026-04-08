export function normalizeTournamentCode(value: string) {
  return value.replace(/\D/g, '').slice(0, 6)
}

export function formatTournamentCode(value: string) {
  const digits = normalizeTournamentCode(value)

  if (digits.length <= 3) {
    return digits
  }

  return `${digits.slice(0, 3)} ${digits.slice(3)}`
}

export function isCompleteTournamentCode(value: string) {
  return normalizeTournamentCode(value).length === 6
}
