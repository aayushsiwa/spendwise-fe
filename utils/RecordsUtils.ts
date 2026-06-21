import { RecordType, RecordTypes } from '@/types/Records';

export class RecordsUtil {
  public static formatAmount(amount: number, type: RecordTypes): string {
    const symbol = RecordsUtil.currencySymbol('INR', 'en-IN');
    const formatted = Number(amount).toLocaleString('en-IN');

    if (type === RecordType.EXPENSE) {
      return `- ${symbol}${formatted}`;
    } else if (type === RecordType.TRANSFER) {
      return `${symbol}${formatted}`;
    } else {
      return `+ ${symbol}${formatted}`;
    }
  }

  public static currencySymbol = (currency = 'INR', locale = 'en-IN'): string =>
    // It will return the currency symbol for a correct given currency code
    // It will throw error for an incorrect currency code
    new Intl.NumberFormat(locale, { style: 'currency', currency })
      .formatToParts(1)
      .find((x) => x.type === 'currency')?.value as string;
}
