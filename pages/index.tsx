import PageContainer from '@/layout/Main';
import {
  Box,
  Button,
  Center,
  Group,
  Title,
  useMantineTheme
} from '@mantine/core';
import Link from 'next/link';
import type { NextPage } from 'next';

const Home: NextPage = () => {
  const theme = useMantineTheme();
  // when user is logged in
  // const { user, mutateUser } = useUser();
  // when user is logged in || redirectIfFound -> login page = true home page = false
  // const { user, mutateUser } = useUser({redirectIfFound: true, redirectTo: '/dashboard'});
  // const { events } = useEvents(user, '/user/mutate');
  return (
    <PageContainer>
      <Group grow={true}>
        <Center>
          <img
            style={{ width: '80%' }}
            src="./hero_img.svg"
            alt="Vliegtuig met wolken"
          />
        </Center>
        <Box>
          <Title order={1} color={theme.colors.green[6]}>
            Ga Lekker Reizen
          </Title>
          <p style={{ width: ' 70%' }}>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Placeat
            molestias quo temporibus hic laborum iste maxime, deserunt officia,
            assumenda, doloribus impedit aut sequi architecto. Velit excepturi
            aut maiores. Fuga, vel?
          </p>

          <Link href="/inlog" passHref={true}>
            <Button component="a">Inloggen</Button>
          </Link>
        </Box>
      </Group>
    </PageContainer>
  );
};

export default Home;
