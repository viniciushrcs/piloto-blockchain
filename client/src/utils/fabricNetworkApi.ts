import axios from "axios";
import {
  CreateChannelPayload,
  DeployChaincodePayload,
  StartNetworkPayload,
} from "../interfaces/fabricNetworkApiPayloads";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

class FabricNetworkApi {
  async startNetwork(payload: StartNetworkPayload) {
    try {
      return await api.post("/start-network", payload);
    } catch (error) {
      console.error("Erro ao iniciar a rede:", error);
      throw error;
    }
  }

  async createChannel(payload: CreateChannelPayload) {
    try {
      return await api.post("/create-channel", payload);
    } catch (error) {
      console.error("Erro ao criar canal:", error);
      throw error;
    }
  }

  deployChaincode = async (payload: DeployChaincodePayload) => {
    try {
      return await api.post("/deploy-chaincode", payload);
    } catch (error) {
      console.error("Erro ao implantar chaincode", error);
      throw error;
    }
  };

  async getStatus() {
    try {
      const response = await api.get("/check-status");
      return response;
    } catch (error) {
      console.error("Erro ao obter o status:", error);
      throw error;
    }
  }
  async executeChaincode() {
    try {
      //todo remover esse hardcode
      const payload = {
        ordererOrganization: "org0",
        peerOrganizations: [
          {
            name: "org1",
            peers: ["peer1"],
          },
        ],
        channelName: "channelname",
        chaincodeName: "asset-transfer-basic",
        chaincodePath: "chaincode-typescript",
        chaincodeCommand: {
          init: {
            Args: ["InitLedger"],
          },
        },
      };
      const response = await api.post("/execute-chaincode", payload);
      return response;
    } catch (error) {
      console.error("Erro ao obter o status:", error);
      throw error;
    }
  }
}

const FabricNetworkApiInstance = new FabricNetworkApi();

export default FabricNetworkApiInstance;
