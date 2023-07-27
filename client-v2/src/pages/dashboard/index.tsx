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
  Group
} from '@mantine/core';
import { hasLength, useForm } from '@mantine/form';
import {
  IconCheck,
  IconCircleDashed,
  IconInfoCircle
} from '@tabler/icons-react';

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

  const [step, setActive] = useState(0);

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

  const nextStep = () =>
    setActive((current) => (current < 5 ? current + 1 : current));

  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const onSubmit = async (values: FormValues) => {
    console.log(values);
  };

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
