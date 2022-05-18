import PageContainer from '@/layout/Main';
import useUser from '@/lib/useUser';
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
import { DatePicker } from '@mantine/dates';
import { useForm } from '@mantine/hooks';
import axios from 'axios';
import Router from 'next/router';
import React, { useState } from 'react';

const Aanmaken = () => {
  const [submitting, setSubmitting] = useState(false);

  // checken wanneer gebruiker is ingelogd || omleiden
  useUser({
    redirectTo: '/inlog',
    redirectIfFound: false
  });

  // beginwaarden van gegevens
  const form = useForm({
    initialValues: {
      title: '',
      description: '',
      destination: '',
      max: '',
      begin: '',
      end: ''
    }
  }) as any;

  const processForm = async (values: any, event: React.FormEvent) => {
    await axios.post('/api/reizen/mutate?m=createReis', values).then((res) => {
      const { ok, message } = res.data;

      setSubmitting(true);

      // Wanneer ok === true is wordt er redirect naar reizen overzicht
      if (ok) {
        Router.push('/overzicht');
      } else {
        setSubmitting(false);
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

            <DatePicker
              label="Start datum"
              required={true}
              {...form.getInputProps('begin')}
            />
            <DatePicker
              label="Eind datum"
              required={true}
              {...form.getInputProps('end')}
            />

            <Group position="right" py="lg">
              <Button type="submit" loading={submitting}>
                Reis Toevoegen
              </Button>
            </Group>
          </form>
        </Stack>
      </Center>
    </PageContainer>
  );
};

export default Aanmaken;
