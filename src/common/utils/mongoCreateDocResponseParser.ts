import { MongoGenericDoc } from '../types/mongoCommonTypes';
import { CreateDocResponse } from '../types/createDocResponse';

export const mongoCreateDocResponseParser = (
  data: MongoGenericDoc,
): CreateDocResponse => {
  return {
    id: data._id.toString(),
  };
};
