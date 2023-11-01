import { cluster, kind, up } from '../network-ops';
import { generateArtifacts } from './generate-artifacts';
import { StartNetworkPayload } from '../interfaces/route-payloads.interface';

export const taskStatus = {
  inProgress: false,
  message: '',
};

export async function processNetwork() {
  try {
    taskStatus.inProgress = true;

    taskStatus.message = 'Iniciando o KIND';
    await kind();
    console.log('\n');

    taskStatus.message = 'Iniciando o cluster';
    await cluster();
    console.log('\n');
    taskStatus.message = '';
  } catch (err) {
    console.error('Erro ao processar a rede:', err);
    taskStatus.message = 'Erro';
  } finally {
    taskStatus.inProgress = false;
  }
}
