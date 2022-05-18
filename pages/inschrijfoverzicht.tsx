import PageContainer from '@/layout/Main';
import useUser from '@/lib/useUser';
import { Center, Stack, Table } from '@mantine/core';
import dayjs from 'dayjs';
import React from 'react';
import useSWR from 'swr';

const InschrijfLijst = () => {
  useUser({
    redirectTo: '/inlog',
    redirectIfFound: false
  });
  const { data: plaatsen } = useSWR('/api/reizen/mutate?m=student');

  if (!plaatsen) return <PageContainer>Loading...</PageContainer>;
  return (
    <PageContainer>
      <Center>
        <Stack style={{ width: ' 50rem' }}>
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
              {plaatsen.plaatsen[0].reizen &&
                plaatsen.plaatsen[0].reizen?.map((plaats: any, idx: number) => {
                  const beginDate = dayjs(plaats.beginDatum).format(
                    'DD MMMM YYYY'
                  );
                  const endDate = dayjs(plaats.eindDatum).format(
                    'DD MMMM YYYY'
                  );

                  return (
                    <tr key={idx}>
                      <td>{plaats.titel}</td>
                      <td>{plaats.bestemming}</td>
                      <td>{beginDate}</td>
                      <td>{endDate}</td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
        </Stack>
      </Center>
    </PageContainer>
  );
};

export default InschrijfLijst;
