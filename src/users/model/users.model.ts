import { modelOptions, prop } from '@typegoose/typegoose';
import { ObjectId } from 'mongoose';
import { Role } from '../../common/enums/role.enum';

@modelOptions({
  schemaOptions: {
    timestamps: true,
    toObject: {
      getters: true,
      virtuals: false,
    },
  },
})
export class User {
  _id: ObjectId;

  @prop({ required: true, unique: true })
  email: string;

  @prop({ required: true })
  firstName: string;

  @prop({ required: true })
  lastName: string;

  @prop({ enum: Role, type: String })
  roles: Role[];

  @prop()
  password?: string;

  @prop()
  token?: string;
}
