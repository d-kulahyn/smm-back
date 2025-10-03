import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { UserRepository } from '../../domain/repositories/user.repository';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    return user ? this.toDomain(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    return user ? this.toDomain(user) : null;
  }

  async create(user: User): Promise<User> {
    const created = await this.prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
        password: user.password,
        name: user.name,
        role: user.role, // Добавляем роль
        avatar: user.avatar,
        isActive: user.isActive,
        emailVerifiedAt: user.emailVerifiedAt,
      },
    });

    return this.toDomain(created);
  }

  async update(id: string, userData: Partial<User>): Promise<User> {
    const updated = await this.prisma.user.update({
      where: { id },
      data: {
        name: userData.name,
        role: userData.role, // Добавляем роль для обновления
        avatar: userData.avatar,
        isActive: userData.isActive,
        emailVerifiedAt: userData.emailVerifiedAt,
      },
    });

    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }

  async confirmEmail(email: string): Promise<void> {
    await this.prisma.user.update({
      where: { email },
      data: {
        emailVerifiedAt: new Date(),
      },
    });
  }

  private toDomain(user: any): User {
    return new User(
      user.id,
      user.email,
      user.password,
      user.name,
      user.role, // Добавляем роль в конструктор
      user.avatar,
      user.isActive,
      user.emailVerifiedAt,
      user.createdAt,
      user.updatedAt,
    );
  }
}
