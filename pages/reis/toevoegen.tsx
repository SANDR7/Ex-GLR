import PageContainer from '@/layout/Main';
import useUser from '@/lib/useUser';
import {
  Center,
  NumberInput,
  Stack,
  Textarea,
  TextInput,
  Title,
  Group,
  Button
} from '@mantine/core';
import { useForm } from '@mantine/hooks';
import axios from 'axios';
import Router from 'next/router';
import React, { useState } from 'react';

const Aanmaken = () => {
  const [submitting, setSubmitting] = useState(false);

  const {user} = useUser({
    redirectTo: '/inlog',
    redirectIfFound: false
  });
  

  const form = useForm({
    initialValues: {
      title: '',
      description: '',
      destination: '',
      max: ''
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
        console.log(message);

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
