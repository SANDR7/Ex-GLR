import PageContainer from '@/layout/Main';
import {
  Anchor,
  Button,
  Center,
  Grid,
  Group,
  SimpleGrid,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import type { NextPage } from 'next';
import Link from 'next/link';

const Home: NextPage = () => {
  const theme = useMantineTheme();

  // basis gegvens van reisbureau
  const bureauGegevens = [
    {
      title: 'E-mail',
      description: 'hello@glr.nl',
      link: 'mailto:hello@glr.nl'
    },
    { title: 'Telefoon', description: '088 200 1500', link: 'tel:0882001500' },
    {
      title: 'Adres',
      description: 'Heer Bokelweg 255, 3032 AD Rotterdam',
      link: 'https://goo.gl/maps/SjTmHL81hSXps1g1A'
    }
  ];

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
            <SimpleGrid
              cols={2}
              breakpoints={[{ maxWidth: 755, cols: 1 }]}
              style={{ maxWidth: 400, marginTop: ' 10rem' }}
            >
              {bureauGegevens.map((item, idx) => (
                <>
                  <Group key={idx}>{item.title}</Group>
                  <Anchor href={item.link} target="_blank">
                    <Group>{item.description}</Group>
                  </Anchor>
                </>
              ))}
            </SimpleGrid>
          </Grid.Col>
        </Grid>
      </Center>
    </PageContainer>
  );
};

export default Home;
