import PageContainer from '@/layout/Main';
import { sessionOptions } from '@/lib/session';
import { withIronSessionSsr } from 'iron-session/next';
import { GetServerSideProps } from 'next';
import {useRouter} from 'next/router';
import React from 'react';
import useSWR from 'swr';

const ReisDetail = () => {
    const router  = useRouter();

    const plaatsTitel = router.query;
    

    const { data: plaats } = useSWR(`/api/reizen/single?plaats=${plaatsTitel.slug}`);
    
  return (
    <PageContainer title={`GLR - Detail pagina van [reis]`}>reis</PageContainer>
  );
};

export const getServerSideProps: GetServerSideProps = withIronSessionSsr(
  async ({ req, res }) => {
        const user = req.session.user;        

        if (user === undefined) {
          res.setHeader('location', '/inlog');
          res.statusCode = 302;
          res.end();
          return {
            props: {} as any
          };
        }


    return {
      props: {}
    };
  },
  sessionOptions
);
export default ReisDetail;

