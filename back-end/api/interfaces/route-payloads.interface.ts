export interface ChaincodeCommandArgs {
  Args: string[];
}

export interface ChaincodeCommand {
  [key: string]: ChaincodeCommandArgs;
}

export interface PeerOrganization {
  name: string;
  peers: string[];
}

export interface StartNetworkPayload {
  ordererOrganization: string;
  peerOrganizations: PeerOrganization[];
}

export interface CreateChannelPayload {
  ordererOrganization: string;
  peerOrgsToJoin: PeerOrganization[];
  channelName: string;
}

export interface DeployChaincodePayload
  extends CreateChannelPayload,
    StartNetworkPayload {
  chaincodeName: string;
  chaincodePath: string;
}

export interface ExecuteChaincodePayload
  extends DeployChaincodePayload,
    CreateChannelPayload,
    StartNetworkPayload {
  chaincodeCommand: ChaincodeCommand;
}
