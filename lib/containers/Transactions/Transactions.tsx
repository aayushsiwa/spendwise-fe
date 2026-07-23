import { Box, Paper, Typography } from '@mui/material';

import Records from '@/lib/components/Records/Records';
import TransactionsFilter from '@/lib/components/Transactions/TransactionsFilter';
import { CategoriesContextProvider } from '@/lib/context/Categories/Categories';
import { useRecords } from '@/lib/hooks/useRecords';

const Transactions = () => {
  const {
    localRows,
    setLocalRows,
    records,
    isLoading,
    pagination,
    handlePaginationModelChange,
    getTypeDetails,
    processRowUpdate,
    handleDeleteRecord,
    isGetRecordsError,
    error,
    filters,
    setFilters,
  } = useRecords({ defaultPageSize: 10 });

  return (
    <CategoriesContextProvider>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
          Transactions
        </Typography>

        <Paper variant="outlined" sx={{ p: 2, mb: 2, borderRadius: 2 }}>
          <TransactionsFilter filters={filters} onChange={setFilters} />
        </Paper>

        <Box
          sx={{
            borderRadius: 1,
            boxShadow: 2,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Records
            localRows={localRows}
            setLocalRows={setLocalRows}
            records={records}
            isLoading={isLoading}
            pagination={pagination}
            handlePaginationModelChange={handlePaginationModelChange}
            getTypeDetails={getTypeDetails}
            processRowUpdate={processRowUpdate}
            handleDeleteRecord={handleDeleteRecord}
            isGetRecordsError={isGetRecordsError}
            error={error}
            isCheckBoxSelectionAllowed={false}
          />
        </Box>
      </Box>
    </CategoriesContextProvider>
  );
};

export default Transactions;
