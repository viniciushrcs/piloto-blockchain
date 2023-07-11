import {
  NetworkInfoContainer,
  NetworkDetails,
  SectionTitle,
  PeerOrganizationContainer,
  StatusIcon,
  ManageNetworkContainer,
} from "./NetworkInfo.styles";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import Modal from "../Modal/Modal";
import LaunchIcon from "@mui/icons-material/Launch";
import IconButton from "@mui/material/IconButton";
import React, { useState } from "react";
import NetworkControlPanel from "./NetworkControlPanel/NetworkControlPanel";

interface PeerOrganization {
  name: string;
  numberOfPeers: number;
}

interface NetworkInfoProps {
  ordererOrganization: string;
  peerOrganizations: PeerOrganization[];
  channels?: string[];
  chaincodes?: string[];
  success: boolean;
}

function NetworkInfo({
  ordererOrganization,
  peerOrganizations,
  success,
  channels,
  chaincodes,
}: NetworkInfoProps) {
  const [showModal, setShowModal] = useState(false);

  const handleModalToggle = () => {
    setShowModal(true);
  };

  return (
    <NetworkInfoContainer>
      <StatusIcon>
        {success ? (
          <CheckCircleIcon sx={{ color: "#4CAF50" }} />
        ) : (
          <CancelIcon sx={{ color: "#F44336" }} />
        )}
      </StatusIcon>
      <SectionTitle>Organização Orderer</SectionTitle>
      <NetworkDetails>Nome: {ordererOrganization}</NetworkDetails>
      <SectionTitle>Organizações Peer</SectionTitle>
      {peerOrganizations.map((peerOrg) => (
        <PeerOrganizationContainer key={peerOrg.name}>
          <NetworkDetails>Nome: {peerOrg.name}</NetworkDetails>
          <NetworkDetails>Nodes: {peerOrg.numberOfPeers}</NetworkDetails>
        </PeerOrganizationContainer>
      ))}
      <SectionTitle>Canais</SectionTitle>
      {channels?.map((channel) => (
        <PeerOrganizationContainer key={channel}>
          <NetworkDetails>Nome: {channel}</NetworkDetails>
        </PeerOrganizationContainer>
      ))}
      <SectionTitle>Chaincodes</SectionTitle>
      {chaincodes?.map((chaincode) => (
        <PeerOrganizationContainer key={chaincode}>
          <NetworkDetails>Nome: {chaincode}</NetworkDetails>
        </PeerOrganizationContainer>
      ))}
      <ManageNetworkContainer>
        <p> Gerenciar a Rede </p>
        <IconButton onClick={handleModalToggle}>
          <LaunchIcon />
        </IconButton>
      </ManageNetworkContainer>
      {showModal && (
        <Modal
          onClose={() => {
            setShowModal(false);
          }}
        >
          <NetworkControlPanel
            ordererOrganization={ordererOrganization}
            peerOrganizations={peerOrganizations}
            channels={channels}
            chaincodes={chaincodes}
          />
        </Modal>
      )}
    </NetworkInfoContainer>
  );
}

export default NetworkInfo;
