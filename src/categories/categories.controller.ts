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
import { CategoriesService } from './categories.service';
import { CreateCategoryRequestDto } from './dto/createCategoryRequest.dto';
import { CreateCategoryResponseDto } from './dto/createCategoryResponse.dto';
import { ListCategoryResponseDto } from './dto/listCategoryResponse.dto';
import { UpdateCategoryRequestDto } from './dto/updateCategoryRequest.dto';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiOperation({
    summary: 'Create a category',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: apiResponseWrapper(CreateCategoryResponseDto),
    description: 'Created',
  })
  @Auth()
  @Roles(Role.SUPER_ADMIN)
  @Post()
  async create(
    @Body() categoryData: CreateCategoryRequestDto,
  ): Promise<CreateCategoryResponseDto> {
    return this.categoriesService.create(categoryData);
  }

  @ApiOperation({
    summary: 'Get all categories',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: apiResponseWrapper(ListCategoryResponseDto),
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
  ): Promise<ListCategoryResponseDto> {
    return this.categoriesService.findAll({
      page,
      limit,
      name,
    });
  }

  @ApiOperation({
    summary: 'Find one category by id',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: apiResponseWrapper(CreateCategoryResponseDto),
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
  ): Promise<CreateCategoryResponseDto> {
    return this.categoriesService.findOne(id);
  }

  @ApiOperation({
    summary: 'Update one category by id',
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
  @Roles(Role.SUPER_ADMIN)
  @Put(':id')
  async update(
    @Param('id', new MongoIdValidation()) id: string,
    @Body() item: UpdateCategoryRequestDto,
  ): Promise<boolean> {
    return this.categoriesService.update(id, item);
  }

  @ApiOperation({
    summary: 'Delete one category by id',
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
  @Roles(Role.SUPER_ADMIN)
  @Delete(':id')
  async delete(
    @Param('id', new MongoIdValidation()) id: string,
  ): Promise<boolean> {
    return this.categoriesService.delete(id);
  }
}
