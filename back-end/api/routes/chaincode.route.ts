import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import tar from 'tar';
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

router.post('/deploy-chaincode', upload.single('file'), async (req, res) => {
  const specs: DeployChaincodePayload = req.body;
  if (!req.file) {
    res.status(400).send('Nenhum arquivo foi carregado');
    return;
  }

  const destinationDir = path.join(__dirname, '../../');
  const chaincodeName = `chaincode-${specs.chaincodeName}`;
  const destinationFile = path.join(destinationDir, chaincodeName);

  try {
    await tar.x({
      file: req.file.path,
      cwd: destinationDir,
    });

    const unzippedFolder = path.join(destinationDir, `${specs.chaincodeName}`);

    if (fs.existsSync(unzippedFolder)) {
      fs.renameSync(unzippedFolder, destinationFile);
    } else {
      throw new Error('A pasta descompactada não foi encontrada');
    }

    specs.chaincodeName = chaincodeName;
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
