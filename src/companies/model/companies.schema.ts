import { BaseDoc } from '../../common/types/baseDoc.schema';
import { ID } from '../../common/types/id';

export type CompanySchema = {
  slug: string; // unique
  name: string;
  ownerId: ID;
  // TODO: stores: Ref[]
};

export type CompanyDoc = CompanySchema & BaseDoc;
