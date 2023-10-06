# Tutorial para usar o projeto de Back-End e Front-End (Linux Ubuntu)

Este tutorial apresenta um guia passo a passo para configurar e executar um projeto de back-end e front-end em um ambiente Linux Ubuntu. Certifique-se de seguir os pré-requisitos e as instruções fornecidas abaixo para obter uma experiência bem-sucedida.

## Pré-requisitos

Antes de iniciar, certifique-se de ter os seguintes softwares instalados no seu sistema Ubuntu:

- [Node.js](https://nodejs.org/en/download)
- [Docker](https://www.docker.com/)
- [kubectl](https://kubernetes.io/docs/tasks/tools/)
- [jq](https://jqlang.github.io/jq/)
- [kind](https://kind.sigs.k8s.io/docs/user/quick-start/#installation)

### Instalando Pré-Requisitos

1. **Node.js**: Baixe e instale o Node.js a partir do [site oficial](https://nodejs.org/en/download).

2. **Docker**: Siga as instruções de instalação disponíveis no [site oficial do Docker](https://www.docker.com/).

3. **kubectl**: Instale o `kubectl` seguindo as instruções na [documentação do Kubernetes](https://kubernetes.io/docs/tasks/tools/).

4. **jq**: Instale o `jq` de acordo com as instruções em [jq's GitHub](https://jqlang.github.io/jq/).

5. **kind**: Siga as instruções de instalação fornecidas na [página de instalação do kind](https://kind.sigs.k8s.io/docs/user/quick-start/#installation).

## Configurando o Projeto

1. Baixe o repositório chamado "Piloto-Blockchain-v1" para o seu sistema.

2. Navegue até a pasta `back-end/api` dentro do repositório e execute o seguinte comando uma única vez para instalar as dependências:
   ```shell
   npm install
   ```

3. Após a instalação, execute o seguinte comando para iniciar o servidor back-end:
   ```shell
   npm run dev
   ```

4. Navegue até a pasta `client-v2` no mesmo repositório e execute o seguinte comando uma única vez para instalar as dependências:
   ```shell
   npm install
   ```

5. Após a instalação, inicie o servidor front-end com o seguinte comando:
   ```shell
   npm run dev
   ```

## Verificando a Configuração

Se tudo ocorreu sem problemas, você deve ver as seguintes telas:

- Terminal em execução para o back-end
<img src="https://git.rnp.br/gci/dev/testbed-blockchain/piloto-blockchain-v1/-/raw/main/docs/images/terminal-back.png?ref_type=heads" width="600" alt="Terminal em execução para o back-end">

- Terminal em execução para o front-end
<img src="https://git.rnp.br/gci/dev/testbed-blockchain/piloto-blockchain-v1/-/raw/main/docs/images/terminal-front.png?ref_type=heads" width="600" alt="Terminal em execução para o front-end">


Agora, você pode acessar a aplicação web no seu navegador através do seguinte endereço: [http://localhost:3000](http://localhost:3000).

## Utilizando a Aplicação Web

A criação de uma rede blockchain usando a aplicação web é intuitiva e pode ser vista no [vídeo](https://git.rnp.br/gci/dev/testbed-blockchain/piloto-blockchain-v1/-/raw/main/docs/videos/clientv2.mp4?ref_type=heads).

## Possíveis Problemas

É importante garantir que a porta 80 não esteja sendo usada por outros serviços, pois ela será utilizada para criar containers. Para verificar isso, execute o seguinte comando no terminal:

```shell
sudo lsof -i :80
```

Se a saída for semelhante à imagem abaixo, isso indica que a porta 80 está em uso por outro serviço:

<img src="https://git.rnp.br/gci/dev/testbed-blockchain/piloto-blockchain-v1/-/raw/main/docs/images/terminal-port.png?ref_type=heads" width="600" alt="Listando serviços na porta 80">

Nesse caso, você deve finalizar o serviço em execução usando o comando:

```shell
sudo kill <ID_do_Serviço>
```

Substitua `<ID_do_Serviço>` pelo ID do serviço principal, que geralmente é o primeiro da lista na saída do comando `sudo lsof -i :80`.