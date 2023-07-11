import React, { useState } from "react";
import {
  NetworkDetails,
  PeerOrganizationContainer,
} from "../NetworkInfo.styles";
import {
  ControlPanelAction,
  ControlPanelContainer,
  ControlPanelSectionTitle,
  ControlPanelSection,
  ControlPanelInput,
  SecondaryButton,
  ControlPanelSelect,
} from "./NetworkControlPanel.styles";
import FabricNetworkApi from "../../../utils/fabricNetworkApi";
import { createPayload } from "../../../utils/helpers";
import { useNetworkHistory } from "../../../context/NetworkHistoryContext";
import CircularProgress from "@mui/material/CircularProgress";
import {
  CreateChannelPayload,
  DeployChaincodePayload,
} from "../../../interfaces/fabricNetworkApiPayloads";
import Modal from "../../Modal/Modal";

interface PeerOrganization {
  name: string;
  numberOfPeers: number;
}

interface NetworkControlProps {
  ordererOrganization: string;
  peerOrganizations: PeerOrganization[];
  channels?: string[];
  chaincodes?: string[];
}

const NetworkControlPanel: React.FC<NetworkControlProps> = ({
  ordererOrganization,
  peerOrganizations,
  channels = [],
  chaincodes = [],
}) => {
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
  const [channelName, setChannelName] = useState("");
  const { networkHistory, updateNetworkHistory } = useNetworkHistory();
  const [isChannelLoading, setIsChannelLoading] = useState(false);
  const [isChaincodeExecutionLoading, setIsChaincodeExecutionLoading] =
    useState(false);
  const [isChaincodeLoading, setIsChaincodeLoading] = useState(false);
  const [showDeployChaincodeModal, setDeployChaincodeModal] = useState(false);
  const [showExecuteChaincodeModal, setShowExecuteChaincodeModal] =
    useState(false);
  const [chaincodeParams, setChaincodeParams] = useState("");

  const handleCreateChannel = async () => {
    if (showCreateChannelModal) {
      setIsChannelLoading(true);
      const payload = createPayload(
        ordererOrganization,
        peerOrganizations,
        channelName
      );
      const response = await FabricNetworkApi.createChannel(
        payload as CreateChannelPayload
      );
      console.log(response);
      if (response.status === 200) {
        const networkItem = networkHistory.find(
          (item) => item.ordererOrganization === ordererOrganization
        );
        if (networkItem) {
          console.log("networkItem", networkItem);
          console.log("channelName", channelName);
          updateNetworkHistory(networkItem, channelName, undefined);
        }
        setIsChannelLoading(false);
      }
      setShowCreateChannelModal(false);
    }
  };

  const handleDeployChaincode = async () => {
    if (showDeployChaincodeModal) {
      setIsChaincodeLoading(true);
      const payload = createPayload(
        ordererOrganization,
        peerOrganizations,
        "channelname",
        "asset-transfer-basic",
        "chaincode-typescript"
      );
      const response = await FabricNetworkApi.deployChaincode(
        payload as DeployChaincodePayload
      );
      if (response.status === 200) {
        const networkItem = networkHistory.find(
          (item) => item.ordererOrganization === ordererOrganization
        );
        if (networkItem) {
          updateNetworkHistory(networkItem, undefined, "asset-transfer-basic");
        }
      }
      setIsChaincodeLoading(false);
    }
  };

  const handleExecuteChaincode = async () => {
    setShowExecuteChaincodeModal(true);
    if (showExecuteChaincodeModal) {
      setIsChaincodeExecutionLoading(true);
      const payload = {
        // preencha com os dados necessários
        chaincodeCommand: { init: { Args: chaincodeParams.split(",") } },
      };
      const response = await FabricNetworkApi.executeChaincode();
      if (response.status === 202) {
        // atualize o estado ou faça o que precisar com a resposta
      }
      setIsChaincodeExecutionLoading(false);
      setShowExecuteChaincodeModal(false);
    }
  };

  return (
    <ControlPanelContainer>
      <ControlPanelSection>
        <ControlPanelSectionTitle>Organização Orderer</ControlPanelSectionTitle>
        <NetworkDetails>Nome: {ordererOrganization}</NetworkDetails>
        <ControlPanelSectionTitle>Organizações Peer</ControlPanelSectionTitle>
        {peerOrganizations.map((peerOrg) => (
          <PeerOrganizationContainer key={peerOrg.name}>
            <NetworkDetails>Nome: {peerOrg.name}</NetworkDetails>
            <NetworkDetails>Nodes: {peerOrg.numberOfPeers}</NetworkDetails>
          </PeerOrganizationContainer>
        ))}
        {channels.length > 0 && (
          <ControlPanelSection>
            <ControlPanelSectionTitle>Canais</ControlPanelSectionTitle>
            {channels.map((channel, index) => (
              <NetworkDetails key={index}>Nome: {channel}</NetworkDetails>
            ))}
          </ControlPanelSection>
        )}
        {chaincodes.length > 0 && (
          <ControlPanelSection>
            <ControlPanelSectionTitle>Chaincodes</ControlPanelSectionTitle>
            {chaincodes.map((channel, index) => (
              <NetworkDetails key={index}>Nome: {channel}</NetworkDetails>
            ))}
          </ControlPanelSection>
        )}
      </ControlPanelSection>
      {showCreateChannelModal && (
        <Modal onClose={() => setShowCreateChannelModal(false)}>
          <ControlPanelInput
            value={channelName}
            placeholder={"Nome do canal"}
            onChange={(e) => setChannelName(e.target.value)}
          />
          {isChannelLoading ? (
            <CircularProgress />
          ) : (
            <SecondaryButton onClick={handleCreateChannel}>
              Criar Canal
            </SecondaryButton>
          )}
        </Modal>
      )}
      <ControlPanelAction onClick={() => setShowCreateChannelModal(true)}>
        Criar Canal
      </ControlPanelAction>
      <ControlPanelSection>
        <ControlPanelSectionTitle>Chaincode</ControlPanelSectionTitle>
        {isChaincodeLoading ? (
          <CircularProgress />
        ) : showDeployChaincodeModal ? (
          <Modal onClose={() => setDeployChaincodeModal(false)}>
            <ControlPanelSelect
              value={chaincodeParams}
              onChange={(e) => setChaincodeParams(e.target.value)}
            >
              <option value="asset-transfer">Asset Transfer</option>
              <option value="logistics">Logistics</option>
              <option value="energy-trade">Energy Trade</option>
            </ControlPanelSelect>
            <SecondaryButton onClick={handleDeployChaincode}>
              Implantar
            </SecondaryButton>
          </Modal>
        ) : (
          <ControlPanelAction onClick={() => setDeployChaincodeModal(true)}>
            Implantar Chaincode
          </ControlPanelAction>
        )}
        {showExecuteChaincodeModal && (
          <Modal onClose={() => setShowExecuteChaincodeModal(false)}>
            <ControlPanelSelect
              value={chaincodeParams}
              onChange={(e) => setChaincodeParams(e.target.value)}
            >
              <option value="asset-transfer">Asset Transfer</option>
              <option value="logistics">Logistics</option>
              <option value="energy-trade">Energy Trade</option>
            </ControlPanelSelect>
            <ControlPanelInput
              value={chaincodeParams}
              placeholder={"Parâmetros do chaincode"}
              onChange={(e) => setChaincodeParams(e.target.value)}
            />
            {isChaincodeExecutionLoading ? (
              <CircularProgress />
            ) : (
              <SecondaryButton onClick={handleExecuteChaincode}>
                Enviar comando
              </SecondaryButton>
            )}
          </Modal>
        )}
        <ControlPanelAction onClick={() => setShowExecuteChaincodeModal(true)}>
          Executar Chaincode
        </ControlPanelAction>
      </ControlPanelSection>
    </ControlPanelContainer>
  );
};

export default NetworkControlPanel;
