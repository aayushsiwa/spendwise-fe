import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import { Record, RecordTypes } from '@/types/Records';

dayjs.extend(customParseFormat);

export type RecordFormData = Omit<Record, 'ID'>;
type RecordValidationInput = Omit<RecordFormData, 'amount'> & {
  amount: number | string;
};

export type RecordValidationErrors = Partial<{
  date: string;
  description: string;
  category: string;
  amount: string;
  type: string;
  note: string;
}>;

const recordTypes = new Set<RecordTypes>(['income', 'expense', 'transfer']);

export const validateRecord = (
  record: RecordValidationInput
): RecordValidationErrors => {
  const errors: RecordValidationErrors = {};
  const amount =
    typeof record.amount === 'string'
      ? parseFloat(record.amount.replace(/[^0-9.-]/g, ''))
      : record.amount;

  if (!record.date.trim()) {
    errors.date = 'Date is required';
  } else if (
    !/^\d{4}-\d{2}-\d{2}$/.test(record.date) ||
    !dayjs(record.date, 'YYYY-MM-DD', true).isValid()
  ) {
    errors.date = 'Date must be in YYYY-MM-DD format';
  }

  if (!record.description.trim()) {
    errors.description = 'Description is required';
  } else if (record.description.trim().length > 255) {
    errors.description = 'Description must be 255 characters or less';
  }

  if (!record.category.trim()) {
    errors.category = 'Category is required';
  }

  if (Number.isNaN(amount)) {
    errors.amount = 'Amount is required';
  } else if (amount <= 0) {
    errors.amount = 'Amount must be greater than 0';
  }

  if (!record.type) {
    errors.type = 'Type is required';
  } else if (!recordTypes.has(record.type)) {
    errors.type = 'Type must be income, expense, or transfer';
  }

  if (record.note.trim().length > 1000) {
    errors.note = 'Note must be 1000 characters or less';
  }

  return errors;
};

export const hasRecordValidationErrors = (errors: RecordValidationErrors) => {
  return Object.keys(errors).length > 0;
};

export const getRecordValidationMessage = (errors: RecordValidationErrors) => {
  return Object.values(errors).join(', ');
};

export const normalizeRecord = (
  record: RecordValidationInput
): RecordFormData => ({
  date: record.date.trim(),
  description: record.description.trim(),
  amount:
    typeof record.amount === 'string'
      ? parseFloat(record.amount.replace(/[^0-9.-]/g, ''))
      : record.amount,
  category: record.category.trim(),
  type: record.type,
  note: record.note.trim(),
});
