import React, { useState, useEffect } from "react";
import FabricNetworkApi from "../../utils/fabricNetworkApi";
import { createPayload } from "../../utils/helpers";
import Loading from "../Loading";
import {
  Container,
  Title,
  Form,
  Label,
  Input,
  Button,
  FieldContainer,
  PeerOrganizationContainer,
  QtdInput,
  NewPeerOrganizationContainer,
  AddButton,
  InternalContainer,
  PeerOrgLabel,
  RemoveButton,
} from "./HomePage.styles";
import Header from "../Header/Header";
import RequestResult from "../RequestResult";
import Modal from "../Modal/Modal";
import { useNetworkHistory } from "../../context/NetworkHistoryContext";

interface PeerOrganizationForm {
  name: string;
  numberOfPeers: number;
}

function HomePage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [finished, setFinished] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [ordererOrganization, setOrdererOrganization] = useState<string>("");
  const [peerOrganizations, setPeerOrganizations] = useState<
    PeerOrganizationForm[]
  >([]);
  const [newOrgName, setNewOrgName] = useState<string>("");
  const { addNetworkHistoryItem } = useNetworkHistory();

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const getStatus = async () => {
      const response = await FabricNetworkApi.getStatus();

      console.log(response.data);

      setStatus(response.data.message);
      if (!response.data.inProgress) {
        setLoading(false);
        setFinished(true);
        if (response.data.message !== "Erro") {
          addNetworkHistoryItem({
            ordererOrganization,
            peerOrganizations,
            success: true,
          });
          setSuccess(true);
        } else {
          addNetworkHistoryItem({
            ordererOrganization,
            peerOrganizations,
            success: false,
          });
          setSuccess(false);
        }
        clearInterval(interval);
      }
    };

    if (loading) {
      getStatus();
      interval = setInterval(getStatus, 10000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [addNetworkHistoryItem, loading, ordererOrganization, peerOrganizations]);

  const resetForm = () => {
    setOrdererOrganization("");
    setPeerOrganizations([]);
    setNewOrgName("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setShowModal(true);

    const payload = createPayload(ordererOrganization, peerOrganizations);

    await FabricNetworkApi.startNetwork(payload);
  };

  const handleRemovePeerOrganization = (index: number) => {
    const updatedPeerOrganizations = [...peerOrganizations];
    updatedPeerOrganizations.splice(index, 1);
    setPeerOrganizations(updatedPeerOrganizations);
  };

  const handleAddPeerOrganization = () => {
    setPeerOrganizations([
      ...peerOrganizations,
      {
        name: newOrgName,
        numberOfPeers: 1,
      },
    ]);
    setNewOrgName("");
  };

  const handleChangePeerOrganization = (index: number, value: number) => {
    const updatedPeerOrganizations = [...peerOrganizations];
    updatedPeerOrganizations[index].numberOfPeers = value;
    setPeerOrganizations(updatedPeerOrganizations);
  };

  return (
    <Container>
      <Header />
      <>
        <Title>Crie sua Rede Blockchain</Title>
        <Form onSubmit={handleSubmit}>
          <FieldContainer>
            <Label>
              <h2>Organizações Validadoras:</h2>
              <Input
                type="text"
                value={ordererOrganization}
                onChange={(e) => setOrdererOrganization(e.target.value)}
              />
            </Label>
          </FieldContainer>
          <h2>Organizações Apenas Registro:</h2>
          {peerOrganizations.map((org, index) => (
            <PeerOrganizationContainer key={index}>
              <PeerOrgLabel>{org.name}</PeerOrgLabel>
              <QtdInput>
                <p>Nodes:</p>
                <input
                  type="number"
                  value={org.numberOfPeers}
                  min="1"
                  onChange={(e) => {
                    const newValue = parseInt(e.target.value);
                    if (newValue >= 1) {
                      handleChangePeerOrganization(index, newValue);
                    }
                  }}
                />
              </QtdInput>
              <div>
                <RemoveButton
                  onClick={() => handleRemovePeerOrganization(index)}
                >
                  Remover
                </RemoveButton>
              </div>
            </PeerOrganizationContainer>
          ))}
          <NewPeerOrganizationContainer>
            <Label>Adicionar Organização Peer</Label>
            <InternalContainer>
              <input
                type="text"
                value={newOrgName}
                placeholder="Nome da nova organização"
                onChange={(e) => setNewOrgName(e.target.value)}
              />
              <AddButton
                type="button"
                onClick={handleAddPeerOrganization}
                disabled={!newOrgName.trim()}
              >
                Adicionar
              </AddButton>
            </InternalContainer>
          </NewPeerOrganizationContainer>
          <Button type="submit">Iniciar Rede</Button>
        </Form>
        {showModal && (
          <Modal
            onClose={() => {
              setShowModal(false);
              resetForm();
            }}
          >
            {loading ? (
              <Loading status={status} />
            ) : (
              finished && <RequestResult success={success} />
            )}
          </Modal>
        )}
      </>
    </Container>
  );
}

export default HomePage;
