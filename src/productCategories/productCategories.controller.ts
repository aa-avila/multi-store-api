import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MongoIdValidation } from '../common/pipes/mongoId.pipe';
import { apiErrorWrapper } from '../common/factories/apiErrorWrapper.factory';
import { Auth } from '../common/decorators/auth.decorator';
import { ErrorResponseDto } from '../common/dto/error.dto';
import { User } from '../common/decorators/user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { UserAuth } from '../common/types/userAuth';
import { apiResponseWrapper } from '../common/factories/apiResponseWrapper.factory';
import { CreateProductCategoryRequestDto } from './dto/createProductCategoryRequest.dto';
import { CreateDocResponseDto } from '../common/dto/createDocResponse.dto';
import { ProductCategoriesService } from './productCategories.service';
import { GetProductCategoryResponseDto } from './dto/getProductCategoryResponse.dto';
import { GetAllProductCategoriesResponseDto } from './dto/getAllProductCategoriesResponse.dto';
import { UpdateProductCategoryRequestDto } from './dto/updateProductCategoryRequest.dto';

@Controller('product-categories')
@ApiTags('ProductCategories')
export class ProductCategoriesController {
  constructor(private companiesService: ProductCategoriesService) {}

  // ******* SUPER_ADMIN *******
  @ApiOperation({
    summary: 'Get all productCategories',
    description:
      'Gets all productCategories that match with the provided query filters ',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: apiResponseWrapper(GetAllProductCategoriesResponseDto),
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
  @ApiQuery({ name: 'companyId', required: false, type: String })
  @Auth()
  @Roles(Role.SUPER_ADMIN)
  @Get()
  async getAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
    @Query('name') name?: string,
    @Query('companyId') companyId?: string,
  ): Promise<GetAllProductCategoriesResponseDto> {
    return this.companiesService.getAll({
      page,
      limit,
      name,
      companyId,
    });
  }

  // ******* SUPER_ADMIN || COMPANY_ADMIN *******
  @ApiOperation({
    summary: 'Create ProductCategory',
    description: 'Creates a new ProductCategory',
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
  @Roles(Role.SUPER_ADMIN, Role.COMPANY_ADMIN)
  @Post()
  async create(
    @Body() companyData: CreateProductCategoryRequestDto,
  ): Promise<CreateDocResponseDto> {
    return this.companiesService.create(companyData);
  }

  @ApiOperation({
    summary: 'Get ProductCategory by id',
    description: 'Gets a ProductCategory by id',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: apiResponseWrapper(GetProductCategoryResponseDto),
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
  @Roles(Role.SUPER_ADMIN, Role.COMPANY_ADMIN)
  @Get(':id')
  async getById(
    @Param('id', new MongoIdValidation()) id: string,
  ): Promise<GetProductCategoryResponseDto> {
    return this.companiesService.getById(id);
  }

  @ApiOperation({
    summary: 'Update ProductCategory by id',
    description: 'Updates a ProductCategory by id',
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
  @Roles(Role.SUPER_ADMIN, Role.COMPANY_ADMIN)
  @Patch(':id')
  async updateById(
    @Param('id', new MongoIdValidation()) id: string,
    @Body() updateData: UpdateProductCategoryRequestDto,
  ): Promise<boolean> {
    return this.companiesService.updateById(id, updateData);
  }

  @ApiOperation({
    summary: 'Delete one ProductCategory by id',
    description: 'Deletes a ProductCategory by id',
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
  @Roles(Role.SUPER_ADMIN, Role.COMPANY_ADMIN)
  @Delete(':id')
  async deleteById(
    @Param('id', new MongoIdValidation()) id: string,
  ): Promise<boolean> {
    return this.companiesService.deleteById(id);
  }

  // ******* COMPANY_ADMIN *******
  @ApiOperation({
    summary: 'Get ProductCategories data (own)',
    description: 'Gets al ProductCategories data with query filters -own only-',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: apiResponseWrapper(GetAllProductCategoriesResponseDto),
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
  async getOwn(
    @User() user: UserAuth,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
    @Query('name') name?: string,
  ): Promise<GetAllProductCategoriesResponseDto> {
    return this.companiesService.getAll({
      page,
      limit,
      name,
      companyId: user.companyId,
    });
  }
}
