import express from 'express';
import { clusterStatus, createCluster } from '../helpers/create-cluster';
import {
  networkStatus,
  createFabricNetwork,
} from '../helpers/create-fabric-network';
import { StartNetworkPayload } from '../interfaces/route-payloads.interface';
import { executeCommand } from '../helpers/helpers';

const router = express.Router();

router.get('/network-ids', (req, res) => {
  const kubectlCommand = [
    "kubectl get configmap network-ids -o=jsonpath='{.data.networks}'",
  ];
  executeCommand(kubectlCommand)
    .then((networks) => {
      const parsedNetworks = networks.split(',');
      res.status(200).json(parsedNetworks);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

router.post('/start-cluster', (req, res) => {
  createCluster().catch((err) => {
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

router.post('/create-fabric-network', async (req, res) => {
  const specs: StartNetworkPayload = req.body;
  createFabricNetwork(specs).catch((err) => {
    console.error('Erro ao processar a rede:', err);
  });
  res.status(202).send('Sua solicitação foi recebida e está sendo processada');
});

export default router;
