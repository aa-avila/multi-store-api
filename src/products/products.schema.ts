import { BaseDoc } from '../core/types/baseDoc.schema';

export type ProductSchema = {
  name: string;
  description: string;
  images: string[];
  display: boolean;
  category: string | any; // TODO: type
};

export type ProductDoc = ProductSchema & BaseDoc;
