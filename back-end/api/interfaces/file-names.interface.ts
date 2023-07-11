export interface PeerFilesNames {
  'org-peer-tls-cert-issuer': string;
  'fabric-ca-server-config-peer': string;
  core: string;
  'org-peer-ca': string;
  'org-peer': string;
  'org-install-k8s-builder': string;
  'org-cc-template': string;
}

export interface OrdFilesNames {
  'configtx-template': string;
  'org-ord-tls-cert-issuer': string;
  orderer: string;
  'fabric-ca-server-config-ord': string;
  'org-ord-ca': string;
  'org-ord-job-scrub-fabric-volumes': string;
  'org-orderer1': string;
}

export interface CommonFileNames {
  'pvc-fabric-org': string;
}
