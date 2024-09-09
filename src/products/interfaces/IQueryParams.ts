import { IPaginationQueryParams } from '../../common/interfaces/IPaginationQueryParams';

export interface IQueryParams extends IPaginationQueryParams {
  name?: string;
  companyId?: string;
}
