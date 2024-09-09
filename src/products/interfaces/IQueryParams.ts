import { IPaginationQueryParams } from '../../common/interfaces/IPaginationQueryParams';

export interface IQueryParams extends IPaginationQueryParams {
  limit?: number;
  page?: number;
  name?: string;
  companyId?: string;
}
