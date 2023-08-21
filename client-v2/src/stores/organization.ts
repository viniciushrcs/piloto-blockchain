/* eslint-disable no-unused-vars */
import { OrgFormData } from '@/types/orgFormData';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type State = {
  organizations: OrgFormData[];
  setOrganizations: (organizations: OrgFormData[]) => void;
  getOrganization: (id: number) => OrgFormData | undefined;
};

export const useOrganizationStore = create<State>()(
  persist(
    (set, get) => ({
      organizations: [] as OrgFormData[],
      setOrganizations: (organizations) => set({ organizations }),
      getOrganization: (id) => {
        const { organizations } = get();
        return organizations.find((org) => org.id === id);
      }
    }),
    {
      name: 'organization-storage'
    }
  )
);
