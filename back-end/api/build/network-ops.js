"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chaincodeQuery = exports.chaincodeInvoke = exports.chaincodeDeploy = exports.createChannel = exports.down = exports.up = exports.cluster = exports.unkind = exports.kind = void 0;
const helpers_1 = require("./helpers");
async function kind() {
    await (0, helpers_1.executeCommand)(['../network kind']);
}
exports.kind = kind;
async function unkind() {
    await (0, helpers_1.executeCommand)(['../network unkind']);
}
exports.unkind = unkind;
async function cluster() {
    await (0, helpers_1.executeCommand)(['../network cluster']);
}
exports.cluster = cluster;
async function up(specs) {
    const peerOrgsArgs = specs.peerOrganizations
        .map((org) => `${org.name}:${org.peers.join(',')}`)
        .join(' ');
    await (0, helpers_1.executeCommand)([
        `../network up ${specs.ordererOrganization} ${peerOrgsArgs}`,
    ]);
}
exports.up = up;
async function down() {
    await (0, helpers_1.executeCommand)([`../network down`]);
}
exports.down = down;
async function createChannel(specs) {
    const peerOrgsArgs = specs.peerOrganizations
        .map((org) => `${org.name}:${org.peers.join(',')}`)
        .join(' ');
    await (0, helpers_1.executeCommand)([
        `../network channel create ${specs.channelName} ${specs.ordererOrganization} ${peerOrgsArgs}`,
    ]);
}
exports.createChannel = createChannel;
async function chaincodeDeploy(specs) {
    const { channelName, ordererOrganization, peerOrganizations, chaincodeName, chaincodePath, } = specs;
    const peerOrgsInfo = peerOrganizations.map((org) => `${org.name}:${org.peers.join(',')}`);
    const peerOrgsName = peerOrganizations.map((org) => `${org.name}`);
    let chaincodeCommited = false;
    let i = 0;
    for (const peerOrg of peerOrgsName) {
        console.log(`Deploying chaincode for org ${peerOrg} and ${peerOrgsInfo[i]}`);
        await (0, helpers_1.executeCommand)([
            `../network chaincode deploy ${channelName} ${chaincodeName} ${chaincodePath} ${chaincodeCommited} ${ordererOrganization} ${peerOrg} ${peerOrgsInfo[i]}`,
        ]);
        chaincodeCommited = true;
        i++;
    }
}
exports.chaincodeDeploy = chaincodeDeploy;
async function chaincodeInvoke(specs) {
    const chaincodeInvokeCommandParsed = JSON.stringify(specs.chaincodeCommand.init);
    const peerOrgsArgs = specs.peerOrganizations.map((org) => `${org.name}`);
    await (0, helpers_1.executeCommand)([
        `../network chaincode invoke ${specs.channelName} ${specs.chaincodeName} '${chaincodeInvokeCommandParsed}' ${specs.ordererOrganization} ${peerOrgsArgs[1]}`,
    ]);
}
exports.chaincodeInvoke = chaincodeInvoke;
async function chaincodeQuery(specs) {
    const { channelName, ordererOrganization, chaincodeName } = specs;
    const chaincodeQueryCommandParsed = JSON.stringify(specs.chaincodeCommand.query);
    const peerOrgsArgs = specs.peerOrganizations.map((org) => `${org.name}`);
    for (const peerOrg of peerOrgsArgs) {
        await (0, helpers_1.executeCommand)([
            `../network chaincode query ${channelName} ${chaincodeName} '${chaincodeQueryCommandParsed}' ${ordererOrganization} ${peerOrg}`,
        ]);
    }
}
exports.chaincodeQuery = chaincodeQuery;
//# sourceMappingURL=network-ops.js.map