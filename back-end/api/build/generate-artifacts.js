"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateArtifacts = void 0;
const generate_yaml_1 = require("./generate-yaml");
const config_1 = require("./config");
const create_files_from_template_1 = require("./create-files-from-template");
async function generateArtifacts(ORD_ORG, PEER_ORGS) {
    const destinationCommonFolderObject = (0, config_1.destinationCommonFolder)();
    const destFolders = {};
    const peerOrgs = [];
    destFolders.COMMON_ORG = destinationCommonFolderObject.dest_dir_pvc;
    for (const PEER_ORG of PEER_ORGS) {
        const destinationPeerFoldersObject = (0, config_1.destinationPeerFolders)(PEER_ORG.name);
        const finalCommonPeerFilesPath = (0, config_1.finalCommonFileNames)(PEER_ORG.name);
        destFolders[`PEER_ORG_${PEER_ORG.name}`] =
            destinationPeerFoldersObject.dest_dir_peer_org;
        destFolders[`CONFIG_PEER_${PEER_ORG.name}`] =
            destinationPeerFoldersObject.dest_dir_config_peer;
        (0, generate_yaml_1.createDirectories)(destFolders);
        peerOrgs.push(PEER_ORG.name);
        for (const ORG_PEER of PEER_ORG.peers) {
            const finalPeerFilesPath = (0, config_1.finalPeerFilesNames)(PEER_ORG.name, ORG_PEER);
            const replacements = {
                ordererOrg: ORD_ORG,
                peerOrg: PEER_ORG.name,
                peerNumber: ORG_PEER,
                Org: PEER_ORG.name,
            };
            await (0, create_files_from_template_1.createFilesFromTemplates)(config_1.templateFolders.fabric_peer_org_templates, destFolders[`CONFIG_PEER_${PEER_ORG.name}`], finalPeerFilesPath, replacements);
            await (0, create_files_from_template_1.createFilesFromTemplates)(config_1.templateFolders.k8s_org_peer_templates, destFolders[`PEER_ORG_${PEER_ORG.name}`], finalPeerFilesPath, replacements);
        }
        const replacements = {
            ordererOrg: ORD_ORG,
            peerOrg: PEER_ORG.name,
            Org: PEER_ORG.name,
        };
        await (0, create_files_from_template_1.createFilesFromTemplates)(config_1.templateFolders.common_templates, destFolders.COMMON_ORG, finalCommonPeerFilesPath, replacements);
    }
    const finalOrdFilesPath = (0, config_1.finalOrdFilesNames)(ORD_ORG);
    const destinationOrdFoldersObject = (0, config_1.destinationOrdFolders)(ORD_ORG);
    const finalCommonOrdFilesPath = (0, config_1.finalCommonFileNames)(ORD_ORG);
    destFolders.ORDERER_ORG = destinationOrdFoldersObject.dest_dir_orderer_org;
    destFolders.CONFIG_ORD = destinationOrdFoldersObject.dest_dir_config_orderer;
    (0, generate_yaml_1.createDirectories)(destFolders);
    const replacements = {
        ordererOrg: ORD_ORG,
        peerOrgs,
        Org: ORD_ORG,
    };
    await (0, create_files_from_template_1.createFilesFromTemplates)(config_1.templateFolders.fabric_orderer_org_templates, destFolders.CONFIG_ORD, finalOrdFilesPath, replacements);
    await (0, create_files_from_template_1.createFilesFromTemplates)(config_1.templateFolders.k8s_org_orderer_templates, destFolders.ORDERER_ORG, finalOrdFilesPath, replacements);
    await (0, create_files_from_template_1.createFilesFromTemplates)(config_1.templateFolders.common_templates, destFolders.COMMON_ORG, finalCommonOrdFilesPath, replacements);
}
exports.generateArtifacts = generateArtifacts;
//# sourceMappingURL=generate-artifacts.js.map