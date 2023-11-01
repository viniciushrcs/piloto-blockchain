import express from 'express';
import { clusterStatus, processNetwork } from '../helpers/process-network';
import { StartNetworkPayload } from '../interfaces/route-payloads.interface';
import { up } from '../network-ops';
import { generateArtifacts } from '../helpers/generate-artifacts';
import { generateRandomId } from '../helpers/helpers';

const router = express.Router();

router.post('/start-cluster', (req, res) => {
  processNetwork().catch((err) => {
    console.error('Erro ao inicializar o cluster:', err);
  });

  res.status(202).send('Sua solicitação foi recebida e está sendo processada');
});

router.get('/check-cluster-status', (req, res) => {
  res.status(200).json(clusterStatus);
});

router.get('/check-network-status', (req, res) => {
  res.status(200).json(networkStatus);
});

const networkStatus = {
  inProgress: false,
  message: '',
  networkId: '',
};

router.post('/create-fabric-network', async (req, res) => {
  const specs: StartNetworkPayload = req.body;
  const networkId = generateRandomId();
  process.env.NETWORK_NAME = networkId;
  networkStatus.message = 'Gerando os artefatos';
  await generateArtifacts(specs.ordererOrganization, specs.peerOrganizations);
  networkStatus.message = 'Iniciando rede Fabric';
  await up(specs);
  networkStatus.networkId = networkId;
  networkStatus.message = '';

  res.status(200).send('Sua solicitação foi recebida e está sendo processada');
});

export default router;
