import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { ID } from '../common/types/id';
import { IQueryFilters } from './interfaces/IQueryFilters';
import { CreateDocResponse } from '../common/types/createDocResponse';
import { CreateProductRequestDto } from './dto/createProductRequest.dto';
import { GetAllProductsResponseDto } from './dto/getAllProductsResponse.dto';
import { UpdateProductRequestDto } from './dto/updateProductRequest.dto';

@Injectable()
export class ProductsService {
  constructor(
    @Inject(ProductsRepository)
    private readonly repository: ProductsRepository,
  ) {}

  public async create(
    data: CreateProductRequestDto,
  ): Promise<CreateDocResponse> {
    const response = await this.repository.create(data);
    return response;
  }

  public async getAll(
    queryFilters: IQueryFilters,
  ): Promise<GetAllProductsResponseDto> {
    return this.repository.getAll(queryFilters);
  }

  public async getById(id: ID): Promise<any> {
    const doc = await this.repository.getById(id);
    if (!doc) {
      throw new NotFoundException();
    }
    return doc;
  }

  public async updateById(
    id: string,
    productData: UpdateProductRequestDto,
  ): Promise<boolean> {
    return this.repository.updateById(id, productData);
  }

  public async deleteById(id: string): Promise<boolean> {
    return this.repository.deleteById(id);
  }
}
