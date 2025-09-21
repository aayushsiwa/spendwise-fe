import Image from 'next/image';

import BasicLayout from '@/lib/Layout/BasicLayout/BasicLayout';

export default function Custom404() {
  return (
    <BasicLayout>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '80vh',
          textAlign: 'center',
        }}
      >
        <Image
          src="https://http.dog/404.jpg"
          alt="404 Not Found"
          width={600}
          height={400}
          style={{ borderRadius: '1rem' }}
        />
        <h1 style={{ marginTop: '1rem' }}>Oops! Page not found 🐶</h1>
      </div>
    </BasicLayout>
  );
}
