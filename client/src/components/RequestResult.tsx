import React from "react";
import { Typography, Paper } from "@mui/material";
import styled from "styled-components";

interface RequestStatusProp {
  success: boolean;
}

const StyledPaper = styled(Paper)`
  padding: 20px;
  margin: 20px;
  text-align: center;
`;

const RequestStatus: React.FC<RequestStatusProp> = ({ success }) => {
  return (
    <StyledPaper>
      {success ? (
        <div>
          <Typography variant="h4" component="h3" gutterBottom>
            Rede criada com sucesso!
          </Typography>
          <Typography>
            A rede foi configurada e está pronta para uso.
          </Typography>
        </div>
      ) : (
        <div>
          <Typography variant="h4" component="h3" gutterBottom>
            Erro ao criar a rede
          </Typography>
          <Typography>
            Ocorreu um erro ao configurar a rede. Tente novamente mais tarde.
          </Typography>
        </div>
      )}
    </StyledPaper>
  );
};

export default RequestStatus;
