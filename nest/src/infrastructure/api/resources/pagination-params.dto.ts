import { IsOptional, IsNumber, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export class PaginationParamsDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  @Max(100)
  perPage?: number = 10;

  static fromQuery(page?: string, perPage?: string): PaginationParamsDto {
    const dto = new PaginationParamsDto();
    dto.page = page ? parseInt(page) || 1 : 1;
    dto.perPage = perPage ? parseInt(perPage) || 10 : 10;

    // Ограничиваем максимальное количество элементов на странице
    if (dto.perPage > 100) dto.perPage = 100;
    if (dto.perPage < 1) dto.perPage = 10;
    if (dto.page < 1) dto.page = 1;

    return dto;
  }
}
