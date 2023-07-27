import QuantityInput from '@/components/QuantityInput';
import {
  Anchor,
  Box,
  Button,
  Checkbox,
  Container,
  LoadingOverlay,
  Paper,
  PasswordInput,
  TextInput,
  Text,
  Tooltip,
  ActionIcon,
  Grid,
  Timeline,
  Title,
  Center,
  createStyles,
  rem,
  Select,
  Stepper,
  Group
} from '@mantine/core';
import { hasLength, useForm } from '@mantine/form';
import {
  IconCircleDashed,
  IconGitBranch,
  IconGitCommit,
  IconGitPullRequest,
  IconInfoCircle,
  IconMessageDots,
  IconQuestionMark
} from '@tabler/icons-react';
import { useEffect, useRef, useState } from 'react';

type FormValues = {
  name: string;
  numberOfPeers: number;
  isValidatingOrganization: boolean;
};

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

export default function Index() {
  const { classes } = useStyles();

  const firstStep = useRef<HTMLButtonElement>(null);

  const stepper = useRef<HTMLDivElement>(null);

  const [active, setActive] = useState(0);

  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const form = useForm<FormValues>({
    initialValues: {
      name: '',
      numberOfPeers: 0,
      isValidatingOrganization: false
    },
    validate: {
      name: hasLength({ min: 3 }),
      isValidatingOrganization: (value) => value !== undefined,
      numberOfPeers: (value) => value >= 0
    }
  });

  const onSubmit = async (values: FormValues) => {
    console.log(values);
  };

  useEffect(() => {
    console.log(active);
  }, [active]);

  return (
    <Container size={'xl'}>
      {/* criar título da página */}
      <Grid>
        <Grid.Col mb={10} md={12}>
          <Title order={1}>Crie sua rede Blockchain</Title>
          <Group position="center" mt="xl">
            <Button variant="default" onClick={prevStep}>
              Back
            </Button>
            <Button onClick={nextStep}>Next step</Button>
          </Group>
        </Grid.Col>
        <Grid.Col md={3}>
          {/* <Timeline active={-1} bulletSize={24} lineWidth={2}>
            <Timeline.Item
              // CircleCheck
              bullet={<IconCircleDashed size={12} />}
              title="Nova organização"
              lineVariant="dashed"
            >
              <Text color="dimmed" size="sm">
                Preencha os dados da nova organização no formulário ao lado
              </Text>
            </Timeline.Item>
            <Timeline.Item
              bullet={<IconCircleDashed size={12} />}
              title="Resumo"
              lineVariant="dashed"
            >
              <Text color="dimmed" size="sm">
                Ao lado você pode ver um resumo dos dados das organizações que
                serão criadas
              </Text>
            </Timeline.Item>
            <Timeline.Item
              title="Processamento"
              bullet={<IconCircleDashed size={12} />}
              lineVariant="dashed"
            >
              <Text color="dimmed" size="sm">
                Aguarde enquanto o processamento é realizado
              </Text>
            </Timeline.Item>
            <Timeline.Item
              title="Concluído"
              bullet={<IconCircleDashed size={12} />}
            >
              <Text color="dimmed" size="sm">
                A rede foi criada com sucesso!
              </Text>
            </Timeline.Item>
          </Timeline> */}
          <Stepper ref={stepper} active={active} orientation="vertical">
            <Stepper.Step label="First step" ref={firstStep} />
            <Stepper.Step label="Second step" />
          </Stepper>
        </Grid.Col>
        <Grid.Col md={9}>
          <Box
            hidden={active !== 0}
            sx={(theme) => ({
              backgroundColor:
                theme.colorScheme === 'dark'
                  ? theme.colors.dark[7]
                  : theme.colors.gray[0],
              borderRadius: theme.radius.md,
              padding: theme.spacing.md,
              border: `1px solid ${
                theme.colorScheme === 'dark'
                  ? theme.colors.dark[7]
                  : theme.colors.gray[2]
              }`
            })}
            component="form"
            onSubmit={form.onSubmit(onSubmit)}
          >
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
              {...form.getInputProps('name')}
            />
            <Select
              withinPortal
              mb="md"
              data={['Sim', 'Não']}
              placeholder="Selecione uma opção"
              label="É uma organização validadora?"
              classNames={classes}
              {...form.getInputProps('isValidatingOrganization')}
            />
            <Select
              withinPortal
              mb="md"
              data={['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']}
              placeholder="Selecione uma opção"
              label="Número de peers"
              classNames={classes}
              {...form.getInputProps('numberOfPeers')}
            />
            <Button fullWidth mt="xl" size="md" type="submit">
              Adicionar
            </Button>
          </Box>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
