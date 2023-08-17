import { OrgFormData } from '@/types/orgFormData';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type State = {
  organizations: OrgFormData[];
  // eslint-disable-next-line no-unused-vars
  setOrganizations: (organizations: OrgFormData[]) => void;
};

export const useOrganizationStore = create<State>()(
  persist(
    (set) => ({
      organizations: [] as OrgFormData[],
      setOrganizations: (organizations) => set({ organizations })
    }),
    {
      name: 'organization-storage'
    }
  )
);
