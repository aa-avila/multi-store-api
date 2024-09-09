import { ApiProperty } from '@nestjs/swagger';
import {
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class ProductCategoryBaseDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Category name' })
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'This is a short description of the category',
  })
  description: string;

  @IsOptional()
  @IsUrl()
  @ApiProperty({
    example:
      'https://cdn.shopify.com/s/files/1/0070/7032/files/trending-products_c8d0d15c-9afc-47e3-9ba2-f7bad0505b9b.png?v=1614559651',
  })
  image?: string;

  @IsNotEmpty()
  @IsMongoId()
  @ApiProperty({ example: '66d65c368cecec2ee70700be' })
  companyId: string;
}
