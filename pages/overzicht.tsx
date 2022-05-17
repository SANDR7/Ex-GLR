import PageContainer from '@/layout/Main';
import { reizen } from '.prisma/client';
import useUser from '@/lib/useUser';
import {
  Badge,
  Button,
  Card,
  Center,
  Text,
  Stack,
  Title,
  Group
} from '@mantine/core';
import { withIronSessionSsr } from 'iron-session/next';
import ErrorPage from 'next/error';
import React from 'react';
import useSWR from 'swr';

const Overzicht = () => {
  useUser({
    redirectTo: '/inlog',
    redirectIfFound: false
  });

  // gegevens ophalen van database
  const { data: plaatsen } = useSWR('/api/reizen');

  console.log(plaatsen);

  // Pagina wanneer er een account is geconstateerd.
  return (
    <PageContainer>
      <Center>
        <Card withBorder={true}>
          <Title>Reis naam</Title>
          <Badge>Bestemming</Badge>
          <Stack py="lg">
            <Text size="sm" style={{ width: '80%' }}>
              With Fjord Tours you can explore more of the magical fjord
              landscapes with tours and activities on and around the fjords of
              Norway
            </Text>
          </Stack>
          <Button>Book classic tour now</Button>
        </Card>
        {/* gegevens van database weergeven */}
        {plaatsen?.map((plaats: reizen) => (
          <Card key={plaats.ID}>
            <Title>{plaats.titel}</Title>
            <Stack py="lg">
              <Text size="sm" style={{ width: '80%' }}>
                {plaats.omschrijving}
              </Text>
            </Stack>
          </Card>
        ))}
      </Center>
    </PageContainer>
  );
};

export default Overzicht;
