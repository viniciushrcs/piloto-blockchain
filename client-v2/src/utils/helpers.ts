import { PeerOrganization } from '@/interfaces/fabricNetworkApiPayloads';
import { OrgFormData } from '@/types/orgFormData';

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

export function convertParticipants(input: OrgFormData[]): PeerOrganization[] {
  const output: PeerOrganization[] = [];

  for (const org of input) {
    const peers: string[] = [];

    for (let i = 1; i <= org.numberOfPeers; i++) {
      peers.push(`peer${i}`);
    }

    output.push({ name: org.name, peers });
  }

  return output;
}
