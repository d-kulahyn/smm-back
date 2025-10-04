import { Module } from '@nestjs/common';
import { HealthController } from '../api/controllers/health.controller';

@Module({
  controllers: [HealthController],
})
export class HealthModule {
  constructor() {
    console.log('HealthModule загружен успешно');
  }
}
