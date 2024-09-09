import { ID } from '../../common/types/id';

export interface ICreateProductCategory {
  name: string;
  description: string;
  image?: string;
  companyId: ID;
}
