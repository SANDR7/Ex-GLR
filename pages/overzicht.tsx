import PageContainer from '@/layout/Main';
import useUser from '@/lib/useUser';
import axios from 'axios';
import React from 'react';
import useSWR from 'swr';
import {
  Badge,
  Button,
  Card,
  Center,
  Group,
  Stack,
  Text,
  Title
} from '@mantine/core';
import dayjs from 'dayjs';
import Link from 'next/link';
import Router from 'next/router';
import { reizen } from '.prisma/client';

const Overzicht = () => {
  // checken wanneer gebruiker is ingelogd || omleiden
  const { user } = useUser({
    redirectTo: '/inlog',
    redirectIfFound: false
  });

  // gegevens ophalen van database
  // gegevens worden client side gerenderd vanwege de datum format
  const { data: plaatsen } = useSWR('/api/reizen');

  const { data: userRole } = useSWR('/api/user/mutate?m=withRole');
  const { data: naam } = useSWR('/api/user/mutate?m=withName');

  // pagina weergeven wanneer er geen gegevens zijn
  if (!userRole && !plaatsen && !naam)
    return <PageContainer>loading...</PageContainer>;

  // Pagina wanneer er een account is geconstateerd.
  return (
    <PageContainer>
      <Center>
        <Stack style={{ width: '50rem' }}>
          <Title order={1}>Reizen overzicht</Title>
          {/* Naam van gebruiker laten zien */}
          {userRole?.userSession.rol === 'ADMIN' && naam && (
            <Text color="glr" weight={700}>
              Hallo, {naam.userSessionAdmin.admin[0].naam}
            </Text>
          )}
          {userRole?.userSession.rol === 'STUDENT' && naam && (
            <Text color="glr" weight={700}>
              Hallo, {naam.userSessionStudent.student[0].naam}
            </Text>
          )}

          {/* Nieuwe reis aanmaken */}
          {userRole?.userSession.rol === 'ADMIN' && (
            <Link href={`/reis/toevoegen`} passHref={true}>
              <Button component="a" style={{ width: 'max-content' }}>
                Reis Toevoegen
              </Button>
            </Link>
          )}
          {/* knop voor het weergeven van ingeschreven reizen */}
          {userRole?.userSession.rol === 'STUDENT' && (
            <Link href={`/inschrijfoverzicht`} passHref={true}>
              <Button disabled={true} style={{ width: 'max-content' }}>
                Ingeschreven lijst
              </Button>
            </Link>
          )}
          {/* gegevens van database weergeven */}
          {plaatsen?.map((plaats: reizen | any) => {
            // Tijden formateren
            const beginDate = dayjs(plaats.beginDatum).format('DD MMM YY');
            const endDate = dayjs(plaats.eindDatum).format('DD MMM YY');

            return (
              // algemene informatie over reis
              <Card key={plaats.ID} withBorder={true}>
                <Group position="apart">
                  <Title>{plaats.titel}</Title>
                  <Text>
                    {beginDate} - {endDate}
                  </Text>
                </Group>
                <Badge>{plaats.bestemming}</Badge>
                <Stack py="lg">
                  <Text size="sm" style={{ width: '80%' }}>
                    {plaats.omschrijving}
                  </Text>
                </Stack>
                {/* checken of gebruiker de juiste rechten heeft */}
                {userRole?.userSession?.rol === 'STUDENT' ? (
                  // Rechten voor Student
                  <Link href={`reis/${plaats.ID}`} passHref={true}>
                    <Button component="a" size="sm">
                      Meer informatie
                    </Button>
                  </Link>
                ) : (
                  // Rechten voor Admin
                  <Group position="apart">
                    <Group>
                      <Link href={`reis/${plaats.ID}`} passHref={true}>
                        <Button component="a" size="sm">
                          Meer informatie
                        </Button>
                      </Link>
                    </Group>

                    <Group position="right">
                      {plaats?.createdBy.adminID === user.ID && (
                        <>
                          <Link
                            href={`/reis/aanpassen?id=${plaats.ID}`}
                            passHref={true}
                          >
                            <Button size="sm" color="blue" component="a">
                              aanpassen
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            color="red"
                            onClick={async () => {
                              await axios.delete(
                                `/api/reizen/single?id=${plaats.ID}`
                              );
                              Router.push(Router.asPath);
                            }}
                          >
                            verwijderen
                          </Button>
                        </>
                      )}
                    </Group>
                  </Group>
                )}
              </Card>
            );
          })}
        </Stack>
      </Center>
    </PageContainer>
  );
};

export default Overzicht;
