import { Button, Grid, InputLabel, TextField, Typography } from '@mui/material';
import { useState } from 'react';

import { useRecordsContext } from '@/lib/context/Records/Records';
import { useCreateRecordAPI } from '@/pages/api/records/createRecord';
import { RecordType, RecordTypes } from '@/types/Records';

import Toast from '../Toasts/Toast';

const AddRecord = () => {
  const { queryParams } = useRecordsContext();
  const createRecord = useCreateRecordAPI();

  const [date, setDate] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [type, setType] = useState<RecordTypes>(RecordType.EXPENSE);
  const [note, setNote] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [showSuccessToast, setShowSuccessToast] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (!date || !description || !amount || !category || !type) {
      setError('All fields are required.');
      return;
    }

    try {
      await createRecord.mutateAsync({
        record: {
          date,
          description,
          amount: parseFloat(amount),
          category,
          type,
          note,
        },
        queryParams,
      });

      setShowSuccessToast(true);
      setError('');

      // Reset form
      setDate('');
      setDescription('');
      setAmount('');
      setCategory('');
      setType(RecordType.EXPENSE);
      setNote('');
    } catch (err: any) {
      setError(err.message || 'Failed to add record');
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
