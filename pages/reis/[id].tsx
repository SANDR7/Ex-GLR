import { reizen, studenten } from '.prisma/client';
import PageContainer from '@/layout/Main';
import prisma from '@/lib/prisma';
import { sessionOptions } from '@/lib/session';
import useUser from '@/lib/useUser';
import {
  Alert,
  Badge,
  Button,
  Card,
  Group,
  Space,
  Stack,
  Table,
  Text,
  TextInput,
  Title
} from '@mantine/core';
import { useForm } from '@mantine/form';
import axios from 'axios';
import dayjs from 'dayjs';
import { withIronSessionSsr } from 'iron-session/next';
import { GetServerSideProps } from 'next';
import Router from 'next/router';
import React, { useState } from 'react';
import useSWR from 'swr';

const ReisDetail = ({ plaats }: { plaats: reizen }) => {
  const [errMessage, setErrMessage] = useState('');

  // checken wanneer gebruiker is ingelogd || omleiden
  useUser({
    redirectTo: '/inlog',
    redirectIfFound: false
  });

  const { data: user } = useSWR('/api/user/mutate?m=withRole');
  const { data: userData } = useSWR(
    `/api/user/mutate?m=withNumbers&p=${plaats.ID}`
  );

  // data is de reis informatie
  const { data } = useSWR(`/api/reizen/single?id=${plaats.ID}`);
  const plek = data?.plaats as reizen | any;

  const form = useForm({
    initialValues: {
      email: '',
      reisID: plaats?.ID
    },
    validate: {
      email: (value) =>
        /^\S+@\S+$/.test(value) ? null : 'onjuist email formaat'
    }
  });

  const beginDate = dayjs(plek?.beginDatum).format('DD MMMM YYYY');
  const endDate = dayjs(plek?.eindDatum).format('DD MMMM YYYY');

  // student inschrijven functie
  const processForm = async (values: any, event: React.FormEvent) => {
    event.preventDefault();

    await axios.put('/api/reizen/boeken', values).then((res) => {
      const { ok, message } = res.data;

      if (ok) {
        Router.push(Router.asPath);
        setErrMessage('');
      } else {
        setErrMessage(message);
      }
    });
  };

  // Voordat gegevens worden opgehaald
  if (!data) return <PageContainer>loading...</PageContainer>;

  // Wanneer er gegevens zijn opgehaald
  return (
    <PageContainer title={`GLR - Detail pagina van ${plek.titel}`}>
      <Stack style={{ maxWidth: '50rem', margin: 'auto' }}>
        <Card withBorder={true}>
          <Group position="apart">
            <Title>{plek.titel}</Title>
          </Group>
          <Badge>Bestemming: {plek.bestemming}</Badge>
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
                  <td>{plek._count.aanmeldingen}</td>
                  <td>
                    {plek._count.aanmeldingen >= plek.maxAantal ? (
                      <Badge color="red">Vol</Badge>
                    ) : (
                      <Badge>Open</Badge>
                    )}
                  </td>
                </tr>
              </tbody>
            </Table>
          </Stack>
        </Card>
        {/* weergave voor student */}
        {user?.userSession.rol === 'STUDENT' && (
          <>
            {errMessage && (
              <Alert title="Boekings fout" color="red">
                {errMessage}
              </Alert>
            )}
            <form onSubmit={form.onSubmit(processForm)}>
              <TextInput
                label="Je email"
                type="email"
                placeholder="12345@glr.nl"
                required={true}
                {...form.getInputProps('email')}
              />
              <TextInput hidden={true} {...form.getInputProps('reisID')} />
              <Space h={10} />
              <Group position="right">
                <Button type="submit">Inschrijven</Button>
              </Group>
            </form>
          </>
        )}

        {user?.userSession.rol === 'ADMIN' && (
          <Group my="md">
            <Title>Ingeschreven lijst</Title>
            <Table>
              <thead>
                <tr>
                  <th>Naam</th>
                  <th>Studentnummer</th>
                </tr>
              </thead>
              <tbody>
                {userData?.userSession?.aanmeldingen?.map(
                  (aanmelding: studenten) => (
                    <tr key={aanmelding.studentNummer}>
                      <td>{aanmelding.naam}</td>
                      <td>{aanmelding.studentNummer}</td>
                    </tr>
                  )
                )}
              </tbody>
            </Table>
          </Group>
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
