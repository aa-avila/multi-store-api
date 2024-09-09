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
import { Role } from '../../common/enums/role.enum';
import { UserSchema } from './users.schema';

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
@index(
  { email: 1 },
  {
    unique: true,
    partialFilterExpression: {
      email: { $exists: true },
    },
  },
)
@index(
  { token: 1 },
  {
    unique: false,
    partialFilterExpression: {
      token: { $exists: true },
    },
  },
)
export class User implements UserSchema {
  _id: ObjectId;

  @prop({ required: true, unique: true })
  email: string;

  @prop({ required: true })
  firstName: string;

  @prop({ required: true })
  lastName: string;

  @prop()
  phoneNumber?: string;

  @prop({ enum: Role, type: String })
  roles: Role[];

  @prop()
  password?: string;

  @prop()
  token?: string;

  @prop()
  companyId?: string;

  static paginate: PaginateMethod<User>;

  static deleteById: DeleteMethod;
}
