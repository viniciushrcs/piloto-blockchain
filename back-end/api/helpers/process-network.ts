import { cluster, kind } from '../network-ops';

export const clusterStatus = {
  inProgress: false,
  message: '',
};

export async function processNetwork() {
  try {
    clusterStatus.inProgress = true;

    clusterStatus.message = 'Iniciando o KIND';
    await kind();
    console.log('\n');

    clusterStatus.message = 'Iniciando o cluster';
    await cluster();
    console.log('\n');
    clusterStatus.message = '';
  } catch (err) {
    console.error('Erro ao processar a rede:', err);
    clusterStatus.message = 'Erro';
  } finally {
    clusterStatus.inProgress = false;
  }
}
