import express from 'express';
import { processNetwork, taskStatus } from '../helpers/process-network';
import { StartNetworkPayload } from '../interfaces/route-payloads.interface';

const router = express.Router();

router.post('/start-network', (req, res) => {
  const specs: StartNetworkPayload = req.body;

  processNetwork(specs).catch((err) => {
    console.error('Erro ao processar a rede:', err);
  });

  res.status(202).send('Sua solicitação foi recebida e está sendo processada');
});

router.get('/check-status', (req, res) => {
  res.status(200).json(taskStatus);
});

export default router;
