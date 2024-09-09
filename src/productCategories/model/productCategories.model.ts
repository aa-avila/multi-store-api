import {
  modelOptions,
  prop,
  plugin,
  index,
  // Ref,
} from '@typegoose/typegoose';
import { ObjectId } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import * as mongooseDelete from 'mongoose-delete';
import {
  DeleteMethod,
  PaginateMethod,
} from '../../common/types/mongoCommonTypes';
import { ProductCategorySchema } from './productCategories.schema';

@modelOptions({
  schemaOptions: {
    collection: 'productCategories',
    timestamps: true,
    toObject: {
      getters: true,
      virtuals: false,
    },
  },
})
@plugin(mongoosePaginate)
@plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: true,
  deletedBy: true,
})
@index(
  { companyId: 1, name: 1 },
  {
    unique: false,
  },
)
export class ProductCategory implements ProductCategorySchema {
  _id: ObjectId;

  @prop({ required: true })
  companyId: string;

  @prop({ required: true })
  name: string;

  @prop({ required: true })
  description: string;

  @prop()
  image?: string;

  static paginate: PaginateMethod<ProductCategory>;

  static deleteById: DeleteMethod;
}
