import { CreateCompanyRequestDto } from '../dto/createCompanyRequest.dto';
import { ICreateCompany } from '../interfaces/ICreateCompany';

export const companyCreateData: ICreateCompany = {
  slug: 'the-company',
  name: 'The Company',
  ownerId: '66d7ae01937e9e3b8af3db7d',
};

export const companyUpdateData: Partial<ICreateCompany> = {
  name: 'The New Data',
};

export const companyCreateReq: CreateCompanyRequestDto = {
  ...companyCreateData,
};

export const companyId = '61d4c1b0bb013bc318c951d7';
