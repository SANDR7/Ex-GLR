import { reizen } from '.prisma/client';
import PageContainer from '@/layout/Main';
import prisma from '@/lib/prisma';
import { sessionOptions } from '@/lib/session';
import {
  Button,
  Center,
  Group,
  NumberInput,
  Stack,
  Textarea,
  TextInput,
  Title
} from '@mantine/core';
import { useForm } from '@mantine/form';
import axios from 'axios';
import { withIronSessionSsr } from 'iron-session/next';
import { GetServerSideProps } from 'next';
import React from 'react';
import Router from 'next/router';

const Aanpassen = ({ plaats }: { plaats: reizen }) => {
  const form = useForm({
    initialValues: {
      title: plaats.titel,
      description: plaats.omschrijving,
      destination: plaats.bestemming,
      max: plaats.maxAantal
    }
  }) as any;

  const processForm = async (values: any, event: React.FormEvent) => {
    await axios
      .put(`/api/reizen/mutate?m=udpateReis&id=${plaats.ID}`, values)
      .then((res) => {
        const { ok, message } = res.data;

        //    setSubmitting(true);

        // Wanneer ok === true is wordt er redirect naar reizen overzicht
        if (ok) {
          Router.push('/overzicht');
        } else {
          //  setSubmitting(false);
          // setErrMessage(message);
        }
      });
  };

  return (
    <PageContainer>
      <Center>
        <Stack style={{ width: '40%' }}>
          <Title order={1}>Reis Toevoegen</Title>

          <form onSubmit={form.onSubmit(processForm)}>
            <TextInput
              label="Titel"
              required={true}
              {...form.getInputProps('title')}
            />
            <TextInput
              label="Bestemming"
              required={true}
              {...form.getInputProps('destination')}
            />
            <Textarea
              label="Omschrijving"
              required={true}
              {...form.getInputProps('description')}
            />
            <NumberInput
              label="Maximum aantal"
              required={true}
              {...form.getInputProps('max')}
            />

            <Group position="right" py="lg">
              <Button type="submit">Reis Toevoegen</Button>
            </Group>
          </form>
        </Stack>
      </Center>
    </PageContainer>
  );
};

export const getServerSideProps: GetServerSideProps = withIronSessionSsr(
  async ({ req, res, query }) => {
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
        ID: query?.id as string
      },
      select: {
        ID: true,
        titel: true,
        bestemming: true,
        omschrijving: true,
        maxAantal: true
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

export default Aanpassen;