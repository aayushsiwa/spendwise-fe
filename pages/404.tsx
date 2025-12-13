import Image from 'next/image';

import BaseLayout from '@/lib/Layout/BaseLayout/BaseLayout';

export default function Custom404() {
  return (
    <BaseLayout>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          // height: '80vh',
        }}
      >
        <Image
          src="https://http.dog/404.jpg"
          alt="404 Not Found"
          width={600}
          height={400}
          style={{ borderRadius: '1rem' }}
        />
      </div>
    </BaseLayout>
  );
}
