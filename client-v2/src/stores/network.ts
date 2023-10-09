/* eslint-disable no-unused-vars */
import { PeerOrganization } from '@/interfaces/fabricNetworkApiPayloads';
import { ChainCode } from '@/types/chainCode';
import { Channel } from '@/types/channel';
import { Network } from '@/types/network';
import { OrgFormData } from '@/types/orgFormData';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type State = {
  networks: Network[];
  setNetworks: (networks: Network[]) => void;
  getNetwork: (id: number) => Network | undefined;
  setChannel: (
    networkId: number,
    channelName: string,
    organizations: string[]
  ) => void;
  setChaincode: (networkId: number, chainCode: ChainCode) => void;
  getOrganizations: (networkId: number) => OrgFormData[] | undefined;
  getChannels: (networkId: number) => Channel[] | undefined;
};

export const useNetworkStore = create<State>()(
  persist(
    (set, get) => ({
      networks: [] as Network[],
      setNetworks: (networks) => {
        set(() => ({ networks: [...get().networks, ...networks] }));
      },
      getNetwork: (id) => {
        const { networks } = get();

        return networks.find((network) => network.id === id);
      },
      setChannel: (networkId, channelName, organizations) => {
        const { networks } = get();

        const updatedNetworks = networks.map((network) => {
          if (network.id === networkId) {
            const channel: Channel = {
              name: channelName,
              organizations
            };

            return {
              ...network,
              channels: [...(network.channels || []), channel] // Add the new channel
            };
          }
          return network;
        });

        set(() => ({ networks: updatedNetworks }));
      },
      setChaincode: (networkId, chainCode) => {
        const { networks } = get();

        const updatedNetworks = networks.map((network) => {
          if (network.id === networkId) {
            return {
              ...network,
              chainCodes: [...(network.chainCodes || []), chainCode] // Add the new chaincode
            };
          }
          return network;
        });

        set(() => ({ networks: updatedNetworks }));
      },
      getOrganizations: (networkId) => {
        const { networks } = get();

        const network = networks.find((n) => n.id === networkId);

        return network?.organizations;
      },
      getChannels: (networkId) => {
        const { networks } = get();

        const network = networks.find((n) => n.id === networkId);

        return network?.channels;
      }
    }),
    {
      name: 'networks-storage'
    }
  )
);
