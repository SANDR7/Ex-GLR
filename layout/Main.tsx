import useUser from '@/lib/useUser';
import { AppShell, Button, Footer, Group, Header, Text } from '@mantine/core';
import axios from 'axios';
import Head from 'next/head';
import Router, { useRouter } from 'next/router';
import React, { FC, useEffect } from 'react';

const PageContainer: FC<any> = (props) => {
  const router = useRouter();
  const { user } = useUser();
  useEffect(() => {

    // Dark mode easter egg
    console.log('Hey!')
    console.log('Wat doe je hier?');
    console.log('Ben je een developer?');
    console.log('druk Ctrl + J');
    console.log('Bedank me later ;)');
       
    
  }, [])

  const { children, ...customMeta } = props;

  // Meta beschrijvingen voor SEO
  const meta = {
    title: `GLR - Ga Lekker Reizen`,
    description: 'Examen applicatie voor reisbureau GLR',
    type: 'website',
    ...customMeta
  };

  const processLogout = async () => {
    await axios.post('/api/auth/logout');
    Router.push('/inlog');
  };

  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta name="robots" content="follow, index" />

        <meta content={meta.description} name="description" />

        <meta property="og:site_name" content="Sander van Ast" />
        <meta property="og:description" content={meta.description} />
        <meta property="og:title" content={meta.title} />

        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
      </Head>

      {user?.isLoggedIn ? (
        <AppShell
          header={
            <Header height={60} px=" 10rem">
              <Group position="apart" align="center" style={{ height: 60 }}>
                {/* <Group> */}
                <Button onClick={() => history.back()} color="dark">
                  Terug
                </Button>
                <Button onClick={processLogout}>Logout</Button>
                {/* </Group> */}
              </Group>
            </Header>
          }
        >
          {children}
        </AppShell>
      ) : (
        <AppShell
          header={
            <Header height={60} px=" 10rem">
              <Group align="center" style={{ height: 60 }}>
                <Button onClick={() => router.push('/')} color="dark">
                  Home
                </Button>
              </Group>
            </Header>
          }
        >
          {children}
        </AppShell>
      )}
    </>
  );
};

export default PageContainer;
