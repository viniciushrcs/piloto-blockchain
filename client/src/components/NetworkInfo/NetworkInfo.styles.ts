import { Button } from "@mui/material";
import styled from "styled-components";

export const NetworkInfoContainer = styled.div`
  position: relative;
  background-color: #f8f8f8;
  border-radius: 4px;
  padding: 30px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  &:hover {
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  }
`;

export const SectionTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
`;

export const NetworkDetails = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: #666;
`;

export const PeerOrganizationContainer = styled.div`
  padding: 8px 0;
  border-bottom: 1px solid #e0e0e0;
  &:last-child {
    border-bottom: none;
  }
`;

export const ManageNetworkContainer = styled.div`
  margin-top: 10px;
  display: flex;
  align-items: center;
`;

export const StatusIcon = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
`;

export const AddChannel = styled(Button)`
  background-color: #008cba;
  padding: 8px 16px;
  font-size: 14px;
  margin-top: 0px;
  &:hover {
    background-color: #00ace0;
  }
`;
