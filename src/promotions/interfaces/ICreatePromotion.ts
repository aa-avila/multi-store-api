import { ID } from '../../common/types/id';

export interface ICreatePromotion {
  companyId: ID;
  name: string;
  description: string;
  images: string[];
  categories?: ID[];
  price: number;
}
