import { Container, Title } from "../HomePage/HomePage.styles";
import React, { useContext } from "react";
import Header from "../Header/Header";
import NetworkInfo from "../NetworkInfo/NetworkInfo";
import { NetworkHistoryContext } from "../../context/NetworkHistoryContext";
import { NetworkListContainer } from "./HistoryPage.styles";

function HistoryPage() {
  const { networkHistory } = useContext(NetworkHistoryContext);

  return (
    <Container>
      <Header />
      <Title>Gerencie suas Redes Blockchain</Title>
      <NetworkListContainer>
        {networkHistory.map((network, index) => (
          <NetworkInfo
            key={index}
            ordererOrganization={network.ordererOrganization}
            peerOrganizations={network.peerOrganizations}
            success={network.success}
            channels={network.channels}
            chaincodes={network.chaincodes}
          />
        ))}
      </NetworkListContainer>
    </Container>
  );
}

export default HistoryPage;
