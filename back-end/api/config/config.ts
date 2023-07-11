import {
  CommonFileNames,
  OrdFilesNames,
  PeerFilesNames,
} from '../interfaces/file-names.interface';
import {
  DestinationCommonFolder,
  DestinationOrdFolders,
  DestinationPeerFolders,
} from '../interfaces/folder-names.interface';

export const finalPeerFilesNames = (PEER_ORG, PEER_NUMBER): PeerFilesNames => ({
  'org-peer-tls-cert-issuer': `${PEER_ORG}-tls-cert-issuer.yaml`,
  'fabric-ca-server-config-peer': `fabric-ca-server-config.yaml`,
  core: `core.yaml`,
  'org-peer-ca': `${PEER_ORG}-ca.yaml`,
  'org-peer': `${PEER_ORG}-${PEER_NUMBER}.yaml`,
  'org-install-k8s-builder': `${PEER_ORG}-install-k8s-builder.yaml`,
  'org-cc-template': `${PEER_ORG}-cc-template.yaml`,
});

export const finalOrdFilesNames = (ORD_ORG): OrdFilesNames => ({
  'configtx-template': `configtx-template.yaml`,
  'org-ord-tls-cert-issuer': `${ORD_ORG}-tls-cert-issuer.yaml`,
  orderer: `orderer.yaml`,
  'fabric-ca-server-config-ord': `fabric-ca-server-config.yaml`,
  'org-ord-ca': `${ORD_ORG}-ca.yaml`,
  'org-ord-job-scrub-fabric-volumes': `${ORD_ORG}-job-scrub-fabric-volumes.yaml`,
  'org-orderer1': `${ORD_ORG}-orderer1.yaml`,
});

export const finalCommonFileNames = (ORG): CommonFileNames => ({
  'pvc-fabric-org': `pvc-fabric-${ORG}.yaml`,
});

export const templateFolders = {
  fabric_orderer_org_templates: `${__dirname}/yaml-templates/fabric/orderer_org`,
  fabric_peer_org_templates: `${__dirname}/yaml-templates/fabric/peer_org`,
  k8s_org_orderer_templates: `${__dirname}/yaml-templates/k8s/org_orderer`,
  k8s_org_peer_templates: `${__dirname}/yaml-templates/k8s/org_peer`,
  common_templates: `${__dirname}/yaml-templates/k8s/common`,
};

export const destinationOrdFolders = (ORD_ORG): DestinationOrdFolders => ({
  dest_dir_config_orderer: `${__dirname}/../config/${ORD_ORG}`,
  dest_dir_orderer_org: `${__dirname}/../kube/${ORD_ORG}`,
});

export const destinationCommonFolder = (): DestinationCommonFolder => ({
  dest_dir_pvc: `${__dirname}/../kube`,
});

export const destinationPeerFolders = (PEER_ORG): DestinationPeerFolders => ({
  dest_dir_config_peer: `${__dirname}/../config/${PEER_ORG}`,
  dest_dir_peer_org: `${__dirname}/../kube/${PEER_ORG}`,
});
