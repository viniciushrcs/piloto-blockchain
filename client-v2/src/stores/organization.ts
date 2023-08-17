import { StartNetworkPayload } from '@/interfaces/fabricNetworkApiPayloads';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type State = {
  organizations: StartNetworkPayload[];
  // eslint-disable-next-line no-unused-vars
  setOrganization: (organization: StartNetworkPayload) => void;
};

export const useOrganizationStore = create<State>()(
  persist(
    (set) => ({
      organizations: [] as StartNetworkPayload[],
      setOrganization: (organization) => {
        set((state) => ({
          ...state,
          organizations: [...state.organizations, organization]
        }));
      }
    }),
    {
      name: 'organization-storage'
    }
  )
);
