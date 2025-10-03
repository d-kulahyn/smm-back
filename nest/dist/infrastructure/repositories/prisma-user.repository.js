"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaUserRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
const user_entity_1 = require("../../domain/entities/user.entity");
let PrismaUserRepository = class PrismaUserRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findById(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        return user ? this.toDomain(user) : null;
    }
    async findByEmail(email) {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        return user ? this.toDomain(user) : null;
    }
    async create(user) {
        const created = await this.prisma.user.create({
            data: {
                id: user.id,
                email: user.email,
                password: user.password,
                name: user.name,
                role: user.role,
                avatar: user.avatar,
                isActive: user.isActive,
                emailVerifiedAt: user.emailVerifiedAt,
            },
        });
        return this.toDomain(created);
    }
    async update(id, userData) {
        const updated = await this.prisma.user.update({
            where: { id },
            data: {
                name: userData.name,
                role: userData.role,
                avatar: userData.avatar,
                isActive: userData.isActive,
                emailVerifiedAt: userData.emailVerifiedAt,
            },
        });
        return this.toDomain(updated);
    }
    async delete(id) {
        await this.prisma.user.delete({
            where: { id },
        });
    }
    async confirmEmail(email) {
        await this.prisma.user.update({
            where: { email },
            data: {
                emailVerifiedAt: new Date(),
            },
        });
    }
    toDomain(user) {
        return new user_entity_1.User(user.id, user.email, user.password, user.name, user.role, user.avatar, user.isActive, user.emailVerifiedAt, user.createdAt, user.updatedAt);
    }
};
exports.PrismaUserRepository = PrismaUserRepository;
exports.PrismaUserRepository = PrismaUserRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaUserRepository);
//# sourceMappingURL=prisma-user.repository.js.map