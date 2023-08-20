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
  rem
} from '@mantine/core';
import { OrgFormData } from '@/types/orgFormData';

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
  }
}));

export default function Organizations() {
  const { classes } = useStyles();

  const [organizations, setOrganizations] = useState<OrgFormData[]>([]);

  const { organizations: orgs } = useOrganizationStore();

  useEffect(() => {
    if (orgs) {
      setOrganizations(orgs);
    }
  }, [orgs]);

  return (
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
            <Title order={2}>Resumo</Title>
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
                </Card.Section>
              </Card>
            ))}
          </Box>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
