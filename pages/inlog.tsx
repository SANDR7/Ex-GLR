import { accounts } from '.prisma/client';
import PageContainer from '@/layout/Main';
import useUser from '@/lib/useUser';
import {
  Button,
  Center,
  Group,
  Paper,
  PasswordInput,
  Space,
  TextInput,
  Title
} from '@mantine/core';
import { useForm } from '@mantine/form';
import axios from 'axios';
import Router from 'next/router';
import React, { useState } from 'react';

const Inlog = () => {
  const [submitting, setSubmitting] = useState(false);
  const [errMessage, setErrMessage] = useState('');


  useUser({ redirectTo: '/overzicht', redirectIfFound: true });

  const form = useForm({
    initialValues: {
      email: '',
      password: ''
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email')
    }
  });

  // Formulier verwerken
  const processForm = async (values: any, event: React.FormEvent<Element>) => {
    event.preventDefault();
    await axios.post('api/auth/login', values).then((res) => {
      const { ok, message } = res.data;

      setSubmitting(true);

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
      <Center>
        <Paper shadow="sm" p="lg" withBorder={true} style={{ width: ' 40rem' }}>
          <Center>

          <Title>Welkom</Title>
          </Center>
          {errMessage || 'nog geen fouten gemaakt'}
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
              <Button type="submit" loading={submitting}>Inloggen</Button>
            </Group>
          </form>
        </Paper>
      </Center>
    </PageContainer>
  );
};

export default Inlog;
