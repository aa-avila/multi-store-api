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
import { CreateUserRequestDto } from './dto/createUserRequest.dto';
import { CreateDocResponseDto } from '../common/dto/createDocResponse.dto';
import { UsersService } from './users.service';
import { GetUserResponseDto } from './dto/getUserResponse.dto';
import { UpdateUserRequestDto } from './dto/updateUserRequest.dto';
import { GetAllUsersResponseDto } from './dto/getAllUsersResponse.dto';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // ******* SUPER_ADMIN  *******
  @ApiOperation({
    summary: 'Count',
    description: 'Count users',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: apiResponseWrapper(Number),
    description: 'Ok',
  })
  @Auth()
  @Roles(Role.SUPER_ADMIN)
  @Get('count')
  async count(): Promise<number> {
    return this.usersService.count();
  }

  @ApiOperation({
    summary: 'Create new user',
    description: 'Creates a new user',
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
    status: HttpStatus.CONFLICT,
    type: apiResponseWrapper(ErrorResponseDto),
    description: 'Conflict',
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
    @Body() userData: CreateUserRequestDto,
  ): Promise<CreateDocResponseDto> {
    return this.usersService.create(userData);
  }

  @ApiOperation({
    summary: 'Get all users',
    description: 'Gets all users that match with the provided query filters ',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: apiResponseWrapper(GetAllUsersResponseDto),
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
  @ApiQuery({ name: 'email', required: false, type: String })
  @ApiQuery({ name: 'companyId', required: false, type: String })
  @Auth()
  @Roles(Role.SUPER_ADMIN)
  @Get()
  async getAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
    @Query('email') email?: string,
    @Query('companyId') companyId?: string,
  ): Promise<GetAllUsersResponseDto> {
    return this.usersService.getAll({
      page,
      limit,
      email,
      companyId,
    });
  }

  @ApiOperation({
    summary: 'Get user by Id',
    description: 'Gets a user by id',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: apiResponseWrapper(GetUserResponseDto),
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
  @Roles(Role.SUPER_ADMIN)
  @Get(':id')
  async getById(
    @Param('id', new MongoIdValidation()) id: string,
  ): Promise<GetUserResponseDto> {
    const response = await this.usersService.getById(id);
    response?.password && delete response.password;
    response?.token && delete response.token;
    return response;
  }

  @ApiOperation({
    summary: 'Update user by id',
    description: 'Updates a user by id',
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
  @Patch(':id')
  async updateById(
    @Param('id', new MongoIdValidation()) id: string,
    @Body() updateData: UpdateUserRequestDto,
  ): Promise<boolean> {
    return this.usersService.updateById(id, updateData);
  }

  @ApiOperation({
    summary: 'Delete user by id',
    description: 'Deletes a user by id',
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
    return this.usersService.deleteById(id);
  }

  // ******* COMPANY_ADMIN && SUPER_ADMIN *******
  @ApiOperation({
    summary: 'Get user data (own user only)',
    description: 'Gets user data -own user only-',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: apiResponseWrapper(GetUserResponseDto),
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
  @Auth()
  @Roles(Role.COMPANY_ADMIN, Role.SUPER_ADMIN)
  @Get('me')
  async getOwn(@User() user: UserAuth): Promise<GetUserResponseDto> {
    return this.usersService.getById(user.companyId);
  }
}
