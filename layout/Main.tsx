import { AppShell } from '@mantine/core';
import Head from 'next/head';
import React, { FC } from 'react';

const PageContainer: FC<any> = (props) => {
  const { children, ...customMeta } = props;

  // Meta beschrijvingen voor SEO
  const meta = {
    title: `GLR - Ga Lekker Reizen`,
    description: 'Examen applicatie voor reisbureau GLR',
    type: 'website',
    ...customMeta
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
      <AppShell>{children}</AppShell>
    </>
  );
};

export default PageContainer;
