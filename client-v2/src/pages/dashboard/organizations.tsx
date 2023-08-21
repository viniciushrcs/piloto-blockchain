import { useEffect, useState } from 'react';
import { useOrganizationStore } from '@/stores/organization';
import {
  Container,
  Grid,
  Box,
  Title,
  Text,
  Card,
  createStyles,
  rem,
  Button,
  Modal,
  Group
} from '@mantine/core';
import { OrgFormData } from '@/types/orgFormData';
import { useDisclosure } from '@mantine/hooks';

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white
  },

  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
    borderTop: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]
    }`
  },

  title: {
    lineHeight: 1
  },

  item: {
    '& + &': {
      paddingTop: theme.spacing.sm,
      marginTop: theme.spacing.sm,
      borderTop: `${rem(1)} solid ${
        theme.colorScheme === 'dark'
          ? theme.colors.dark[4]
          : theme.colors.gray[2]
      }`
    }
  }
}));

export default function Organizations() {
  const { classes } = useStyles();

  const [opened, { open, close }] = useDisclosure(false);

  const [organization, setOrganization] = useState<OrgFormData | undefined>(
    undefined
  );

  const [organizations, setOrganizations] = useState<OrgFormData[]>([]);

  const { organizations: orgs, getOrganization } = useOrganizationStore();

  const handleOpen = (id: number) => {
    console.log(id);

    const org = getOrganization(id);

    setOrganization(org);

    open();
  };

  useEffect(() => {
    if (orgs) {
      setOrganizations(orgs);
    }
  }, [orgs]);

  return (
    <>
      <Modal opened={opened} onClose={close} title="Gerenciar rede" centered>
        <Card className={classes.card}>
          <Group position="apart" className={classes.item} noWrap spacing="xl">
            <div>
              <Text size="xs" color="dimmed">
                Nome da organização
              </Text>
              <Text>{organization?.name}</Text>
            </div>
          </Group>
          <Group position="apart" className={classes.item} noWrap spacing="xl">
            <div>
              <Text size="xs" color="dimmed">
                Possui nó ordenador?
              </Text>
              <Text>
                {organization?.hasOrderingNode.toString() === '1'
                  ? 'Sim'
                  : 'Não'}
              </Text>
            </div>
          </Group>
          <Group position="apart" className={classes.item} noWrap spacing="xl">
            <div>
              <Text size="xs" color="dimmed">
                Número de peers
              </Text>
              <Text>
                {organization?.numberOfPeers.toString() === '1'
                  ? `${organization?.numberOfPeers} peer`
                  : `${organization?.numberOfPeers} peers`}
              </Text>
            </div>
          </Group>
          <Button variant="default" color="blue" fullWidth mt="md" radius="md">
            Criar canal
          </Button>
        </Card>
        <Card className={classes.card}>
          <Text className={classes.title} fw={500}>
            Chaincode
          </Text>
          <Text fz="xs" c="dimmed" mt={3} mb="xl">
            Gerencie os chaincodes da organização
          </Text>
          <Button variant="default" color="blue" fullWidth mt="md" radius="md">
            Implementar chaincode
          </Button>
          <Button variant="default" color="blue" fullWidth mt="md" radius="md">
            Executar chaincode
          </Button>
        </Card>
      </Modal>
      <Container size={'xl'}>
        <Grid>
          <Grid.Col md={12}>
            <Box
              p="md"
              sx={(theme) => ({
                backgroundColor: theme.colors.gray[0],
                border: `1px solid ${theme.colors.gray[2]}`,
                borderRadius: theme.radius.md
              })}
              component="div"
              className="space-y-4"
            >
              <Title order={2}>Gereciamento de organizações</Title>
              {organizations?.map((organization) => (
                <Card
                  key={organization.id}
                  withBorder
                  padding="lg"
                  className={classes.card}
                >
                  <Card.Section className={classes.footer}>
                    <div>
                      <Text size="xs" color="dimmed">
                        Nome da organização
                      </Text>
                      <Text weight={500} size="sm">
                        {organization.name}
                      </Text>
                    </div>
                    <div>
                      <Text size="xs" color="dimmed">
                        Possui nó ordenador?
                      </Text>
                      <Text weight={500} size="sm">
                        {organization.hasOrderingNode.toString() === '1'
                          ? 'Sim'
                          : 'Não'}
                      </Text>
                    </div>
                    <div>
                      <Text size="xs" color="dimmed">
                        Número de peers
                      </Text>
                      <Text weight={500} size="sm">
                        {organization.numberOfPeers.toString() === '1'
                          ? `${organization.numberOfPeers} peer`
                          : `${organization.numberOfPeers} peers`}
                      </Text>
                    </div>
                    <div>
                      <Button
                        color="blue"
                        size="xs"
                        radius="xl"
                        mt={6}
                        onClick={() =>
                          organization.id && handleOpen(organization.id)
                        }
                      >
                        Gerenciar rede
                      </Button>
                    </div>
                  </Card.Section>
                </Card>
              ))}
            </Box>
          </Grid.Col>
        </Grid>
      </Container>
    </>
  );
}
