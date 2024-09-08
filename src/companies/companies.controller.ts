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
import { CreateCompanyRequestDto } from './dto/createCompanyRequest.dto';
import { CreateDocResponseDto } from '../common/dto/createDocResponse.dto';
import { CompaniesService } from './companies.service';
import { GetCompanyResponseDto } from './dto/getCompanyResponse.dto';
import { GetAllCompaniesResponseDto } from './dto/getAllCompaniesResponse.dto';
import { UpdateCompanyRequestDto } from './dto/updateCompanyRequest.dto';

@Controller('companies')
@ApiTags('Companies')
export class CompaniesController {
  constructor(private companiesService: CompaniesService) {}

  // ******* SUPER_ADMIN  *******

  @ApiOperation({
    summary: 'Create company',
    description: 'Creates a new company',
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
    @Body() companyData: CreateCompanyRequestDto,
  ): Promise<CreateDocResponseDto> {
    return this.companiesService.create(companyData);
  }

  @ApiOperation({
    summary: 'Get all companies',
    description:
      'Gets all companies that match with the provided query filters ',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: apiResponseWrapper(GetAllCompaniesResponseDto),
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
  @Roles(Role.SUPER_ADMIN)
  @Get()
  async getAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
    @Query('name') name?: string,
  ): Promise<GetAllCompaniesResponseDto> {
    return this.companiesService.getAll({
      page,
      limit,
      name,
    });
  }

  @ApiOperation({
    summary: 'Get company by id',
    description: 'Gets a company by id',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: apiResponseWrapper(GetCompanyResponseDto),
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
  @Get(':id')
  async getById(
    @Param('id', new MongoIdValidation()) id: string,
  ): Promise<GetCompanyResponseDto> {
    return this.companiesService.getById(id);
  }

  @ApiOperation({
    summary: 'Get company by slug',
    description: 'Gets a company by slug',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: apiResponseWrapper(GetCompanyResponseDto),
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
  @Get(':id')
  async getBySlug(
    @Param('id', new MongoIdValidation()) id: string,
  ): Promise<GetCompanyResponseDto> {
    return this.companiesService.getBySlug(id);
  }

  @ApiOperation({
    summary: 'Update company by id',
    description: 'Updates a company by id',
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
    @Body() updateData: UpdateCompanyRequestDto,
  ): Promise<boolean> {
    return this.companiesService.updateById(id, updateData);
  }

  @ApiOperation({
    summary: 'Delete one company by id',
    description: 'Deletes a company by id',
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
    return this.companiesService.deleteById(id);
  }

  // ******* COMPANY_ADMIN *******
  @ApiOperation({
    summary: 'Get company data (own company)',
    description: 'Gets company data -own company-',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: apiResponseWrapper(GetCompanyResponseDto),
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
  @Roles(Role.COMPANY_ADMIN)
  @Get('me')
  async getOwn(@User() user: UserAuth): Promise<GetCompanyResponseDto> {
    return this.companiesService.getById(user.companyId);
  }
}
