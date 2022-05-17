import useUser from '@/lib/useUser';
import { AppShell, Button, Footer, Group, Header, Text } from '@mantine/core';
import axios from 'axios';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { FC } from 'react';
import useSWR from 'swr';

const PageContainer: FC<any> = (props) => {
  const router = useRouter();
  const { user } = useUser();

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
    router.push('/inlog');
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

      {router.pathname === '/' && '/overzicht' ? (
        <AppShell
          footer={
            <Footer height={60}>
              <Group position="center" align="center" style={{ height: 60 }}>
                Mogeljik gemaakt door: Sander van Ast
              </Group>
            </Footer>
          }
        >
          {children}
        </AppShell>
      ) : (
        <AppShell
          header={
            user?.isLoggedIn && (
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
            )
          }
        >
          {children}
        </AppShell>
      )}
    </>
  );
};

export default PageContainer;
