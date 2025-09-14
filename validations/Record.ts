import { Record } from '@/types/Records';

export const validateRecord = (record: Record) => {
  const errors = [] as string[];

  if (!record.date) {
    errors.push('Date is required');
  }

  if (!record.description) {
    errors.push('Description is required');
  }

  if (!record.category) {
    errors.push('Category is required');
  }

  if (record.amount === undefined || record.amount === null) {
    errors.push('Amount is required');
  }

  if (!record.type) {
    errors.push('Type is required');
  }

  if (errors.length > 0) {
    throw new Error(errors.join(', '));
  }
};
