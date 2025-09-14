import { Record, RecordType } from '@/types/Records';

export const blankRecord: Record = {
  id: 'new',
  date: new Date().toISOString().slice(0, 10),
  description: '',
  category: '',
  amount: 0,
  type: RecordType.EXPENSE,
  note: '',
};
