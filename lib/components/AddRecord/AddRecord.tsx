import { Button, Grid, InputLabel, TextField, Typography } from '@mui/material';
import { useState } from 'react';

import { useCreateRecordAPI } from '@/api/records/createRecord';
import { useAppSnackbar } from '@/lib/context/Snackbar/Snackbar';
import { RecordType, RecordTypes } from '@/types/Records';
import { getApiErrorMessage } from '@/utils/apiError';
import {
  getRecordValidationMessage,
  hasRecordValidationErrors,
  normalizeRecord,
  validateRecord,
} from '@/validations/Record';

import Toast from '../Toasts/Toast';

const AddRecord = () => {
  const createRecord = useCreateRecordAPI();
  const { showSnackbar } = useAppSnackbar();

  const [date, setDate] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [type, setType] = useState<RecordTypes>(RecordType.EXPENSE);
  const [note, setNote] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [showSuccessToast, setShowSuccessToast] = useState<boolean>(false);

  const handleSubmit = async () => {
    const normalizedRecord = normalizeRecord({
      date,
      description,
      amount,
      category,
      type,
      note,
    });

    const errors = validateRecord(normalizedRecord);
    if (hasRecordValidationErrors(errors)) {
      const message = getRecordValidationMessage(errors);
      setError(message);
      return;
    }

    try {
      await createRecord.mutateAsync({
        record: normalizedRecord,
      });

      setShowSuccessToast(true);
      setError('');

      setDate('');
      setDescription('');
      setAmount('');
      setCategory('');
      setType(RecordType.EXPENSE);
      setNote('');
    } catch (err) {
      const message = getApiErrorMessage(err, 'Failed to add record');
      setError(message);
      showSnackbar(message, 'error');
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid>
        <InputLabel>Date</InputLabel>
        <TextField
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </Grid>

      <Grid>
        <InputLabel>Description</InputLabel>
        <TextField
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Grid>

      <Grid>
        <InputLabel>Amount</InputLabel>
        <TextField
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </Grid>

      <Grid>
        <InputLabel>Category</InputLabel>
        <TextField
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
      </Grid>

      <Grid>
        <InputLabel>Type</InputLabel>
        <TextField
          type="text"
          value={type}
          onChange={(e) => setType(e.target.value as RecordTypes)}
        />
      </Grid>

      <Grid>
        <InputLabel>Note</InputLabel>
        <TextField
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </Grid>

      <Grid>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleSubmit}
          disabled={createRecord.isPending}
        >
          <Typography variant="button">
            {createRecord.isPending ? 'Adding...' : 'Add Record'}
          </Typography>
        </Button>
      </Grid>

      {error && <Toast variant="error" message={error} />}
      {showSuccessToast && (
        <Toast variant="success" message="Record added successfully!" />
      )}
    </Grid>
  );
};

export default AddRecord;
