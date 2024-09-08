import {
  modelOptions,
  prop,
  plugin,
  // Ref,
} from '@typegoose/typegoose';
import { ObjectId } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import * as mongooseDelete from 'mongoose-delete';
import {
  DeleteMethod,
  PaginateMethod,
} from '../../common/types/mongoCommonTypes';
import { CompanySchema } from './companies.schema';

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
@plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: true,
  deletedBy: true,
})
export class Company implements CompanySchema {
  _id: ObjectId;

  @prop({ required: true, unique: true })
  slug: string;

  @prop({ required: true })
  name: string;

  @prop({ required: true })
  ownerId: string;

  static paginate: PaginateMethod<Company>;

  static deleteById: DeleteMethod;
}
