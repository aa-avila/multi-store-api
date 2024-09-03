import { ID } from '../../common/types/id';

export interface ICreateCompany {
  slug: string;
  name: string;
  ownerId: ID;
}
