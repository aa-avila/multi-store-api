import { PartialType } from '@nestjs/swagger';
import { CreateCategoryRequestDto } from './createCategoryRequest.dto';

export class UpdateCategoryRequestDto extends PartialType(
  CreateCategoryRequestDto,
) {}
