import { ID } from './id';

export type BaseDoc = {
  id: ID;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
};
