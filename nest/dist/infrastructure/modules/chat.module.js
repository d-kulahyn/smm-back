"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatModule = exports.USER_REPOSITORY = exports.CHAT_MEMBER_REPOSITORY = exports.MESSAGE_REPOSITORY = exports.CHAT_REPOSITORY = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const chat_controller_1 = require("../api/controllers/chat.controller");
const create_chat_use_case_1 = require("../../application/use-cases/create-chat.use-case");
const send_message_use_case_1 = require("../../application/use-cases/send-message.use-case");
const add_user_to_chat_use_case_1 = require("../../application/use-cases/add-user-to-chat.use-case");
const remove_user_from_chat_use_case_1 = require("../../application/use-cases/remove-user-from-chat.use-case");
const mark_messages_as_read_use_case_1 = require("../../application/use-cases/mark-messages-as-read.use-case");
const mongo_chat_repository_1 = require("../repositories/mongo-chat.repository");
const mongo_message_repository_1 = require("../repositories/mongo-message.repository");
const mongo_chat_member_repository_1 = require("../repositories/mongo-chat-member.repository");
const prisma_user_repository_1 = require("../repositories/prisma-user.repository");
const prisma_service_1 = require("../database/prisma.service");
const shared_1 = require("../../shared");
const shared_2 = require("../../shared");
const chat_schema_1 = require("../database/schemas/chat.schema");
const message_schema_1 = require("../database/schemas/message.schema");
const message_read_schema_1 = require("../database/schemas/message-read.schema");
const chat_member_schema_1 = require("../database/schemas/chat-member.schema");
const events_1 = require("../../shared/events");
exports.CHAT_REPOSITORY = 'CHAT_REPOSITORY';
exports.MESSAGE_REPOSITORY = 'MESSAGE_REPOSITORY';
exports.CHAT_MEMBER_REPOSITORY = 'CHAT_MEMBER_REPOSITORY';
exports.USER_REPOSITORY = 'USER_REPOSITORY';
let ChatModule = class ChatModule {
};
exports.ChatModule = ChatModule;
exports.ChatModule = ChatModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: chat_schema_1.Chat.name, schema: chat_schema_1.ChatSchema },
                { name: message_schema_1.Message.name, schema: message_schema_1.MessageSchema },
                { name: message_read_schema_1.MessageRead.name, schema: message_read_schema_1.MessageReadSchema },
                { name: chat_member_schema_1.ChatMember.name, schema: chat_member_schema_1.ChatMemberSchema },
            ]),
            events_1.EventsModule,
        ],
        controllers: [chat_controller_1.ChatController],
        providers: [
            create_chat_use_case_1.CreateChatUseCase,
            send_message_use_case_1.SendMessageUseCase,
            add_user_to_chat_use_case_1.AddUserToChatUseCase,
            remove_user_from_chat_use_case_1.RemoveUserFromChatUseCase,
            mark_messages_as_read_use_case_1.MarkMessageAsReadUseCase,
            mark_messages_as_read_use_case_1.MarkAllMessagesAsReadUseCase,
            mark_messages_as_read_use_case_1.MarkMultipleMessagesAsReadUseCase,
            prisma_service_1.PrismaService,
            shared_1.FileService,
            shared_2.ChatPolicy,
            {
                provide: exports.CHAT_REPOSITORY,
                useClass: mongo_chat_repository_1.MongoChatRepository,
            },
            {
                provide: exports.MESSAGE_REPOSITORY,
                useClass: mongo_message_repository_1.MongoMessageRepository,
            },
            {
                provide: exports.CHAT_MEMBER_REPOSITORY,
                useClass: mongo_chat_member_repository_1.MongoChatMemberRepository,
            },
            {
                provide: exports.USER_REPOSITORY,
                useClass: prisma_user_repository_1.PrismaUserRepository,
            },
        ],
    })
], ChatModule);
//# sourceMappingURL=chat.module.js.map