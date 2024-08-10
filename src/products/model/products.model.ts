import {
  modelOptions,
  prop,
  plugin,
  mongoose,
  Ref,
} from '@typegoose/typegoose';
import {
  FilterQuery,
  ObjectId,
  PaginateOptions,
  PaginateResult,
} from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import * as mongooseDelete from 'mongoose-delete';
import { Category } from '../../categories/categories.model';
import { ProductSchema } from './products.schema';

type PaginateMethod<T> = (
  query?: FilterQuery<T>,
  options?: PaginateOptions,
  callback?: (err: any, result: PaginateResult<T>) => void,
) => Promise<PaginateResult<T>>;

type DeleteMethod = (
  id?: string | mongoose.Types.ObjectId,
  deleteBy?: string | mongoose.Types.ObjectId | mongoose.Document,
) => Promise<any>;

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
export class Product implements ProductSchema {
  _id: ObjectId;

  @prop({ required: true, unique: true })
  name: string;

  @prop({ required: true })
  description: string;

  @prop({ required: true, type: String, default: [] })
  images: string[];

  @prop({ required: true, default: true })
  display: boolean;

  @prop({ ref: () => Category, type: () => String })
  category?: Ref<Category, string>;

  static paginate: PaginateMethod<Product>;

  static deleteById: DeleteMethod;
}
