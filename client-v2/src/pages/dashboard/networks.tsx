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
  Tooltip,
  MultiSelect,
  Select,
  FileInput
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useNetworkStore } from '@/stores/network';
import { Network } from '@/types/network';
import { hasLength, useForm } from '@mantine/form';
import { IconInfoCircle, IconSquareX, IconTextPlus } from '@tabler/icons-react';
import { Channel } from '@/types/channel';
import { applyNamingPattern } from '@/utils/applyNamingPattern';
import {
  CreateChannelPayload,
  DeployChaincodePayload
} from '@/interfaces/fabricNetworkApiPayloads';
import FabricNetworkApiInstance from '@/services/fabricNetworkApi';
import { convertParticipants } from '@/utils/convertParticipants';
import { StatusCodes } from 'http-status-codes';
import { notifications } from '@mantine/notifications';
import { OrgFormData } from '@/types/orgFormData';

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

type OptionProps = {
  label: string;
  value: string;
};

type ChainCode = {
  params: string;
  channel: string;
  file: File | undefined;
};

export default function Networks() {
  const { classes } = useStyles();

  const [opened, { open, close }] = useDisclosure(false);

  const { networks: nets, getNetwork, setChannel } = useNetworkStore();

  const [network, setNetwork] = useState<Network | undefined>(undefined);

  const [networks, setNetworks] = useState<Network[]>([]);

  const [createChannel, setCreateChannel] = useState(false);

  const [createChainCode, setCreateChainCode] = useState(false);

  const [loading, setLoading] = useState(false);

  const [optionPropsOrgs, setOptionPropsOrgs] = useState<OptionProps[]>([]);

  const [optionPropsChannels, setOptionPropsChannels] = useState<OptionProps[]>(
    []
  );

  const channelForm = useForm<Channel>({
    initialValues: {
      name: '',
      organizations: []
    },
    validate: {
      name: hasLength({ min: 3 }, 'Você precisa informar o nome da canal')
    }
  });

  const chainCodeForm = useForm<ChainCode>({
    initialValues: {
      params: '',
      channel: '',
      file: undefined
    },
    validate: {
      params: hasLength({ min: 3 }, 'Você precisa informar os parâmetros'),
      channel: hasLength({ min: 3 }, 'Você precisa informar o canal')
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

  const handleCancelChainCodeCreating = () => {
    setCreateChainCode(false);

    chainCodeForm.reset();
  };

  const getPeerOrganizations = (organizations?: string[]) => {
    if (organizations?.length) {
      const orgs = organizations
        .map(
          (organizationId) =>
            network?.organizations?.find(
              (org) => org.id?.toString() === organizationId
            )
        )
        .filter((organization) => organization) as OrgFormData[];

      return convertParticipants(orgs);
    }

    return convertParticipants(
      network?.organizations as Network['organizations']
    );
  };

  const onSubmitChainCode = async (values: ChainCode) => {
    // TODO: Criar método para obter organização que possui nó ordenador
    const ordererOrganization =
      network?.organizations?.find(
        (organization) => organization.hasOrderingNode == 1
      )?.name || '';

    const peerOrganizations = getPeerOrganizations();

    const payload: DeployChaincodePayload = {
      ordererOrganization,
      peerOrganizations,
      channelName: values.channel,
      chaincodeName: values.params,
      chaincodePath: 'chaincode-typescript'
    };

    const response = await FabricNetworkApiInstance.deployChaincode(payload);

    console.log(response);
  };

  const onSubmitChannel = async (values: Channel) => {
    setLoading(true);

    const channelName = values.name;

    const organizations = values.organizations?.length
      ? values.organizations
      : (network?.organizations?.map(
          (organization) => organization.name
        ) as []);

    // TODO: Criar método para obter organização que possui nó ordenador
    const ordererOrganization =
      network?.organizations?.find(
        (organization) => organization.hasOrderingNode == 1
      )?.name || '';

    const peerOrganizations = getPeerOrganizations(values.organizations);

    const payload: CreateChannelPayload = {
      channelName,
      ordererOrganization,
      peerOrganizations
    };

    const { status } = await FabricNetworkApiInstance.createChannel(payload);

    if (status === StatusCodes.OK) {
      const networkId = network?.id as number;

      setChannel(networkId, channelName, organizations);

      handleCancelChannelCreating();

      const updateNetwork = getNetwork(networkId);

      setNetwork(updateNetwork);

      notifications.show({
        title: 'Canal criado com sucesso!',
        message: `O canal ${channelName} foi criado com sucesso`,
        color: 'green',
        icon: <IconTextPlus size={20} />,
        autoClose: 5000
      });
    } else {
      notifications.show({
        title: 'Erro ao criar canal!',
        message: `Ocorreu um erro ao criar o canal ${channelName}`,
        color: 'red',
        icon: <IconSquareX size={20} />,
        autoClose: 5000
      });
    }

    setLoading(false);
  };

  const handleCloseModal = () => {
    close();

    setTimeout(() => {
      setNetwork(undefined);

      setCreateChannel(false);
      channelForm.reset();

      setCreateChainCode(false);
      chainCodeForm.reset();
    }, 500);
  };

  useEffect(() => {
    if (network) {
      setOptionPropsOrgs(
        network?.organizations?.map((organization) => ({
          label: organization.name,
          value: organization.name
        })) as OptionProps[]
      );
    }
  }, [network]);

  useEffect(() => {
    if (nets) {
      setNetworks(nets);
    }
  }, [nets]);

  useEffect(() => {
    if (createChainCode && network?.channels?.length) {
      setOptionPropsChannels(
        network?.channels?.map((channel) => ({
          label: channel.name,
          value: channel.name
        })) as OptionProps[]
      );
    }
  }, [createChainCode, network]);

  return (
    <>
      <Modal
        opened={opened}
        onClose={handleCloseModal}
        title={`Gerenciar rede / ID: ${network?.id}`}
        size={'xl'}
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
        <Card classNames={classes.card}>
          <Text className={classes.title} fw={500}>
            Canais
          </Text>
          <Text
            fz="xs"
            c="dimmed"
            mt={3}
            mb={network?.channels?.length ? 0 : 'xs'}
          >
            Gerencie os canais da rede
          </Text>
          {network?.channels && (
            <Card className={classes.card} withBorder mb={'xs'}>
              {network?.channels?.map((channel) => (
                <>
                  <Group
                    key={Math.random()}
                    position="apart"
                    className={classes.item}
                    noWrap
                    spacing="xl"
                  >
                    <div>
                      <Text size="xs" color="dimmed">
                        Nome do canal
                      </Text>
                      <Text>{channel?.name}</Text>
                    </div>
                    <div>
                      <Text size="xs" color="dimmed" ta="end">
                        Organizações
                      </Text>
                      <Text>
                        {channel?.organizations
                          ?.map((organization) => organization)
                          .join(', ')}
                      </Text>
                    </div>
                  </Group>
                </>
              ))}
            </Card>
          )}
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
            <Title order={6}>Definição de um novo canal</Title>
            <TextInput
              withAsterisk
              mb="md"
              label="Nome do canal"
              placeholder="Ex.: channel-name (sem espaços, caracteres especiais ou acentos...)"
              classNames={classes}
              disabled={loading}
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
            <div>
              <MultiSelect
                disabled={loading}
                data={optionPropsOrgs}
                searchable
                placeholder="Deixe em branco ou selecione um ou mais organizações"
                label="Organizações (Deixe o campo em branco p/ criar um canal para todas)"
                classNames={classes}
                // limit={20}
                // valueComponent={Value}
                // itemComponent={Item}
                // defaultValue={['US', 'FI']}
                {...channelForm.getInputProps('organizations')}
              />
            </div>
            <div className="space-x-2">
              <Button
                type="submit"
                leftIcon={<IconTextPlus size={20} />}
                loading={loading}
              >
                Criar canal
              </Button>
              <Button
                type="button"
                variant="default"
                leftIcon={<IconSquareX size={20} />}
                onClick={handleCancelChannelCreating}
                disabled={loading}
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
          <Box
            hidden={!createChainCode}
            p="md"
            sx={(theme) => ({
              backgroundColor: theme.colors.gray[0],
              border: `1px solid ${theme.colors.gray[2]}`,
              borderRadius: theme.radius.md
            })}
            component="form"
            onSubmit={chainCodeForm.onSubmit(onSubmitChainCode)}
            className="space-y-4"
          >
            <Title order={6}>Definição de um novo chaincode</Title>
            <Select
              disabled={loading}
              data={optionPropsChannels}
              searchable
              placeholder="Selecione um canal"
              label="Selecione um canal"
              classNames={classes}
              {...chainCodeForm.getInputProps('channel')}
            />
            <Select
              disabled={loading}
              data={[
                { label: 'Asset Transfer', value: 'asset-transfer-basic' },
                { label: 'Custom', value: 'custom' }
              ]}
              searchable
              placeholder="Parâmetros"
              label="Selecione um parâmetro"
              classNames={classes}
              {...chainCodeForm.getInputProps('params')}
            />
            {chainCodeForm.getInputProps('params').value === 'custom' && (
              <FileInput
                label="Selecione o arquivo (tar.gz)"
                placeholder="Selecione o arquivo"
                classNames={classes}
                accept=".tar.gz"
                multiple={false}
                {...chainCodeForm.getInputProps('file')}
              />
            )}
            <div className="space-x-2">
              <Button
                type="submit"
                leftIcon={<IconTextPlus size={20} />}
                loading={loading}
              >
                Implantar
              </Button>
              <Button
                type="button"
                variant="default"
                leftIcon={<IconSquareX size={20} />}
                onClick={handleCancelChainCodeCreating}
                disabled={loading}
              >
                Cancelar
              </Button>
            </div>
          </Box>
          {!createChainCode && (
            <Button
              variant="default"
              color="blue"
              fullWidth
              mt="md"
              radius="md"
              onClick={() => setCreateChainCode(true)}
            >
              Implantar chaincode
            </Button>
          )}
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
