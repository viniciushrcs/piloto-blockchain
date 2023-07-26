import {
  createStyles,
  Container,
  Title,
  Text,
  Button,
  SimpleGrid,
  rem
} from '@mantine/core';
import Link from 'next/link';
import { DASHBOARD_PATH } from '@/utils/constants';

const useStyles = createStyles((theme) => ({
  root: {
    paddingTop: rem(80),
    paddingBottom: rem(80)
  },

  title: {
    fontWeight: 900,
    fontSize: rem(34),
    marginBottom: theme.spacing.md,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,

    [theme.fn.smallerThan('sm')]: {
      fontSize: rem(32)
    }
  },

  control: {
    [theme.fn.smallerThan('sm')]: {
      width: '100%'
    }
  },

  mobileImage: {
    [theme.fn.largerThan('sm')]: {
      display: 'none'
    }
  },

  desktopImage: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none'
    }
  }
}));

export default function PageNotFound() {
  const { classes } = useStyles();

  return (
    <Container className={classes.root} size={'xl'}>
      <SimpleGrid
        spacing={80}
        cols={2}
        breakpoints={[{ maxWidth: 'sm', cols: 1, spacing: 40 }]}
      >
        <div>
          <Title className={classes.title}>Oops! Página não encontrada</Title>
          <Text color="dimmed" size="lg">
            A página que você está tentando acessar não existe ou foi removida.
            Se você acha que isso é um erro, por favor, entre em contato com o
            suporte.
          </Text>
          <Link href={DASHBOARD_PATH}>
            <Button
              variant="outline"
              size="md"
              mt="xl"
              className={classes.control}
            >
              Voltar para a página inicial
            </Button>
          </Link>
        </div>
      </SimpleGrid>
    </Container>
  );
}
