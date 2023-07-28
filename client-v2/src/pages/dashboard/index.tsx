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
  Alert
} from '@mantine/core';
import { hasLength, isInRange, useForm } from '@mantine/form';
import {
  IconAlertCircle,
  IconCheck,
  IconCircleDashed,
  IconInfoCircle
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
  name: string;
  hasOrderingNode: number;
  numberOfPeers: number;
};

type Data = Step1FormValues | Step2FormValues;

export default function Index() {
  const { classes } = useStyles();

  const [data, setData] = useState<Data | null>(null);

  console.log(data);

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
      hasOrderingNode: 0,
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

  const onSubmitStep1 = async (values: Step1FormValues) => {
    setData(values);
    nextStep();
  };

  const onSubmitStep2 = async (values: Step2FormValues) => {
    setData((prev) => ({ ...prev, ...values }));
    nextStep();
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
        <Grid.Col md={9}>
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
            <Button mt="xl" size="md" type="submit">
              Próximo
            </Button>
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
            <Group>
              <Button mt="xl" size="md" type="submit">
                Adicionar
              </Button>
              <Button mt="xl" size="md" onClick={prevStep} variant="default">
                Voltar
              </Button>
            </Group>
          </Box>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
