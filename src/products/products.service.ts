import { Injectable, NotFoundException } from '@nestjs/common';
import { ReturnModelType, DocumentType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
// import { Category } from 'src/categories/categories.model';
import { CreateProductRequestDto } from './dto/createProductRequest.dto';
// import { CreateProductResponseDto } from './dto/createProductResponse.dto';
import { ListProductResponseDto } from './dto/listProductResponse.dto';
import { UpdateProductRequestDto } from './dto/updateProductRequest.dto';
import { ListProductFilters } from './interfaces/listProductFilters.interface';
import { Product } from './products.model';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product)
    private readonly productModel: ReturnModelType<typeof Product>,
  ) {}

  public async create(
    productData: CreateProductRequestDto,
  ): Promise<DocumentType<Product>> {
    const response = await this.productModel.create(productData);
    return response;
  }

  public async findAll({
    page,
    limit,
    name,
  }: ListProductFilters): Promise<ListProductResponseDto> {
    const filters: any = {};
    if (name) {
      filters.name = { $regex: name };
    }
    return this.productModel.paginate(filters, {
      limit,
      page,
      populate: { path: 'category', select: { _id: 1, name: 1 } },
    });
  }

  public async findOne(_id: string): Promise<DocumentType<Product>> {
    const doc = await this.productModel.findOne({ _id });
    // .populate<{ category: Category }>('category', { _id: 1, name: 1 });
    if (!doc) {
      throw new NotFoundException();
    }
    return doc;
  }

  public async update(
    _id: string,
    productData: UpdateProductRequestDto,
  ): Promise<boolean> {
    const { modifiedCount } = await this.productModel.updateOne(
      { _id },
      productData,
    );

    return modifiedCount === 1;
  }

  public async delete(_id: string): Promise<boolean> {
    const { modifiedCount } = await this.productModel.deleteById(_id);
    return modifiedCount === 1;
  }
}
