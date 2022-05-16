import PageContainer from '@/layout/Main';
import logger from '@/lib/logger';
import { sessionOptions } from '@/lib/session';
import useUser from '@/lib/useUser';
import { GetServerSideProps } from 'next';
import ErrorPage from 'next/error';
import React from 'react';
import { withIronSessionSsr } from 'iron-session/next';

const LOGGER = logger(import.meta.url);

const Overzicht = ({ data }: { data: string }) => {
  console.log(data);

  const { user } = useUser({
    redirectTo: '/inlog',
    redirectIfFound: false
  });

  //   Er voor zorgen dat gebruikers zonder account de pagina niet kunnen bekijken.
  if (!user) {
    console.error('gebruiker niet geautoriseerd om pagina te bezoeken');
    return (
      <ErrorPage
        statusCode={403} // Verboden toegang
        title="Je niet geautoriseerd om pagina te bezoeken"
      />
    );
  }
  // Pagina wanneer er een account is geconstateerd.
  return <PageContainer>protected Overzicht</PageContainer>;
};

export const getServerSideProps = withIronSessionSsr(async ({ req, res }) => {
  if (!req.session?.isLoggedIn) {
    LOGGER.warn('gebruiker niet geautoriseerd om pagina te bezoeken');
    return {
      props: {}
    };
  }

  return {
    props: {}
  };
}, sessionOptions);

export default Overzicht;
