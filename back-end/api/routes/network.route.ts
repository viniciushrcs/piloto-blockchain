import express from 'express';
import { processNetwork, taskStatus } from '../helpers/process-network';
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

router.get('/check-status', (req, res) => {
  res.status(200).json(taskStatus);
});

router.post('/create-fabric-network', (req, res) => {
  const specs: StartNetworkPayload = req.body;
  const networkId = generateRandomId();
  process.env.NETWORK_NAME = networkId;
  generateArtifacts(specs.ordererOrganization, specs.peerOrganizations).then(
    () => {
      up(specs).catch((err) => {
        console.error('Erro ao criar a rede fabric:', err);
      });
    }
  );

  res.status(200).send('Sua solicitação foi recebida e está sendo processada');
});

export default router;
