import { IPaginationQueryParams } from '../../common/interfaces/IPaginationQueryParams';

export interface IQueryParams extends IPaginationQueryParams {
  email?: string;
  companyId?: string;
}
