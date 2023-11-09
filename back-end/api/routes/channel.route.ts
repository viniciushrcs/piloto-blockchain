import express from 'express';
import { CreateChannelPayload } from '../interfaces/route-payloads.interface';
import { createChannel } from '../network-ops';
import { updateNetworkName } from '../helpers/networkName';

const router = express.Router();

router.post('/:networkId/create-channel', async (req, res) => {
  const specs: CreateChannelPayload = req.body;
  updateNetworkName(req.params.networkId);
  try {
    await createChannel(specs);
    res.status(200).send(`O canal ${specs.channelName} foi criado`);
  } catch (e) {
    res.status(500).send(`Ocorreu um erro ao criar o canal`);
  }
});

export default router;
