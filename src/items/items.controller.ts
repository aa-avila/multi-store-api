import {
  Controller,
  Post,
  Body,
  HttpStatus,
  Get,
  Param,
  Put,
  Delete,
  DefaultValuePipe,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { apiResponseWrapper } from '../utils/factories/apiResponseWrapper.factory';
import { apiErrorWrapper } from '../utils/factories/apiErrorWrapper.factory';
import { ItemsService } from './items.service';
import { Auth } from '../auth/auth.decorador';
import { CreateItemResponseDto } from './dto/createItemResponse.dto';
import { CreateItemRequestDto } from './dto/createItemRequest.dto';
import { Role } from '../utils/enum/role';
import { Roles } from '../utils/decorators/roles.decorator';
import { ErrorResponseDto } from '../utils/errors/error.dto';
import { MongoIdValidation } from '../pipes/mongoId.pipe';
import { UpdateItemRequestDto } from './dto/updateItemRequest.dto';
import { ListItemResponseDto } from './dto/listItemResponse.dto';

@ApiTags('Items')
@Controller('items')
export class ItemsController {
  constructor(private itemsService: ItemsService) {}

  @ApiOperation({
    summary: 'Get all items',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: apiResponseWrapper(ListItemResponseDto),
    description: 'Ok',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'name', required: false, type: String })
  @Auth()
  @Roles(Role.ADMIN, Role.OTHER)
  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('name') name?: string,
  ): Promise<ListItemResponseDto> {
    return this.itemsService.findAll({
      page,
      limit,
      name,
    });
  }

  @ApiOperation({
    summary: 'Create items',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: apiResponseWrapper(CreateItemResponseDto),
    description: 'Created',
  })
  @Auth()
  @Roles(Role.ADMIN, Role.OTHER)
  @Post()
  async create(
    @Body() item: CreateItemRequestDto,
  ): Promise<CreateItemResponseDto> {
    return this.itemsService.create(item);
  }

  @ApiOperation({
    summary: 'Count items',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: apiResponseWrapper(Number),
    description: 'Ok',
  })
  @Auth()
  @Roles(Role.ADMIN, Role.OTHER)
  @Get('count')
  async count(): Promise<number> {
    return this.itemsService.count();
  }

  @ApiOperation({
    summary: 'Find one item',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: apiResponseWrapper(CreateItemResponseDto),
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
  @Auth()
  @Roles(Role.ADMIN, Role.OTHER)
  @Get(':id')
  async findOne(
    @Param('id', new MongoIdValidation()) _id: string,
  ): Promise<CreateItemResponseDto> {
    return this.itemsService.findOne(_id);
  }

  @ApiOperation({
    summary: 'Update one item',
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
  @Roles(Role.ADMIN, Role.OTHER)
  @Put(':id')
  async update(
    @Param('id', new MongoIdValidation()) _id: string,
    @Body() item: UpdateItemRequestDto,
  ): Promise<boolean> {
    return this.itemsService.update(_id, item);
  }

  @ApiOperation({
    summary: 'Delete one item',
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
  @Roles(Role.ADMIN, Role.OTHER)
  @Delete(':id')
  async delete(
    @Param('id', new MongoIdValidation()) _id: string,
  ): Promise<boolean> {
    return this.itemsService.delete(_id);
  }
}
