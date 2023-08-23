import { useEffect, useState } from 'react';
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
  Group,
  Center,
  TextInput,
  Tooltip
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useNetworkStore } from '@/stores/network';
import { Network } from '@/types/network';
import { hasLength, useForm } from '@mantine/form';
import { IconInfoCircle, IconSquareX, IconTextPlus } from '@tabler/icons-react';
import { Channel } from '@/types/channel';
import { applyNamingPattern } from '@/utils/applyNamingPattern';
import { CreateChannelPayload } from '@/interfaces/fabricNetworkApiPayloads';
import FabricNetworkApiInstance from '@/services/fabricNetworkApi';
import { convertParticipants } from '@/utils/convertParticipants';

const useStyles = createStyles((theme) => ({
  root: {
    position: 'relative'
  },

  input: {
    height: rem(54),
    paddingTop: rem(18)
  },

  label: {
    position: 'absolute',
    pointerEvents: 'none',
    fontSize: theme.fontSizes.xs,
    paddingLeft: theme.spacing.sm,
    paddingTop: `calc(${theme.spacing.sm} / 2)`,
    zIndex: 1
  },

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

export default function Networks() {
  const { classes } = useStyles();

  const [opened, { open, close }] = useDisclosure(false);

  const { networks: nets, getNetwork } = useNetworkStore();

  const [network, setNetwork] = useState<Network | undefined>(undefined);

  const [networks, setNetworks] = useState<Network[]>([]);

  const [createChannel, setCreateChannel] = useState(false);

  const channelForm = useForm<Channel>({
    initialValues: {
      name: ''
    },
    validate: {
      name: hasLength({ min: 3 }, 'Você precisa informar o nome da canal')
    }
  });

  const handleOpen = (id: number) => {
    const network = getNetwork(id);

    setNetwork(network);

    open();
  };

  const handleCancelChannelCreating = () => {
    setCreateChannel(false);

    channelForm.reset();
  };

  const onSubmitChannel = async (values: Channel) => {
    const channelName = values.name;

    // TODO: Criar método para obter organização que possui nó ordenador
    const ordererOrganization =
      network?.organizations?.find(
        (organization) => organization.hasOrderingNode == 1
      )?.name || '';

    const peerOrganizations = convertParticipants(
      network?.organizations as Network['organizations']
    );

    const payload: CreateChannelPayload = {
      channelName,
      ordererOrganization,
      peerOrganizations
    };

    console.log(payload);

    const response = await FabricNetworkApiInstance.createChannel(
      payload as CreateChannelPayload
    );

    console.log(response);
  };

  useEffect(() => {
    if (nets) {
      setNetworks(nets);
    }
  }, [nets]);

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title={`Gerenciar rede / ID: ${network?.id}`}
        size={'lg'}
        centered
      >
        <Card className={classes.card}>
          {network?.organizations?.map((organization) => (
            <>
              <Group
                key={organization.id}
                position="apart"
                className={classes.item}
                noWrap
                spacing="xl"
              >
                <div>
                  <Text size="xs" color="dimmed">
                    Nome da organização
                  </Text>
                  <Text>{organization?.name}</Text>
                </div>
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
            </>
          ))}
        </Card>
        <Card className={classes.card}>
          <Text className={classes.title} fw={500}>
            Canais
          </Text>
          <Text fz="xs" c="dimmed" mt={3} mb="xl">
            Gerencie os canais da rede
          </Text>
          <Box
            hidden={!createChannel}
            p="md"
            sx={(theme) => ({
              backgroundColor: theme.colors.gray[0],
              border: `1px solid ${theme.colors.gray[2]}`,
              borderRadius: theme.radius.md
            })}
            component="form"
            onSubmit={channelForm.onSubmit(onSubmitChannel)}
            className="space-y-4"
          >
            <Title order={6}>Definição do canal</Title>
            <TextInput
              withAsterisk
              mb="md"
              label="Nome do canal"
              placeholder="Ex.: channel-name (sem espaços, caracteres especiais ou acentos...)"
              classNames={classes}
              rightSection={
                <Tooltip
                  label="O nome do canal deve ser único e não pode ser alterado após a criação"
                  position="top-end"
                  withArrow
                  transitionProps={{ transition: 'pop-bottom-right' }}
                >
                  <Text color="dimmed" sx={{ cursor: 'help' }}>
                    <Center>
                      <IconInfoCircle size="1.1rem" stroke={1.5} />
                    </Center>
                  </Text>
                </Tooltip>
              }
              onChange={(event) => {
                const { value } = event.currentTarget;

                channelForm.setFieldValue('name', applyNamingPattern(value));
              }}
              value={channelForm.values.name}
              error={channelForm.errors.name}
            />
            <div className="space-x-2">
              <Button type="submit" leftIcon={<IconTextPlus size={20} />}>
                Criar canal
              </Button>
              <Button
                type="button"
                variant="default"
                leftIcon={<IconSquareX size={20} />}
                onClick={handleCancelChannelCreating}
              >
                Cancelar
              </Button>
            </div>
          </Box>
          {!createChannel && (
            <Button
              variant="default"
              color="blue"
              fullWidth
              mt="md"
              radius="md"
              onClick={() => setCreateChannel(true)}
            >
              Criar canal
            </Button>
          )}
        </Card>
        <Card className={classes.card}>
          <Text className={classes.title} fw={500}>
            Chaincode
          </Text>
          <Text fz="xs" c="dimmed" mt={3} mb="xl">
            Gerencie os chaincodes da rede
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
              <Title order={2}>Gereciamento das redes</Title>
              {networks?.map((network) => (
                <Card
                  key={network.id}
                  classNames={classes.card}
                  className="space-y-4"
                >
                  <div className="flex justify-between">
                    <Title order={6} color="gray">
                      ID: {network.id}
                    </Title>
                    <Button
                      color="blue"
                      size="xs"
                      onClick={() => handleOpen(network.id)}
                    >
                      Gerenciar rede
                    </Button>
                  </div>
                  {network.organizations?.map((organization) => (
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
                </Card>
              ))}
            </Box>
          </Grid.Col>
        </Grid>
      </Container>
    </>
  );
}
