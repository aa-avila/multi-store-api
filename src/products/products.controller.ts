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
import { apiResponseWrapper } from '../utils/factories/apiResponseWrapper.factory';
import { apiErrorWrapper } from '../utils/factories/apiErrorWrapper.factory';
import { ErrorResponseDto } from '../utils/errors/error.dto';
import { Auth } from '../auth/auth.decorador';
import { Role } from '../utils/enum/role';
import { Roles } from '../utils/decorators/roles.decorator';
import { MongoIdValidation } from '../pipes/mongoId.pipe';
import { ProductsService } from './products.service';
import { CreateProductRequestDto } from './dto/createProductRequest.dto';
import { CreateProductResponseDto } from './dto/createProductResponse.dto';
import { ListProductResponseDto } from './dto/listProductResponse.dto';
import { UpdateProductRequestDto } from './dto/updateProductRequest.dto';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiOperation({
    summary: 'Create a product',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: apiResponseWrapper(CreateProductResponseDto),
    description: 'Created',
  })
  @Auth()
  @Roles(Role.ADMIN)
  @Post()
  async create(
    @Body() productData: CreateProductRequestDto,
  ): Promise<CreateProductResponseDto> {
    return this.productsService.create(productData);
  }

  @ApiOperation({
    summary: 'Get all products',
    description: 'Category is populated, only fields "_id" & "name"',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: apiResponseWrapper(ListProductResponseDto),
    description: 'Ok',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'name', required: false, type: String })
  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('name') name?: string,
  ): Promise<ListProductResponseDto> {
    return this.productsService.findAll({
      page,
      limit,
      name,
    });
  }

  @ApiOperation({
    summary: 'Find one product by id',
    description: 'Category is populated, only fields "_id" & "name"',
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
  async findOne(
    @Param('id', new MongoIdValidation()) id: string,
  ): Promise<CreateProductResponseDto> {
    return this.productsService.findOne(id);
  }

  @ApiOperation({
    summary: 'Update one product by id',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: apiResponseWrapper(Boolean),
    description: 'Ok',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: apiErrorWrapper(ErrorResponseDto),
    description: 'Bad request',
  })
  @Auth()
  @Roles(Role.ADMIN)
  @Put(':id')
  async update(
    @Param('id', new MongoIdValidation()) id: string,
    @Body() item: UpdateProductRequestDto,
  ): Promise<boolean> {
    return this.productsService.update(id, item);
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
    status: HttpStatus.BAD_REQUEST,
    type: apiErrorWrapper(ErrorResponseDto),
    description: 'Bad request',
  })
  @Auth()
  @Roles(Role.ADMIN)
  @Delete(':id')
  async delete(
    @Param('id', new MongoIdValidation()) id: string,
  ): Promise<boolean> {
    return this.productsService.delete(id);
  }
}
