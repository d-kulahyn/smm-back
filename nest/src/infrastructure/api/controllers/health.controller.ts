import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

// Response DTOs
import { HealthResponseDto } from '../responses';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor() {
    console.log('HealthController');
  }

  @Get()
  @ApiOperation({
    summary: 'Health check endpoint',
    description: 'Returns the health status of the application'
  })
  @ApiResponse({
    status: 200,
    description: 'Application health status',
    type: HealthResponseDto
  })
  check(): HealthResponseDto {
    const memoryUsage = process.memoryUsage();

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: {
        rss: memoryUsage.rss,
        heapTotal: memoryUsage.heapTotal,
        heapUsed: memoryUsage.heapUsed,
        external: memoryUsage.external,
        arrayBuffers: memoryUsage.arrayBuffers
      },
      version: process.version,
      environment: process.env.NODE_ENV || 'development'
    };
  }
}
