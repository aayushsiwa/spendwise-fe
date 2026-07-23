import BaseLayout from '@/lib/Layout/BaseLayout/BaseLayout';
import CategoryManager from '@/lib/containers/CategoryManager/CategoryManager';

const CategoriesPage = () => {
  return (
    <BaseLayout>
      <CategoryManager />
    </BaseLayout>
  );
};

export default CategoriesPage;
