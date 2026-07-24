import BaseLayout from '@/lib/Layout/BaseLayout/BaseLayout';
import BudgetManager from '@/lib/containers/BudgetManager/BudgetManager';

const BudgetsPage = () => {
  return (
    <BaseLayout>
      <BudgetManager />
    </BaseLayout>
  );
};

export default BudgetsPage;
