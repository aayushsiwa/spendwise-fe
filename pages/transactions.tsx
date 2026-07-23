import BaseLayout from '@/lib/Layout/BaseLayout/BaseLayout';
import Transactions from '@/lib/containers/Transactions/Transactions';

const TransactionsPage = () => {
  return (
    <BaseLayout showPeriodSelector={false}>
      <Transactions />
    </BaseLayout>
  );
};

export default TransactionsPage;
