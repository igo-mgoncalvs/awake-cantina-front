export function formatCurrency(value: string): string {
  const numbers = value.replace(/\D/g, "");

  const cents = Number(numbers) / 100;

  return cents.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
