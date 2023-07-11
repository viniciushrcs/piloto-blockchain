import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import styled from "styled-components";

interface LoadingProps {
  status: string;
}

const StatusMessage = styled.p`
  color: #008cba;
  font-size: 18px;
  font-weight: bold;
`;

const Loading: React.FC<LoadingProps> = ({ status }) => {
  return (
    <div
      style={{
        marginTop: "100px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h2>Aguarde, estamos criando a rede solicitada</h2>
      <CircularProgress />
      <StatusMessage>{status}</StatusMessage>
    </div>
  );
};

export default Loading;
