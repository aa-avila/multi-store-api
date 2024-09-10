import { PartialType } from '@nestjs/swagger';
import { CreateCompanyRequestDto } from '../dto/createCompanyRequest.dto';

export class UpdateCompanyRequestDto extends PartialType(
  CreateCompanyRequestDto,
) {}
