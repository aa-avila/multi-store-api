import { ID } from '../../common/types/id';
import { BaseDoc } from '../../common/types/baseDoc.schema';

export type PromotionSchema = {
  companyId: ID;
  name: string;
  description: string;
  images: string[];
  categories?: ID[] | any; // can be populated
  price: number; // cents
};

export type PromotionDoc = PromotionSchema & BaseDoc;
