export interface FormattedDate {
    formatted: string;
    relative: string;
    iso: string;
}
export declare class DateFormatter {
    static formatDate(date?: Date): string | null;
    static formatDateWithRelative(date?: Date): FormattedDate | null;
    static formatCreatedAt(createdAt?: Date): FormattedDate | null;
    static formatUpdatedAt(updatedAt?: Date): FormattedDate | null;
}
