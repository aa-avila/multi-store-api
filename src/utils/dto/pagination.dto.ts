import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
  @ApiProperty()
  totalDocs: number;

  @ApiProperty()
  offset: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  page?: number | undefined;

  @ApiProperty()
  pagingCounter: number;

  @ApiProperty()
  hasPrevPage?: boolean | number | null | undefined;

  @ApiProperty()
  hasNextPage?: boolean | number | null | undefined;

  @ApiProperty()
  prevPage?: boolean | number;

  @ApiProperty()
  nextPage?: boolean | number;
}
