import { ChatStatus } from '../../../../domain/enums/index';
export declare class CreateChatDto {
    name: string;
    description?: string;
    status?: ChatStatus;
}
