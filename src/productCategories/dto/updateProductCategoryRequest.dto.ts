import { OmitType } from '@nestjs/swagger';
import { CreateDocResponseDto } from '../../common/dto/createDocResponse.dto';

export class UpdateProductCategoryRequestDto extends OmitType(
  CreateDocResponseDto,
  ['id'] as const,
) {}
