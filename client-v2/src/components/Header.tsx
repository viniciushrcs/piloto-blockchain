import { useMemo } from 'react';
import {
  createStyles,
  Header as MantineHeader,
  Text,
  rem,
  Container,
  Group,
  Burger,
  Paper,
  Transition
} from '@mantine/core';
import { IconSettings, IconHome } from '@tabler/icons-react';
import Link from 'next/link';
import { useDisclosure } from '@mantine/hooks';
import Logo from '@/components/Logo';
import { useRouter } from 'next/router';

const HEADER_HEIGHT = rem(70);

const useStyles = createStyles((theme) => ({
  root: {
    position: 'relative',
    zIndex: 1
  },

  dropdown: {
    position: 'absolute',
    top: HEADER_HEIGHT,
    left: 0,
    right: 0,
    zIndex: 0,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderTopWidth: 0,
    overflow: 'hidden',

    [theme.fn.largerThan('sm')]: {
      display: 'none'
    }
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%'
  },

  links: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none'
    }
  },

  burger: {
    [theme.fn.largerThan('sm')]: {
      display: 'none'
    }
  },

  link: {
    display: 'block',
    padding: `${rem(8)} ${rem(12)}`,
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[6]
          : theme.colors.gray[0]
    },

    [theme.fn.smallerThan('sm')]: {
      borderRadius: 0,
      padding: theme.spacing.md
    }
  },

  linkActive: {
    '&, &:hover': {
      backgroundColor: theme.fn.variant({
        variant: 'light',
        color: theme.primaryColor
      }).background,
      color: theme.fn.variant({ variant: 'light', color: theme.primaryColor })
        .color
    }
  }
}));

export default function Header() {
  const router = useRouter();

  const currentLink = router.pathname;

  const links = useMemo(
    () => [
      {
        link: '/dashboard',
        label: 'Dashboard',
        icon: IconHome,
        isActive: currentLink === '/dashboard'
      },
      {
        link: '/dashboard/settings',
        label: 'Configurações',
        icon: IconSettings,
        isActive: currentLink === '/dashboard/settings'
      }
    ],
    [currentLink]
  );

  const { classes, cx } = useStyles();

  const [opened, { toggle }] = useDisclosure(false);

  const items = links.map((link) => {
    const IconComponent = link.icon;

    return (
      <Link
        key={link.label}
        href={link.link}
        className={cx(classes.link, {
          [classes.linkActive]: link.isActive
        })}
      >
        <div className="flex items-center justify-center">
          <IconComponent size={16} className="mr-1" />
          <Text>{link.label}</Text>
        </div>
      </Link>
    );
  });

  return (
    <MantineHeader height={HEADER_HEIGHT} mb={20} className={classes.root}>
      <Container className={classes.header} size={'xl'}>
        <Link href={'#'}>
          <Logo />
        </Link>
        <Group spacing={5} className={classes.links}>
          {items}
        </Group>
        <Burger
          opened={opened}
          onClick={toggle}
          className={classes.burger}
          size="sm"
        />
        <Transition transition="pop-top-right" duration={200} mounted={opened}>
          {(styles) => (
            <Paper className={classes.dropdown} withBorder style={styles}>
              {items}
            </Paper>
          )}
        </Transition>
      </Container>
    </MantineHeader>
  );
}
