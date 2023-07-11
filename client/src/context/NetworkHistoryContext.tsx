import React, { createContext, useContext, useState } from "react";

interface PeerOrganizationForm {
  name: string;
  numberOfPeers: number;
}

interface NetworkHistoryItem {
  ordererOrganization: string;
  peerOrganizations: PeerOrganizationForm[];
  channels?: string[];
  chaincodes?: string[];
  success: boolean;
}

interface NetworkHistoryContextData {
  networkHistory: NetworkHistoryItem[];
  addNetworkHistoryItem: (item: NetworkHistoryItem) => void;
  updateNetworkHistory: (
    item: NetworkHistoryItem,
    channel?: string,
    chaincode?: string
  ) => void;
}

export const NetworkHistoryContext = createContext<NetworkHistoryContextData>(
  {} as NetworkHistoryContextData
);

export const useNetworkHistory = () => {
  return useContext(NetworkHistoryContext);
};

interface NetworkHistoryProviderProps {
  children: React.ReactNode;
}

export const NetworkHistoryProvider: React.FC<NetworkHistoryProviderProps> = ({
  children,
}) => {
  const [networkHistory, setNetworkHistory] = useState<NetworkHistoryItem[]>([
    // {
    //   ordererOrganization: "teste",
    //   peerOrganizations: [
    //     {
    //       name: "teste2",
    //       numberOfPeers: 2,
    //     },
    //   ],
    //   success: true,
    //   chaincodes: ["teste"],
    //   channels: ["teste"],
    // },
  ]);

  const addNetworkHistoryItem = (item: NetworkHistoryItem) => {
    setNetworkHistory((prevState) => [...prevState, item]);
  };

  const updateNetworkHistory = (
    item: NetworkHistoryItem,
    channel?: string,
    chaincode?: string
  ) => {
    let updatedItem: NetworkHistoryItem = { ...item };

    if (channel) {
      updatedItem = {
        ...updatedItem,
        channels: [...(updatedItem.channels || []), channel],
      };
    }

    if (chaincode) {
      updatedItem = {
        ...updatedItem,
        chaincodes: [...(updatedItem.chaincodes || []), chaincode],
      };
    }

    setNetworkHistory((prevState) =>
      prevState.map((historyItem) =>
        historyItem.ordererOrganization === item.ordererOrganization
          ? updatedItem
          : historyItem
      )
    );
  };

  return (
    <NetworkHistoryContext.Provider
      value={{
        networkHistory,
        addNetworkHistoryItem,
        updateNetworkHistory,
      }}
    >
      {children}
    </NetworkHistoryContext.Provider>
  );
};
