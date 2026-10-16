export function currencyToCents(value: string): number {
  return Number(value.replace(/\D/g, ""));
}
