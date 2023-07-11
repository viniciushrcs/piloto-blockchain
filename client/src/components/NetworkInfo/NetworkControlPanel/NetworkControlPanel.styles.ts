import styled from "styled-components";

export const ControlPanelContainer = styled.div`
  width: 75%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
`;

export const ControlPanelTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 1rem;
`;

export const ControlPanelSection = styled.div`
  width: 100%;
  margin-bottom: 2rem;
`;

export const ControlPanelSectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
`;

export const ControlPanelAction = styled.button`
  font-size: 1rem;
  font-weight: 500;
  color: #fff;
  background-color: #2196f3;
  border: none;
  border-radius: 5px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 5px;

  &:hover {
    background-color: #1976d2;
  }

  &:disabled {
    background-color: #90caf9;
    cursor: not-allowed;
  }
`;

export const SecondaryButton = styled(ControlPanelAction)`
  background-color: #f5f5f5;
  color: #2196f3;
  border: 1px solid #2196f3;
  margin: 5px;
  &:hover {
    background-color: #e3f2fd;
  }

  &:disabled {
    background-color: #90caf9;
    color: #fff;
    border-color: #90caf9;
  }
`;
export const ControlPanelInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
`;

export const ControlPanelInputLabel = styled.label`
  font-size: 1rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 0.5rem;
`;

export const ControlPanelInput = styled.input`
  font-size: 1rem;
  font-weight: 400;
  color: #333;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin: 15px 0px;

  &:focus {
    border-color: #2196f3;
    outline: none;
  }
`;

export const ControlPanelSelect = styled.select`
  font-size: 1rem;
  font-weight: 400;
  color: #333;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin: 15px 0px;

  &:focus {
    border-color: #2196f3;
    outline: none;
  }
`;
