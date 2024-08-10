import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Delete,
  Body,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  HttpStatus,
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
import { ProductsService } from './products.service';
import { CreateProductRequestDto } from './dto/createProductRequest.dto';
import { CreateProductResponseDto } from './dto/createProductResponse.dto';
import { GetAllProductsResponseDto } from './dto/getAllProductsResponse.dto';
import { UpdateProductRequestDto } from './dto/updateProductRequest.dto';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // ******* SUPER_ADMIN *******
  @ApiOperation({
    summary: 'Get all products',
    description:
      'Gets all products that match with the provided query filters ',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: apiResponseWrapper(GetAllProductsResponseDto),
    description: 'Ok',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'name', required: false, type: String })
  @Get()
  async getAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
    @Query('name') name?: string,
    @Query('companyId') companyId?: string,
  ): Promise<GetAllProductsResponseDto> {
    return this.productsService.getAll({
      page,
      limit,
      name,
      companyId,
    });
  }

  // ******* SUPER_ADMIN + COMPANY_ADMIN *******
  @ApiOperation({
    summary: 'Create product',
    description: 'Creates a product',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: apiResponseWrapper(CreateProductResponseDto),
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
    @Body() productData: CreateProductRequestDto,
  ): Promise<CreateProductResponseDto> {
    return this.productsService.create(productData);
  }

  @ApiOperation({
    summary: 'Get product by id',
    description: 'Gets a product by id',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: apiResponseWrapper(CreateProductResponseDto),
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
  ): Promise<CreateProductResponseDto> {
    return this.productsService.getById(id);
  }

  @ApiOperation({
    summary: 'Update product by id',
    description: 'Updates a product by id',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: apiResponseWrapper(Boolean),
    description: 'Ok',
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
  @Put(':id')
  async updateById(
    @Param('id', new MongoIdValidation()) id: string,
    @Body() item: UpdateProductRequestDto,
  ): Promise<boolean> {
    return this.productsService.updateById(id, item);
  }

  @ApiOperation({
    summary: 'Delete one product by id',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: apiResponseWrapper(Boolean),
    description: 'Ok',
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
  @Delete(':id')
  async deleteById(
    @Param('id', new MongoIdValidation()) id: string,
  ): Promise<boolean> {
    return this.productsService.deleteById(id);
  }

  // ******* COMPANY_ADMIN *******
  @ApiOperation({
    summary: 'Get all products (own company)',
    description:
      'Gets all -own company- products that match with the provided query filters ',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: apiResponseWrapper(GetAllProductsResponseDto),
    description: 'Ok',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'name', required: false, type: String })
  @Get()
  async getAllOwn(
    @User() user: UserAuth,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
    @Query('name') name?: string,
  ): Promise<GetAllProductsResponseDto> {
    return this.productsService.getAll({
      page,
      limit,
      name,
      companyId: user.companyId,
    });
  }
}
