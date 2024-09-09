import { BaseDoc } from '../../common/types/baseDoc.schema';
import { ID } from '../../common/types/id';

export type ProductCategorySchema = {
  name: string;
  description: string;
  image?: string;
  companyId: ID;
};

export type ProductCategoryDoc = ProductCategorySchema & BaseDoc;
