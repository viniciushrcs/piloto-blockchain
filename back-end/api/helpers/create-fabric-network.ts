import { StartNetworkPayload } from '../interfaces/route-payloads.interface';
import { up } from '../network-ops';
import { generateArtifacts } from './generate-artifacts';
import {
  generateNetworkName,
  getNetworkName,
  resetNetworkName,
} from './networkName';

export const networkStatus = {
  inProgress: false,
  message: '',
  networkId: '',
};

export async function createFabricNetwork(specs: StartNetworkPayload) {
  try {
    resetNetworkName();
    generateNetworkName();
    networkStatus.message = 'Gerando os artefatos';
    await generateArtifacts(specs.ordererOrganization, specs.peerOrganizations);
    networkStatus.message = 'Iniciando rede Fabric';
    await up(specs);
    networkStatus.networkId = getNetworkName();
    networkStatus.message = '';
  } catch (err) {
    console.error('Erro ao processar a rede:', err);
    networkStatus.message = 'Erro';
  } finally {
    networkStatus.inProgress = false;
  }
}
