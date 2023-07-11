import { createDirectories } from './generate-yaml';
import {
  destinationCommonFolder,
  destinationOrdFolders,
  destinationPeerFolders,
  finalCommonFileNames,
  finalOrdFilesNames,
  finalPeerFilesNames,
  templateFolders,
} from '../config/config';
import { createFilesFromTemplates } from './create-files-from-template';

interface DestinationFolders {
  [key: string]: string;
}

export async function generateArtifacts(ORD_ORG, PEER_ORGS) {
  const destinationCommonFolderObject = destinationCommonFolder();
  const destFolders: DestinationFolders = {};
  const peerOrgs = [];

  destFolders.COMMON_ORG = destinationCommonFolderObject.dest_dir_pvc;

  for (const PEER_ORG of PEER_ORGS) {
    const destinationPeerFoldersObject = destinationPeerFolders(PEER_ORG.name);
    const finalCommonPeerFilesPath = finalCommonFileNames(PEER_ORG.name);

    destFolders[`PEER_ORG_${PEER_ORG.name}`] =
      destinationPeerFoldersObject.dest_dir_peer_org;
    destFolders[`CONFIG_PEER_${PEER_ORG.name}`] =
      destinationPeerFoldersObject.dest_dir_config_peer;
    createDirectories(destFolders);
    peerOrgs.push(PEER_ORG.name);

    for (const ORG_PEER of PEER_ORG.peers) {
      const finalPeerFilesPath = finalPeerFilesNames(PEER_ORG.name, ORG_PEER);
      const replacements = {
        ordererOrg: ORD_ORG,
        peerOrg: PEER_ORG.name,
        peerNumber: ORG_PEER,
        Org: PEER_ORG.name,
      };

      await createFilesFromTemplates(
        templateFolders.fabric_peer_org_templates,
        destFolders[`CONFIG_PEER_${PEER_ORG.name}`],
        finalPeerFilesPath,
        replacements
      );
      await createFilesFromTemplates(
        templateFolders.k8s_org_peer_templates,
        destFolders[`PEER_ORG_${PEER_ORG.name}`],
        finalPeerFilesPath,
        replacements
      );
    }
    const replacements = {
      ordererOrg: ORD_ORG,
      peerOrg: PEER_ORG.name,
      Org: PEER_ORG.name,
    };

    await createFilesFromTemplates(
      templateFolders.common_templates,
      destFolders.COMMON_ORG,
      finalCommonPeerFilesPath,
      replacements
    );
  }

  const finalOrdFilesPath = finalOrdFilesNames(ORD_ORG);
  const destinationOrdFoldersObject = destinationOrdFolders(ORD_ORG);
  const finalCommonOrdFilesPath = finalCommonFileNames(ORD_ORG);

  destFolders.ORDERER_ORG = destinationOrdFoldersObject.dest_dir_orderer_org;
  destFolders.CONFIG_ORD = destinationOrdFoldersObject.dest_dir_config_orderer;

  createDirectories(destFolders);

  const replacements = {
    ordererOrg: ORD_ORG,
    peerOrgs,
    Org: ORD_ORG,
  };
  await createFilesFromTemplates(
    templateFolders.fabric_orderer_org_templates,
    destFolders.CONFIG_ORD,
    finalOrdFilesPath,
    replacements
  );
  await createFilesFromTemplates(
    templateFolders.k8s_org_orderer_templates,
    destFolders.ORDERER_ORG,
    finalOrdFilesPath,
    replacements
  );
  await createFilesFromTemplates(
    templateFolders.common_templates,
    destFolders.COMMON_ORG,
    finalCommonOrdFilesPath,
    replacements
  );
}
