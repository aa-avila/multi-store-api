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

import { PetsService } from './pets.service';
import { CreatePetRequestDto } from './dto/createPetRequest.dto';
import { CreatePetResponseDto } from './dto/createPetResponse.dto';
import { ListPetResponseDto } from './dto/listPetResponse.dto';
import { UpdatePetRequestDto } from './dto/updatePetRequest.dto';

@ApiTags('Pets')
@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @ApiOperation({
    summary: 'Create a pet',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: apiResponseWrapper(CreatePetResponseDto),
    description: 'Created',
  })
  @Auth()
  @Roles(Role.ADMIN)
  @Post()
  async create(
    @Body() petData: CreatePetRequestDto,
  ): Promise<CreatePetResponseDto> {
    return this.petsService.create(petData);
  }

  @ApiOperation({
    summary: 'Get all pets',
    description: 'Only ADMIN role',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: apiResponseWrapper(ListPetResponseDto),
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
  ): Promise<ListPetResponseDto> {
    return this.petsService.findAll({
      page,
      limit,
      name,
    });
  }

  @ApiOperation({
    summary: 'Find one pet by id',
    description: 'Paginate & filter (opt): limit, page, name',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: apiResponseWrapper(CreatePetResponseDto),
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
  ): Promise<CreatePetResponseDto> {
    return this.petsService.findOne(_id);
  }

  @ApiOperation({
    summary: 'Update one pet by id',
    description: 'Only ADMIN role',
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
    @Param('id', new MongoIdValidation()) _id: string,
    @Body() item: UpdatePetRequestDto,
  ): Promise<boolean> {
    return this.petsService.update(_id, item);
  }

  @ApiOperation({
    summary: 'Delete one pet by id',
    description: 'Only ADMIN role',
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
    return this.petsService.delete(id);
  }
}
