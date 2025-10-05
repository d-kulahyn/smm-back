export declare class PaginationParamsDto {
    page?: number;
    perPage?: number;
    static fromQuery(page?: string, perPage?: string): PaginationParamsDto;
}
