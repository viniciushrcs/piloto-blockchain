import { OrgFormData } from '@/types/orgFormData';
import { ORDERING_ORGANIZATION } from './constants';

export const getOrderingOrganization = (participants: OrgFormData[]) => {
  return (
    participants.filter(
      (participant) => participant.hasOrderingNode == ORDERING_ORGANIZATION
    )[0]?.name || ''
  );
};
