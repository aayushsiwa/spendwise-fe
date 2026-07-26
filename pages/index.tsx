import BaseLayout from '@/lib/Layout/BaseLayout/BaseLayout';
import Home from '@/lib/containers/Home/Home';

const HomePage = () => {
  return (
    <BaseLayout showPeriodSelector>
      <Home />
    </BaseLayout>
  );
};

export default HomePage;
