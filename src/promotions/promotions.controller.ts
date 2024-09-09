import {
  Controller,
  Get,
  Post,
  // Put,
  Param,
  Delete,
  Body,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { apiResponseWrapper } from '../common/factories/apiResponseWrapper.factory';
import { apiErrorWrapper } from '../common/factories/apiErrorWrapper.factory';
import { ErrorResponseDto } from '../common/dto/error.dto';
import { Auth } from '../common/decorators/auth.decorator';
import { Role } from '../common/enums/role.enum';
import { Roles } from '../common/decorators/roles.decorator';
import { User } from '../common/decorators/user.decorator';
import { UserAuth } from '../common/types/userAuth';
import { MongoIdValidation } from '../common/pipes/mongoId.pipe';
import { PromotionsService } from './promotions.service';
import { CreatePromotionRequestDto } from './dto/createPromotionRequest.dto';
import { CreateDocResponseDto } from '../common/dto/createDocResponse.dto';
import { GetAllProductsResponseDto } from './dto/getAllPromotionsResponse.dto';
import { UpdatePromotionRequestDto } from './dto/updatePromotionRequest.dto';
import { GetPromotionResponseDto } from './dto/getPromotionResponse.dto';

@ApiTags('Promotions')
@Controller('promotions')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  // ******* SUPER_ADMIN *******
  @ApiOperation({
    summary: 'Get all promotions',
    description:
      'Gets all promotions that match with the provided query filters ',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: apiResponseWrapper(GetAllProductsResponseDto),
    description: 'Ok',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'name', required: false, type: String })
  @ApiQuery({ name: 'companyId', required: false, type: String })
  @Get()
  async getAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
    @Query('name') name?: string,
    @Query('companyId') companyId?: string,
  ): Promise<GetAllProductsResponseDto> {
    return this.promotionsService.getAll({
      page,
      limit,
      name,
      companyId,
    });
  }

  // ******* SUPER_ADMIN + COMPANY_ADMIN *******
  @ApiOperation({
    summary: 'Create promotion',
    description: 'Creates a promotion',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: apiResponseWrapper(CreateDocResponseDto),
    description: 'Created',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: apiErrorWrapper(ErrorResponseDto),
    description: 'Bad request',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: apiErrorWrapper(ErrorResponseDto),
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    type: apiErrorWrapper(ErrorResponseDto),
    description: 'Forbidden',
  })
  @Auth()
  @Roles(Role.SUPER_ADMIN)
  @Post()
  async create(
    @Body() createData: CreatePromotionRequestDto,
  ): Promise<CreateDocResponseDto> {
    return this.promotionsService.create(createData);
  }

  @ApiOperation({
    summary: 'Get promotion by id',
    description: 'Gets a promotion by id',
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
  @Get(':id')
  async getById(
    @Param('id', new MongoIdValidation()) id: string,
  ): Promise<GetPromotionResponseDto> {
    return this.promotionsService.getById(id);
  }

  @ApiOperation({
    summary: 'Update promotion by id',
    description: 'Updates a promotion by id',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: apiResponseWrapper(Boolean),
    description: 'Ok',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: apiErrorWrapper(ErrorResponseDto),
    description: 'Not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: apiErrorWrapper(ErrorResponseDto),
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    type: apiErrorWrapper(ErrorResponseDto),
    description: 'Forbidden',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: apiErrorWrapper(ErrorResponseDto),
    description: 'Bad request',
  })
  @Auth()
  @Roles(Role.SUPER_ADMIN)
  @Patch(':id')
  async updateById(
    @Param('id', new MongoIdValidation()) id: string,
    @Body() updateData: UpdatePromotionRequestDto,
  ): Promise<boolean> {
    return this.promotionsService.updateById(id, updateData);
  }

  @ApiOperation({
    summary: 'Delete one promotion by id',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: apiResponseWrapper(Boolean),
    description: 'Ok',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: apiErrorWrapper(ErrorResponseDto),
    description: 'Not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: apiErrorWrapper(ErrorResponseDto),
    description: 'Bad request',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: apiErrorWrapper(ErrorResponseDto),
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    type: apiErrorWrapper(ErrorResponseDto),
    description: 'Forbidden',
  })
  @Auth()
  @Roles(Role.SUPER_ADMIN)
  @Delete(':id')
  async deleteById(
    @Param('id', new MongoIdValidation()) id: string,
  ): Promise<boolean> {
    return this.promotionsService.deleteById(id);
  }

  // ******* COMPANY_ADMIN *******
  @ApiOperation({
    summary: 'Get all promotions (own company)',
    description:
      'Gets all -own company- promotions that match with the provided query filters ',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: apiResponseWrapper(GetAllProductsResponseDto),
    description: 'Ok',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: apiErrorWrapper(ErrorResponseDto),
    description: 'Bad request',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: apiErrorWrapper(ErrorResponseDto),
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    type: apiErrorWrapper(ErrorResponseDto),
    description: 'Forbidden',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'name', required: false, type: String })
  @Auth()
  @Roles(Role.COMPANY_ADMIN)
  @Get('me')
  async getAllOwn(
    @User() user: UserAuth,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
    @Query('name') name?: string,
  ): Promise<GetAllProductsResponseDto> {
    return this.promotionsService.getAll({
      page,
      limit,
      name,
      companyId: user.companyId,
    });
  }
}
