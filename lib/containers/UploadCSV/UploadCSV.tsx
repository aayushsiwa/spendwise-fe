import {
  Box,
  Button,
  Divider,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useState } from 'react';

import { useUploadCSVAPI } from '@/api/upload/csv';

const UploadCSV = () => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { mutate: uploadCSV, isPending } = useUploadCSVAPI();

  const handleUpload = () => {
    if (!file) return;

    setError(null);

    uploadCSV(
      { file },
      {
        onSuccess: () => {
          setFile(null);
        },
        onError: () => {
          setError('Upload failed');
        },
      }
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
        Upload CSV
      </Typography>

      <Paper
        sx={{
          p: 3,
          border: '1px dashed',
          borderColor: 'divider',
          textAlign: 'center',
        }}
      >
        <Button variant="contained" component="label" disabled={isPending}>
          Choose CSV File
          <input
            key={file?.name}
            hidden
            type="file"
            accept=".csv"
            onChange={(e) => {
              const selected = e.target.files?.[0];

              if (!selected) return;

              if (!selected.name.endsWith('.csv')) {
                setError('Only CSV files are allowed');
                return;
              }

              setError(null);
              setFile(selected);
            }}
          />
        </Button>

        {file && (
          <Box sx={{ mt: 2 }}>
            <Typography sx={{ fontWeight: 600 }}>{file.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {(file.size / 1024).toFixed(2)} KB
            </Typography>
          </Box>
        )}

        {isPending && <LinearProgress sx={{ mt: 2 }} />}

        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}

        <Button
          variant="contained"
          sx={{ mt: 3 }}
          disabled={!file || isPending}
          onClick={handleUpload}
        >
          {isPending ? 'Uploading...' : 'Upload'}
        </Button>
      </Paper>

      {/* ✅ HINTS SECTION */}
      <Paper sx={{ mt: 3, p: 3 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'start',
            gap: 2,
            mb: 1,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            CSV Format Guidelines
          </Typography>

          <Button
            size="small"
            onClick={() => {
              const csvContent = [
                'date,description,category,amount,type,note',
                '2025-01-01,Swiggy order,food,-250,expense,lunch',
                '2025-01-02,Salary,,50000,income,monthly salary',
              ].join('\n');
              const blob = new Blob([csvContent], { type: 'text/csv' });

              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'sample.csv';
              a.click();
            }}
          >
            Download Sample CSV
          </Button>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Your CSV should contain headers. We automatically detect columns based
          on common names.
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Stack spacing={1}>
          <Typography variant="body2">
            <strong>Date *:</strong> date, transaction_date, txn_date,
            value_date, posting_date
          </Typography>
          <Typography variant="body2">
            <strong>Description:</strong> description, details, narration,
            particulars
          </Typography>
          <Typography variant="body2">
            <strong>Category:</strong> category, subcategory, sub_category
          </Typography>
          <Typography variant="body2">
            <strong>Amount *:</strong> amount, value, amt, transaction_amount,
            txn_amount
          </Typography>
          <Typography variant="body2">
            <strong>Type:</strong> type, transaction_type, dr/cr, debit_credit
            (optional)
          </Typography>
          <Typography variant="body2">
            <strong>Note:</strong> note, remarks, comment, reference (optional)
          </Typography>
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
          Column Detection
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Headers are case-insensitive. Underscores, spaces, slashes, and
          hyphens are stripped before matching. For example,{' '}
          <code>Transaction Date</code>,<code> transaction_date</code>, and{' '}
          <code>txn_date</code> all match the &quot;date&quot; field.
        </Typography>

        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
          Type Inference
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          If the type column is missing or empty, the sign of the amount
          determines the type: negative → expense, positive → income.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          When type is provided, these values are recognised:
          <br />
          <strong>Expense:</strong> dr, debit, expense, payment, withdrawal,
          sent
          <br />
          <strong>Income:</strong> cr, credit, income, deposit, refund, received
          <br />
          <strong>Transfer:</strong> transfer
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
          Example CSV:
        </Typography>

        <Box
          sx={{
            fontFamily: 'monospace',
            fontSize: 13,
            backgroundColor: 'background.default',
            p: 2,
            borderRadius: 1,
            overflowX: 'auto',
          }}
        >
          date,description,category,amount,type,note
          <br />
          2025-01-01,Swiggy order,food,-250,expense,lunch
          <br />
          2025-01-02,Salary,,50000,income,monthly salary
        </Box>
      </Paper>
    </Box>
  );
};

export { UploadCSV };
