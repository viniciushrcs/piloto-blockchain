import { PeerOrganization } from '@/interfaces/fabricNetworkApiPayloads';

export function createPayload(
  ordererOrganization: string,
  peerOrganizations: { name: string; numberOfPeers: number }[],
  channelName?: string,
  chaincodeName?: string,
  chaincodePath?: string
): {
  ordererOrganization: string;
  peerOrganizations: PeerOrganization[];
  channelName?: string;
  chaincodeName?: string;
  chaincodePath?: string;
} {
  const formattedPeerOrganizations: PeerOrganization[] = peerOrganizations.map(
    (org) => ({
      name: org.name,
      peers: Array.from({ length: org.numberOfPeers }, (_, i) => `peer${i + 1}`)
    })
  );

  return {
    ordererOrganization,
    peerOrganizations: formattedPeerOrganizations,
    channelName,
    chaincodeName,
    chaincodePath
  };
}
