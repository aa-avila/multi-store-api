import { Injectable, NotFoundException } from '@nestjs/common';
import { ReturnModelType, DocumentType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { Pet } from './pets.model';
import { CreatePetRequestDto } from './dto/createPetRequest.dto';
import { ListPetResponseDto } from './dto/listPetResponse.dto';
import { ListPetFilters } from './interfaces/listPetFilters.interface';
import { UpdatePetRequestDto } from './dto/updatePetRequest.dto';

@Injectable()
export class PetsService {
  constructor(
    @InjectModel(Pet) private readonly petModel: ReturnModelType<typeof Pet>,
  ) {}

  public async create(
    petData: CreatePetRequestDto,
  ): Promise<DocumentType<Pet>> {
    // TODO: si envia owner, validar existencia en BD
    const newPet = await this.petModel.create(petData);
    return newPet;
  }

  public async findAll({
    page,
    limit,
    name,
  }: ListPetFilters): Promise<ListPetResponseDto> {
    const filters: any = {};
    if (name) {
      filters.name = { $regex: name };
    }
    return this.petModel.paginate(filters, { limit, page });
  }

  public async findOne(_id: string): Promise<DocumentType<Pet>> {
    const doc = await this.petModel.findOne({ _id });
    if (!doc) {
      throw new NotFoundException();
    }
    return doc;
  }

  public async update(
    _id: string,
    petData: UpdatePetRequestDto,
  ): Promise<boolean> {
    const { modifiedCount } = await this.petModel.updateOne({ _id }, petData);

    return modifiedCount === 1;
  }

  public async delete(_id: string): Promise<boolean> {
    const { modifiedCount } = await this.petModel.deleteById(_id);
    return modifiedCount === 1;
  }
}
