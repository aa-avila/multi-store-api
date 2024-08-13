import { mongoose } from '@typegoose/typegoose';
import { FilterQuery, PaginateOptions, PaginateResult } from 'mongoose';
import { ID } from '../types/id';

type LowDoc<T> = T & {
  _id: ID;
  createdAt: Date;
  updatedAt: Date;
  deleted: boolean;
  __v: number;
};
export type MongoDoc<K> = {
  _id: ID;
  _doc: LowDoc<K>;
};

export type PaginateMethod<T> = (
  query?: FilterQuery<T>,
  options?: PaginateOptions,
  callback?: (err: any, result: PaginateResult<T>) => void,
) => Promise<PaginateResult<T>>;

export type DeleteMethod = (
  id?: string | mongoose.Types.ObjectId,
  deleteBy?: string | mongoose.Types.ObjectId | mongoose.Document,
) => Promise<any>;
