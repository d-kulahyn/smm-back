import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiProperty } from '@nestjs/swagger';

// Response DTOs для Swagger документации
export class HealthResponseDto {
  @ApiProperty({ example: 'ok' })
  status: string;

  @ApiProperty({ example: '2024-10-04T10:21:42.177Z' })
  timestamp: string;

  @ApiProperty({ example: 125.960380934 })
  uptime: number;

  @ApiProperty({
    type: 'object',
    properties: {
      rss: { type: 'number', example: 131166208 },
      heapTotal: { type: 'number', example: 45330432 },
      heapUsed: { type: 'number', example: 39939072 },
      external: { type: 'number', example: 20819384 },
      arrayBuffers: { type: 'number', example: 18320745 }
    }
  })
  memory: {
    rss: number;
    heapTotal: number;
    heapUsed: number;
    external: number;
    arrayBuffers: number;
  };

  @ApiProperty({ example: 'v22.20.0' })
  version: string;

  @ApiProperty({ example: 'development' })
  environment: string;
}

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
    description: 'Health check successful',
    type: HealthResponseDto
  })
  check() {
    console.log('Health check endpoint');
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.version,
      environment: process.env.NODE_ENV || 'development'
    };
  }

  @Get('ready')
  @ApiOperation({
    summary: 'Readiness check',
    description: 'Check if the application is ready to serve requests'
  })
  @ApiResponse({
    status: 200,
    description: 'Application is ready',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string' },
        timestamp: { type: 'string' }
      }
    }
  })
  ready() {
    return {
      status: 'ready',
      timestamp: new Date().toISOString()
    };
  }

  @Get('live')
  @ApiOperation({
    summary: 'Liveness check',
    description: 'Check if the application is alive'
  })
  @ApiResponse({
    status: 200,
    description: 'Application is alive',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string' },
        timestamp: { type: 'string' }
      }
    }
  })
  live() {
    return {
      status: 'alive',
      timestamp: new Date().toISOString()
    };
  }
}
