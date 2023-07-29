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
  Badge
} from '@mantine/core';
import { hasLength, isInRange, useForm } from '@mantine/form';
import {
  IconAlertCircle,
  IconArrowLeft,
  IconArrowRight,
  IconCheck,
  IconCircleDashed,
  IconInfoCircle,
  IconPencil,
  IconPlaystationCircle,
  IconTextPlus,
  IconTrash
} from '@tabler/icons-react';

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
  }
}));

type Step1FormValues = {
  platform: string;
};

type Step2FormValues = {
  id?: number;
  name: string;
  hasOrderingNode: number;
  numberOfPeers: number;
};

type Data = Step1FormValues | Step2FormValues;

export default function Index() {
  const { classes } = useStyles();

  const [data, setData] = useState<Data | null>(null);

  console.log(data);

  const [buttonName, setButtonName] = useState('Adicionar participante');

  const [participants, setParticipants] = useState<Step2FormValues[]>([]);

  const [step, setActive] = useState(0);

  const step1Form = useForm<Step1FormValues>({
    initialValues: {
      platform: ''
    },
    validate: {
      platform: hasLength({ min: 3 })
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
                  onClick={nextStep}
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
        </Grid.Col>
      </Grid>
    </Container>
  );
}
