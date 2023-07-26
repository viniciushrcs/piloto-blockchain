import { useState } from 'react';
import {
  createStyles,
  Text,
  Container,
  ActionIcon,
  Group,
  rem
} from '@mantine/core';
import {
  IconBrandTwitter,
  IconBrandYoutube,
  IconBrandInstagram,
  IconBrandFacebook,
  IconBrandLinkedin
} from '@tabler/icons-react';
import Link from 'next/link';
import Logo from '@/components/Logo';

const useStyles = createStyles((theme) => ({
  footer: {
    marginTop: rem(120),
    paddingTop: `calc(${theme.spacing.xl} * 2)`,
    paddingBottom: `calc(${theme.spacing.xl} * 2)`,
    backgroundColor:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[6]
        : theme.colors.gray[0],
    borderTop: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]
    }`
  },

  logo: {
    maxWidth: rem(200),

    [theme.fn.smallerThan('sm')]: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }
  },

  description: {
    marginTop: rem(5),

    [theme.fn.smallerThan('sm')]: {
      marginTop: theme.spacing.xs,
      textAlign: 'center'
    }
  },

  inner: {
    display: 'flex',
    justifyContent: 'space-between',

    [theme.fn.smallerThan('sm')]: {
      flexDirection: 'column',
      alignItems: 'center'
    }
  },

  groups: {
    display: 'flex',
    flexWrap: 'wrap',

    [theme.fn.smallerThan('sm')]: {
      display: 'none'
    }
  },

  wrapper: {
    width: rem(160)
  },

  link: {
    display: 'block',
    color:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[1]
        : theme.colors.gray[6],
    fontSize: theme.fontSizes.sm,
    paddingTop: rem(3),
    paddingBottom: rem(3),
    textDecoration: 'none',

    '&:hover': {
      textDecoration: 'underline'
    }
  },

  title: {
    fontSize: theme.fontSizes.lg,
    fontWeight: 700,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    marginBottom: `calc(${theme.spacing.xs} / 2)`,
    color: theme.colorScheme === 'dark' ? theme.white : theme.black
  },

  afterFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.xl,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
    borderTop: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
    }`,

    [theme.fn.smallerThan('sm')]: {
      flexDirection: 'column'
    }
  },

  social: {
    [theme.fn.smallerThan('sm')]: {
      marginTop: theme.spacing.xs
    }
  }
}));

export default function Footer() {
  const { classes, cx } = useStyles();

  const [data] = useState([
    {
      title: 'Recursos Educacionais',
      links: [
        {
          label: 'Internet Avançada',
          link: 'https://www.rnp.br/busca?term=internet+avan%C3%A7ada&sort_by=created&range=all'
        },
        {
          label: 'Serviços Colaborativos',
          link: 'https://www.rnp.br/busca?term=Servi%C3%A7os+Colaborativos&sort_by=created&range=all'
        },
        {
          label: 'Plataforma de Conhecimento',
          link: 'https://www.rnp.br/busca?term=Plataforma+de+Conhecimento&sort_by=created&range=all'
        }
      ]
    },
    {
      title: 'Pesquisa e Inovação',
      links: [
        { label: 'Projetos em Destaque', link: 'https://www.rnp.br/projetos' },
        {
          label: 'Laboratórios Avançados',
          link: 'https://www.rnp.br/busca?term=Laborat%C3%B3rios+Avan%C3%A7ados&sort_by=created&range=all'
        },
        {
          label: 'Soluções Tecnológicas',
          link: 'https://www.rnp.br/busca?term=Solu%C3%A7%C3%B5es+Tecnol%C3%B3gicas&sort_by=created&range=all'
        }
      ]
    },
    {
      title: 'Segurança e Privacidade',
      links: [
        {
          label: 'Proteção de Dados',
          link: 'https://www.rnp.br/busca?term=Dados&sort_by=created&range=all'
        },
        {
          label: 'Cibersegurança',
          link: 'https://www.rnp.br/busca?term=Ciberseguran%C3%A7a&sort_by=created&range=all'
        },
        {
          label: 'Políticas de Acesso',
          link: 'https://www.rnp.br/sistema-rnp/ferramentas/documentos/politica-cookies'
        }
      ]
    }
  ]);

  const groups = data.map((group) => {
    const links = group.links.map((link, index) => (
      <a
        key={index}
        className={classes.link}
        href={link.link}
        target="_blank"
        rel="noopener noreferrer"
      >
        {link.label}
      </a>
    ));

    return (
      <div className={classes.wrapper} key={group.title}>
        <Text className={classes.title}>{group.title}</Text>
        {links}
      </div>
    );
  });

  return (
    <footer className={cx(classes.footer, 'mt-10')}>
      <Container className={classes.inner} size={'xl'}>
        <div className={classes.logo}>
          <Link href={'#'}>
            <Logo />
          </Link>
          <Text size="xs" color="dimmed" className={classes.description}>
            Organização Social do MCTI.
          </Text>
        </div>
        <div className={classes.groups}>{groups}</div>
      </Container>
      <Container className={classes.afterFooter} size={'xl'}>
        <Text color="dimmed" size="sm">
          © {new Date().getFullYear()} RNP. Todos os direitos
        </Text>
        <Group spacing={0} className={classes.social} position="right" noWrap>
          <ActionIcon size="lg">
            <a
              href="https://www.linkedin.com/company/redernp"
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconBrandLinkedin size="1.05rem" stroke={1.5} />
            </a>
          </ActionIcon>
          <ActionIcon size="lg">
            <a
              href="https://www.facebook.com/RedeNacionaldeEnsinoePesquisaRNP"
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconBrandFacebook size="1.05rem" stroke={1.5} />
            </a>
          </ActionIcon>
          <ActionIcon size="lg">
            <a
              href="https://twitter.com/Rede_RNP"
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconBrandTwitter size="1.05rem" stroke={1.5} />
            </a>
          </ActionIcon>
          <ActionIcon size="lg">
            <a
              href="https://www.youtube.com/c/RedeRNP"
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconBrandYoutube size="1.05rem" stroke={1.5} />
            </a>
          </ActionIcon>
          <ActionIcon size="lg">
            <a
              href="https://www.instagram.com/redernp"
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconBrandInstagram size="1.05rem" stroke={1.5} />
            </a>
          </ActionIcon>
        </Group>
      </Container>
    </footer>
  );
}
