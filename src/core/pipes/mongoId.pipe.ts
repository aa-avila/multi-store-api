import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { isMongoId } from 'class-validator';

@Injectable()
export class MongoIdValidation implements PipeTransform {
  transform(value: any): any {
    if (isMongoId(value)) return value;
    throw new BadRequestException();
  }
}
