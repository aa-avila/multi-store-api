import { PartialType } from '@nestjs/swagger';
import { CreateProductRequestDto } from './createProductRequest.dto';

export class UpdateProductRequestDto extends PartialType(
  CreateProductRequestDto,
) {}
