import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType, DocumentType } from '@typegoose/typegoose';

import { Item } from './items.model';
import { CreateItemRequestDto } from './dto/createItemRequest.dto';
import { UpdateItemRequestDto } from './dto/updateItemRequest.dto';
import { ListItemResponseDto } from './dto/listItemResponse.dto';

@Injectable()
export class ItemsService {
  constructor(
    @InjectModel(Item)
    private readonly itemModel: ReturnModelType<typeof Item>,
  ) {}

  async create(item: CreateItemRequestDto): Promise<DocumentType<Item>> {
    return this.itemModel.create(item);
  }

  async count(): Promise<number> {
    return this.itemModel.countDocuments();
  }

  async findOne(_id: string): Promise<DocumentType<Item>> {
    const doc = await this.itemModel.findOne({ _id });
    if (!doc) {
      throw new NotFoundException();
    }
    return doc;
  }

  async update(_id: string, item: UpdateItemRequestDto): Promise<boolean> {
    const { modifiedCount } = await this.itemModel.updateOne({ _id }, item);

    return !!modifiedCount;
  }

  async delete(_id: string): Promise<boolean> {
    const { modifiedCount } = await this.itemModel.deleteById(_id);

    return !!modifiedCount;
  }

  async findAll({
    page,
    limit,
    name,
  }: {
    page: number;
    limit: number;
    name: string;
  }): Promise<ListItemResponseDto> {
    const filters: any = {};
    if (name) {
      filters.name = { $regex: name };
    }
    return this.itemModel.paginate(filters, { limit, page });
  }
}
