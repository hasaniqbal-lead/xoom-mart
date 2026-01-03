export function formatPrice(amount: number, currency: string = 'PKR'): string {
  return `${currency} ${Math.round(amount).toLocaleString()}`;
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
