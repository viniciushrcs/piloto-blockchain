import { ChainCode } from './chainCode';
import { Channel } from './channel';
import { OrgFormData } from './orgFormData';

export type Network = {
  id: number;
  networkId?: string;
  organizations: OrgFormData[];
  channels?: Channel[];
  chainCodes?: ChainCode[];
};
