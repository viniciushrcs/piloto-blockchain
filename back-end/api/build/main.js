"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const network_ops_1 = require("./network-ops");
const generate_artifacts_1 = require("./generate-artifacts");
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
app.use(express_1.default.json());
const taskStatus = {
    inProgress: false,
    message: '',
};
async function processNetwork(specs) {
    try {
        taskStatus.inProgress = true;
        taskStatus.message = 'Gerando artefatos';
        await (0, generate_artifacts_1.generateArtifacts)(specs.ordererOrganization, specs.peerOrganizations);
        taskStatus.message = 'Iniciando o KIND';
        await (0, network_ops_1.kind)();
        console.log('\n');
        taskStatus.message = 'Iniciando o cluster';
        await (0, network_ops_1.cluster)();
        console.log('\n');
        taskStatus.message = 'Configurando a rede';
        await (0, network_ops_1.up)(specs);
    }
    catch (err) {
        console.error('Erro ao processar a rede:', err);
        taskStatus.message = 'Erro ao processar a rede';
    }
    finally {
        taskStatus.inProgress = false;
    }
}
app.post('/start-network', (req, res) => {
    const specs = req.body;
    processNetwork(specs).catch((err) => {
        console.error('Erro ao processar a rede:', err);
    });
    res.status(202).send('Sua solicitação foi recebida e está sendo processada');
});
app.get('/check-status', (req, res) => {
    res.status(200).json(taskStatus);
});
app.post('/create-channel', async (req, res) => {
    const specs = req.body;
    await (0, network_ops_1.createChannel)(specs);
    res.status(200).send(`O canal ${specs.channelName} foi criado`);
});
app.post('/deploy-chaincode', async (req, res) => {
    const specs = req.body;
    await (0, network_ops_1.chaincodeDeploy)(specs);
    res.status(200).send(`O chaincode ${specs.chaincodeName} foi deployado`);
});
app.post('/execute-chaincode', async (req, res) => {
    const specs = req.body;
    if (specs.chaincodeCommand?.init) {
        await (0, network_ops_1.chaincodeInvoke)(specs);
    }
    if (specs.chaincodeCommand?.query) {
        await (0, network_ops_1.chaincodeQuery)(specs);
    }
    res
        .status(202)
        .send(`Sua solicitação para executar o chaincode ${specs.chaincodeName} com os comandos ${specs.chaincodeCommand} foi recebida`);
});
app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});
//# sourceMappingURL=main.js.map