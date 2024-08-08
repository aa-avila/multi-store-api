import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductRequestDto } from './dto/createProductRequest.dto';
import { ListProductResponseDto } from './dto/listProductResponse.dto';
import { UpdateProductRequestDto } from './dto/updateProductRequest.dto';
import { IQueryFilters } from './interfaces/IQueryFilters';
import { ProductsRepository } from './products.repository';
import { CreateDocResponse } from '../core/types/createDocResponse';

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

  public async findAll(
    queryFilters: IQueryFilters,
  ): Promise<ListProductResponseDto> {
    return this.repository.getAll(queryFilters);
  }

  public async findOne(id: string): Promise<any> {
    const doc = await this.repository.getById(id);
    if (!doc) {
      throw new NotFoundException();
    }
    return doc;
  }

  public async update(
    _id: string,
    productData: UpdateProductRequestDto,
  ): Promise<boolean> {
    return this.repository.update(_id, productData);
  }

  public async delete(_id: string): Promise<boolean> {
    return this.repository.delete(_id);
  }
}
