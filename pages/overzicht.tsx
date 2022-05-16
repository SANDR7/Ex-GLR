import PageContainer from '@/layout/Main';
import { reizen } from '.prisma/client';
import logger from '@/lib/logger';
import prisma from '@/lib/prisma';
import { sessionOptions } from '@/lib/session';
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
import { GetServerSideProps } from 'next';

const LOGGER = logger(import.meta.url);

const Overzicht = ({ plaatsen }: { plaatsen: reizen[] }) => {
  console.log(plaatsen);

  const { user } = useUser({
    redirectTo: '/inlog',
    redirectIfFound: false
  });

  //   Er voor zorgen dat gebruikers zonder account de pagina niet kunnen bekijken.
  if (!user) {
    console.error('gebruiker niet geautoriseerd om pagina te bezoeken');
    return (
      <ErrorPage
        statusCode={403} // Verboden toegang
        title="Je niet geautoriseerd om pagina te bezoeken"
      />
    );
  }
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

        {plaatsen?.map((plaats: reizen) => (
          <Card key={plaats.ID}>
            <Title>{plaats.titel}</Title>
          </Card>
        ))}
      </Center>
    </PageContainer>
  );
};

export const getServerSideProps: GetServerSideProps = withIronSessionSsr(
  async ({ req, res }) => {
    // const user = req.session.user;
    if (!req.session?.isLoggedIn) {
      LOGGER.warn('gebruiker niet geautoriseerd om pagina te bezoeken');
      return {
        props: {}
      };
    }

      const plaatsen = await prisma.accounts.findMany();

      console.table(plaatsen);

      return {
        props: { plaatsen } as any
      };
    }
  },
  sessionOptions
);

export default Overzicht;
