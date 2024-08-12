import { BaseDoc } from '../types/baseDoc.schema';
import { MongoGenericDoc } from '../types/mongoCommonTypes';

export const mongoDocResponseParser = <T extends BaseDoc>(
  data: MongoGenericDoc,
) => {
  const { _id, ...rest } = data;
  return {
    id: _id.toString(),
    ...rest,
  } as T; // <== TODO: no es lo ideal pero safa
};
