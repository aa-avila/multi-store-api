import { IPaginationQueryParams } from '../../common/interfaces/IPaginationQueryParams';
import { ID } from '../../common/types/id';

export interface IQueryParams extends IPaginationQueryParams {
  name?: string;
  companyId?: ID;
}
