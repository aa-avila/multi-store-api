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
import { apiResponseWrapper } from '../core/factories/apiResponseWrapper.factory';
import { apiErrorWrapper } from '../core/factories/apiErrorWrapper.factory';
import { ErrorResponseDto } from '../core/dto/error.dto';
import { Auth } from '../core/decorators/auth.decorator';
import { Role } from '../core/enums/role.enum';
import { Roles } from '../core/decorators/roles.decorator';
import { MongoIdValidation } from '../core/pipes/mongoId.pipe';
import { ProductsService } from './products.service';
import { CreateProductRequestDto } from './dto/createProductRequest.dto';
import { CreateProductResponseDto } from './dto/createProductResponse.dto';
import { GetAllProductsResponseDto } from './dto/getAllProductsResponse.dto';
import { UpdateProductRequestDto } from './dto/updateProductRequest.dto';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

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
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
    @Query('name') name?: string,
  ): Promise<GetAllProductsResponseDto> {
    return this.productsService.getAll({
      page,
      limit,
      name,
    });
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
}
