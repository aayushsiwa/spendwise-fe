import BaseLayout from '@/lib/Layout/BaseLayout/BaseLayout';
import { UploadCSV } from '@/lib/containers/UploadCSV/UploadCSV';

const HomePage = () => {
  return (
    <BaseLayout>
      <UploadCSV />
    </BaseLayout>
  );
};

export default HomePage;
