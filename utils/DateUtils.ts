import dayjs from 'dayjs';

export class DateUtil {
  public static formattedDate(date?: string): string {
    if (!date) return dayjs().format('YYYY-MM-DD');

    return dayjs(date).format('YYYY-MM-DD');
  }
}
