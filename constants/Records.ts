import { Record, RecordType } from '@/types/Records';
import { DateUtil } from '@/utils/DateUtils';

export const blankRecord: Record = {
  id: 9999,
  date: DateUtil.formattedDate(new Date().toISOString()),
  description: '',
  category: '',
  amount: 0,
  type: RecordType.EXPENSE,
  note: '',
};
