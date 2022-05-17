import PageContainer from '@/layout/Main';
import {
  Box,
  Button,
  Center,
  Grid,
  Group,
  Text,
  Title,
  useMantineTheme
} from '@mantine/core';
import type { NextPage } from 'next';
import Link from 'next/link';

const Home: NextPage = () => {
  const theme = useMantineTheme();
  // when user is logged in
  // const { user, mutateUser } = useUser();
  // when user is logged in || redirectIfFound -> login page = true home page = false
  // const { user, mutateUser } = useUser({redirectIfFound: true, redirectTo: '/dashboard'});
  // const { events } = useEvents(user, '/user/mutate');
  return (
    <PageContainer>
      <Center style={{ height: '80vh', minHeight: '50rem' }}>
        <Grid px="lg">
          <Grid.Col lg={6}>
            <img
              style={{ width: '80%' }}
              src="./hero_img.svg"
              alt="Vliegtuig met wolken"
            />
          </Grid.Col>
          <Grid.Col lg={6}>
            <Title order={1} style={{ color: theme.colors.glr[6] }}>
              Ga Lekker Reizen
            </Title>

            <Text style={{ width: ' 70%' }} my="lg">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Placeat
              molestias quo temporibus hic laborum iste maxime, deserunt
              officia, assumenda, doloribus impedit aut sequi architecto. Velit
              excepturi aut maiores. Fuga, vel?
            </Text>

            <Link href="/inlog" passHref={true}>
              <Button component="a" size="lg">
                Inloggen
              </Button>
            </Link>
          </Grid.Col>
        </Grid>
      </Center>
    </PageContainer>
  );
};

export default Home;
