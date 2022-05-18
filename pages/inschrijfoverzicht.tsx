import PageContainer from '@/layout/Main';
import useUser from '@/lib/useUser';
import { Center, Stack, Table } from '@mantine/core';
import dayjs from 'dayjs';
import Router from 'next/router';
import React from 'react';
import useSWR from 'swr';

const InschrijfLijst = () => {
  useUser({
    redirectTo: '/inlog',
    redirectIfFound: false
  });

  const { data: plaatsen } = useSWR('/api/reizen/mutate?m=student');

  console.log(plaatsen);

  const { data: userRole } = useSWR('/api/user/mutate?m=withRole');
  return userRole?.userSession.rol === 'STUDENT' ? (
    <PageContainer>
      <Center>
        <Stack style={{width: ' 50rem'}}>
          <Table>
            <thead>
              <tr>
                <th>Naam reis</th>
                <th>Bestemming</th>
                <th>start datum</th>
                <th>eind datum</th>
              </tr>
            </thead>
            <tbody>
              {plaatsen.plaatsen[0].reizen?.map((plaats, idx: number) => {
                const beginDate = dayjs(plaats.beginDatum).format(
                  'DD MMMM YYYY'
                );
                const endDate = dayjs(plaats.eindDatum).format('DD MMMM YYYY');

                return (
                  <tr key={idx}>
                    <td>{plaats.titel}</td>
                    <td>{plaats.bestemming}</td>
                    <td>{beginDate}</td>
                    <td>{endDate}</td>
                  </tr>
                );
              })}
              {/* map tr -> td */}
            </tbody>
          </Table>
        </Stack>
      </Center>
    </PageContainer>
  ) : null;
};

export default InschrijfLijst;
