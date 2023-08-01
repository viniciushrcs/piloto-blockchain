import { useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextInput,
  Text,
  Tooltip,
  Grid,
  Title,
  Center,
  createStyles,
  rem,
  Select,
  Stepper,
  Group,
  Alert,
  ScrollArea,
  Table,
  ActionIcon,
  Badge,
  Card,
  Paper,
  Progress
} from '@mantine/core';
import { hasLength, isInRange, useForm } from '@mantine/form';
import {
  IconAlertCircle,
  IconArrowLeft,
  IconArrowRight,
  IconArtboard,
  IconCheck,
  IconCircleDashed,
  IconInfoCircle,
  IconPencil,
  IconPlaystationCircle,
  IconTextPlus,
  IconTrash,
  IconX
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { convertParticipants } from '@/utils/helpers';
import { StartNetworkPayload } from '@/interfaces/fabricNetworkApiPayloads';
import FabricNetworkApiInstance from '@/services/fabricNetworkApi';

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
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    lineHeight: 1
  }
}));

type Step1FormValues = {
  platform: string;
};

export type Step2FormValues = {
  id?: number;
  name: string;
  hasOrderingNode: number;
  numberOfPeers: number;
};

type Data = Step1FormValues | Step2FormValues;

export default function Index() {
  const { classes } = useStyles();

  const [data, setData] = useState<Data | null>(null);

  const [buttonName, setButtonName] = useState('Adicionar participante');

  const [participants, setParticipants] = useState<Step2FormValues[]>([]);

  const [step, setActive] = useState(0);

  const [loading, setLoading] = useState(false);

  const step1Form = useForm<Step1FormValues>({
    initialValues: {
      platform: ''
    },
    validate: {
      platform: hasLength({ min: 3 }, 'Você precisa selecionar uma plataforma')
    }
  });

  const step2Form = useForm<Step2FormValues>({
    initialValues: {
      name: '',
      hasOrderingNode: -1,
      numberOfPeers: 0
    },
    validate: {
      name: hasLength({ min: 3 }, 'O nome deve ter no mínimo 3 caracteres'),
      hasOrderingNode: (value) =>
        isInRange(
          { min: 0, max: 1 },
          'O valor informado precisa ser Sim ou Não'
        )(parseInt(value.toString())),
      numberOfPeers: (value) =>
        isInRange(
          { min: 1, max: 10 },
          'O valor informado precisa estar entre 1 e 10'
        )(parseInt(value.toString()))
    }
  });

  const nextStep = () =>
    setActive((current) => (current < 5 ? current + 1 : current));

  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const handleEdit = (id: number) => {
    const participant = participants.find((p) => p.id === id);

    if (participant) {
      step2Form.setValues(participant);
      setButtonName('Salvar alterações');
    }
  };

  const handleDelete = (id: number) => {
    setParticipants((prevParticipants) =>
      prevParticipants.filter((participant) => participant.id !== id)
    );
  };

  const onSubmitStep1 = async (values: Step1FormValues) => {
    setData(values);
    nextStep();
  };

  const onSubmitStep2 = async (values: Step2FormValues) => {
    const hasOrderingNode = participants.filter(
      (participant) =>
        participant.hasOrderingNode == 1 && participant.id != values.id
    );

    if (values.hasOrderingNode == 1 && hasOrderingNode.length > 0) {
      return notifications.show({
        title: 'Atenção!',
        message: 'Já existe um participante com nó ordenador',
        color: 'red',
        icon: <IconX size={20} />,
        withBorder: true
      });
    }

    if (values.id) {
      const newParticipants = participants.map((participant) =>
        participant.id === values.id ? values : participant
      );

      setParticipants(newParticipants);
      setButtonName('Adicionar participante');
    } else {
      const randomId = Math.floor(Math.random() * 1000000);

      const valuesWithId = { ...values, id: randomId };

      setParticipants((prev) => [...prev, valuesWithId]);
    }

    step2Form.reset();
  };

  const handleNext = () => {
    if (participants.length === 0) {
      return notifications.show({
        title: 'Atenção!',
        message: 'É necessário adicionar pelo menos um participante',
        color: 'red',
        icon: <IconX size={20} />,
        withBorder: true
      });
    }

    nextStep();
  };

  const handleCreate = async () => {
    setLoading(true);
    nextStep();

    const formattedParticipants = convertParticipants(participants);

    const payload: StartNetworkPayload = {
      ordererOrganization:
        participants.filter(
          (participant) => participant.hasOrderingNode === 1
        )[0]?.name || '',
      peerOrganizations: formattedParticipants
    };

    console.log('new: ', payload);

    await FabricNetworkApiInstance.startNetwork(payload);
  };

  return (
    <Container size={'xl'}>
      <Grid>
        <Grid.Col mb={10} md={12}>
          <Title order={1}>Crie sua rede Blockchain</Title>
        </Grid.Col>
        <Grid.Col md={3}>
          <Stepper
            size="sm"
            active={step}
            orientation="vertical"
            completedIcon={<IconCheck size={26} />}
          >
            <Stepper.Step
              label="Definição da plataforma"
              description="Escolha a plataforma que será utilizada para a criação da rede Blockchain"
              icon={<IconCircleDashed size={20} />}
            />
            <Stepper.Step
              label="Definição dos participantes"
              description="Preencha os dados da nova organização no formulário ao lado"
              icon={<IconCircleDashed size={20} />}
            />
            <Stepper.Step
              label="Resumo"
              description="Ao lado você pode ver um resumo dos dados das organizações que serão criadas"
              icon={<IconCircleDashed size={20} />}
            />
            <Stepper.Step
              label="Processamento"
              description="Aguarde enquanto a rede é criada"
              icon={<IconCircleDashed size={20} />}
              loading={loading}
            />
            <Stepper.Step
              label="Concluído"
              description="A rede foi criada com sucesso!"
              icon={<IconCircleDashed size={20} />}
            />
          </Stepper>
        </Grid.Col>
        <Grid.Col md={9} className="space-y-4">
          <Box
            hidden={step !== 0}
            p="md"
            sx={(theme) => ({
              backgroundColor: theme.colors.gray[0],
              border: `1px solid ${theme.colors.gray[2]}`,
              borderRadius: theme.radius.md
            })}
            component="form"
            onSubmit={step1Form.onSubmit(onSubmitStep1)}
            className="space-y-4"
          >
            <Title order={2}>Definição da plataforma</Title>
            <Alert
              icon={<IconAlertCircle size="1rem" />}
              title="Atenção!"
              color="yellow"
              className="border border-yellow-500"
            >
              <Text>
                Escolha a plataforma que será utilizada para a criação da rede
                Blockchain. No momento, apenas a plataforma Hyperledger Fabric
                está disponível.
              </Text>
            </Alert>
            <Select
              withinPortal
              withAsterisk
              mb="md"
              data={['Hyperledger Fabric']}
              placeholder="Selecione uma opção"
              label="Plataforma"
              classNames={classes}
              {...step1Form.getInputProps('platform')}
            />
            <Button
              size="md"
              type="submit"
              variant="default"
              className="w-full md:w-1/4"
              rightIcon={<IconArrowRight size={20} />}
            >
              Avançar
            </Button>
          </Box>
          <Box
            hidden={participants.length === 0 || step !== 1}
            p="sm"
            sx={(theme) => ({
              backgroundColor: theme.colors.gray[0],
              border: `1px solid ${theme.colors.gray[2]}`,
              borderRadius: theme.radius.md
            })}
          >
            <ScrollArea>
              <Table sx={{ minWidth: 800 }} verticalSpacing="sm">
                <thead>
                  <tr>
                    <th>Organização</th>
                    <th>Possui nó ordenador</th>
                    <th>Número de peers</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {participants?.map((participant) => (
                    <tr key={participant.id}>
                      <td>
                        <Group spacing="sm">
                          <IconPlaystationCircle size={20} color={'gray'} />
                          <Text fz="sm" fw={500}>
                            {participant.name}
                          </Text>
                        </Group>
                      </td>
                      <td>
                        <Badge
                          color={
                            participant.hasOrderingNode.toString() === '1'
                              ? 'green'
                              : 'red'
                          }
                          variant="outline"
                        >
                          {participant.hasOrderingNode.toString() === '1'
                            ? 'Sim'
                            : 'Não'}
                        </Badge>
                      </td>
                      <td>
                        <Text fz="sm" c="dimmed">
                          {participant.numberOfPeers.toString() === '1'
                            ? `${participant.numberOfPeers} peer`
                            : `${participant.numberOfPeers} peers`}
                        </Text>
                      </td>
                      <td>
                        <Group spacing={0} position="right">
                          <ActionIcon
                            color="blue"
                            onClick={() =>
                              participant?.id && handleEdit(participant.id)
                            }
                          >
                            <IconPencil size="1rem" stroke={1.5} />
                          </ActionIcon>
                          <ActionIcon
                            color="red"
                            onClick={() =>
                              participant?.id && handleDelete(participant.id)
                            }
                          >
                            <IconTrash size="1rem" stroke={1.5} />
                          </ActionIcon>
                        </Group>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </ScrollArea>
          </Box>
          <Box
            hidden={step !== 1}
            p="md"
            sx={(theme) => ({
              backgroundColor: theme.colors.gray[0],
              border: `1px solid ${theme.colors.gray[2]}`,
              borderRadius: theme.radius.md
            })}
            component="form"
            onSubmit={step2Form.onSubmit(onSubmitStep2)}
            className="space-y-4"
          >
            <Title order={2}>Definição dos participantes</Title>
            <TextInput
              withAsterisk
              mb="md"
              label="Nome da organização"
              placeholder="Ex.: Org0"
              classNames={classes}
              rightSection={
                <Tooltip
                  label="O nome da organização deve ter no mínimo 3 caracteres"
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
              {...step2Form.getInputProps('name')}
            />
            <Select
              withinPortal
              withAsterisk
              mb="md"
              data={[
                { value: '1', label: 'Sim' },
                { value: '0', label: 'Não' }
              ]}
              placeholder="Selecione uma opção"
              label="Possui nó ordenador?"
              classNames={classes}
              {...step2Form.getInputProps('hasOrderingNode')}
            />
            <Select
              withinPortal
              withAsterisk
              mb="md"
              data={[
                { value: '1', label: '1 peer' },
                { value: '2', label: '2 peers' },
                { value: '3', label: '3 peers' },
                { value: '4', label: '4 peers' },
                { value: '5', label: '5 peers' },
                { value: '6', label: '6 peers' },
                { value: '7', label: '7 peers' },
                { value: '8', label: '8 peers' },
                { value: '9', label: '9 peers' },
                { value: '10', label: '10 peers' }
              ]}
              placeholder="Selecione uma opção"
              label="Número de peers"
              classNames={classes}
              {...step2Form.getInputProps('numberOfPeers')}
            />
            <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between">
              <Button
                size="md"
                type="submit"
                leftIcon={<IconTextPlus size={20} />}
              >
                {buttonName}
              </Button>
              <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:space-x-4">
                <Button
                  size="md"
                  onClick={prevStep}
                  variant="default"
                  className="w-full"
                  leftIcon={<IconArrowLeft size={20} />}
                >
                  Voltar
                </Button>
                <Button
                  size="md"
                  onClick={handleNext}
                  variant="default"
                  color="blue"
                  className="w-full"
                  rightIcon={<IconArrowRight size={20} />}
                >
                  Avançar
                </Button>
              </div>
            </div>
          </Box>
          <Box
            hidden={step !== 2}
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
            <Alert
              icon={<IconAlertCircle size="1rem" />}
              title="Atenção!"
              color="yellow"
              className="border border-yellow-500"
            >
              <Text>
                Confira os dados das organizações que serão criadas na rede
                Blockchain usando a plataforma{' '}
                <strong>{data && (data as Step1FormValues).platform}</strong>.
              </Text>
            </Alert>
            {participants?.map((participant) => (
              <Card
                key={participant.id}
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
                      {participant.name}
                    </Text>
                  </div>
                  <div>
                    <Text size="xs" color="dimmed">
                      Possui nó ordenador?
                    </Text>
                    <Text weight={500} size="sm">
                      {participant.hasOrderingNode.toString() === '1'
                        ? 'Sim'
                        : 'Não'}
                    </Text>
                  </div>
                  <div>
                    <Text size="xs" color="dimmed">
                      Número de peers
                    </Text>
                    <Text weight={500} size="sm">
                      {participant.numberOfPeers.toString() === '1'
                        ? `${participant.numberOfPeers} peer`
                        : `${participant.numberOfPeers} peers`}
                    </Text>
                  </div>
                </Card.Section>
              </Card>
            ))}
            <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between">
              <Button
                size="md"
                onClick={handleCreate}
                leftIcon={<IconArtboard size={20} />}
              >
                Iniciar criação da rede
              </Button>
              <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:space-x-4">
                <Button
                  size="md"
                  onClick={prevStep}
                  variant="default"
                  className="w-full"
                  leftIcon={<IconArrowLeft size={20} />}
                >
                  Voltar
                </Button>
              </div>
            </div>
          </Box>
          <Box
            hidden={step !== 3}
            p="md"
            sx={(theme) => ({
              backgroundColor: theme.colors.gray[0],
              border: `1px solid ${theme.colors.gray[2]}`,
              borderRadius: theme.radius.md
            })}
            component="div"
            className="space-y-4"
          >
            <Title order={2}>Processamento</Title>
            <Text>
              Aguarde enquanto a rede é criada. Esse processo pode levar alguns
              minutos.
            </Text>
            <Paper radius="md" withBorder className={classes.card} p="xl">
              <Text ta="center" fw={700} className={classes.title}>
                Criando rede Blockchain
              </Text>
              <Group position="apart" mt="xs">
                <Text fz="sm" color="dimmed">
                  Progresso
                </Text>
                <Text fz="sm" color="dimmed">
                  xxx%
                </Text>
              </Group>
              <Progress value={62} mt={5} animate size="xl" />
              <Group position="apart" mt="md">
                <Badge size="sm">tempo decorrido</Badge>
              </Group>
            </Paper>
          </Box>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
