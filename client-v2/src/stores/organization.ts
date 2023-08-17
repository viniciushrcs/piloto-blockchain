import { StartNetworkPayload } from '@/interfaces/fabricNetworkApiPayloads';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type State = {
  organization: StartNetworkPayload;
  // eslint-disable-next-line no-unused-vars
  setOrganization: (organization?: StartNetworkPayload) => void;
};

const INITIAL_STATE = {
  organization: {
    ordererOrganization: '',
    peerOrganizations: []
  }
};

export const useOrganizationStore = create<State>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,
      setOrganization: (organization) => set({ organization })
    }),
    {
      name: 'organization-storage'
    }
  )
);
