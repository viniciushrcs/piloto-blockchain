import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { DASHBOARD_PATH } from '@/utils/constants';
import { Container } from '@mantine/core';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const redirectTimeout = setTimeout(() => {
      router.push(DASHBOARD_PATH);
    }, 0);

    return () => clearTimeout(redirectTimeout);
  }, [router]);

  return (
    <Container size={'xl'}>
      <p>Redirecionando...</p>
    </Container>
  );
}
