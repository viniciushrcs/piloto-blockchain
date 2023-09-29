import express from 'express';
import multer from 'multer';
import path, { resolve } from 'path';
import tar from 'tar';
import fs from 'fs';
import {
  DeployChaincodePayload,
  ExecuteChaincodePayload,
} from '../interfaces/route-payloads.interface';
import {
  chaincodeDeploy,
  chaincodeInvoke,
  chaincodeQuery,
} from '../network-ops';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

const defaultChaincodes = ['asset-transfer-basic'];

router.post('/deploy-chaincode', upload.single('file'), async (req, res) => {
  const specs: DeployChaincodePayload = req.body;
  specs.peerOrganizations = JSON.parse(
    specs.peerOrganizations as unknown as string
  );

  if (!req.file && !defaultChaincodes.includes(specs.chaincodeName)) {
    res
      .status(400)
      .send(
        'Nenhum arquivo foi carregado ou chaincodeName não é um chaincode default válido'
      );
    return;
  }

  const destinationDir = path.join(__dirname, '../../chaincodes');

  try {
    let chaincodePath;
    if (req.file) {
      await tar.x({
        file: req.file.path,
        cwd: destinationDir,
      });
      chaincodePath = resolve(destinationDir, specs.chaincodeName);
    } else {
      chaincodePath = path.join(destinationDir, specs.chaincodeName);
      if (!fs.existsSync(chaincodePath)) {
        res
          .status(400)
          .send('Chaincode default não encontrado no diretório ../chaincodes/');
        return;
      }
    }
    specs.chaincodePath = chaincodePath;
    await chaincodeDeploy(specs);
    res.status(200).send(`O chaincode ${specs.chaincodeName} foi deployado`);
  } catch (e) {
    console.log(e);
    res.status(500).send(`Ocorreu um erro ao implantar o chaincode`);
  }
});

router.post('/execute-chaincode', async (req, res) => {
  const specs: ExecuteChaincodePayload = req.body;
  try {
    if (specs.chaincodeCommand?.init) {
      await chaincodeInvoke(specs);
    }
    if (specs.chaincodeCommand?.query) {
      await chaincodeQuery(specs);
    }
    res
      .status(202)
      .send(
        `Sua solicitação para executar o chaincode ${specs.chaincodeName} com os comandos ${specs.chaincodeCommand} foi recebida`
      );
  } catch (e) {
    console.log(e);
    res.status(500).send(`Ocorreu um erro ao executar o chaincode`);
  }
});

export default router;
