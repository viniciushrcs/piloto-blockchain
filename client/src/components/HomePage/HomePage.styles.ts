import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background-color: #004c8c;
`;

export const Title = styled.h1`
  font-family: "Roboto", sans-serif;
  color: #ffffff;
  font-size: 48px;
  font-weight: 500;
  margin-bottom: 50px;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background-color: #ffffff;
  border-radius: 8px;
  padding: 40px;
  max-width: 500px;
  margin-bottom: 60px;
  width: 100%;
`;

export const Label = styled.label`
  font-family: "Roboto", sans-serif;
  display: flex;
  flex-direction: column;
  font-size: 18px;
  font-weight: bold;
  color: #333333;
  margin-bottom: 5px;
`;

export const Input = styled.input`
  font-family: "Roboto", sans-serif;
  border: 1px solid #cccccc;
  border-radius: 4px;
  padding: 10px;
  font-size: 16px;
  color: #333333;
  margin-top: 5px;
`;

export const Button = styled.button`
  font-family: "Roboto", sans-serif;
  background-color: #009b3a;
  border: none;
  border-radius: 4px;
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
  padding: 10px 20px;
  margin-top: 30px;
  align-self: center;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #00b84a;
  }
`;

export const FieldContainer = styled.div`
  margin-bottom: 15px;
`;

export const PeerOrganizationContainer = styled.div`
  background-color: #f2f2f2;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 15px;
`;

export const QtdInput = styled.label`
  display: flex;
  flex-direction: column;
  font-size: 18px;
  font-weight: bold;
  color: #333333;
  margin-bottom: 15px;

  input {
    border: 1px solid #cccccc;
    border-radius: 4px;
    padding: 10px;
    font-size: 16px;
    color: #333333;
    margin-top: 5px;
    width: 100px;
  }

  p {
    font-weight: normal;
  }
`;

export const NewPeerOrganizationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  background-color: #f2f2f2;
  border-radius: 8px;
  padding: 30px;
  margin-bottom: 15px;
  width: 80%;

  input {
    border: 1px solid #cccccc;
    border-radius: 4px;
    padding: 10px;
    font-size: 14px;
    color: #333333;
    width: 60%;
  }
`;

export const AddButton = styled(Button)`
  background-color: #008cba;
  padding: 8px 16px;
  font-size: 14px;
  margin-top: 0px;
  &:hover {
    background-color: #00ace0;
  }
`;

export const PeerOrgLabel = styled(Label)`
  font-size: 18px;
`;

export const InternalContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: 15px;

  button {
    align-self: center;
  }
`;

export const RemoveButton = styled.button`
  background-color: #e74c3c;
  border: none;
  border-radius: 4px;
  color: #ffffff;
  font-size: 14px;
  font-weight: bold;
  padding: 5px 10px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #e76b5d;
  }
`;
