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
import { User } from '../users/users.model';
import { Sex } from '../utils/enum/sex';
// import { User } from 'src/users/users.model';
// import { Sex } from 'src/utils/enum/sex';

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
export class Pet {
  _id: ObjectId;

  @prop({ required: true })
  name!: string;

  @prop({ required: true })
  type!: string;

  @prop({ enum: Sex, type: String, default: Sex.NS })
  sex: string;

  @prop({ default: null })
  weight: number;

  @prop({ default: null })
  color: string;

  @prop({ default: null })
  birthday: string;

  @prop({
    validate: {
      validator: (v) => {
        return v.length <= 150;
      },
      message: 'value is over 150 characters long!',
      default: null,
    },
  })
  notes: string;

  @prop({ ref: () => User, type: () => String })
  owners: Ref<User, string>[];

  static paginate: PaginateMethod<Pet>;

  static deleteById: DeleteMethod;
}
