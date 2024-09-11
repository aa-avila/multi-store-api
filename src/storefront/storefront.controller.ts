import {
  Controller,
  Get,
  Param,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  HttpStatus,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { apiResponseWrapper } from '../common/factories/apiResponseWrapper.factory';
import { apiErrorWrapper } from '../common/factories/apiErrorWrapper.factory';
import { ErrorResponseDto } from '../common/dto/error.dto';
import { MongoIdValidation } from '../common/pipes/mongoId.pipe';
import { StorefrontService } from './storefront.service';
import { GetAllPromotionsResponseDto } from '../promotions/dto/getAllPromotionsResponse.dto';
import { GetPromotionResponseDto } from '../promotions/dto/getPromotionResponse.dto';
import { sanitizePromotion } from './utils/docSanitizers';

@ApiTags('Storefront')
@Controller('storefront')
export class StorefrontController {
  constructor(private readonly storefrontService: StorefrontService) {}

  // ******* PROMOTIONS *******
  @ApiOperation({
    summary: 'Get one promotion by  id',
    description: 'Gets one promotion by id',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: apiResponseWrapper(GetPromotionResponseDto),
    description: 'Ok',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: apiErrorWrapper(ErrorResponseDto),
    description: 'Bad request',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: apiErrorWrapper(ErrorResponseDto),
    description: 'Not found',
  })
  @Get('promotions/:id')
  async GetPromotionById(
    @Param('id', new MongoIdValidation()) id: string,
  ): Promise<GetPromotionResponseDto> {
    return this.storefrontService.getPromotionById(id);
  }

  // ******* COMPANIES / PROMOTIONS *******
  @ApiOperation({
    summary: 'Get all promotions by company slug',
    description:
      'Gets all promotions of a specified company by its company slug',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: apiResponseWrapper(GetAllPromotionsResponseDto),
    description: 'Ok',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @Get('/companies/:companySlug/promotions')
  async getAllPromotionsByCompanySlug(
    @Param('companySlug') companySlug: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
  ): Promise<GetAllPromotionsResponseDto> {
    const response = await this.storefrontService.getAllPromotionsByCompanySlug(
      companySlug,
      {
        page,
        limit,
      },
    );
    return {
      ...response,
      docs: response.docs.map((doc) => {
        return sanitizePromotion(doc);
      }),
    };
  }
}
