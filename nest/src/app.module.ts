import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { ThrottlerModule } from '@nestjs/throttler';

import { AuthModule } from './infrastructure/modules/auth.module';
import { ProjectModule } from './infrastructure/modules/project.module';
import { TaskModule } from './infrastructure/modules/task.module';
import { ChatModule } from './infrastructure/modules/chat.module';
import { HealthModule } from './infrastructure/modules/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    AuthModule,
    ProjectModule,
    TaskModule,
    ChatModule,
    HealthModule,
  ],
  controllers: [],
})
export class AppModule {}
