import { reizen } from '.prisma/client';
import PageContainer from '@/layout/Main';
import prisma from '@/lib/prisma';
import { sessionOptions } from '@/lib/session';
import {
  Stack,
  Card,
  Group,
  Title,
  Badge,
  Text,
  Button,
  TextInput,
  Space,
  Table
} from '@mantine/core';
import { useForm } from '@mantine/form';
import dayjs from 'dayjs';
import { withIronSessionSsr } from 'iron-session/next';
import { GetServerSideProps } from 'next';
import React from 'react';
import useSWR from 'swr';

const ReisDetail = ({ plaats }: { plaats: reizen }) => {
  const { data: user } = useSWR('/api/user/mutate?m=withRole');

  // data is de reis informatie
  const { data } = useSWR(`/api/reizen/single?id=${plaats.ID}`);
  const plek = data?.plaats as reizen | any;
  console.log(plek);

  const form = useForm({
    initialValues: {
      email: '',
      reisID: plek?.ID
    },
    validate: {
      email: (value) =>
        /^\S+@\S+$/.test(value) ? null : 'onjuist email formaat'
    }
  });

  const beginDate = dayjs(plek?.beginDatum).format('DD MMMM YYYY');
  const endDate = dayjs(plek?.eindDatum).format('DD MMMM YYYY');

  // data is de reis informatie
  if (!data) return <div>loading...</div>;
  return (
    <PageContainer title={`GLR - Detail pagina van ${plek.titel}`}>
      <Stack style={{ maxWidth: '40%', margin: 'auto' }}>
        <Card withBorder={true}>
          <Group position="apart">
            <Title>{plek.titel}</Title>
          </Group>
          <Badge>{plek.bestemming}</Badge>
          <Stack py="lg">
            <Text size="sm" style={{ width: '80%' }}>
              {plek.omschrijving}
            </Text>
            <Table>
              <thead>
                <tr>
                  <th>organisator</th>
                  <th>Start datum</th>
                  <th>Eind datum</th>
                  <th>groep aantal</th>
                  <th>status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <b>{plek.createdBy.naam}</b>
                  </td>
                  <td>{beginDate}</td>
                  <td>{endDate}</td>
                  <td>{plek.huidigAantal}</td>
                  <td>
                    {plek.huidigAantal >= plek.maxAantal ? 'vol' : 'niet vol'}
                  </td>
                </tr>
              </tbody>
            </Table>
          </Stack>
        </Card>
        {user?.userSession.rol === 'STUDENT' && (
          <form>
            <TextInput
              label="Je email"
              type="email"
              placeholder="12345@glr.nl"
              required={true}
            />
            <Space h={10} />
            <Group position="right">
              <Button type="submit">Inschrijven</Button>
            </Group>
          </form>
        )}
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
