/* eslint-disable no-unused-vars */
import { Network } from '@/types/network';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type State = {
  networks: Network[];
  setNetworks: (networks: Network[]) => void;
  getNetwork: (id: number) => Network | undefined;
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
      }
    }),
    {
      name: 'networks-storage'
    }
  )
);
