import { PartialType } from '@nestjs/swagger';
import { CreatePromotionRequestDto } from './createPromotionRequest.dto';

export class UpdatePromotionRequestDto extends PartialType(
  CreatePromotionRequestDto,
) {}
// TODO: Omit companyId
