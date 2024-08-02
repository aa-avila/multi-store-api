import { modelOptions, prop, plugin, mongoose } from '@typegoose/typegoose';
import {
  FilterQuery,
  ObjectId,
  PaginateOptions,
  PaginateResult,
} from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import * as mongooseDelete from 'mongoose-delete';

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
export class Category {
  _id: ObjectId;

  @prop({ required: true, unique: true })
  name: string;

  @prop({ required: true })
  description: string;

  @prop({ required: true, type: String, default: [] })
  images: string[];

  @prop({ required: true, default: true })
  display: boolean;

  static paginate: PaginateMethod<Category>;

  static deleteById: DeleteMethod;
}
