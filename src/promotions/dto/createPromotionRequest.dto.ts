import { IsArray, IsMongoId, IsOptional } from 'class-validator';
import { PromotionBaseDto } from './promotionBase.dto';
import { ApiProperty } from '@nestjs/swagger';
import { ID } from '../../common/types/id';

export class CreatePromotionRequestDto extends PromotionBaseDto {
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  @ApiProperty({
    isArray: true,
    example: ['61d433863260b40e79f87db1'],
  })
  categories?: ID[];
}
