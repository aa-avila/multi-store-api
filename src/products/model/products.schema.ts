import { ID } from '../../common/types/id';
import { BaseDoc } from '../../common/types/baseDoc.schema';
// import { ProductCategoryDoc } from '../../productCategories/model/productCategories.schema';

export type ProductSchema = {
  companyId: ID;
  name: string;
  description: string;
  images: string[];
  categories?: ID[] | any; // can be populated
  price: number; // cents
};

export type ProductDoc = ProductSchema & BaseDoc;
