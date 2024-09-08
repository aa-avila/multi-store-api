import { MongoDoc } from '../types/mongoCommonTypes';

export const mongoDocParser = <S, D>(dbDoc: any): D => {
  const doc = { ...dbDoc } as unknown as MongoDoc<S>;
  delete doc._doc.__v;
  const { _id, ...data } = doc._doc;
  return {
    id: _id.toString(),
    ...data,
  } as D;
};
