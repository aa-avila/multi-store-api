import { Injectable, NotFoundException } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { ListCategoryFilters } from './interfaces/listCategoryFilters.interface';
import { Category } from './categories.model';
import { CreateCategoryRequestDto } from './dto/createCategoryRequest.dto';
import { CreateCategoryResponseDto } from './dto/createCategoryResponse.dto';
import { ListCategoryResponseDto } from './dto/listCategoryResponse.dto';
import { UpdateCategoryRequestDto } from './dto/updateCategoryRequest.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category)
    private readonly categoryModel: ReturnModelType<typeof Category>,
  ) {}

  public async create(
    categoryData: CreateCategoryRequestDto,
  ): Promise<CreateCategoryResponseDto> {
    const response = await this.categoryModel.create(categoryData);
    return response;
  }

  public async findAll({
    page,
    limit,
    name,
  }: ListCategoryFilters): Promise<ListCategoryResponseDto> {
    const filters: any = {};
    if (name) {
      filters.name = { $regex: name };
    }
    return this.categoryModel.paginate(filters, { limit, page });
  }

  public async findOne(_id: string): Promise<CreateCategoryResponseDto> {
    const doc = await this.categoryModel.findOne({ _id });
    if (!doc) {
      throw new NotFoundException();
    }
    return doc;
  }

  public async update(
    _id: string,
    categoryData: UpdateCategoryRequestDto,
  ): Promise<boolean> {
    const { modifiedCount } = await this.categoryModel.updateOne(
      { _id },
      categoryData,
    );

    return modifiedCount === 1;
  }

  public async delete(_id: string): Promise<boolean> {
    const { modifiedCount } = await this.categoryModel.deleteById(_id);
    return modifiedCount === 1;
  }
}
