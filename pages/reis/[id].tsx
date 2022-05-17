import { reizen } from '.prisma/client';
import PageContainer from '@/layout/Main';
import prisma from '@/lib/prisma';
import { sessionOptions } from '@/lib/session';
import { Stack, Card, Group, Title, Badge, Text } from '@mantine/core';
import { withIronSessionSsr } from 'iron-session/next';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import useSWR from 'swr';

const ReisDetail = ({ plaats }: { plaats: reizen }) => {
  const router = useRouter();

  const { data } = useSWR(`/api/reizen/single?id=${plaats.ID}`);
  const plek = data?.plaats;

  if (!data) return <div>loading...</div>

  return (
    <PageContainer title={`GLR - Detail pagina van [reis]`}>
      <Stack>
        <Card>
          <Group position="apart">
            <Title>{plek.titel}</Title>
          </Group>
          <Badge>{plek.bestemming}</Badge>
          <Stack py="lg">
            <Text size="sm" style={{ width: '80%' }}>
              {plek.omschrijving}
            </Text>
          </Stack>
        </Card>
      </Stack>
    </PageContainer>
  );
};

export const getServerSideProps: GetServerSideProps = withIronSessionSsr(
  async ({ req, res, params }) => {
    const user = req.session.user;

    if (user === undefined) {
      res.setHeader('location', '/inlog');
      res.statusCode = 302;
      res.end();
      return {
        props: {} as any
      };
    }
    const plaats = await prisma.reizen.findUnique({
      where: {
        ID: params?.id as string
      },
      select: {
        ID: true
      }
    });

    return {
      props: {
        plaats
      }
    };
  },
  sessionOptions
);
export default ReisDetail;
