import { PeerOrganization } from '@/interfaces/fabricNetworkApiPayloads';
import { OrgFormData } from '@/types/orgFormData';

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
