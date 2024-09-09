import { modelOptions, prop, plugin, Ref, index } from '@typegoose/typegoose';
import { ObjectId } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import * as mongooseDelete from 'mongoose-delete';
import {
  DeleteMethod,
  PaginateMethod,
} from '../../common/types/mongoCommonTypes';
import { PromotionSchema } from './promotions.schema';
import { ProductCategory } from '../../productCategories/model/productCategories.model';

@modelOptions({
  schemaOptions: {
    timestamps: true,
    toObject: {
      getters: true,
      virtuals: false,
    },
  },
})
@plugin(mongoosePaginate)
@plugin(mongooseDelete, { deletedAt: true, overrideMethods: true })
@index(
  { companyId: 1, name: 1 },
  {
    unique: false,
  },
)
export class Promotion implements PromotionSchema {
  _id: ObjectId;

  @prop({ required: true })
  companyId: string;

  @prop({ required: true, unique: true })
  name: string;

  @prop({ required: true, default: '-' })
  description: string;

  @prop({ required: true, type: [String], default: [] })
  images: string[];

  @prop({ ref: () => ProductCategory })
  categories?: Ref<ProductCategory, string>[];

  @prop({ required: true, default: 0 })
  price: number;

  static paginate: PaginateMethod<Promotion>;

  static deleteById: DeleteMethod;
}
