import PageContainer from '@/layout/Main';
import useUser from '@/lib/useUser';
import {
  Alert,
  Button,
  Center,
  Group,
  Paper,
  PasswordInput,
  Space,
  TextInput,
  Text,
  Title,
  Stack
} from '@mantine/core';
import { useForm } from '@mantine/form';
import axios from 'axios';
import Router from 'next/router';
import React, { useState } from 'react';

const Inlog = () => {
  const [submitting, setSubmitting] = useState(false);
  const [errMessage, setErrMessage] = useState('');

  // redirect gebruiker wanneer er is ingelogd
  useUser({ redirectTo: '/overzicht', redirectIfFound: true });

  const form = useForm({
    initialValues: {
      email: '',
      password: ''
    },

    validate: {
      email: (value) =>
        /^\S+@\S+$/.test(value) ? null : 'onjuist email formaat'
    }
  });

  // Formulier verwerken
  const processForm = async (values: any, event: React.FormEvent<Element>) => {
    event.preventDefault();
    // verzoek om gebruiker in te loggen
    await axios.post('api/auth/login', values).then((res) => {
      const { ok, message } = res.data;

      setSubmitting(true);

      // Wanneer ok === true is wordt er redirect naar reizen overzicht
      if (ok) {
        Router.push('/overzicht');
      } else {
        setSubmitting(false);
        setErrMessage(message);
      }
    });
  };

  return (
    <PageContainer title="GLR - Inloggen">
      <Center mt="10rem">
        <Paper shadow="sm" p="lg" withBorder={true} style={{ width: ' 40rem' }}>
          <Center>
            <Stack>
              <Title>Welkom Reiziger!</Title>
              <Text>Kijk wat er allemaal wordt aangeboden</Text>
            </Stack>
          </Center>
          {/* Als er een error komt wordt het weer gegeven */}
          {errMessage && (
            <Alert title="Inlog fout" color="red">
              {errMessage}
            </Alert>
          )}
          <Space h="lg" />
          <form onSubmit={form.onSubmit(processForm)}>
            <TextInput
              label="Email"
              type="email"
              description="Voer hier uw email adres in"
              placeholder="12345@glr.nl"
              required={true}
              {...form.getInputProps('email')}
            />
            <Space h="lg" />
            <PasswordInput
              label="wachtwood"
              description="Voer hier uw geheime wachtwoord in"
              placeholder="geheim wachtwoord"
              required={true}
              {...form.getInputProps('password')}
            />
            <Space h="lg" />
            <Group position="right">
              <Button type="submit" loading={submitting}>
                Inloggen
              </Button>
            </Group>
          </form>
        </Paper>
      </Center>
    </PageContainer>
  );
};

export default Inlog;
