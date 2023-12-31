import axios from 'axios';
import {
  StartNetworkPayload,
  CreateChannelPayload,
  DeployChaincodePayload
} from '@/interfaces/fabricNetworkApiPayloads';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
});

class FabricNetworkApi {
  async uploadChaincode(formData: FormData) {
    try {
      return await api.post('/upload-chaincode', formData);
    } catch (error) {
      console.error('Erro ao fazer upload do chaincode:', error);
      throw error;
    }
  }

  async startCluster() {
    try {
      return await api.post('/start-cluster');
    } catch (error) {
      console.error('Erro ao iniciar a rede:', error);
      throw error;
    }
  }

  async createFabricNetwork(payload: StartNetworkPayload) {
    try {
      return await api.post('/create-fabric-network', payload);
    } catch (error) {
      console.error('Erro ao iniciar a rede:', error);
      throw error;
    }
  }

  async createChannel(payload: CreateChannelPayload, networkId: string) {
    try {
      return await api.post(`${networkId}/create-channel`, payload);
    } catch (error) {
      console.error('Erro ao criar canal:', error);
      throw error;
    }
  }

  async deployChaincode(payload: DeployChaincodePayload, networkId: string) {
    try {
      return await api.post(`${networkId}/deploy-chaincode`, payload);
    } catch (error) {
      console.error('Erro ao implantar chaincode', error);
      throw error;
    }
  }

  async getStatus() {
    try {
      const response = await api.get('/check-status');
      return response;
    } catch (error) {
      console.error('Erro ao obter o status:', error);
      throw error;
    }
  }

  async checkNetworkStatus() {
    try {
      const response = await api.get('/check-network-status');
      return response;
    } catch (error) {
      console.error('Erro ao obter o status:', error);
      throw error;
    }
  }

  async checkClusterStatus() {
    try {
      const response = await api.get('/check-cluster-status');
      return response;
    } catch (error) {
      console.error('Erro ao obter o status:', error);
      throw error;
    }
  }

  async executeChaincode(payload: unknown, networkId: string) {
    try {
      const response = await api.post(
        `${networkId}/execute-chaincode`,
        payload
      );

      return response;
    } catch (error) {
      console.error('Erro ao obter o status:', error);
      throw error;
    }
  }
}

const FabricNetworkApiInstance = new FabricNetworkApi();

export default FabricNetworkApiInstance;
