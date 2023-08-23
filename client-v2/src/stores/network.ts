/* eslint-disable no-unused-vars */
import { Channel } from '@/types/channel';
import { Network } from '@/types/network';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type State = {
  networks: Network[];
  setNetworks: (networks: Network[]) => void;
  getNetwork: (id: number) => Network | undefined;
  setChannel: (network: Network, channel: Channel) => void;
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
      setChannel: (network, channel) => {
        const { networks } = get();

        const networkIndex = networks.findIndex((n) => n.id === network.id);

        const newNetworks = [...networks];

        newNetworks[networkIndex] = {
          ...network,
          channels: [...(network.channels ?? []), channel]
        };

        set(() => ({ networks: newNetworks }));
      }
    }),
    {
      name: 'networks-storage'
    }
  )
);
