import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MongoIdValidation } from '../common/pipes/mongoId.pipe';
import { apiErrorWrapper } from '../common/factories/apiErrorWrapper.factory';
import { Auth } from '../common/decorators/auth.decorator';
import { ErrorResponseDto } from '../common/dto/error.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { apiResponseWrapper } from '../common/factories/apiResponseWrapper.factory';
import { CreateUserRequestDto } from './dto/createUserRequest.dto';
import { CreateUserResponseDto } from './dto/createUserResponse.dto';
import { UsersService } from './users.service';
import { GetUserResponseDto } from './dto/getUserResponse.dto';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({
    summary: 'Create new user',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: apiResponseWrapper(CreateUserResponseDto),
    description: 'Created',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    type: apiResponseWrapper(ErrorResponseDto),
    description: 'Conflict',
  })
  @Post()
  async create(
    @Body() userData: CreateUserRequestDto,
  ): Promise<CreateUserResponseDto> {
    return this.usersService.create(userData);
  }

  @ApiOperation({
    summary: 'Count',
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
    summary: 'Get user by Id',
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
  @Roles(Role.SUPER_ADMIN, Role.CUSTOMER)
  @Get(':id')
  async getById(
    @Param('id', new MongoIdValidation()) id: string,
  ): Promise<GetUserResponseDto> {
    const response = await this.usersService.getById(id);
    response?.password && delete response.password;
    response?.token && delete response.token;
    return response;
  }
}
