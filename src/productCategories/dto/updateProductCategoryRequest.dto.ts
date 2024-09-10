import { PartialType } from '@nestjs/swagger';
import { CreateProductCategoryRequestDto } from '../dto/createProductCategoryRequest.dto';

export class UpdateProductCategoryRequestDto extends PartialType(
  CreateProductCategoryRequestDto,
) {}
