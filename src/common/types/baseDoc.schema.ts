import { ID } from './id';

export type BaseDoc = {
  id: ID;
  createdAt?: Date; // <== TODO: este no deberia ser opcional
  updatedAt?: Date;
  deletedAt?: Date;
};
